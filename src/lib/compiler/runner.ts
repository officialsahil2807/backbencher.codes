import { transform } from "sucrase";
import { ExecutionResponse } from "@/app/api/compiler/execute/route";

export interface ClientRunResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTimeMs: number;
  status: "success" | "error" | "timeout" | "rate_limited";
  htmlPreview?: string;
  tableResult?: {
    columns: string[];
    values: (string | number | null)[][];
  };
}

/**
 * Execute JavaScript/TypeScript inside an isolated sandbox iframe
 */
export async function runBrowserJS(
  code: string,
  isTypeScript: boolean = false
): Promise<ClientRunResult> {
  const startTime = performance.now();
  let executableCode = code;

  if (isTypeScript) {
    try {
      const compiled = transform(code, {
        transforms: ["typescript"],
      });
      executableCode = compiled.code;
    } catch (err: unknown) {
      const e = err as Error;
      return {
        stdout: "",
        stderr: `TypeScript Compilation Error:\n${e.message}`,
        exitCode: 1,
        executionTimeMs: Math.round(performance.now() - startTime),
        status: "error",
      };
    }
  }

  return new Promise((resolve) => {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    // Sandboxed without allow-same-origin to prevent access to parent DOM, cookies or localStorage
    iframe.sandbox.add("allow-scripts");
    document.body.appendChild(iframe);

    const logs: string[] = [];
    const errors: string[] = [];
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let hasSentCode = false;

    const cleanup = () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener("message", messageHandler);
      if (iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
    };

    const sendCode = () => {
      if (hasSentCode) return;
      hasSentCode = true;
      try {
        iframe.contentWindow?.postMessage(
          { __backbencher_run__: true, code: executableCode },
          "*"
        );
      } catch (err) {
        console.error("Failed to post code to iframe runner:", err);
      }
    };

    const messageHandler = (event: MessageEvent) => {
      if (event.data && event.data.__backbencher_eval__) {
        const { type, messages, error } = event.data;
        if (type === "ready") {
          sendCode();
        } else if (type === "log") {
          logs.push(messages.join(" "));
        } else if (type === "error") {
          errors.push(error);
        } else if (type === "done") {
          cleanup();
          const duration = Math.round(performance.now() - startTime);
          resolve({
            stdout: logs.join("\n"),
            stderr: errors.join("\n"),
            exitCode: errors.length > 0 ? 1 : 0,
            executionTimeMs: duration,
            status: errors.length > 0 ? "error" : "success",
          });
        }
      }
    };

    window.addEventListener("message", messageHandler);

    // 10-second timeout limit for browser execution
    timeoutId = setTimeout(() => {
      cleanup();
      resolve({
        stdout: logs.join("\n"),
        stderr: "Execution timed out (10000ms limit reached).",
        exitCode: 124,
        executionTimeMs: 10000,
        status: "timeout",
      });
    }, 10000);

    iframe.onload = () => {
      sendCode();
    };

    // Runner HTML that listens for code execution message and captures logs & uncaught errors
    const runnerScript = `
      (function() {
        function stringify(arg) {
          if (typeof arg === 'object' && arg !== null) {
            try { return JSON.stringify(arg, null, 2); } catch (e) { return String(arg); }
          }
          return String(arg);
        }

        var origLog = console.log;
        var origError = console.error;
        var origWarn = console.warn;

        console.log = function() {
          var args = Array.prototype.slice.call(arguments);
          window.parent.postMessage({
            __backbencher_eval__: true,
            type: 'log',
            messages: args.map(stringify)
          }, '*');
          if (origLog) origLog.apply(console, arguments);
        };

        console.error = function() {
          var args = Array.prototype.slice.call(arguments);
          window.parent.postMessage({
            __backbencher_eval__: true,
            type: 'error',
            error: args.map(stringify).join(' ')
          }, '*');
          if (origError) origError.apply(console, arguments);
        };

        console.warn = console.log;

        window.onerror = function(msg, url, line, col, err) {
          var errorMsg = err && err.message ? (err.name + ': ' + err.message) : String(msg);
          if (line) errorMsg += ' (line ' + line + ')';
          window.parent.postMessage({
            __backbencher_eval__: true,
            type: 'error',
            error: errorMsg
          }, '*');
          window.parent.postMessage({ __backbencher_eval__: true, type: 'done' }, '*');
          return true;
        };

        window.addEventListener('unhandledrejection', function(event) {
          var reason = event.reason;
          var msg = reason && reason.message ? (reason.name + ': ' + reason.message) : String(reason);
          window.parent.postMessage({
            __backbencher_eval__: true,
            type: 'error',
            error: 'Unhandled Promise Rejection: ' + msg
          }, '*');
          window.parent.postMessage({ __backbencher_eval__: true, type: 'done' }, '*');
        });

        window.addEventListener('message', function(e) {
          if (e.data && e.data.__backbencher_run__) {
            try {
              var s = document.createElement('script');
              s.textContent = e.data.code;
              document.body.appendChild(s);
            } catch (err) {
              console.error(err.name + ': ' + err.message);
            }
            setTimeout(function() {
              window.parent.postMessage({ __backbencher_eval__: true, type: 'done' }, '*');
            }, 50);
          }
        });

        // Inform parent that receiver is bound
        window.parent.postMessage({ __backbencher_eval__: true, type: 'ready' }, '*');
      })();
    `;

    iframe.srcdoc = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><script>${runnerScript}</` + `script></body></html>`;
  });
}

// Cached SQL.js engine instance to eliminate repeated downloads and compiles
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cachedSQL: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let sqlInitPromise: Promise<any> | null = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getSqlEngine(): Promise<any> {
  if (cachedSQL) return cachedSQL;
  if (!sqlInitPromise) {
    sqlInitPromise = (async () => {
      const sqlModule = await import("sql.js");
      const initSqlJs = sqlModule.default || sqlModule;

      // Priority 1: Fetch local /sql-wasm.wasm as an ArrayBuffer directly
      // This completely avoids all locateFile, MIME type mismatch, and CDN CORS/offline issues.
      try {
        const wasmRes = await fetch("/sql-wasm.wasm");
        if (wasmRes.ok) {
          const wasmBinary = await wasmRes.arrayBuffer();
          cachedSQL = await initSqlJs({ wasmBinary });
          return cachedSQL;
        }
      } catch (e) {
        console.warn("Direct fetch of /sql-wasm.wasm failed, attempting locateFile fallback:", e);
      }

      // Priority 2: Use locateFile with local root path
      try {
        cachedSQL = await initSqlJs({
          locateFile: (file: string) => `/${file}`,
        });
        return cachedSQL;
      } catch (e2) {
        console.warn("locateFile local failed, attempting cdnjs fallback:", e2);
      }

      // Priority 3: CDN fallback
      cachedSQL = await initSqlJs({
        locateFile: (file: string) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/${file}`,
      });
      return cachedSQL;
    })();
  }
  return sqlInitPromise;
}

