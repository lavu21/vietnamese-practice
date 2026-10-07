"use client";

import { useRouter } from "next/navigation";
import { useWriting } from "@/lib/writing-context";
import { AnalysisStatus } from "@/lib/types";

interface TopBarProps {
  status: AnalysisStatus;
  totalCount: number;
  resolvedCount: number;
}

export default function TopBar({ status, totalCount, resolvedCount }: TopBarProps) {
  const router = useRouter();
  const { reset } = useWriting();

  return (
    <div className="flex min-h-14 items-center justify-between gap-3 border-b border-line bg-surface px-4 py-2 sm:px-6">
      <div className="flex min-w-0 flex-col justify-center">
        <span className="truncate text-sm font-bold text-ink sm:text-[15px]">Bài luyện: &quot;Một ngày đi học&quot;</span>
        <span className="truncate text-xs text-neutral">
          {status === "loading" && "Đang phân tích bài viết..."}
          {status === "error" && "Không thể phân tích bài viết"}
          {status === "success" && totalCount === 0 && "Không tìm thấy lỗi nào"}
          {status === "success" && totalCount > 0 && `Đã xử lý ${resolvedCount}/${totalCount} gợi ý`}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => {
            reset();
            router.push("/");
          }}
          className="whitespace-nowrap rounded-md border border-line bg-white px-3 py-1.5 text-[13px] text-ink hover:bg-gray-50"
        >
          ← Viết bài mới
        </button>
        <button
          type="button"
          className="whitespace-nowrap rounded-md border border-line bg-white px-3 py-1.5 text-[13px] text-ink hover:bg-gray-50"
        >
          Lưu
        </button>
      </div>
    </div>
  );
}
