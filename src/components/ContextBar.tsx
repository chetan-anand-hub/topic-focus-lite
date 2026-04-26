import { useLazyTopper } from "@/context/LazyTopperContext";
import { topicBySlug } from "@/lib/topics";
import { Sparkles } from "lucide-react";

interface ContextBarProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  compact?: boolean;
  showMode?: boolean;
}

export function ContextBar({ title, subtitle, right, compact, showMode = false }: ContextBarProps) {
  const { subject, stream, topicSlug, selectedTopicSlugs, paperScope, mode, mistakeAwareEnabled } = useLazyTopper();
  const topicName = topicBySlug(topicSlug)?.name;

  const scopeLabel =
    paperScope === "full-subject"
      ? `${subject} full subject`
      : paperScope === "multi-topic"
      ? `${selectedTopicSlugs.length} topics selected`
      : topicName ?? "No topic";

  const modeLabel = mode.replace(/-/g, " ");

  return (
    <header className="mb-5 animate-fade-in">
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-2">
        <span className="lt-chip">Class 10</span>
        <span className="lt-chip">{subject}{subject === "Science" && stream !== "All" ? ` · ${stream}` : ""}</span>
        <span className="lt-chip">Scope: {scopeLabel}</span>
        {showMode && <span className="lt-chip">Mode: {modeLabel}</span>}
        {mistakeAwareEnabled && (
          <span className="lt-chip-accent"><Sparkles className="h-3 w-3" /> Using mistake intelligence</span>
        )}
      </div>
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className={compact ? "font-display text-2xl font-semibold text-foreground tracking-tight" : "font-display text-3xl font-semibold text-foreground tracking-tight"}>
            {title}
          </h1>
          {subtitle && <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{subtitle}</p>}
        </div>
        {right}
      </div>
    </header>
  );
}