/**
 * Execute real SQL queries in an isolated in-memory SQLite sandbox with cloud fallback
 */
export async function runSQL(code: string): Promise<ClientRunResult> {
  const startTime = performance.now();
  try {
    const SQL = await getSqlEngine();
    const db = new SQL.Database();
    const results = db.exec(code);

    const duration = Math.round(performance.now() - startTime);

    if (!results || results.length === 0) {
      return {
        stdout: "Query executed successfully. (0 rows returned or DDL statement executed)",
        stderr: "",
        exitCode: 0,
        executionTimeMs: duration,
        status: "success",
      };
    }

    const lastResult = results[results.length - 1];
    let formattedText = `Query Result (${lastResult.values.length} rows):\n\n`;
    formattedText += lastResult.columns.join(" | ") + "\n";
    formattedText += "-".repeat(lastResult.columns.join(" | ").length) + "\n";
    lastResult.values.forEach((row: (string | number | null)[]) => {
      formattedText += row.map((cell) => (cell === null ? "NULL" : String(cell))).join(" | ") + "\n";
    });

    return {
      stdout: formattedText,
      stderr: "",
      exitCode: 0,
      executionTimeMs: duration,
      status: "success",
      tableResult: {
        columns: lastResult.columns,
        values: lastResult.values.map((row: (string | number | null)[]) =>
          row.map((cell) => {
            if (cell === null) return null;
            if (typeof cell === "number") return cell;
            return String(cell);
          })
        ),
      },
    };
  } catch (wasmError: unknown) {
    // In-browser WebAssembly failed or had syntax error, smoothly fallback to backend SQLite runner
    console.warn("In-browser SQL execution failed, delegating to backend SQLite runner:", wasmError);
    try {
      const res = await fetch("/api/compiler/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: "sql",
          sourceCode: code,
          stdin: "",
        }),
      });
      const data: ExecutionResponse = await res.json();
      return {
        stdout: data.stdout,
        stderr: data.stderr,
        exitCode: data.exitCode,
        executionTimeMs: data.executionTimeMs,
        status: data.status,
      };
    } catch (e2: unknown) {
      const e = e2 as Error;
      return {
        stdout: "",
        stderr: `SQL Execution Error: ${e.message}`,
        exitCode: 1,
        executionTimeMs: Math.round(performance.now() - startTime),
        status: "error",
      };
    }
  }
}

