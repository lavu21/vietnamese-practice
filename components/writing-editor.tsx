"use client";

import { useEffect, useRef } from "react";
import { buildEditorSegments } from "@/lib/build-segments";
import { AnalysisStatus, WritingError } from "@/lib/types";
import CoherenceSpan from "./coherence-span";
import InlineCorrection from "./inline-correction";

interface WritingEditorProps {
  text: string;
  errors: WritingError[];
  status: AnalysisStatus;
  selectedErrorId: string | null;
  flashId: string | null;
  onSelect: (id: string) => void;
}

export default function WritingEditor({
  text,
  errors,
  status,
  selectedErrorId,
  flashId,
  onSelect,
}: WritingEditorProps) {
  const segments = buildEditorSegments(text, errors);
  const isBusy = status === "loading";
  const pendingCount = errors.filter((e) => e.status === "pending").length;
  const resolvedCount = errors.length - pendingCount;
  const spanRefs = useRef<Record<string, HTMLSpanElement | null>>({});

  useEffect(() => {
    if (!selectedErrorId) return;
    spanRefs.current[selectedErrorId]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [selectedErrorId]);

  return (
    <div className="relative rounded-xl border border-line bg-surface p-8">
      {isBusy && (
        <div className="absolute inset-0 z-10 flex items-start justify-center rounded-xl bg-surface/60 pt-16 backdrop-blur-[1px]">
          <div className="flex items-center gap-2 text-sm font-medium text-neutral">
            <span className="h-2 w-2 animate-ping rounded-full bg-primary" />
            Đang phân tích bài viết...
          </div>
        </div>
      )}

      {status === "success" && (
        <div className="mb-4 flex items-center gap-1.5 text-[13px] text-neutral">
          {errors.length === 0 ? (
            <span>🎉 Không tìm thấy lỗi nào</span>
          ) : (
            <span>
              ✅ <b className="text-ink">Đã tìm thấy {errors.length} lỗi</b> — đã xử lý {resolvedCount}/{errors.length}
            </span>
          )}
        </div>
      )}

      <p className={`whitespace-pre-wrap text-base leading-[1.8] text-ink ${isBusy ? "opacity-40" : ""}`}>
        {segments.map((segment, index) =>
          segment.kind === "text" ? (
            <span key={index}>{segment.content}</span>
          ) : segment.error.category === "coherence" ? (
            <CoherenceSpan
              key={segment.error.id}
              error={segment.error}
              isSelected={selectedErrorId === segment.error.id}
              isFlashing={flashId === segment.error.id}
              onSelect={() => onSelect(segment.error.id)}
              elementRef={(el) => {
                spanRefs.current[segment.error.id] = el;
              }}
            />
          ) : (
            <InlineCorrection
              key={segment.error.id}
              error={segment.error}
              isFlashing={flashId === segment.error.id}
              onSelect={() => onSelect(segment.error.id)}
              elementRef={(el) => {
                spanRefs.current[segment.error.id] = el;
              }}
            />
          ),
        )}
      </p>
    </div>
  );
}
