"use client";

import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { useAuth } from "./auth-context";
import { SAMPLE_TEXT } from "./constants";
import { addHistoryEntry, HistoryEntry } from "./history";
import { Audience, Tone } from "./types";

interface WritingContextValue {
  draftText: string;
  setDraftText: (value: string) => void;
  tone: Tone | null;
  setTone: (value: Tone) => void;
  audience: Audience | null;
  setAudience: (value: Audience) => void;
  submittedText: string | null;
  submit: () => void;
  openEntry: (entry: HistoryEntry) => void;
  reset: () => void;
}

const WritingContext = createContext<WritingContextValue | null>(null);

export function WritingProvider({ children }: { children: ReactNode }) {
  const { username } = useAuth();
  const [draftText, setDraftText] = useState(SAMPLE_TEXT);
  const [tone, setTone] = useState<Tone | null>("casual");
  const [audience, setAudience] = useState<Audience | null>("child");
  const [submittedText, setSubmittedText] = useState<string | null>(null);

  const value = useMemo<WritingContextValue>(
    () => ({
      draftText,
      setDraftText,
      tone,
      setTone,
      audience,
      setAudience,
      submittedText,
      submit: () => {
        const text = draftText.trim();
        setSubmittedText(text);
        if (username) addHistoryEntry(username, { text, tone, audience });
      },
      openEntry: (entry) => {
        setDraftText(entry.text);
        setTone(entry.tone);
        setAudience(entry.audience);
        setSubmittedText(entry.text);
      },
      reset: () => {
        setSubmittedText(null);
        setDraftText(SAMPLE_TEXT);
        setTone("casual");
        setAudience("child");
      },
    }),
    [draftText, tone, audience, submittedText, username],
  );

  return <WritingContext.Provider value={value}>{children}</WritingContext.Provider>;
}

export function useWriting() {
  const ctx = useContext(WritingContext);
  if (!ctx) throw new Error("useWriting must be used within WritingProvider");
  return ctx;
}
