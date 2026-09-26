"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { AUDIENCE_OPTIONS, MIN_WORD_COUNT, MOCK_SAMPLES, TONE_OPTIONS } from "@/lib/constants";
import { useWriting } from "@/lib/writing-context";

function countWords(text: string) {
  const trimmed = text.trim();
  return trimmed.length === 0 ? 0 : trimmed.split(/\s+/).length;
}

export default function HomePage() {
  const router = useRouter();
  const { draftText, setDraftText, tone, setTone, audience, setAudience, submit } = useWriting();

  const wordCount = useMemo(() => countWords(draftText), [draftText]);
  const isReady = wordCount >= MIN_WORD_COUNT && tone !== null && audience !== null;

  function handleSubmit() {
    if (!isReady) return;
    submit();
    router.push("/cham-bai");
  }

  return (
    <main className="flex min-h-full flex-1 justify-center bg-page px-4 py-12">
      <div className="w-full max-w-[720px] rounded-xl border border-line bg-surface p-8 shadow-sm">
        <h1 className="text-xl font-bold text-ink">Luyện viết tiếng Việt</h1>
        <p className="mt-1 mb-6 text-sm text-neutral">Nhập bài viết, chọn Tone và Đối tượng trước khi chấm bài</p>

        <label className="mb-2 block text-[13px] font-semibold text-ink">Bài viết của bạn</label>
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-ink-muted">Chưa tích hợp AI — dùng bài mẫu:</span>
          {MOCK_SAMPLES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => setDraftText(sample.text)}
              title={sample.description}
              className="rounded-full border border-line bg-white px-2.5 py-1 text-xs font-medium text-primary hover:border-primary/50 hover:bg-primary/5"
            >
              {sample.label}
            </button>
          ))}
        </div>
        <textarea
          value={draftText}
          onChange={(e) => setDraftText(e.target.value)}
          placeholder="Nhập bài viết của bạn ở đây..."
          className="min-h-[180px] w-full resize-y rounded-lg border border-line p-4 text-base leading-relaxed text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none"
        />
        <div
          className={`mt-1.5 text-right text-xs ${
            wordCount >= MIN_WORD_COUNT ? "font-semibold text-vocab" : "text-ink-muted"
          }`}
        >
          Số từ: {wordCount}/{MIN_WORD_COUNT} tối thiểu
        </div>

        <label className="mt-5 mb-2 block text-[13px] font-semibold text-ink">Tone giọng</label>
        <div className="flex gap-2">
          {TONE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setTone(option.value)}
              className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors ${
                tone === option.value
                  ? "border-primary bg-primary text-white"
                  : "border-line bg-white text-ink-muted hover:border-primary/50"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <label className="mt-5 mb-2 block text-[13px] font-semibold text-ink">Đối tượng</label>
        <div className="flex flex-wrap gap-2">
          {AUDIENCE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setAudience(option.value)}
              className={`flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-sm transition-colors ${
                audience === option.value
                  ? "border-primary bg-primary text-white"
                  : "border-line bg-white text-ink hover:border-primary/50"
              }`}
            >
              <span>{option.icon}</span>
              {option.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          disabled={!isReady}
          onClick={handleSubmit}
          className={`mt-8 w-full rounded-lg py-3.5 text-[15px] font-bold text-white transition-colors ${
            isReady ? "cursor-pointer bg-primary hover:bg-primary-hover" : "cursor-not-allowed bg-gray-300"
          }`}
        >
          Chấm bài
        </button>
        <p className="mt-2 text-center text-xs text-ink-muted">
          {isReady
            ? "Đã đủ điều kiện — sẵn sàng gửi cho AI phân tích"
            : "Nhập tối thiểu 20 từ, chọn Tone và Đối tượng để tiếp tục"}
        </p>
      </div>
    </main>
  );
}
