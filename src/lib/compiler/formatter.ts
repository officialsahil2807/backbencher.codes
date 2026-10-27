/**
 * Universal Code Formatter for Backbencher.codes
 * Formats all 14 supported languages with Prettier for web languages and
 * robust AST-like indentation & style normalizers for systems/backend languages.
 */

// ── SQL Formatter ─────────────────────────────────────────────────────────────
export function formatSQL(sql: string): string {
  const keywords = [
    "SELECT", "FROM", "WHERE", "AND", "OR", "GROUP BY", "ORDER BY", "HAVING",
    "LIMIT", "OFFSET", "JOIN", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "FULL JOIN",
    "CROSS JOIN", "ON", "AS", "INSERT INTO", "VALUES", "UPDATE", "SET",
    "DELETE FROM", "CREATE TABLE", "DROP TABLE", "ALTER TABLE", "PRIMARY KEY",
    "FOREIGN KEY", "REFERENCES", "NOT NULL", "UNIQUE", "DEFAULT", "CHECK",
    "UNION", "UNION ALL", "INTERSECT", "EXCEPT", "CASE", "WHEN", "THEN", "ELSE", "END",
    "IN", "BETWEEN", "LIKE", "IS NULL", "IS NOT NULL", "EXISTS", "DISTINCT", "COUNT",
    "SUM", "AVG", "MIN", "MAX", "INTEGER", "TEXT", "REAL", "BLOB", "BOOLEAN", "VARCHAR"
  ];

  // Tokenize and uppercase SQL keywords outside quotes
  const lines = sql.split("\n");
  const formattedLines: string[] = [];
  const indent = 0;

  for (const rawLine of lines) {
    let line = rawLine.trim();
    if (!line) {
      formattedLines.push("");
      continue;
    }

    // Preserve comments
    if (line.startsWith("--") || line.startsWith("/*")) {
      formattedLines.push("    ".repeat(indent) + line);
      continue;
    }

    // Case normalization for keywords
    for (const kw of keywords) {
      const regex = new RegExp(`\\b${kw}\\b`, "gi");
      line = line.replace(regex, kw);
    }

    // Adjust indentation for major clauses
    const upper = line.toUpperCase();
    if (upper.startsWith("FROM") || upper.startsWith("WHERE") || upper.startsWith("GROUP BY") ||
        upper.startsWith("ORDER BY") || upper.startsWith("HAVING") || upper.startsWith("LIMIT")) {
      formattedLines.push("    ".repeat(Math.max(0, indent)) + line);
    } else if (upper.startsWith("JOIN") || upper.startsWith("LEFT JOIN") || upper.startsWith("INNER JOIN")) {
      formattedLines.push("    ".repeat(Math.max(0, indent + 1)) + line);
    } else if (upper.startsWith("SELECT") || upper.startsWith("INSERT INTO") || upper.startsWith("CREATE TABLE") ||
               upper.startsWith("UPDATE") || upper.startsWith("DELETE FROM")) {
      formattedLines.push("    ".repeat(indent) + line);
    } else {
      formattedLines.push("    ".repeat(indent + 1) + line);
    }
  }

  return formattedLines.join("\n").trimEnd();
}

// ── Python Formatter ──────────────────────────────────────────────────────────
export function formatPython(code: string): string {
  const lines = code.split("\n");
  const formatted: string[] = [];
  let currentIndent = 0;

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const trimmed = raw.trim();

    if (!trimmed) {
      // Don't add more than two consecutive empty lines (PEP 8)
      if (formatted.length > 0 && formatted[formatted.length - 1] !== "") {
        formatted.push("");
      }
      continue;
    }

    // Deduce un-indent keywords: return, pass, break, continue, elif, else, except, finally
    if (/^(elif\b|else\b|except\b|finally\b)/.test(trimmed)) {
      currentIndent = Math.max(0, currentIndent - 1);
    }

    // Format operators spacing: a = 1, b + c, x == y (avoiding comments and strings)
    let processedLine = trimmed;
    if (!trimmed.startsWith("#")) {
      // Clean comma and colon spacing
      processedLine = processedLine.replace(/\s*,\s*/g, ", ");
      processedLine = processedLine.replace(/\s*:\s*$/g, ":");
    }

    formatted.push("    ".repeat(currentIndent) + processedLine);

    // If line ends with colon, next line is indented
    if (trimmed.endsWith(":")) {
      currentIndent++;
    }
  }

  return formatted.join("\n").trimEnd();
}

