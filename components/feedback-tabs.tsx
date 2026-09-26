"use client";

import { CATEGORY_ORDER, CATEGORY_META } from "@/lib/constants";
import { ErrorCategory, WritingError } from "@/lib/types";

interface FeedbackTabsProps {
  errors: WritingError[];
  activeTab: ErrorCategory;
  onChangeTab: (category: ErrorCategory) => void;
}

export default function FeedbackTabs({ errors, activeTab, onChangeTab }: FeedbackTabsProps) {
  return (
    <div className="mb-4 flex gap-2">
      {CATEGORY_ORDER.map((category) => {
        const meta = CATEGORY_META[category];
        const pending = errors.filter((e) => e.category === category && e.status === "pending").length;
        const isActive = activeTab === category;
        return (
          <button
            key={category}
            type="button"
            onClick={() => onChangeTab(category)}
            className={`flex min-w-0 flex-1 items-center justify-center gap-1 rounded-lg border px-1 py-2 text-[11px] font-bold ${
              isActive ? "border-ink text-ink" : "border-transparent text-ink-muted"
            }`}
          >
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: meta.color }} />
            <span className="min-w-0 truncate">
              {meta.label}
              {pending > 0 ? ` (${pending})` : ""}
            </span>
          </button>
        );
      })}
    </div>
  );
}
