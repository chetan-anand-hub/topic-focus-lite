// Helpers for building login-gate redirects with context preservation.
import type { ActionSource } from "./types";

export interface GateOptions {
  reason: string;
  redirect: string;
}

export function buildLoginPath({ reason, redirect }: GateOptions) {
  const params = new URLSearchParams();
  params.set("reason", reason);
  params.set("redirect", redirect);
  return `/app/login?${params.toString()}`;
}

export function buildPracticePath(opts: {
  scope?: "topic" | "multi-topic" | "full-subject";
  subject?: "Maths" | "Science";
  stream?: "All" | "Physics" | "Chemistry" | "Biology";
  topic?: string;
  topics?: string[];
  mode?: string;
  source?: ActionSource;
  mistake?: string;
}) {
  const p = new URLSearchParams();
  if (opts.scope) p.set("scope", opts.scope);
  if (opts.subject) p.set("subject", opts.subject);
  if (opts.stream && opts.stream !== "All") p.set("stream", opts.stream);
  if (opts.topic) p.set("topic", opts.topic);
  if (opts.topics?.length) p.set("topics", opts.topics.join(","));
  if (opts.mode) p.set("mode", opts.mode);
  if (opts.source) p.set("source", opts.source);
  if (opts.mistake) p.set("mistake", opts.mistake);
  const qs = p.toString();
  return `/app/practice${qs ? `?${qs}` : ""}`;
}

export function buildWorksheetPath(opts: {
  scope?: "topic" | "multi-topic" | "full-subject";
  subject?: "Maths" | "Science";
  stream?: "All" | "Physics" | "Chemistry" | "Biology";
  topic?: string;
  topics?: string[];
  mistakeAware?: boolean;
  source?: ActionSource;
}) {
  const p = new URLSearchParams();
  if (opts.scope) p.set("scope", opts.scope);
  if (opts.subject) p.set("subject", opts.subject);
  if (opts.stream && opts.stream !== "All") p.set("stream", opts.stream);
  if (opts.topic) p.set("topic", opts.topic);
  if (opts.topics?.length) p.set("topics", opts.topics.join(","));
  if (opts.mistakeAware) p.set("mistakeAware", "1");
  if (opts.source) p.set("source", opts.source);
  const qs = p.toString();
  return `/app/practice/worksheet${qs ? `?${qs}` : ""}`;
}

export function buildCheckPath(opts: { topic?: string; source?: ActionSource }) {
  const p = new URLSearchParams();
  if (opts.topic) p.set("topic", opts.topic);
  if (opts.source) p.set("source", opts.source);
  const qs = p.toString();
  return `/app/check${qs ? `?${qs}` : ""}`;
}

/**
 * Topic Hub navigation must always go to /app/topic/:slug — never to /app/practice.
 */
export function buildTopicPath(slug: string, source?: ActionSource) {
  const qs = source ? `?source=${source}` : "";
  return `/app/topic/${slug}${qs}`;
}
