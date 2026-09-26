"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnalysisStatus, ErrorCategory, WritingError } from "@/lib/types";
import FeedbackCard from "./feedback-card";
import FeedbackTabs from "./feedback-tabs";
import InfoModal from "./info-modal";

interface FeedbackPanelProps {
  errors: WritingError[];
  status: AnalysisStatus;
  activeTab: ErrorCategory;
  onChangeTab: (category: ErrorCategory) => void;
  selectedErrorId: string | null;
  onSelect: (id: string) => void;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onRetry: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function FeedbackPanel({
  errors,
  status,
  activeTab,
  onChangeTab,
  selectedErrorId,
  onSelect,
  onAccept,
  onReject,
  onRetry,
  mobileOpen,
  onCloseMobile,
}: FeedbackPanelProps) {
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState<"up" | "down" | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (!selectedErrorId) return;
    cardRefs.current[selectedErrorId]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [selectedErrorId]);

  const cardsForTab = useMemo(() => {
    return errors
      .filter((e) => e.category === activeTab)
      .sort((a, b) => {
        if (a.status === "pending" && b.status !== "pending") return -1;
        if (a.status !== "pending" && b.status === "pending") return 1;
        return a.startIndex - b.startIndex;
      });
  }, [errors, activeTab]);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-20 max-h-[80vh] overflow-x-hidden overflow-y-auto rounded-t-2xl border border-line bg-surface p-4 shadow-2xl transition-transform duration-300 md:static md:z-auto md:max-h-none md:translate-y-0 md:rounded-xl md:p-4 md:shadow-none ${
        mobileOpen ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="mb-3 flex items-center justify-between gap-2 text-xs">
        <button type="button" onClick={() => setNoteModalOpen(true)} className="font-medium text-primary hover:underline">
          ⚠️ Lưu ý chấm điểm
        </button>
        <button
          type="button"
          onClick={() => setFeedbackModalOpen(true)}
          className="font-medium text-primary hover:underline"
        >
          👍👎 Góp ý để AI thông minh hơn
        </button>
        <button type="button" onClick={onCloseMobile} className="shrink-0 text-ink-muted md:hidden">
          Đóng ✕
        </button>
      </div>

      {status === "loading" && (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-lg bg-gray-100" />
          ))}
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <span className="text-2xl">⚠️</span>
          <p className="text-sm text-neutral">Không thể phân tích bài viết. Vui lòng thử lại.</p>
          <button type="button" onClick={onRetry} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white">
            Thử lại
          </button>
        </div>
      )}

      {status === "success" && (
        <>
          <FeedbackTabs errors={errors} activeTab={activeTab} onChangeTab={onChangeTab} />
          {cardsForTab.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <span className="text-2xl">🎉</span>
              <p className="text-sm text-neutral">Không tìm thấy lỗi nào ở nhóm này!</p>
            </div>
          ) : (
            cardsForTab.map((error) => (
              <FeedbackCard
                key={error.id}
                error={error}
                isSelected={selectedErrorId === error.id}
                onSelect={() => onSelect(error.id)}
                onAccept={() => onAccept(error.id)}
                onReject={() => onReject(error.id)}
                elementRef={(el) => {
                  cardRefs.current[error.id] = el;
                }}
              />
            ))
          )}
        </>
      )}

      <InfoModal open={noteModalOpen} onClose={() => setNoteModalOpen(false)} title="Lưu ý chấm điểm">
        <p>
          Gợi ý từ AI có thể không chính xác 100%. Hãy tự đọc và suy nghĩ trước khi bấm Accept — AI chỉ hỗ trợ,
          không thay bạn viết.
        </p>
      </InfoModal>

      <InfoModal
        open={feedbackModalOpen}
        onClose={() => {
          setFeedbackModalOpen(false);
          setFeedbackSent(null);
        }}
        title="Góp ý để AI thông minh hơn"
      >
        {feedbackSent ? (
          <p className="text-vocab">Cảm ơn bạn đã góp ý! Phản hồi giúp AI cải thiện tốt hơn.</p>
        ) : (
          <div className="flex items-center gap-3">
            <p className="text-sm text-ink">Bạn thấy các gợi ý ở bài này thế nào?</p>
            <button type="button" onClick={() => setFeedbackSent("up")} className="text-xl" aria-label="Tốt">
              👍
            </button>
            <button type="button" onClick={() => setFeedbackSent("down")} className="text-xl" aria-label="Chưa tốt">
              👎
            </button>
          </div>
        )}
      </InfoModal>
    </div>
  );
}
