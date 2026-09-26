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
    <div className="flex h-14 items-center justify-between border-b border-line bg-surface px-6">
      <div className="flex flex-col justify-center">
        <span className="text-[15px] font-bold text-ink">Bài luyện: &quot;Một ngày đi học&quot;</span>
        <span className="text-xs text-neutral">
          {status === "loading" && "Đang phân tích bài viết..."}
          {status === "error" && "Không thể phân tích bài viết"}
          {status === "success" && totalCount === 0 && "Không tìm thấy lỗi nào"}
          {status === "success" && totalCount > 0 && `Đã xử lý ${resolvedCount}/${totalCount} gợi ý`}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            reset();
            router.push("/");
          }}
          className="rounded-md border border-line bg-white px-3.5 py-1.5 text-[13px] text-ink hover:bg-gray-50"
        >
          ← Viết bài mới
        </button>
        <button
          type="button"
          className="rounded-md border border-line bg-white px-3.5 py-1.5 text-[13px] text-ink hover:bg-gray-50"
        >
          Lưu
        </button>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-[13px] font-bold text-white">
          A
        </div>
      </div>
    </div>
  );
}
