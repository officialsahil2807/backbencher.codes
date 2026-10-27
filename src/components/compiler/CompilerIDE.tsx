"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import type { editor } from "monaco-editor";
import { IDEToolbar } from "./IDEToolbar";
import { FileTree } from "./FileTree";
import { MonacoEditor } from "./MonacoEditor";
import { OutputPanel } from "./OutputPanel";
import { LANGUAGES } from "@/lib/compiler/languages";
import {
  WorkspaceFile,
  loadSavedProject,
  saveProject,
  clearSavedProject,
  exportProjectAsZip,
  downloadSingleFile,
} from "@/lib/compiler/storage";
import { executeCode, ClientRunResult } from "@/lib/compiler/runner";
import { formatCode } from "@/lib/compiler/formatter";
import { useTheme } from "@/lib/theme/ThemeContext";
import { X, PanelLeftClose, PanelLeft } from "lucide-react";

interface CompilerIDEProps {
  initialLanguage?: string;
}

export function CompilerIDE({ initialLanguage = "python" }: CompilerIDEProps) {
  const [currentLanguage, setCurrentLanguage] = useState<string>(
    LANGUAGES[initialLanguage] ? initialLanguage : "python"
  );
  const [files, setFiles] = useState<WorkspaceFile[]>([]);
  const [activeFileId, setActiveFileId] = useState<string>("");
  const [fontSize, setFontSize] = useState<number>(14);
  const [wordWrap, setWordWrap] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showSidebar, setShowSidebar] = useState<boolean>(true);

  // Execution state
  const [stdin, setStdin] = useState<string>(LANGUAGES[initialLanguage]?.sampleInput || "");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [executionStatus, setExecutionStatus] = useState<"idle" | "running" | "success" | "error" | "timeout">("idle");
  const [runResult, setRunResult] = useState<ClientRunResult | null>(null);

  const editorInstanceRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Initialize or switch language project files
  useEffect(() => {
    const loadedFiles = loadSavedProject(currentLanguage);
    setFiles(loadedFiles);
    if (loadedFiles.length > 0) {
      setActiveFileId(loadedFiles[0].id);
    }
    const lang = LANGUAGES[currentLanguage];
    if (lang?.sampleInput) {
      setStdin(lang.sampleInput);
    }
    setRunResult(null);
    setExecutionStatus("idle");
  }, [currentLanguage]);

  const activeFile = files.find((f) => f.id === activeFileId) || files[0];

  // Update file content
  const handleContentChange = (newContent: string) => {
    if (!activeFile) return;
    const updated = files.map((f) =>
      f.id === activeFile.id ? { ...f, content: newContent, isDirty: true } : f
    );
    setFiles(updated);
    saveProject(currentLanguage, updated);
  };

  // Run program
  const handleRun = useCallback(async () => {
    if (!activeFile || isRunning) return;

    setIsRunning(true);
    setExecutionStatus("running");

    try {
      const result = await executeCode(currentLanguage, activeFile.content, stdin, files);
      setRunResult(result);
      setExecutionStatus(result.status === "rate_limited" ? "error" : result.status);
    } catch (e: unknown) {
      const err = e as Error;
      setRunResult({
        stdout: "",
        stderr: err.message || "Failed to execute program.",
        exitCode: 1,
        executionTimeMs: 0,
        status: "error",
      });
      setExecutionStatus("error");
    } finally {
      setIsRunning(false);
    }
  }, [activeFile, currentLanguage, stdin, isRunning, files]);

  // Handle Ctrl+Enter to run anywhere in IDE
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleRun();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleRun]);

  // Format code in editor for all 14 languages
  const handleFormat = async () => {
    if (!activeFile) return;
    try {
      const formatted = await formatCode(activeFile.content, activeFile.language);
      if (formatted && formatted !== activeFile.content) {
        handleContentChange(formatted);
        if (editorInstanceRef.current) {
          editorInstanceRef.current.setValue(formatted);
        }
        return;
      }
    } catch (e) {
      console.warn("Direct formatting error:", e);
    }

    if (editorInstanceRef.current) {
      editorInstanceRef.current
        .getAction("editor.action.formatDocument")
        ?.run()
        .catch(() => {
          editorInstanceRef.current
            ?.getAction("editor.action.formatSelection")
            ?.run();
        });
    }
  };

  // Reset code to default starter template
  const handleReset = () => {
    const lang = LANGUAGES[currentLanguage];
    if (!lang) return;
    clearSavedProject(currentLanguage);
    const resetFiles: WorkspaceFile[] = [
      {
        id: "main-file",
        name: `main.${lang.extension}`,
        content: lang.defaultCode,
        language: currentLanguage,
        isDirty: false,
      },
    ];
    setFiles(resetFiles);
    setActiveFileId(resetFiles[0].id);
    if (lang.sampleInput) setStdin(lang.sampleInput);
    setRunResult(null);
    setExecutionStatus("idle");
  };

  // Copy active code
  const handleCopy = () => {
    if (activeFile) {
      navigator.clipboard.writeText(activeFile.content);
    }
  };

  // Download active file
  const handleDownload = () => {
    if (activeFile) {
      downloadSingleFile(activeFile);
    }
  };

  // Upload file
  const handleUpload = (content: string, filename: string) => {
    const newFile: WorkspaceFile = {
      id: `file-${Date.now()}`,
      name: filename,
      content,
      language: currentLanguage,
      isDirty: true,
    };
    const updated = [...files, newFile];
    setFiles(updated);
    setActiveFileId(newFile.id);
    saveProject(currentLanguage, updated);
  };

  // Create file
  const handleCreateFile = (name: string) => {
    const newFile: WorkspaceFile = {
      id: `file-${Date.now()}`,
      name,
      content: "",
      language: currentLanguage,
      isDirty: false,
    };
    const updated = [...files, newFile];
    setFiles(updated);
    setActiveFileId(newFile.id);
    saveProject(currentLanguage, updated);
  };

  // Rename file
  const handleRenameFile = (fileId: string, newName: string) => {
    const updated = files.map((f) => (f.id === fileId ? { ...f, name: newName } : f));
    setFiles(updated);
    saveProject(currentLanguage, updated);
  };

  // Delete file
  const handleDeleteFile = (fileId: string) => {
    if (files.length <= 1) return;
    const updated = files.filter((f) => f.id !== fileId);
    setFiles(updated);
    if (activeFileId === fileId) {
      setActiveFileId(updated[0].id);
    }
    saveProject(currentLanguage, updated);
  };

  // Dynamic color tokens
  const borderColor = isDark ? "#292929" : "#E4E4E7";
  const toolbarBg = isDark ? "#141416" : "#F0F0F3";
  const editorAreaBg = isDark ? "#101012" : "#FAFAFA";
  const tabBarBg = isDark ? "#141416" : "#EBEBEE";
  const activeTabTextColor = isDark ? "#F5F5F5" : "#111111";
  const inactiveTabTextColor = isDark ? "#A1A1AA" : "#6B6B75";

  return (
    <div
      style={{ borderColor, backgroundColor: editorAreaBg }}
      className={`flex flex-col border rounded-xl overflow-hidden shadow-2xl ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none border-none" : "h-[85vh] min-h-[640px]"
      }`}
    >
      {/* Top Toolbar */}
      <IDEToolbar
        currentLanguage={currentLanguage}
        onLanguageChange={(newLang) => setCurrentLanguage(newLang)}
        onRun={handleRun}
        onStop={() => setIsRunning(false)}
        onFormat={handleFormat}
        onReset={handleReset}
        onCopy={handleCopy}
        onDownload={handleDownload}
        onUpload={handleUpload}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        wordWrap={wordWrap}
        onWordWrapToggle={() => setWordWrap(!wordWrap)}
        isFullscreen={isFullscreen}
        onFullscreenToggle={() => setIsFullscreen(!isFullscreen)}
        isRunning={isRunning}
        executionStatus={executionStatus}
        executionTimeMs={runResult?.executionTimeMs || 0}
      />

      {/* Main Workspace: Sidebar + Editor + Output */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Project Explorer Sidebar */}
        {showSidebar && (
          <FileTree
            files={files}
            activeFileId={activeFileId}
            onSelectFile={setActiveFileId}
            onCreateFile={handleCreateFile}
            onRenameFile={handleRenameFile}
            onDeleteFile={handleDeleteFile}
            onDownloadZip={() => exportProjectAsZip(`backbencher-${currentLanguage}`, files)}
            onClearDrafts={handleReset}
          />
        )}

        {/* Center & Right Workspace: Editor & Output */}
        <div className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: editorAreaBg }}>
          {/* File Tabs Bar */}
          <div
            style={{ backgroundColor: tabBarBg, borderBottom: `1px solid ${borderColor}` }}
            className="flex items-center justify-between px-2 overflow-x-auto text-xs select-none"
          >
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                style={{ color: inactiveTabTextColor }}
                className="p-1.5 hover:opacity-80 rounded transition-colors mr-1"
                title={showSidebar ? "Hide Explorer" : "Show Explorer"}
              >
                {showSidebar ? <PanelLeftClose className="w-3.5 h-3.5" /> : <PanelLeft className="w-3.5 h-3.5" />}
              </button>

              {files.map((file) => {
                const isActive = file.id === activeFileId;
                return (
                  <div
                    key={file.id}
                    onClick={() => setActiveFileId(file.id)}
                    style={{
                      backgroundColor: isActive ? editorAreaBg : tabBarBg,
                      color: isActive ? activeTabTextColor : inactiveTabTextColor,
                      borderTop: `2px solid ${isActive ? "#FF7900" : "transparent"}`,
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 cursor-pointer font-mono transition-colors hover:opacity-90"
                  >
                    <span>{file.name}</span>
                    {file.isDirty && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF7900]" />
                    )}
                    {files.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFile(file.id);
                        }}
                        className="hover:text-red-400 p-0.5 rounded"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Monaco Editor Canvas */}
          <div className="flex-1 overflow-hidden relative">
            {activeFile && (
              <MonacoEditor
                value={activeFile.content}
                language={LANGUAGES[currentLanguage]?.monacoLang || "plaintext"}
                fontSize={fontSize}
                wordWrap={wordWrap}
                onChange={handleContentChange}
                onMountCallback={(ed) => {
                  editorInstanceRef.current = ed;
                }}
              />
            )}
          </div>

          {/* Bottom Resizable Output Panel */}
          <OutputPanel
            runResult={runResult}
            isRunning={isRunning}
            stdin={stdin}
            onStdinChange={setStdin}
            onClearOutput={() => {
              setRunResult(null);
              setExecutionStatus("idle");
            }}
            languageId={currentLanguage}
          />
        </div>
      </div>
    </div>
  );
}
