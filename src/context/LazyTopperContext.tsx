import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type {
  ActionSource,
  AttemptRecord,
  AuthState,
  MistakeInsight,
  Mode,
  PaperScope,
  SessionSnapshot,
  Stream,
  Subject,
} from "@/lib/types";
import { topicsBySubject, topicBySlug } from "@/lib/topics";
import { SAMPLE_MISTAKE_LIBRARY } from "@/lib/mistakeData";

const MEMORY_KEY = "lazytopper.memory.v1";
const ACTIVE_KEY = "lazytopper.active.v1";

interface LazyTopperState {
  classLevel: 10;
  subject: Subject;
  stream: Stream;
  topicSlug: string | null;
  selectedTopicSlugs: string[];
  actionSource: ActionSource;
  mode: Mode;
  paperScope: PaperScope;
  auth: AuthState;
  lastAttempt: AttemptRecord | null;
  mistakeInsight: MistakeInsight | null;
  mistakeAwareEnabled: boolean;
  attemptHistory: AttemptRecord[];
  lastRoute: string;
}

interface LazyTopperContextValue extends LazyTopperState {
  setSubject: (s: Subject) => void;
  setStream: (s: Stream) => void;
  setTopicSlug: (slug: string | null) => void;
  toggleSelectedTopic: (slug: string) => void;
  setSelectedTopicSlugs: (slugs: string[]) => void;
  clearSelectedTopics: () => void;
  setMode: (m: Mode) => void;
  setPaperScope: (p: PaperScope) => void;
  setActionSource: (a: ActionSource) => void;
  startTrial: () => void;
  signOut: () => void;
  setMistakeAwareEnabled: (b: boolean) => void;
  recordAttempt: (a: Omit<AttemptRecord, "id" | "date">, derivedInsight?: MistakeInsight | null) => AttemptRecord;
  setMistakeInsight: (m: MistakeInsight | null) => void;
  setLastRoute: (r: string) => void;
  memory: SessionSnapshot | null;
  hasMeaningfulMemory: boolean;
  hasMemory: boolean;
  clearMemory: () => void;
}

const Ctx = createContext<LazyTopperContextValue | null>(null);

const DEFAULT_STATE: LazyTopperState = {
  classLevel: 10,
  subject: "Maths",
  stream: "All",
  topicSlug: null,
  selectedTopicSlugs: [],
  actionSource: "landing",
  mode: "practice-set",
  paperScope: "topic",
  auth: "logged-out",
  lastAttempt: null,
  mistakeInsight: null,
  mistakeAwareEnabled: false,
  attemptHistory: [],
  lastRoute: "/app",
};

function readMemory(): SessionSnapshot | null {
  try {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(MEMORY_KEY) : null;
    if (!raw) return null;
    return JSON.parse(raw) as SessionSnapshot;
  } catch {
    return null;
  }
}

function readActive(): Partial<LazyTopperState> | null {
  try {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(ACTIVE_KEY) : null;
    if (!raw) return null;
    return JSON.parse(raw) as Partial<LazyTopperState>;
  } catch {
    return null;
  }
}

function writeActive(s: LazyTopperState) {
  try { window.localStorage.setItem(ACTIVE_KEY, JSON.stringify(s)); } catch { /* noop */ }
}

function snapshotFromState(s: LazyTopperState): SessionSnapshot {
  return {
    auth: s.auth,
    lastRoute: s.lastRoute,
    subject: s.subject,
    stream: s.stream,
    topicSlug: s.topicSlug,
    selectedTopicSlugs: s.selectedTopicSlugs,
    paperScope: s.paperScope,
    mode: s.mode,
    mistakeAwareEnabled: s.mistakeAwareEnabled,
    lastAttempt: s.lastAttempt,
    mistakeInsight: s.mistakeInsight,
    attemptHistory: s.attemptHistory,
    savedAt: new Date().toISOString(),
  };
}

export function isMeaningfulMemory(m: SessionSnapshot | null): boolean {
  if (!m) return false;
  if (m.lastAttempt) return true;
  if (m.attemptHistory && m.attemptHistory.length > 0) return true;
  if (m.topicSlug) return true;
  if (m.selectedTopicSlugs && m.selectedTopicSlugs.length > 0) return true;
  if (m.mistakeInsight) return true;
  if (m.lastRoute && m.lastRoute !== "/app") return true;
  return false;
}

