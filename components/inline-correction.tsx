"use client";

import { WritingError } from "@/lib/types";

interface InlineCorrectionProps {
  error: WritingError;
  isFlashing: boolean;
  onSelect: () => void;
  elementRef: (el: HTMLSpanElement | null) => void;
}

export default function InlineCorrection({ error, isFlashing, onSelect, elementRef }: InlineCorrectionProps) {
  const flashClass = isFlashing ? "rounded ring-2 ring-primary/60" : "";

  if (error.status === "accepted") {
    return (
      <span ref={elementRef} className={`font-semibold text-ink ${flashClass}`}>
        {error.suggestion}{" "}
      </span>
    );
  }
  if (error.status === "rejected") {
    return (
      <span ref={elementRef} className={flashClass}>
        {error.original}{" "}
      </span>
    );
  }

  const highlightClass = error.category === "grammar" ? "bg-grammar/20 text-amber-800" : "bg-vocab/20 text-green-900";

  return (
    <span
      ref={elementRef}
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => e.key === "Enter" && onSelect()}
      title={`${error.explanation} — bấm để xem chi tiết & xử lý ở panel bên phải`}
      className={`cursor-pointer rounded ${flashClass}`}
    >
      <span className="mr-1 text-ink-muted line-through">{error.original}</span>
      <span className={`mr-1 rounded px-1.5 py-0.5 font-semibold ${highlightClass}`}>{error.suggestion}</span>{" "}
    </span>
  );
}
