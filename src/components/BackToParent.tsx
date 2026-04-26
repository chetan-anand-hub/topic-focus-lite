import { Link, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLazyTopper } from "@/context/LazyTopperContext";
import type { ActionSource } from "@/lib/types";

interface BackToParentProps {
  /** Optional fallback if no source/returnTo can be resolved. */
  fallbackPath?: string;
  fallbackLabel?: string;
}

const SOURCE_MAP: Record<string, { path: string; label: string }> = {
  trends: { path: "/app/trends", label: "Back to Exam Trends" },
  practice: { path: "/app/practice", label: "Back to Practice" },
  worksheet: { path: "/app/practice/worksheet", label: "Back to Worksheet" },
  check: { path: "/app/check", label: "Back to Check & Improve" },
  me: { path: "/app/me", label: "Back to Me / Progress" },
  home: { path: "/app", label: "Back to Home" },
  topicHub: { path: "/app/trends", label: "Back" },
};

/**
 * Parent-aware back link.
 * Resolution priority: returnTo > source > actionSource > fallback.
 */
export function BackToParent({ fallbackPath, fallbackLabel }: BackToParentProps = {}) {
  const location = useLocation();
  const { actionSource } = useLazyTopper();

  const params = new URLSearchParams(location.search);
  const returnTo = params.get("returnTo");
  const source = (params.get("source") as ActionSource | null) ?? null;

  let path: string | null = null;
  let label: string | null = null;

  if (returnTo) {
    path = returnTo;
    const parentKey = source ?? actionSource;
    label = (parentKey && SOURCE_MAP[parentKey]?.label) || "Back";
  } else if (source && SOURCE_MAP[source]) {
    path = SOURCE_MAP[source].path;
    label = SOURCE_MAP[source].label;
  } else if (actionSource && SOURCE_MAP[actionSource]) {
    path = SOURCE_MAP[actionSource].path;
    label = SOURCE_MAP[actionSource].label;
  } else if (fallbackPath) {
    path = fallbackPath;
    label = fallbackLabel ?? "Back";
  }

  if (!path || !label) return null;

  return (
    <Link
      to={path}
      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2"
    >
      <ArrowLeft className="h-3 w-3" />
      {label}
    </Link>
  );
}
