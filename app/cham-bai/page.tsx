"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FeedbackPanel from "@/components/feedback-panel";
import TopBar from "@/components/top-bar";
import WritingEditor from "@/components/writing-editor";
import { analyzeText } from "@/lib/mock-ai";
import { CATEGORY_ORDER } from "@/lib/constants";
import { AnalysisStatus, ErrorCategory, WritingError } from "@/lib/types";
import { useWriting } from "@/lib/writing-context";

export default function GradingPage() {
  const router = useRouter();
  const { submittedText } = useWriting();

  const [status, setStatus] = useState<AnalysisStatus>("loading");
  const [errors, setErrors] = useState<WritingError[]>([]);
  const [activeTab, setActiveTab] = useState<ErrorCategory>("grammar");
  const [selectedErrorId, setSelectedErrorId] = useState<string | null>(null);
  const [flashId, setFlashId] = useState<string | null>(null);
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);
  const [retryToken, setRetryToken] = useState(0);

  useEffect(() => {
    if (submittedText === null) {
      router.replace("/");
    }
  }, [submittedText, router]);

  useEffect(() => {
    if (!submittedText) return;
    let cancelled = false;

    analyzeText(submittedText)
      .then((result) => {
        if (cancelled) return;
        setErrors(result);
        setStatus("success");
        const firstWithErrors = CATEGORY_ORDER.find((category) => result.some((e) => e.category === category));
        setActiveTab(firstWithErrors ?? "grammar");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [submittedText, retryToken]);

  function runAnalysis() {
    setStatus("loading");
    setSelectedErrorId(null);
    setRetryToken((t) => t + 1);
  }

  if (submittedText === null) return null;

  const pendingCount = errors.filter((e) => e.status === "pending").length;
  const resolvedCount = errors.length - pendingCount;

  function updateErrorStatus(id: string, next: "accepted" | "rejected") {
    setErrors((prev) => prev.map((e) => (e.id === id ? { ...e, status: next } : e)));
  }

  function selectError(id: string) {
    const error = errors.find((e) => e.id === id);
    if (!error) return;
    setSelectedErrorId(id);
    setActiveTab(error.category);
    setFlashId(id);
    setMobilePanelOpen(true);
    window.setTimeout(() => setFlashId((current) => (current === id ? null : current)), 900);
  }

  return (
    <main className="min-h-full bg-page pb-24 md:pb-6">
      <TopBar status={status} totalCount={errors.length} resolvedCount={resolvedCount} />

      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 p-6 md:grid-cols-[64%_36%]">
        <WritingEditor
          text={submittedText}
          errors={errors}
          status={status}
          selectedErrorId={selectedErrorId}
          flashId={flashId}
          onSelect={selectError}
        />
        <FeedbackPanel
          errors={errors}
          status={status}
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          selectedErrorId={selectedErrorId}
          onSelect={selectError}
          onAccept={(id) => updateErrorStatus(id, "accepted")}
          onReject={(id) => updateErrorStatus(id, "rejected")}
          onRetry={runAnalysis}
          mobileOpen={mobilePanelOpen}
          onCloseMobile={() => setMobilePanelOpen(false)}
        />
      </div>

      {status === "success" && !mobilePanelOpen && (
        <button
          type="button"
          onClick={() => setMobilePanelOpen(true)}
          className="fixed right-6 bottom-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-bold text-white shadow-lg md:hidden"
        >
          {pendingCount > 0 ? pendingCount : "🎉"}
        </button>
      )}
    </main>
  );
}
