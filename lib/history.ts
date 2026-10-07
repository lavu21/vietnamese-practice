import { Audience, Tone } from "./types";

export interface HistoryEntry {
  id: string;
  text: string;
  tone: Tone | null;
  audience: Audience | null;
  createdAt: number;
}

const MAX_ENTRIES = 100;

function storageKey(username: string) {
  return `vnp_history_${username}`;
}

export function loadHistory(username: string): HistoryEntry[] {
  try {
    const raw = window.localStorage.getItem(storageKey(username));
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

function saveHistory(username: string, entries: HistoryEntry[]) {
  window.localStorage.setItem(storageKey(username), JSON.stringify(entries.slice(0, MAX_ENTRIES)));
}

export function addHistoryEntry(username: string, entry: Omit<HistoryEntry, "id" | "createdAt">) {
  const next: HistoryEntry = { ...entry, id: crypto.randomUUID(), createdAt: Date.now() };
  saveHistory(username, [next, ...loadHistory(username)]);
}

export function removeHistoryEntry(username: string, id: string): HistoryEntry[] {
  const next = loadHistory(username).filter((e) => e.id !== id);
  saveHistory(username, next);
  return next;
}

export function clearHistory(username: string) {
  window.localStorage.removeItem(storageKey(username));
}
