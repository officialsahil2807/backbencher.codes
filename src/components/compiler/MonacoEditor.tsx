"use client";

import React, { useRef, useEffect } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import type { editor, languages } from "monaco-editor";
import { useTheme } from "@/lib/theme/ThemeContext";
import { formatCode } from "@/lib/compiler/formatter";

interface MonacoEditorProps {
  value: string;
  language: string;
  fontSize: number;
  wordWrap: boolean;
  onChange: (value: string) => void;
  onMountCallback?: (editor: editor.IStandaloneCodeEditor) => void;
}

const ALL_LANGUAGES = [
  "python",
  "javascript",
  "typescript",
  "html",
  "css",
  "cpp",
  "c",
  "java",
  "rust",
  "sql",
  "dart",
  "php",
  "swift",
  "kotlin",
  "json",
  "markdown",
];

export function MonacoEditor({
  value,
  language,
  fontSize,
  wordWrap,
  onChange,
  onMountCallback,
}: MonacoEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof import("monaco-editor") | null>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleEditorDidMount: OnMount = (editorInstance, monaco) => {
    editorRef.current = editorInstance;
    monacoRef.current = monaco;

    // ── Dark Theme ──────────────────────────────────────────────────────────────
    monaco.editor.defineTheme("backbencher-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "", foreground: "F5F5F5", background: "101012" },
        { token: "comment", foreground: "6B7280", fontStyle: "italic" },
        { token: "keyword", foreground: "FF7900", fontStyle: "bold" },
        { token: "string", foreground: "10B981" },
        { token: "number", foreground: "FF963D" },
        { token: "type", foreground: "3B82F6" },
        { token: "function", foreground: "60A5FA" },
        { token: "operator", foreground: "F5F5F5" },
        { token: "identifier", foreground: "E5E7EB" },
        { token: "delimiter", foreground: "9CA3AF" },
      ],
      colors: {
        "editor.background": "#101012",
        "editor.foreground": "#F5F5F5",
        "editorCursor.foreground": "#FF7900",
        "editor.lineHighlightBackground": "#18181B",
        "editorLineNumber.foreground": "#4B5563",
        "editorLineNumber.activeForeground": "#FF7900",
        "editor.selectionBackground": "#FF790044",
        "editor.inactiveSelectionBackground": "#292929",
        "editorIndentGuide.background1": "#1F1F23",
        "editorIndentGuide.activeBackground1": "#FF7900",
        "editorBracketMatch.background": "#FF790033",
        "editorBracketMatch.border": "#FF7900",
        "editorOverviewRuler.border": "#101012",
        "minimap.background": "#101012",
        "editorWidget.background": "#141416",
        "editorWidget.border": "#292929",
        "editorSuggestWidget.background": "#141416",
        "editorSuggestWidget.border": "#292929",
        "editorSuggestWidget.selectedBackground": "#1C1C1F",
      },
    });

    // ── Light Theme ─────────────────────────────────────────────────────────────
    monaco.editor.defineTheme("backbencher-light", {
      base: "vs",
      inherit: true,
      rules: [
        { token: "", foreground: "111111", background: "FAFAFA" },
        { token: "comment", foreground: "9CA3AF", fontStyle: "italic" },
        { token: "keyword", foreground: "C0561B", fontStyle: "bold" },
        { token: "string", foreground: "059669" },
        { token: "number", foreground: "D97706" },
        { token: "type", foreground: "2563EB" },
        { token: "function", foreground: "3B82F6" },
        { token: "operator", foreground: "374151" },
        { token: "identifier", foreground: "1F2937" },
        { token: "delimiter", foreground: "6B7280" },
      ],
      colors: {
        "editor.background": "#FAFAFA",
        "editor.foreground": "#111111",
        "editorCursor.foreground": "#E86E00",
        "editor.lineHighlightBackground": "#F0F0F4",
        "editorLineNumber.foreground": "#9CA3AF",
        "editorLineNumber.activeForeground": "#E86E00",
        "editor.selectionBackground": "#E8700033",
        "editor.inactiveSelectionBackground": "#E4E4E7",
        "editorIndentGuide.background1": "#E4E4E7",
        "editorIndentGuide.activeBackground1": "#E86E00",
        "editorBracketMatch.background": "#E8700020",
        "editorBracketMatch.border": "#E86E00",
        "editorOverviewRuler.border": "#FAFAFA",
        "minimap.background": "#F4F4F6",
        "editorWidget.background": "#FFFFFF",
        "editorWidget.border": "#E4E4E7",
        "editorSuggestWidget.background": "#FFFFFF",
        "editorSuggestWidget.border": "#E4E4E7",
        "editorSuggestWidget.selectedBackground": "#F4F4F6",
      },
    });

    const monacoTheme = isDark ? "backbencher-dark" : "backbencher-light";
    monaco.editor.setTheme(monacoTheme);

    // Register universal formatting providers for ALL supported languages
    ALL_LANGUAGES.forEach((langId) => {
      monaco.languages.registerDocumentFormattingEditProvider(langId, {
        provideDocumentFormattingEdits: async (model) => {
          try {
            const raw = model.getValue();
            const formatted = await formatCode(raw, langId);
            if (formatted && formatted !== raw) {
              return [
                {
                  range: model.getFullModelRange(),
                  text: formatted,
                },
              ];
            }
            return [];
          } catch (e) {
            console.warn(`Format failed for ${langId}:`, e);
            return [];
          }
        },
      } as languages.DocumentFormattingEditProvider);
    });

    // Enhanced editor options
    editorInstance.updateOptions({
      bracketPairColorization: { enabled: true },
      guides: { bracketPairs: true, indentation: true },
      cursorBlinking: "smooth",
      cursorSmoothCaretAnimation: "on",
      smoothScrolling: true,
      renderLineHighlight: "all",
    });

    if (onMountCallback) {
      onMountCallback(editorInstance);
    }
  };

  // Switch theme when context changes
  useEffect(() => {
    if (monacoRef.current && editorRef.current) {
      const monacoTheme = isDark ? "backbencher-dark" : "backbencher-light";
      monacoRef.current.editor.setTheme(monacoTheme);
    }
  }, [isDark]);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({
        fontSize,
        wordWrap: wordWrap ? "on" : "off",
      });
    }
  }, [fontSize, wordWrap]);

  const editorBg = isDark ? "#101012" : "#FAFAFA";

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ backgroundColor: editorBg }}>
      <Editor
        height="100%"
        language={language}
        value={value}
        theme={isDark ? "backbencher-dark" : "backbencher-light"}
        onChange={(val) => onChange(val || "")}
        onMount={handleEditorDidMount}
        options={{
          fontSize,
          wordWrap: wordWrap ? "on" : "off",
          automaticLayout: true,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Geist Mono', monospace",
          fontLigatures: true,
          minimap: { enabled: true, maxColumn: 80, scale: 1 },
          scrollBeyondLastLine: false,
          padding: { top: 14, bottom: 14 },
          renderWhitespace: "selection",
          tabSize: 4,
          formatOnPaste: true,
          formatOnType: true,
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
        }}
        loading={
          <div
            className="flex flex-col items-center justify-center h-full gap-3"
            style={{ color: "var(--muted)", backgroundColor: editorBg }}
          >
            <div className="w-8 h-8 border-2 border-[#FF7900] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono">Initializing Monaco Workspace...</span>
          </div>
        }
      />
    </div>
  );
}
