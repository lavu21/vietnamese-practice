import { WritingError } from "./types";

export type EditorSegment =
  | { kind: "text"; content: string }
  | { kind: "error"; error: WritingError };

/** Splits the original text into plain-text and error segments, in reading order. */
export function buildEditorSegments(text: string, errors: WritingError[]): EditorSegment[] {
  const segments: EditorSegment[] = [];
  const sorted = [...errors].sort((a, b) => a.startIndex - b.startIndex);
  let cursor = 0;

  for (const error of sorted) {
    if (error.startIndex > cursor) {
      segments.push({ kind: "text", content: text.slice(cursor, error.startIndex) });
    }
    segments.push({ kind: "error", error });
    cursor = Math.max(cursor, error.endIndex);
  }

  if (cursor < text.length) {
    segments.push({ kind: "text", content: text.slice(cursor) });
  }

  return segments;
}
