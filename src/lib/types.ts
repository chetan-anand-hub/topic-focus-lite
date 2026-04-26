// LazyTopper — global types (CBSE Class 10)

export type Subject = "Maths" | "Science";
export type Stream = "All" | "Physics" | "Chemistry" | "Biology";

export type Mode =
  | "worksheet"
  | "practice-set"
  | "predicted"
  | "timed"
  | "chapter-test"
  | "full-mock"
  | "practice-paper"
  | "check-answer";

export type PaperScope = "topic" | "multi-topic" | "full-subject";

export type ActionSource =
  | "landing"
  | "home"
  | "trends"
  | "topicHub"
  | "practice"
  | "worksheet"
  | "check"
  | "me";

export type AuthState = "logged-out" | "trial-active";

export type MistakeType = "conceptual" | "calculation" | "silly" | "presentation";

export interface MistakeInsight {
  id: string;
  topicSlug: string;
  topicName: string;
  subject: Subject;
  stream: Stream;
  mistakeType: MistakeType;
  mistakeLabel: string;
  detail: string;
  recommendedDrill: string;
  recommendedMode: Mode;
  recommendedFilters: string[];
  recommendedTopicSlugs: string[];
  createdAt: string;
}

export interface AttemptRecord {
  id: string;
  topicSlug: string;
  topicName: string;
  subject: Subject;
  stream: Stream;
  mode: Mode;
  score: number;
  outOf: number;
  date: string;
  mistakes: string[];
  mistakeType?: MistakeType;
  source: ActionSource;
}

export interface Topic {
  slug: string;
  name: string;
  subject: Subject;
  stream: Stream;
  weight: number;
  trendTier: "high" | "medium" | "low";
  blurb: string;
}

export interface SessionSnapshot {
  auth: AuthState;
  lastRoute: string;
  subject: Subject;
  stream: Stream;
  topicSlug: string | null;
  selectedTopicSlugs: string[];
  paperScope: PaperScope;
  mode: Mode;
  mistakeAwareEnabled: boolean;
  lastAttempt: AttemptRecord | null;
  mistakeInsight: MistakeInsight | null;
  attemptHistory: AttemptRecord[];
  savedAt: string;
}
