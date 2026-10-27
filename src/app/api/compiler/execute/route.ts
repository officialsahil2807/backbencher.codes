import { NextRequest, NextResponse } from "next/server";
import dns from "node:dns";
import { LANGUAGES } from "@/lib/compiler/languages";

// Force IPv4 resolution first to prevent Node.js 24 Happy Eyeballs / undici IPv6 connect timeouts on Windows
try {
  dns.setDefaultResultOrder("ipv4first");
} catch {
  // Ignore in environments where not supported
}

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

function checkRateLimit(ip: string): boolean {
  if (process.env.NODE_ENV !== "production" || ip === "127.0.0.1" || ip === "::1" || ip === "localhost") {
    return true;
  }
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.expiresAt) {
    rateLimitMap.set(ip, { count: 1, expiresAt: now + 60000 });
    return true;
  }

  if (entry.count >= 60) {
    return false;
  }

  entry.count++;
  return true;
}

export interface ExecutionResponse {
  stdout: string;
  stderr: string;
  compileOutput?: string;
  exitCode: number;
  executionTimeMs: number;
  memoryKb?: number;
  status: "success" | "error" | "timeout" | "rate_limited";
}

// Wandbox compiler mappings (tested & working)
const WANDBOX_COMPILERS: Record<string, string> = {
  python: "cpython-3.12.7",
  cpp: "gcc-head",
  c: "gcc-head-c",
  rust: "rust-1.82.0",
  java: "openjdk-jdk-22+36",
  php: "php-8.3.12",
  swift: "swift-6.0.1",
  sql: "sqlite-3.46.1",
};

/**
 * Executes code on Judge0 CE using asynchronous token polling (avoids HTTP dropouts)
 */