/**
 * Builds preview HTML by inlining all workspace CSS and JS files into index.html
 */
export function buildHtmlPreview(
  mainHtml: string,
  files?: Array<{ name: string; content: string; language: string }>
): string {
  let html = mainHtml;

  if (files && files.length > 0) {
    // 1. Resolve workspace CSS files (e.g. style.css)
    const cssFiles = files.filter((f) => f.name.endsWith(".css"));
    for (const cssFile of cssFiles) {
      const linkRegex = new RegExp(`<link[^>]+href=["'](?:\\.?\\/)?${cssFile.name}["'][^>]*>`, "gi");
      if (linkRegex.test(html)) {
        html = html.replace(linkRegex, `<style>/* Inlined from ${cssFile.name} */\n${cssFile.content}\n</style>`);
      } else if (!html.includes(cssFile.content) && cssFile.content.trim()) {
        if (html.includes("</head>")) {
          html = html.replace("</head>", `<style>/* Workspace ${cssFile.name} */\n${cssFile.content}\n</style></head>`);
        } else {
          html = `<style>/* Workspace ${cssFile.name} */\n${cssFile.content}\n</style>\n` + html;
        }
      }
    }

    // 2. Resolve workspace JS files (e.g. script.js)
    const jsFiles = files.filter((f) => f.name.endsWith(".js") && !f.name.endsWith(".json"));
    for (const jsFile of jsFiles) {
      const scriptRegex = new RegExp(`<script[^>]+src=["'](?:\\.?\\/)?${jsFile.name}["'][^>]*></script>`, "gi");
      if (scriptRegex.test(html)) {
        html = html.replace(scriptRegex, `<script>/* Inlined from ${jsFile.name} */\n${jsFile.content}\n</` + `script>`);
      } else if (!html.includes(jsFile.content) && jsFile.content.trim()) {
        if (html.includes("</body>")) {
          html = html.replace("</body>", `<script>/* Workspace ${jsFile.name} */\n${jsFile.content}\n</` + `script></body>`);
        } else {
          html = html + `\n<script>/* Workspace ${jsFile.name} */\n${jsFile.content}\n</` + `script>`;
        }
      }
    }
  }

  return html;
}

/**
 * Unified execution dispatcher
 */
export async function executeCode(
  languageId: string,
  sourceCode: string,
  stdin: string = "",
  files?: Array<{ name: string; content: string; language: string }>
): Promise<ClientRunResult> {
  if (languageId === "javascript") {
    return runBrowserJS(sourceCode, false);
  }

  if (languageId === "typescript") {
    return runBrowserJS(sourceCode, true);
  }

  if (languageId === "sql") {
    return runSQL(sourceCode);
  }

  if (languageId === "html" || languageId === "css") {
    const htmlPreview = buildHtmlPreview(sourceCode, files);
    return {
      stdout: "Live preview refreshed with external CSS, JS & workspace assets.",
      stderr: "",
      exitCode: 0,
      executionTimeMs: 12,
      status: "success",
      htmlPreview,
    };
  }

  // Backend languages: Call Next.js API
  try {
    const res = await fetch("/api/compiler/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: languageId,
        sourceCode,
        stdin,
      }),
    });

    const data: ExecutionResponse = await res.json();
    return {
      stdout: data.stdout,
      stderr: data.stderr,
      exitCode: data.exitCode,
      executionTimeMs: data.executionTimeMs,
      status: data.status,
    };
  } catch (err: unknown) {
    const e = err as Error;
    return {
      stdout: "",
      stderr: `Network/Runner Error: ${e.message}`,
      exitCode: 1,
      executionTimeMs: 0,
      status: "error",
    };
  }
}