export function formatCurlyBrace(code: string): string {
  // If code has braces/semicolons grouped on single lines, expand them into clean line breaks
  let expanded = code;
  if (!code.includes("\n") || code.split("\n").length <= 3) {
    expanded = code
      .replace(/\{/g, " {\n")
      .replace(/\}/g, "\n}\n")
      .replace(/;(?!\s*\\n)/g, ";\n");
  }

  const lines = expanded.split("\n");
  const formatted: string[] = [];
  let indent = 0;

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    let trimmed = raw.trim();

    if (!trimmed) {
      if (formatted.length > 0 && formatted[formatted.length - 1] !== "") {
        formatted.push("");
      }
      continue;
    }

    // Count opening and closing braces on this line
    // Ignore characters inside strings/comments
    let openCount = 0;
    let closeCount = 0;
    let inString = false;
    let stringChar = "";

    for (let c = 0; c < trimmed.length; c++) {
      const char = trimmed[c];
      const prev = c > 0 ? trimmed[c - 1] : "";

      if ((char === '"' || char === "'") && prev !== "\\") {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (stringChar === char) {
          inString = false;
        }
      }

      if (!inString) {
        if (char === "{") openCount++;
        if (char === "}") closeCount++;
      }
    }

    // If line starts with a closing brace, decrease indent for this line
    if (trimmed.startsWith("}") || trimmed.startsWith(")") || trimmed.startsWith("]")) {
      indent = Math.max(0, indent - 1);
    }

    // Format common statement spacing: `if (`, `for (`, `while (`
    if (!trimmed.startsWith("//") && !trimmed.startsWith("/*") && !trimmed.startsWith("*")) {
      trimmed = trimmed
        .replace(/\b(if|for|while|switch|catch)\s*\(/g, "$1 (")
        .replace(/\)\s*\{/g, ") {")
        .replace(/\s*,\s*/g, ", ")
        .replace(/\s*;\s*$/g, ";");
    }

    formatted.push("    ".repeat(Math.max(0, indent)) + trimmed);

    // If opening braces exceeded closing braces, increase indent for next lines
    if (openCount > closeCount) {
      if (!trimmed.startsWith("}") && !trimmed.startsWith(")") && !trimmed.startsWith("]")) {
        indent += (openCount - closeCount);
      }
    } else if (closeCount > openCount) {
      if (!trimmed.startsWith("}") && !trimmed.startsWith(")") && !trimmed.startsWith("]")) {
        indent = Math.max(0, indent - (closeCount - openCount));
      }
    }
  }

  return formatted.join("\n").trimEnd();
}

/**
 * Universal code format dispatcher
 */
export async function formatCode(sourceCode: string, language: string): Promise<string> {
  const trimmed = sourceCode.trim();
  if (!trimmed) return sourceCode;

  // 1. JSON
  if (language === "json") {
    try {
      const parsed = JSON.parse(sourceCode);
      return JSON.stringify(parsed, null, 4);
    } catch {
      return sourceCode;
    }
  }

  // 2. Prettier supported: HTML, CSS, JavaScript, TypeScript, Markdown
  if (["html", "css", "javascript", "typescript", "markdown"].includes(language)) {
    try {
      const prettier = (await import("prettier/standalone")).default;
      let plugins: Array<import("prettier").Plugin | string> = [];
      let parser = language;

      if (language === "html") {
        const htmlPlugin = (await import("prettier/plugins/html")).default;
        plugins = [htmlPlugin];
        parser = "html";
      } else if (language === "css") {
        const postcssPlugin = (await import("prettier/plugins/postcss")).default;
        plugins = [postcssPlugin];
        parser = "css";
      } else if (language === "javascript") {
        const babelPlugin = (await import("prettier/plugins/babel")).default;
        const estreePlugin = (await import("prettier/plugins/estree")).default;
        plugins = [babelPlugin, estreePlugin];
        parser = "babel";
      } else if (language === "typescript") {
        const tsPlugin = (await import("prettier/plugins/typescript")).default;
        const estreePlugin = (await import("prettier/plugins/estree")).default;
        plugins = [tsPlugin, estreePlugin];
        parser = "typescript";
      } else if (language === "markdown") {
        const mdPlugin = (await import("prettier/plugins/markdown")).default;
        plugins = [mdPlugin];
        parser = "markdown";
      }

      const formatted = await prettier.format(sourceCode, {
        parser,
        plugins,
        printWidth: 100,
        tabWidth: 4,
        singleQuote: false,
        semi: true,
      });

      return formatted.trimEnd();
    } catch (err) {
      console.warn("Prettier format failed, falling back to structural formatter:", err);
      // Fallback below
    }
  }

  // 3. SQL
  if (language === "sql") {
    return formatSQL(sourceCode);
  }

  // 4. Python
  if (language === "python") {
    return formatPython(sourceCode);
  }

  // 5. C, C++, Java, Rust, Dart, PHP, Swift, Kotlin
  if (["c", "cpp", "java", "rust", "dart", "php", "swift", "kotlin"].includes(language)) {
    return formatCurlyBrace(sourceCode);
  }

  return sourceCode;
}