async function runOnJudge0(
  languageId: number,
  sourceCode: string,
  stdin: string = ""
): Promise<{ stdout: string; stderr: string; compileOutput?: string; exitCode: number; status: "success" | "error" } | null> {
  try {
    const b64Code = Buffer.from(sourceCode).toString("base64");
    const b64Stdin = stdin ? Buffer.from(stdin).toString("base64") : undefined;

    const postRes = await fetch("https://ce.judge0.com/submissions?base64_encoded=true", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source_code: b64Code,
        language_id: languageId,
        stdin: b64Stdin,
      }),
      signal: AbortSignal.timeout(12000),
    });

    if (!postRes.ok) return null;
    const postData = await postRes.json();
    const token = postData.token;
    if (!token) return null;

    // Poll until complete or max 20 attempts
    for (let i = 0; i < 20; i++) {
      await new Promise((r) => setTimeout(r, 1000));
      const getRes = await fetch(`https://ce.judge0.com/submissions/${token}?base64_encoded=true`, {
        signal: AbortSignal.timeout(10000),
      });
      if (!getRes.ok) continue;
      const data = await getRes.json();
      const statusId = data.status?.id;

      // Status 1 = In Queue, 2 = Processing. >= 3 is finished
      if (statusId >= 3) {
        const stdout = data.stdout ? Buffer.from(data.stdout, "base64").toString("utf8").trimEnd() : "";
        const stderr = data.stderr
          ? Buffer.from(data.stderr, "base64").toString("utf8").trimEnd()
          : data.compile_output
          ? Buffer.from(data.compile_output, "base64").toString("utf8").trimEnd()
          : "";
        const exitCode = statusId === 3 ? 0 : 1;
        return {
          stdout,
          stderr,
          compileOutput: data.compile_output ? Buffer.from(data.compile_output, "base64").toString("utf8") : "",
          exitCode,
          status: exitCode === 0 ? "success" : "error",
        };
      }
    }
    return null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          stdout: "",
          stderr: "Rate limit exceeded. Please wait a minute before running code again.",
          exitCode: 429,
          executionTimeMs: 0,
          status: "rate_limited",
        } satisfies ExecutionResponse,
        { status: 429 }
      );
    }

    const body = await req.json();
    const { language, sourceCode, stdin = "" } = body;

    if (!language || !sourceCode) {
      return NextResponse.json(
        {
          stdout: "",
          stderr: "Bad Request: language and sourceCode are required.",
          exitCode: 400,
          executionTimeMs: 0,
          status: "error",
        } satisfies ExecutionResponse,
        { status: 400 }
      );
    }

    const langConfig = LANGUAGES[language];
    if (!langConfig) {
      return NextResponse.json(
        {
          stdout: "",
          stderr: `Unsupported language: ${language}`,
          exitCode: 400,
          executionTimeMs: 0,
          status: "error",
        } satisfies ExecutionResponse,
        { status: 400 }
      );
    }

    if (sourceCode.length > 50000) {
      return NextResponse.json(
        {
          stdout: "",
          stderr: "Source code exceeds maximum permitted size of 50KB.",
          exitCode: 413,
          executionTimeMs: 0,
          status: "error",
        } satisfies ExecutionResponse,
        { status: 413 }
      );
    }

    const startTime = performance.now();

    // Strategy 0: Specialized Official Kotlin Playground Runner
    if (language === "kotlin") {
      try {
        const ktRes = await fetch("https://api.kotlinlang.org/api/v1/compiler/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            args: "",
            files: [{ name: "File.kt", text: sourceCode }],
          }),
          signal: AbortSignal.timeout(12000),
        });

        if (ktRes.ok) {
          const ktData = await ktRes.json();
          const rawText = ktData.text || "";
          const outMatch = rawText.match(/<outStream>([\s\S]*?)<\/outStream>/);
          const errMatch = rawText.match(/<errStream>([\s\S]*?)<\/errStream>/);
          const stdout = outMatch ? outMatch[1] : rawText.replace(/<[^>]+>/g, "").trim();
          const stderr = errMatch ? errMatch[1] : (ktData.exception ? JSON.stringify(ktData.exception) : "");
          const duration = Math.round(performance.now() - startTime);

          return NextResponse.json({
            stdout: stdout.trimEnd(),
            stderr: stderr.trimEnd(),
            exitCode: stderr ? 1 : 0,
            executionTimeMs: duration,
            status: stderr ? "error" : "success",
          } satisfies ExecutionResponse);
        }
      } catch {
        // Fallback to Judge0
      }
    }

    // Strategy 1: Wandbox Isolated Cloud Compiler (Python, C++, C, Rust, Java, PHP, Swift, SQL)
    const wandboxCompiler = WANDBOX_COMPILERS[language];
    if (wandboxCompiler) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 24000);

        let codeToCompile = sourceCode;
        if (language === "java") {
          codeToCompile = codeToCompile.replace(/\bpublic\s+class\b/g, "class");
        }

        const wandboxPayload = {
          code: codeToCompile,
          compiler: wandboxCompiler,
          stdin: stdin || undefined,
        };

        const wandboxRes = await fetch("https://wandbox.org/api/compile.json", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(wandboxPayload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (wandboxRes.ok) {
          const result = await wandboxRes.json();
          const stdout = (result.program_output || "").trimEnd();
          const stderr = (result.program_error || result.compiler_error || result.compiler_message || "").trimEnd();
          const exitCode = parseInt(result.status || "0", 10);
          const duration = Math.round(performance.now() - startTime);

          if (exitCode === 0 || stdout) {
            return NextResponse.json({
              stdout,
              stderr,
              compileOutput: result.compiler_output || "",
              exitCode,
              executionTimeMs: duration,
              status: exitCode === 0 && !stderr ? "success" : exitCode === 0 ? "success" : "error",
            } satisfies ExecutionResponse);
          }
        }
      } catch {
        // Fallback to Judge0
      }
    }

    // Strategy 2: Judge0 CE API (Base64 Encoded with Async Polling for 100% Reliability)
    if (langConfig.judge0Id) {
      const judge0Result = await runOnJudge0(langConfig.judge0Id, sourceCode, stdin);
      if (judge0Result) {
        const duration = Math.round(performance.now() - startTime);
        return NextResponse.json({
          stdout: judge0Result.stdout,
          stderr: judge0Result.stderr,
          compileOutput: judge0Result.compileOutput,
          exitCode: judge0Result.exitCode,
          executionTimeMs: duration,
          status: judge0Result.status,
        } satisfies ExecutionResponse);
      }
    }

    // Strategy 3: Self-hosted / Custom Piston API if configured
    if (process.env.PISTON_API_URL) {
      try {
        const pistonPayload = {
          language: langConfig.pistonLang || language,
          version: langConfig.pistonVersion || "*",
          files: [{ name: `main.${langConfig.extension}`, content: sourceCode }],
          stdin: stdin,
          run_timeout: 8000,
        };

        const res = await fetch(`${process.env.PISTON_API_URL}/api/v2/execute`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(pistonPayload),
          signal: AbortSignal.timeout(12000),
        });

        if (res.ok) {
          const result = await res.json();
          const run = result.run || {};
          const duration = Math.round(performance.now() - startTime);
          return NextResponse.json({
            stdout: run.stdout || "",
            stderr: run.stderr || "",
            exitCode: run.code ?? 0,
            executionTimeMs: duration,
            status: run.code === 0 ? "success" : "error",
          } satisfies ExecutionResponse);
        }
      } catch {
        // Fall through to final error
      }
    }

    // Strategy 4: Final fallback
    const duration = Math.round(performance.now() - startTime);
    return NextResponse.json({
      stdout: "",
      stderr: `Runtime sandbox for ${langConfig.name} is temporarily busy. Please try running again in a few moments.`,
      exitCode: 503,
      executionTimeMs: duration,
      status: "error",
    } satisfies ExecutionResponse);
  } catch (error: unknown) {
    const err = error as Error;
    const isAbort = err?.name === "AbortError";
    return NextResponse.json({
      stdout: "",
      stderr: isAbort
        ? "Execution timed out (exceeded limit of 24s)."
        : `Execution error: ${err.message || "Failed to reach execution runner."}`,
      exitCode: isAbort ? 124 : 500,
      executionTimeMs: 0,
      status: isAbort ? "timeout" : "error",
    } satisfies ExecutionResponse);
  }
}
