"use client";

import React, { useState } from "react";
import {
  Play,
  Square,
  RotateCcw,
  Copy,
  Download,
  Upload,
  WrapText,
  Maximize2,
  Minimize2,
  Sparkles,
  HelpCircle,
  Check,
  ZoomIn,
  ZoomOut,
  ChevronDown,
} from "lucide-react";
import { LANGUAGES, LANGUAGE_LIST } from "@/lib/compiler/languages";
import { LanguageLogo } from "./LanguageLogo";
import { useTheme } from "@/lib/theme/ThemeContext";

interface IDEToolbarProps {
  currentLanguage: string;
  onLanguageChange: (langId: string) => void;
  onRun: () => void;
  onStop: () => void;
  onFormat: () => void;
  onReset: () => void;
  onCopy: () => void;
  onDownload: () => void;
  onUpload: (content: string, filename: string) => void;
  fontSize: number;
  onFontSizeChange: (newSize: number) => void;
  wordWrap: boolean;
  onWordWrapToggle: () => void;
  isFullscreen: boolean;
  onFullscreenToggle: () => void;
  isRunning: boolean;
  executionStatus: "idle" | "running" | "success" | "error" | "timeout";
  executionTimeMs: number;
}

export function IDEToolbar({
  currentLanguage,
  onLanguageChange,
  onRun,
  onStop,
  onFormat,
  onReset,
  onCopy,
  onDownload,
  onUpload,
  fontSize,
  onFontSizeChange,
  wordWrap,
  onWordWrapToggle,
  isFullscreen,
  onFullscreenToggle,
  isRunning,
  executionStatus,
  executionTimeMs,
}: IDEToolbarProps) {
  const [copied, setCopied] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const { theme } = useTheme();
  const isDark = theme === "dark";
  const langConfig = LANGUAGES[currentLanguage] || LANGUAGES.python;

  // Theme-aware color tokens
  const toolbarBg = isDark ? "#141416" : "#F0F0F3";
  const borderColor = isDark ? "#292929" : "#E4E4E7";
  const dropdownBg = isDark ? "#141416" : "#FFFFFF";
  const textPrimary = isDark ? "#F5F5F5" : "#111111";
  const textMuted = isDark ? "#A1A1AA" : "#6B6B75";
  const hoverBg = isDark ? "#1C1C1F" : "#E8E8EC";
  const modalBg = isDark ? "#141416" : "#FFFFFF";
  const inputBg = isDark ? "#0B0B0D" : "#F4F4F7";
  const kbdBg = isDark ? "#0B0B0D" : "#EBEBEE";
  const kbdBorderColor = isDark ? "#292929" : "#D1D5DB";
  const dividerColor = isDark ? "#292929" : "#E4E4E7";

  const handleCopyClick = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      onUpload(content, file.name);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div
      style={{
        backgroundColor: toolbarBg,
        borderBottom: `1px solid ${borderColor}`,
      }}
      className="flex items-center justify-between px-3 py-2 select-none text-xs gap-2 flex-wrap"
    >
      {/* Left: Language selector & Run/Stop buttons */}
      <div className="flex items-center gap-2">
        {/* Language dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowLangDropdown(!showLangDropdown)}
            style={{
              backgroundColor: isDark ? "#0B0B0D" : "#FFFFFF",
              border: `1px solid ${borderColor}`,
              color: textPrimary,
            }}
            className="flex items-center gap-2 px-2.5 py-1.5 hover:border-[#FF7900] rounded font-medium transition-colors"
            title="Switch Language"
          >
            <LanguageLogo languageId={langConfig.id} size={16} />
            <span className="font-semibold">{langConfig.name}</span>
            <span style={{ color: textMuted }} className="text-[10px] hidden sm:inline">
              {langConfig.version}
            </span>
            <ChevronDown style={{ color: textMuted }} className="w-3.5 h-3.5" />
          </button>

          {showLangDropdown && (
            <div
              style={{
                backgroundColor: dropdownBg,
                border: `1px solid ${borderColor}`,
              }}
              className="absolute left-0 mt-1 w-56 max-h-80 overflow-y-auto rounded-lg shadow-2xl z-50 py-1"
            >
              <div
                style={{
                  color: textMuted,
                  borderBottom: `1px solid ${borderColor}`,
                }}
                className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold"
              >
                Select Environment
              </div>
              {LANGUAGE_LIST.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => {
                    onLanguageChange(lang.id);
                    setShowLangDropdown(false);
                  }}
                  style={{
                    color:
                      lang.id === currentLanguage
                        ? "#FF7900"
                        : textPrimary,
                    backgroundColor:
                      lang.id === currentLanguage
                        ? "rgba(255, 121, 0, 0.1)"
                        : "transparent",
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-left transition-colors hover:opacity-80"
                >
                  <div className="flex items-center gap-2">
                    <LanguageLogo languageId={lang.id} size={16} />
                    <span>{lang.name}</span>
                  </div>
                  <span style={{ color: textMuted }} className="text-[10px]">
                    {lang.version}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Run Button */}
        {isRunning ? (
          <button
            onClick={onStop}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-600/90 hover:bg-red-600 text-white font-bold rounded shadow-sm transition-all"
            title="Cancel execution"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>Stop</span>
          </button>
        ) : (
          <button
            onClick={onRun}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#FF7900] hover:bg-[#FF963D] text-[#0B0B0D] font-bold rounded shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Run code (Ctrl + Enter)"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run</span>
            <span className="text-[10px] opacity-75 font-mono hidden md:inline ml-1">
              Ctrl+↵
            </span>
          </button>
        )}

        {/* Execution Status Badge */}
        {executionStatus !== "idle" && (
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] font-mono ${
              executionStatus === "running"
                ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                : executionStatus === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                executionStatus === "running"
                  ? "bg-amber-400 animate-ping"
                  : executionStatus === "success"
                  ? "bg-emerald-400"
                  : "bg-red-400"
              }`}
            />
            <span className="capitalize">{executionStatus}</span>
            {executionTimeMs > 0 && <span>({executionTimeMs}ms)</span>}
          </div>
        )}
      </div>

      {/* Right: Code actions, format, font, shortcuts */}
      <div className="flex items-center gap-1" style={{ color: textMuted }}>
        {/* Format button */}
        <button
          onClick={onFormat}
          style={{ color: textMuted }}
          className="p-1.5 rounded transition-colors hover:opacity-80"
          title="Format Code (Shift+Alt+F)"
        >
          <Sparkles className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleCopyClick}
          style={{ color: textMuted }}
          className="p-1.5 rounded transition-colors hover:opacity-80"
          title="Copy Code"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>

        <button
          onClick={onDownload}
          style={{ color: textMuted }}
          className="p-1.5 rounded transition-colors hover:opacity-80"
          title="Download File"
        >
          <Download className="w-3.5 h-3.5" />
        </button>

        <label
          style={{ color: textMuted }}
          className="p-1.5 rounded transition-colors hover:opacity-80 cursor-pointer"
          title="Upload / Open Local File"
        >
          <Upload className="w-3.5 h-3.5" />
          <input
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept=".py,.js,.ts,.cpp,.c,.java,.rs,.dart,.sql,.php,.swift,.kt,.html,.css,.txt"
          />
        </label>

        <div className="w-[1px] h-4 mx-1" style={{ backgroundColor: dividerColor }} />

        {/* Font size */}
        <button
          onClick={() => onFontSizeChange(Math.max(10, fontSize - 1))}
          style={{ color: textMuted }}
          className="p-1.5 rounded transition-colors hover:opacity-80"
          title="Decrease Font Size"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <span style={{ color: isDark ? "#71717A" : "#9191A0" }} className="font-mono text-[10px] w-6 text-center">
          {fontSize}px
        </span>

        <button
          onClick={() => onFontSizeChange(Math.min(24, fontSize + 1))}
          style={{ color: textMuted }}
          className="p-1.5 rounded transition-colors hover:opacity-80"
          title="Increase Font Size"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        {/* Word wrap toggle */}
        <button
          onClick={onWordWrapToggle}
          style={{
            backgroundColor: wordWrap ? "rgba(255,121,0,0.15)" : "transparent",
            color: wordWrap ? "#FF7900" : textMuted,
          }}
          className="p-1.5 rounded transition-colors"
          title={`Word Wrap: ${wordWrap ? "On" : "Off"}`}
        >
          <WrapText className="w-3.5 h-3.5" />
        </button>

        {/* Reset */}
        <button
          onClick={() => setShowResetConfirm(true)}
          style={{ color: textMuted }}
          className="p-1.5 rounded transition-colors hover:opacity-80"
          title="Reset Code"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Keyboard shortcuts */}
        <button
          onClick={() => setShowShortcuts(true)}
          style={{ color: textMuted }}
          className="p-1.5 rounded transition-colors hover:opacity-80"
          title="Keyboard Shortcuts"
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>

        {/* Fullscreen */}
        <button
          onClick={onFullscreenToggle}
          style={{ color: textMuted }}
          className="p-1.5 rounded transition-colors hover:opacity-80"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? (
            <Minimize2 className="w-3.5 h-3.5" />
          ) : (
            <Maximize2 className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div
            style={{
              backgroundColor: modalBg,
              border: `1px solid ${borderColor}`,
            }}
            className="rounded-xl p-5 max-w-sm w-full space-y-4 shadow-2xl"
          >
            <h3 style={{ color: textPrimary }} className="text-sm font-bold">
              Reset to Default Template?
            </h3>
            <p style={{ color: textMuted }} className="text-xs leading-relaxed">
              This will overwrite your current edits with the original starter code for{" "}
              <span className="text-[#FF7900] font-semibold">{langConfig.name}</span>.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                style={{ backgroundColor: hoverBg, color: textPrimary }}
                className="px-3 py-1.5 rounded hover:opacity-80 text-xs transition-opacity"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onReset();
                  setShowResetConfirm(false);
                }}
                className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white font-semibold text-xs"
              >
                Reset Code
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div
            style={{
              backgroundColor: modalBg,
              border: `1px solid ${borderColor}`,
            }}
            className="rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl"
          >
            <div style={{ borderBottom: `1px solid ${borderColor}` }} className="flex items-center justify-between pb-3">
              <h3 style={{ color: textPrimary }} className="text-sm font-bold flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#FF7900]" />
                Keyboard Shortcuts
              </h3>
              <button
                onClick={() => setShowShortcuts(false)}
                style={{ color: textMuted }}
                className="hover:opacity-80"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { label: "Run Program", kbd: "Ctrl + Enter" },
                { label: "Format Document", kbd: "Shift + Alt + F" },
                { label: "Find & Replace", kbd: "Ctrl + F" },
                { label: "Command Palette", kbd: "F1 / Ctrl + Shift + P" },
                { label: "Toggle Comment", kbd: "Ctrl + /" },
                { label: "Multi-Cursor", kbd: "Alt + Click" },
              ].map(({ label, kbd }, idx, arr) => (
                <div
                  key={label}
                  style={{
                    borderBottom: idx < arr.length - 1 ? `1px solid ${isDark ? "#1F1F23" : "#F0F0F3"}` : undefined,
                  }}
                  className="flex justify-between items-center py-1"
                >
                  <span style={{ color: textMuted }}>{label}</span>
                  <kbd
                    style={{
                      backgroundColor: kbdBg,
                      border: `1px solid ${kbdBorderColor}`,
                      color: idx === 0 ? "#FF7900" : textPrimary,
                    }}
                    className="px-2 py-0.5 rounded font-mono"
                  >
                    {kbd}
                  </kbd>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowShortcuts(false)}
                className="px-4 py-1.5 rounded bg-[#FF7900] text-[#0B0B0D] font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
