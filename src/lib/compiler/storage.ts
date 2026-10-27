import JSZip from "jszip";
import { LANGUAGES } from "./languages";

export interface WorkspaceFile {
  id: string;
  name: string;
  content: string;
  language: string;
  isDirty?: boolean;
}

const STORAGE_PREFIX = "backbencher_project_";

export function loadSavedProject(languageId: string): WorkspaceFile[] {
  if (typeof window === "undefined") return [];

  const saved = localStorage.getItem(`${STORAGE_PREFIX}${languageId}`);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // Fallback
    }
  }

  // Generate initial file from language template
  const lang = LANGUAGES[languageId] || LANGUAGES.python;
  return [
    {
      id: "main-file",
      name: `main.${lang.extension}`,
      content: lang.defaultCode,
      language: languageId,
      isDirty: false,
    },
  ];
}

export function saveProject(languageId: string, files: WorkspaceFile[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${languageId}`, JSON.stringify(files));
  } catch (e) {
    console.error("Failed to save draft to local storage", e);
  }
}

export function clearSavedProject(languageId: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(`${STORAGE_PREFIX}${languageId}`);
}

export async function exportProjectAsZip(
  projectName: string,
  files: WorkspaceFile[]
): Promise<void> {
  const zip = new JSZip();

  files.forEach((file) => {
    zip.file(file.name, file.content);
  });

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${projectName || "backbencher-project"}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadSingleFile(file: WorkspaceFile): void {
  const blob = new Blob([file.content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