export const LazyTopperProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [memory, setMemory] = useState<SessionSnapshot | null>(() => readMemory());

  const [state, setState] = useState<LazyTopperState>(() => {
    const active = readActive();
    if (active && active.auth === "trial-active") {
      return { ...DEFAULT_STATE, ...active } as LazyTopperState;
    }
    return DEFAULT_STATE;
  });

  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current) { initialized.current = true; return; }
    if (state.auth === "trial-active") writeActive(state);
  }, [state]);

  const setSubject = useCallback((subject: Subject) => {
    setState((s) => ({
      ...s,
      subject,
      stream: subject === "Maths" ? "All" : s.stream === "All" ? "All" : s.stream,
      topicSlug: null,
      selectedTopicSlugs: [],
      mode: s.mode === "check-answer" ? s.mode : "practice-set",
    }));
  }, []);

  const setStream = useCallback((stream: Stream) => {
    setState((s) => {
      if (s.subject === "Maths") return { ...s, stream: "All" };
      const valid = topicsBySubject("Science", stream);
      const stillValid = s.topicSlug ? valid.some((t) => t.slug === s.topicSlug) : true;
      const stillValidMulti = s.selectedTopicSlugs.filter((slug) => valid.some((t) => t.slug === slug));
      return {
        ...s,
        stream,
        topicSlug: stillValid ? s.topicSlug : null,
        selectedTopicSlugs: stillValidMulti,
      };
    });
  }, []);

  const setTopicSlug = useCallback((slug: string | null) => {
    setState((s) => ({ ...s, topicSlug: slug }));
  }, []);

  const toggleSelectedTopic = useCallback((slug: string) => {
    setState((s) => {
      const exists = s.selectedTopicSlugs.includes(slug);
      const next = exists ? s.selectedTopicSlugs.filter((x) => x !== slug) : [...s.selectedTopicSlugs, slug];
      return { ...s, selectedTopicSlugs: next };
    });
  }, []);

  const setSelectedTopicSlugs = useCallback((slugs: string[]) => {
    setState((s) => ({ ...s, selectedTopicSlugs: slugs }));
  }, []);

  const clearSelectedTopics = useCallback(() => {
    setState((s) => ({ ...s, selectedTopicSlugs: [] }));
  }, []);

  const setMode = useCallback((mode: Mode) => setState((s) => ({ ...s, mode })), []);
  const setPaperScope = useCallback((paperScope: PaperScope) => setState((s) => ({ ...s, paperScope })), []);
  const setActionSource = useCallback((actionSource: ActionSource) => setState((s) => ({ ...s, actionSource })), []);
  const setLastRoute = useCallback((lastRoute: string) => setState((s) => ({ ...s, lastRoute })), []);

  const startTrial = useCallback(() => {
    setState((s) => {
      if (memory) {
        return {
          ...s,
          auth: "trial-active",
          subject: memory.subject ?? s.subject,
          stream: memory.stream ?? s.stream,
          topicSlug: memory.topicSlug ?? s.topicSlug,
          selectedTopicSlugs: memory.selectedTopicSlugs ?? s.selectedTopicSlugs,
          paperScope: memory.paperScope ?? s.paperScope,
          mode: memory.mode ?? s.mode,
          mistakeAwareEnabled: memory.mistakeAwareEnabled ?? s.mistakeAwareEnabled,
          lastAttempt: memory.lastAttempt ?? s.lastAttempt,
          mistakeInsight: memory.mistakeInsight ?? s.mistakeInsight,
          attemptHistory: memory.attemptHistory ?? s.attemptHistory,
          lastRoute: memory.lastRoute ?? s.lastRoute,
        };
      }
      return { ...s, auth: "trial-active" };
    });
  }, [memory]);

  const signOut = useCallback(() => {
    setState((s) => {
      try {
        const snap = snapshotFromState(s);
        window.localStorage.setItem(MEMORY_KEY, JSON.stringify(snap));
        setMemory(snap);
      } catch { /* noop */ }
      try { window.localStorage.removeItem(ACTIVE_KEY); } catch { /* noop */ }
      return { ...DEFAULT_STATE };
    });
  }, []);

  const clearMemory = useCallback(() => {
    try { window.localStorage.removeItem(MEMORY_KEY); } catch { /* noop */ }
    setMemory(null);
  }, []);

  const setMistakeAwareEnabled = useCallback((b: boolean) => setState((s) => ({ ...s, mistakeAwareEnabled: b })), []);

  const recordAttempt = useCallback(
    (a: Omit<AttemptRecord, "id" | "date">, derivedInsight?: MistakeInsight | null) => {
      const attempt: AttemptRecord = {
        ...a,
        id: `att-${Date.now()}`,
        date: new Date().toISOString(),
      };
      setState((s) => ({
        ...s,
        lastAttempt: attempt,
        attemptHistory: [attempt, ...s.attemptHistory].slice(0, 50),
        mistakeInsight:
          derivedInsight !== undefined
            ? derivedInsight
            : SAMPLE_MISTAKE_LIBRARY.find((m) => m.topicSlug === a.topicSlug) ?? s.mistakeInsight,
      }));
      return attempt;
    },
    []
  );

  const setMistakeInsight = useCallback((m: MistakeInsight | null) => setState((s) => ({ ...s, mistakeInsight: m })), []);

  const meaningful = useMemo(() => isMeaningfulMemory(memory), [memory]);

  const value = useMemo<LazyTopperContextValue>(
    () => ({
      ...state,
      setSubject, setStream, setTopicSlug, toggleSelectedTopic, setSelectedTopicSlugs,
      clearSelectedTopics, setMode, setPaperScope, setActionSource,
      startTrial, signOut, setMistakeAwareEnabled, recordAttempt, setMistakeInsight,
      setLastRoute, memory,
      hasMeaningfulMemory: meaningful,
      hasMemory: !!memory,
      clearMemory,
    }),
    [state, setSubject, setStream, setTopicSlug, toggleSelectedTopic, setSelectedTopicSlugs,
      clearSelectedTopics, setMode, setPaperScope, setActionSource,
      startTrial, signOut, setMistakeAwareEnabled, recordAttempt, setMistakeInsight,
      setLastRoute, memory, meaningful, clearMemory]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export function useLazyTopper() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useLazyTopper must be used inside LazyTopperProvider");
  return v;
}

export function useDisplayTopicName() {
  const { topicSlug } = useLazyTopper();
  return topicBySlug(topicSlug)?.name ?? null;
}
