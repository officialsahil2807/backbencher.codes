"use client";

import React, { useState } from "react";
import {
  Terminal,
  Keyboard,
  Globe,
  Table as TableIcon,
  Trash2,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { ClientRunResult } from "@/lib/compiler/runner";
import { useTheme } from "@/lib/theme/ThemeContext";

interface OutputPanelProps {
  runResult: ClientRunResult | null;
  isRunning: boolean;
  stdin: string;
  onStdinChange: (val: string) => void;
  onClearOutput: () => void;
  languageId: string;
}

export function OutputPanel({
  runResult,
  isRunning,
  stdin,
  onStdinChange,
  onClearOutput,
  languageId,
}: OutputPanelProps) {
  const isWebLanguage = languageId === "html" || languageId === "css";
  const isSql = languageId === "sql";

  const [activeTab, setActiveTab] = useState<"output" | "stdin" | "preview" | "table">(
    isWebLanguage ? "preview" : isSql && runResult?.tableResult ? "table" : "output"
  );
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Theme-aware tokens
  const panelBg = isDark ? "#141416" : "#EBEBEE";
  const contentBg = isDark ? "#101012" : "#F4F4F7";
  const headerBg = isDark ? "#0B0B0D" : "#E4E4E7";
  const borderColor = isDark ? "#292929" : "#D4D4D8";
  const textPrimary = isDark ? "#F5F5F5" : "#111111";
  const textMuted = isDark ? "#A1A1AA" : "#6B6B75";
  const activeTabBg = isDark ? "#141416" : "#EBEBEE";
  const stdinBg = isDark ? "#0B0B0D" : "#FFFFFF";
  const tableRowHover = isDark ? "#1C1C1F" : "#E8E8EC";
  const tableHeaderBg = isDark ? "#141416" : "#E8E8EC";

  const handleCopy = () => {
    if (!runResult) return;
    const text = `${runResult.stdout}\n${runResult.stderr}`.trim();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabClass = (tab: string) =>
    `flex items-center gap-1.5 px-3 py-1.5 rounded-t font-semibold transition-colors ${
      activeTab === tab
        ? "border-b-2 border-[#FF7900]"
        : "hover:opacity-80"
    }`;

  return (
    <div
      style={{ backgroundColor: panelBg, borderTop: `1px solid ${borderColor}` }}
      className={`flex flex-col select-none text-xs transition-all duration-200 ${
        isExpanded ? "h-[80vh]" : "h-72"
      }`}
    >
      {/* Panel Tab Header */}
      <div
        style={{ backgroundColor: headerBg, borderBottom: `1px solid ${borderColor}` }}
        className="flex items-center justify-between px-3 py-1.5"
      >
        {/* Left Tabs */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab("output")}
            style={{
              backgroundColor: activeTab === "output" ? activeTabBg : "transparent",
              color: activeTab === "output" ? "#FF7900" : textMuted,
            }}
            className={tabClass("output")}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Terminal / Console</span>
          </button>

          <button
            onClick={() => setActiveTab("stdin")}
            style={{
              backgroundColor: activeTab === "stdin" ? activeTabBg : "transparent",
              color: activeTab === "stdin" ? "#FF7900" : textMuted,
            }}
            className={tabClass("stdin")}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Standard Input (stdin)</span>
            {stdin.trim().length > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF7900]" />
            )}
          </button>

          {isWebLanguage && (
            <button
              onClick={() => setActiveTab("preview")}
              style={{
                backgroundColor: activeTab === "preview" ? activeTabBg : "transparent",
                color: activeTab === "preview" ? "#FF7900" : textMuted,
              }}
              className={tabClass("preview")}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Live Preview</span>
            </button>
          )}

          {isSql && runResult?.tableResult && (
            <button
              onClick={() => setActiveTab("table")}
              style={{
                backgroundColor: activeTab === "table" ? activeTabBg : "transparent",
                color: activeTab === "table" ? "#FF7900" : textMuted,
              }}
              className={tabClass("table")}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table View ({runResult.tableResult.values.length})</span>
            </button>
          )}
        </div>

        {/* Right Execution Metrics & Actions */}
        <div style={{ color: textMuted }} className="flex items-center gap-3">
          {runResult && (
            <div className="flex items-center gap-2 text-[11px] font-mono">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" style={{ color: textMuted }} />
                {runResult.executionTimeMs}ms
              </span>

              {runResult.status === "success" ? (
                <span className="flex items-center gap-1 text-emerald-500">
                  <CheckCircle2 className="w-3 h-3" />
                  Exit Code: 0
                </span>
              ) : (
                <span className="flex items-center gap-1 text-red-400">
                  <AlertCircle className="w-3 h-3" />
                  Exit Code: {runResult.exitCode}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center gap-1">
            <button
              onClick={handleCopy}
              style={{ color: textMuted }}
              className="p-1 hover:opacity-80 rounded transition-opacity"
              title="Copy Output"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              onClick={onClearOutput}
              style={{ color: textMuted }}
              className="p-1 hover:text-red-400 rounded transition-colors"
              title="Clear Output"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              style={{ color: textMuted }}
              className="p-1 hover:opacity-80 rounded transition-opacity"
              title={isExpanded ? "Collapse Panel" : "Expand Panel"}
            >
              {isExpanded ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Panel Content Area */}
      <div
        style={{ backgroundColor: contentBg, color: textPrimary }}
        className="flex-1 overflow-auto p-3 font-mono text-xs"
      >
        {activeTab === "output" && (
          <div className="h-full space-y-2">
            {isRunning ? (
              <div className="flex items-center gap-2 text-amber-400">
                <div className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                <span>Compiling &amp; executing code...</span>
              </div>
            ) : !runResult ? (
              <div style={{ color: isDark ? "#71717A" : "#9191A0" }} className="italic">
                Press &quot;Run&quot; or press Ctrl + Enter to execute your program.
              </div>
            ) : (
              <div className="space-y-3">
                {runResult.stdout && (
                  <pre style={{ color: textPrimary }} className="whitespace-pre-wrap leading-relaxed select-text font-mono">
                    {runResult.stdout}
                  </pre>
                )}
                {runResult.stderr && (
                  <pre className="text-red-400 bg-red-950/20 border border-red-900/30 p-2.5 rounded whitespace-pre-wrap leading-relaxed select-text font-mono">
                    {runResult.stderr}
                  </pre>
                )}
                {!runResult.stdout && !runResult.stderr && (
                  <div style={{ color: textMuted }} className="italic">
                    Program finished with exit code {runResult.exitCode} (no output produced).
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "stdin" && (
          <div className="h-full flex flex-col gap-2">
            <span style={{ color: textMuted }} className="text-[11px]">
              Provide input for functions like Python&apos;s <code className="text-[#FF7900]">input()</code>, C&apos;s{" "}
              <code className="text-[#FF7900]">scanf()</code>, or Java&apos;s <code className="text-[#FF7900]">Scanner</code>:
            </span>
            <textarea
              value={stdin}
              onChange={(e) => onStdinChange(e.target.value)}
              placeholder="Enter standard input (stdin) lines here..."
              style={{
                backgroundColor: stdinBg,
                border: `1px solid ${borderColor}`,
                color: textPrimary,
              }}
              className="flex-1 w-full focus:border-[#FF7900] rounded p-2.5 font-mono text-xs resize-none outline-none placeholder:opacity-40"
            />
          </div>
        )}

        {activeTab === "preview" && (
          <div className="h-full w-full bg-white rounded overflow-hidden">
            <iframe
              srcDoc={runResult?.htmlPreview || "<html><body><h3 style='font-family:sans-serif;color:#555'>Press Run to render preview</h3></body></html>"}
              title="HTML Sandbox"
              sandbox="allow-scripts allow-modals allow-forms allow-popups"
              className="w-full h-full border-none"
            />
          </div>
        )}

        {activeTab === "table" && runResult?.tableResult && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr style={{ borderBottom: `1px solid ${borderColor}`, backgroundColor: tableHeaderBg }}>
                  {runResult.tableResult.columns.map((col, idx) => (
                    <th key={idx} className="p-2 text-[#FF7900] font-bold">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {runResult.tableResult.values.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    style={{ borderBottom: `1px solid ${isDark ? "#1F1F23" : "#EBEBEE"}` }}
                    className="transition-colors"
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = tableRowHover;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = "";
                    }}
                  >
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} style={{ color: textPrimary }} className="p-2">
                        {cell === null ? (
                          <span style={{ color: isDark ? "#71717A" : "#9191A0" }} className="italic">NULL</span>
                        ) : (
                          String(cell)
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
