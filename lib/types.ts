export type Tone = "professional" | "casual";

export type Audience = "adult" | "child" | "colleague" | "close-friend";

export type ErrorCategory = "grammar" | "vocab" | "coherence";

export type ErrorStatus = "pending" | "accepted" | "rejected";

export interface WritingError {
  id: string;
  category: ErrorCategory;
  status: ErrorStatus;
  /** Character offsets into the original submitted text. */
  startIndex: number;
  endIndex: number;
  original: string;
  suggestion: string;
  explanation: string;
}

export type AnalysisStatus = "loading" | "error" | "success";
