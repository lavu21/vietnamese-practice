"use client";

import { CATEGORY_META } from "@/lib/constants";
import { WritingError } from "@/lib/types";

interface FeedbackCardProps {
  error: WritingError;
  isSelected: boolean;
  onSelect: () => void;
  onAccept: () => void;
  onReject: () => void;
  elementRef: (el: HTMLDivElement | null) => void;
}

export default function FeedbackCard({ error, isSelected, onSelect, onAccept, onReject, elementRef }: FeedbackCardProps) {
  const meta = CATEGORY_META[error.category];
  const isCoherence = error.category === "coherence";
  const isResolved = error.status !== "pending";

  return (
    <div
      ref={elementRef}
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter") onAccept();
        if (e.key === "Escape") onReject();
      }}
      className={`mb-3 rounded-lg border p-4 transition-all ${
        isSelected ? "border-transparent shadow-md ring-2" : "border-line"
      } ${isResolved ? "opacity-60" : ""}`}
      style={
        isSelected
          ? { borderLeft: `4px solid ${meta.color}`, backgroundColor: `${meta.color}1a`, boxShadow: `0 0 0 2px ${meta.color}55` }
          : undefined
      }
    >
      <div
        className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide"
        style={{ color: meta.color }}
      >
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: meta.color }} />
        {meta.label}
      </div>

      {isCoherence ? (
        <div className="mb-3 space-y-1.5 text-[13px] leading-relaxed text-ink">
          <p>
            <span className="font-semibold">Vấn đề: </span>
            {error.explanation}
          </p>
          <p>
            <span className="font-semibold">Đề xuất: </span>&quot;{error.suggestion}&quot;
          </p>
        </div>
      ) : (
        <p className="mb-3 text-[13px] leading-relaxed text-ink">{error.explanation}</p>
      )}

      {error.status === "pending" ? (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAccept();
            }}
            className="rounded-md bg-primary px-3.5 py-2 text-[13px] font-semibold text-white hover:bg-primary-hover"
          >
            {isCoherence ? "Dùng câu này" : "Accept"}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onReject();
            }}
            className="rounded-md border border-line bg-white px-3.5 py-2 text-[13px] font-semibold text-neutral hover:bg-gray-50"
          >
            {isCoherence ? "Bỏ qua" : "Reject"}
          </button>
        </div>
      ) : (
        <p className="text-xs font-medium text-neutral">
          {error.status === "accepted" ? "✓ Đã áp dụng" : "— Đã bỏ qua"}
        </p>
      )}
    </div>
  );
}
