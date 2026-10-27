"use client";

import React, { useState } from "react";
import {
  FolderPlus,
  FilePlus,
  FileCode,
  Trash2,
  Edit2,
  Download,
  RotateCcw,
  FileText,
} from "lucide-react";
import { WorkspaceFile } from "@/lib/compiler/storage";
import { useTheme } from "@/lib/theme/ThemeContext";

interface FileTreeProps {
  files: WorkspaceFile[];
  activeFileId: string;
  onSelectFile: (fileId: string) => void;
  onCreateFile: (fileName: string) => void;
  onRenameFile: (fileId: string, newName: string) => void;
  onDeleteFile: (fileId: string) => void;
  onDownloadZip: () => void;
  onClearDrafts: () => void;
}

export function FileTree({
  files,
  activeFileId,
  onSelectFile,
  onCreateFile,
  onRenameFile,
  onDeleteFile,
  onDownloadZip,
  onClearDrafts,
}: FileTreeProps) {
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Theme tokens
  const sidebarBg = isDark ? "#0F0F11" : "#F4F4F6";
  const borderColor = isDark ? "#292929" : "#E4E4E7";
  const textPrimary = isDark ? "#F5F5F5" : "#111111";
  const textMuted = isDark ? "#A1A1AA" : "#6B6B75";
  const activeBg = isDark ? "#1C1C1F" : "#E4E4E7";
  const hoverBg = isDark ? "rgba(28,28,31,0.5)" : "rgba(228,228,231,0.5)";
  const inputBg = isDark ? "#0B0B0D" : "#FFFFFF";
  const footerText = isDark ? "#71717A" : "#9191A0";

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFileName.trim()) {
      onCreateFile(newFileName.trim());
      setNewFileName("");
      setIsCreatingFile(false);
    }
  };

  const handleRenameSubmit = (e: React.FormEvent, fileId: string) => {
    e.preventDefault();
    if (editName.trim()) {
      onRenameFile(fileId, editName.trim());
      setEditingFileId(null);
    }
  };

  return (
    <div
      style={{
        backgroundColor: sidebarBg,
        borderRight: `1px solid ${borderColor}`,
      }}
      className="flex flex-col h-full select-none text-xs w-56 shrink-0"
    >
      {/* Explorer header */}
      <div
        style={{
          borderBottom: `1px solid ${borderColor}`,
          color: textMuted,
        }}
        className="flex items-center justify-between px-3 py-2"
      >
        <span style={{ color: textPrimary }} className="font-bold tracking-wider uppercase text-[10px]">
          Project Explorer
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsCreatingFile(true)}
            style={{ color: textMuted }}
            className="p-1 hover:text-[#FF7900] rounded transition-colors"
            title="New File"
          >
            <FilePlus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              const name = prompt("Enter new folder name:");
              if (name) onCreateFile(`${name}/index.js`);
            }}
            style={{ color: textMuted }}
            className="p-1 hover:text-[#FF7900] rounded transition-colors"
            title="New Folder"
          >
            <FolderPlus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDownloadZip}
            style={{ color: textMuted }}
            className="p-1 hover:text-[#FF7900] rounded transition-colors"
            title="Download ZIP"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* New file input form */}
      {isCreatingFile && (
        <form
          onSubmit={handleCreateSubmit}
          style={{ borderBottom: `1px solid ${borderColor}` }}
          className="p-2"
        >
          <input
            type="text"
            autoFocus
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            onBlur={() => setIsCreatingFile(false)}
            placeholder="filename.ext"
            style={{
              backgroundColor: inputBg,
              color: textPrimary,
              border: "1px solid #FF7900",
            }}
            className="w-full px-2 py-1 rounded text-xs outline-none font-mono"
          />
        </form>
      )}

      {/* Files list */}
      <div className="flex-1 overflow-y-auto py-1">
        {files.map((file) => {
          const isActive = file.id === activeFileId;
          const isEditing = editingFileId === file.id;

          return (
            <div
              key={file.id}
              style={{
                backgroundColor: isActive ? activeBg : "transparent",
                color: isActive ? textPrimary : textMuted,
                borderLeft: isActive ? "2px solid #FF7900" : "2px solid transparent",
              }}
              className="group flex items-center justify-between px-2.5 py-1.5 cursor-pointer text-xs transition-colors hover:opacity-90"
              onClick={() => onSelectFile(file.id)}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = hoverBg;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                }
              }}
            >
              <div className="flex items-center gap-2 overflow-hidden flex-1">
                <FileCode className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-[#FF7900]" : ""}`} style={{ color: isActive ? "#FF7900" : footerText }} />
                {isEditing ? (
                  <form
                    onSubmit={(e) => handleRenameSubmit(e, file.id)}
                    className="flex-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="text"
                      autoFocus
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onBlur={() => setEditingFileId(null)}
                      style={{
                        backgroundColor: inputBg,
                        color: textPrimary,
                        border: "1px solid #FF7900",
                      }}
                      className="w-full px-1 py-0.5 rounded text-xs font-mono outline-none"
                    />
                  </form>
                ) : (
                  <span className="truncate font-mono">{file.name}</span>
                )}
                {file.isDirty && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF7900] shrink-0" title="Unsaved changes" />
                )}
              </div>

              {/* Action buttons on hover */}
              <div className="hidden group-hover:flex items-center gap-1 shrink-0 ml-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingFileId(file.id);
                    setEditName(file.name);
                  }}
                  style={{ color: textMuted }}
                  className="p-1 hover:text-[#FF7900] rounded"
                  title="Rename"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                {files.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete ${file.name}?`)) {
                        onDeleteFile(file.id);
                      }
                    }}
                    style={{ color: textMuted }}
                    className="p-1 hover:text-red-400 rounded"
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Storage footer */}
      <div
        style={{
          borderTop: `1px solid ${borderColor}`,
          color: footerText,
        }}
        className="p-2 flex items-center justify-between text-[11px]"
      >
        <span className="flex items-center gap-1">
          <FileText className="w-3 h-3 text-[#10B981]" />
          Saved in Browser
        </span>
        <button
          onClick={() => {
            if (confirm("Clear local drafts for this language?")) {
              onClearDrafts();
            }
          }}
          style={{ color: footerText }}
          className="hover:text-red-400 transition-colors"
          title="Clear drafts cache"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
