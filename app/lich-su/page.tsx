"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AUDIENCE_OPTIONS, TONE_OPTIONS } from "@/lib/constants";
import { useAuth } from "@/lib/auth-context";
import { clearHistory, HistoryEntry, loadHistory, removeHistoryEntry } from "@/lib/history";
import { useWriting } from "@/lib/writing-context";

const dateFormatter = new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" });

function countWords(text: string) {
  const trimmed = text.trim();
  return trimmed.length === 0 ? 0 : trimmed.split(/\s+/).length;
}

export default function HistoryPage() {
  const router = useRouter();
  const { username } = useAuth();
  const { openEntry } = useWriting();
  const [entries, setEntries] = useState<HistoryEntry[] | null>(null);

  useEffect(() => {
    if (username) setEntries(loadHistory(username));
  }, [username]);

  function handleOpen(entry: HistoryEntry) {
    openEntry(entry);
    router.push("/cham-bai");
  }

  function handleDelete(id: string) {
    if (username) setEntries(removeHistoryEntry(username, id));
  }

  function handleClear() {
    if (!username || !window.confirm("Xóa toàn bộ lịch sử bài viết?")) return;
    clearHistory(username);
    setEntries([]);
  }

  return (
    <main className="flex min-h-full flex-1 justify-center bg-page px-3 py-6 sm:px-4 sm:py-12">
      <div className="w-full max-w-[720px]">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-ink">Lịch sử bài viết</h1>
            <p className="mt-1 text-sm text-neutral">Các bài viết bạn đã gửi chấm</p>
          </div>
          {entries && entries.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="shrink-0 whitespace-nowrap rounded-md border border-line bg-white px-3.5 py-1.5 text-[13px] text-coherence hover:bg-gray-50"
            >
              Xóa tất cả
            </button>
          )}
        </div>

        {entries === null ? null : entries.length === 0 ? (
          <div className="rounded-xl border border-line bg-surface p-8 text-center shadow-sm">
            <p className="text-sm text-neutral">Chưa có bài viết nào.</p>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
            >
              Viết bài mới
            </button>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {entries.map((entry) => {
              const tone = TONE_OPTIONS.find((o) => o.value === entry.tone)?.label;
              const audience = AUDIENCE_OPTIONS.find((o) => o.value === entry.audience)?.label;
              return (
                <li
                  key={entry.id}
                  className="rounded-xl border border-line bg-surface p-4 shadow-sm transition-colors hover:border-primary/50"
                >
                  <button type="button" onClick={() => handleOpen(entry)} className="block w-full text-left">
                    <p className="line-clamp-3 text-sm leading-relaxed text-ink">{entry.text}</p>
                  </button>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-ink-muted">
                    <span>{dateFormatter.format(entry.createdAt)}</span>
                    <span>·</span>
                    <span>{countWords(entry.text)} từ</span>
                    {tone && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">{tone}</span>}
                    {audience && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">{audience}</span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(entry.id)}
                      className="ml-auto text-coherence hover:underline"
                    >
                      Xóa
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
