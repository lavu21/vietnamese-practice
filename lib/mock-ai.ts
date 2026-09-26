import { WritingError } from "./types";

/**
 * This module stands in for a real AI grading service (see project báo cáo, mục 7.3 —
 * "hướng phát triển: tích hợp AI thật"). It uses a small dictionary + heuristics so the
 * front-end flow (loading / accept / reject / retry) can be demoed end-to-end without a backend.
 */

interface DictEntry {
  phrase: string;
  suggestion: string;
  explanation: string;
  category: "grammar" | "vocab";
}

const GRAMMAR_VOCAB_DICT: DictEntry[] = [
  {
    phrase: "thứt dậy",
    suggestion: "thức dậy",
    explanation: "\"thứt dậy\" sai chính tả → nên viết \"thức dậy\".",
    category: "grammar",
  },
  {
    phrase: "bạn be",
    suggestion: "bạn bè",
    explanation: "\"bạn be\" thiếu dấu, từ đúng là \"bạn bè\".",
    category: "vocab",
  },
  {
    phrase: "dc ",
    suggestion: "được ",
    explanation: "\"dc\" là viết tắt không chuẩn trong văn viết, nên viết đầy đủ \"được\".",
    category: "grammar",
  },
  {
    phrase: "ko ",
    suggestion: "không ",
    explanation: "\"ko\" là viết tắt không chuẩn trong văn viết, nên viết đầy đủ \"không\".",
    category: "grammar",
  },
  {
    phrase: "coi phim",
    suggestion: "xem phim",
    explanation: "\"coi phim\" là cách nói khẩu ngữ, văn viết nên dùng \"xem phim\".",
    category: "vocab",
  },
  {
    phrase: "hong ",
    suggestion: "không ",
    explanation: "\"hong\" là cách viết khẩu ngữ, nên viết đầy đủ \"không\".",
    category: "vocab",
  },
  {
    phrase: "chia sẽ",
    suggestion: "chia sẻ",
    explanation: "\"chia sẽ\" dùng sai từ — \"sẽ\" là thì tương lai, từ đúng ở đây là \"chia sẻ\".",
    category: "grammar",
  },
  {
    phrase: "sát nhập",
    suggestion: "sáp nhập",
    explanation: "\"sát nhập\" là cách viết sai phổ biến, từ đúng là \"sáp nhập\".",
    category: "grammar",
  },
  {
    phrase: "cọ sát",
    suggestion: "cọ xát",
    explanation: "\"cọ sát\" viết sai chính tả, từ đúng là \"cọ xát\".",
    category: "vocab",
  },
  {
    phrase: "sáng lạn",
    suggestion: "xán lạn",
    explanation: "\"sáng lạn\" viết sai, từ đúng là \"xán lạn\" (tương lai xán lạn).",
    category: "vocab",
  },
  {
    phrase: "tựu chung",
    suggestion: "tựu trung",
    explanation: "\"tựu chung\" viết sai, từ đúng là \"tựu trung\" (tựu trung lại).",
    category: "grammar",
  },
  {
    phrase: "nghành",
    suggestion: "ngành",
    explanation: "\"nghành\" thừa chữ \"h\", từ đúng là \"ngành\".",
    category: "grammar",
  },
  {
    phrase: "sử lý",
    suggestion: "xử lý",
    explanation: "\"sử lý\" viết sai, từ đúng là \"xử lý\".",
    category: "grammar",
  },
];

const CURATED_COHERENCE: Record<string, { suggestion: string; explanation: string }> = {
  "Tôi nghỉ rằng nếu đi sớm thì sẽ không bị kẹt xe, nhưng thật ra hôm nay đường lại đông hơn mọi khi.":
    {
      suggestion: "Tôi nghĩ đi sớm sẽ tránh được kẹt xe, nhưng hôm nay đường lại đông hơn thường lệ.",
      explanation:
        "Câu chưa liên kết rõ với ý trước đó và dùng từ chưa chuẩn (\"nghỉ\" → \"nghĩ\"). Đề xuất diễn đạt mạch lạc, súc tích hơn.",
    },
};

interface Range {
  start: number;
  end: number;
}

function overlaps(a: Range, b: Range) {
  return a.start < b.end && b.start < a.end;
}

export class AnalysisFailedError extends Error {}

export async function analyzeText(text: string): Promise<WritingError[]> {
  // Simulate network latency, matching the "Đang phân tích bài viết..." loading state.
  await new Promise((resolve) => setTimeout(resolve, 1100 + Math.random() * 600));

  if (Math.random() < 0.12) {
    throw new AnalysisFailedError("Không thể kết nối tới máy chủ phân tích.");
  }

  const claimed: Range[] = [];
  const errors: WritingError[] = [];
  let counter = 0;

  for (const entry of GRAMMAR_VOCAB_DICT) {
    // Find every non-overlapping occurrence of this phrase, not just the first.
    let searchFrom = 0;
    while (searchFrom <= text.length) {
      const idx = text.indexOf(entry.phrase, searchFrom);
      if (idx === -1) break;
      const range = { start: idx, end: idx + entry.phrase.length };
      searchFrom = range.end;
      if (claimed.some((c) => overlaps(c, range))) continue;
      claimed.push(range);
      errors.push({
        id: `err-${counter++}`,
        category: entry.category,
        status: "pending",
        startIndex: range.start,
        endIndex: range.end,
        original: entry.phrase.trim(),
        suggestion: entry.suggestion.trim(),
        explanation: entry.explanation,
      });
    }
  }

  const sentenceRegex = /[^.!?]+[.!?]*/g;
  const candidates: { start: number; end: number; sentence: string }[] = [];
  let match: RegExpExecArray | null;
  while ((match = sentenceRegex.exec(text)) !== null) {
    if (!match[0].trim()) continue;
    candidates.push({ start: match.index, end: match.index + match[0].length, sentence: match[0] });
  }

  let coherencePicked = 0;
  const MAX_COHERENCE_PICKS = 8;
  for (const candidate of candidates) {
    if (coherencePicked >= MAX_COHERENCE_PICKS) break;
    const range = { start: candidate.start, end: candidate.end };
    if (claimed.some((c) => overlaps(c, range))) continue;

    const trimmed = candidate.sentence.trim();
    const words = trimmed.split(/\s+/);
    const hasButConnector = /\bnhưng\b/i.test(trimmed);
    const isLong = words.length > 14;
    if (!hasButConnector && !isLong) continue;

    const curated = CURATED_COHERENCE[trimmed];
    let suggestion: string;
    let explanation: string;

    if (curated) {
      suggestion = curated.suggestion;
      explanation = curated.explanation;
    } else if (hasButConnector) {
      const parts = trimmed.split(/\bnhưng\b/i);
      suggestion = `${parts[0].trim().replace(/,$/, "")}, nhưng ${parts.slice(1).join(" nhưng ").trim()}`;
      explanation = "Câu chưa liên kết rõ với ý trước đó. Đề xuất diễn đạt mạch lạc hơn.";
    } else {
      const mid = Math.ceil(words.length / 2);
      suggestion = `${words.slice(0, mid).join(" ")}. ${words.slice(mid).join(" ")}`;
      explanation = "Câu khá dài, nên tách thành hai câu ngắn để mạch lạc hơn.";
    }

    claimed.push(range);
    errors.push({
      id: `err-${counter++}`,
      category: "coherence",
      status: "pending",
      startIndex: range.start,
      endIndex: range.end,
      original: trimmed,
      suggestion: suggestion.trim(),
      explanation,
    });
    coherencePicked++;
  }

  return errors.sort((a, b) => a.startIndex - b.startIndex);
}
