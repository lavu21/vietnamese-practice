"use client";

import { WritingError } from "@/lib/types";

interface CoherenceSpanProps {
  error: WritingError;
  isSelected: boolean;
  isFlashing: boolean;
  onSelect: () => void;
  elementRef: (el: HTMLSpanElement | null) => void;
}

export default function CoherenceSpan({ error, isSelected, isFlashing, onSelect, elementRef }: CoherenceSpanProps) {
  const flashClass = isFlashing ? "rounded ring-2 ring-primary/60" : "";

  if (error.status === "accepted") {
    return (
      <span ref={elementRef} className={flashClass}>
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

  return (
    <span
      ref={elementRef}
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => e.key === "Enter" && onSelect()}
      title={error.explanation}
      className={`cursor-pointer rounded underline decoration-coherence decoration-wavy decoration-2 underline-offset-4 ${
        isSelected ? "bg-coherence/25 ring-2 ring-coherence/70 font-semibold" : ""
      } ${flashClass}`}
    >
      {error.original}
    </span>
  );
}
