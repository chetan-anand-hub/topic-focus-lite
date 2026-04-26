import { Link } from "react-router-dom";
import { useLazyTopper } from "@/context/LazyTopperContext";
import { Button } from "@/components/ui/button";
import { Sparkles, Lock, Target, ClipboardList, Layers, BookOpen } from "lucide-react";
import { buildLoginPath, buildPracticePath, buildWorksheetPath, buildTopicPath } from "@/lib/navigation";
import type { ActionSource } from "@/lib/types";

interface MistakeIntelligencePanelProps {
  source: ActionSource;
  compact?: boolean;
  bare?: boolean;
}

export function MistakeIntelligencePanel({ source, compact, bare }: MistakeIntelligencePanelProps) {
  const { auth, mistakeInsight, lastAttempt } = useLazyTopper();

  if (auth === "logged-out") {
    const redirect =
      source === "practice" ? "/app/practice"
      : source === "worksheet" ? "/app/practice/worksheet"
      : source === "home" ? "/app"
      : `/app/${source}`;
    return (
      <section className={`lt-card p-5 ${compact ? "" : "space-y-3"}`}>
        {!bare && (
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-display text-base font-semibold">Mistake-aware practice</h3>
          </div>
        )}
        <p className="text-sm text-muted-foreground">
          Mistake-aware practice needs saved attempts. Start a free trial to unlock targeted drills,
          mistake-aware worksheets, and weak-area mini-sections inside your mocks.
        </p>
        <Button asChild size="sm">
          <Link to={buildLoginPath({ reason: "personal-drill", redirect })}>
            <Sparkles className="h-3.5 w-3.5" /> Start free trial
          </Link>
        </Button>
        <div className="text-[11px] text-muted-foreground">Recommended, not required.</div>
      </section>
    );
  }

  if (!mistakeInsight) {
    return (
      <section className={`lt-card p-5 ${compact ? "" : "space-y-3"}`}>
        {!bare && (
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" />
            <h3 className="font-display text-base font-semibold">Your mistake insights</h3>
          </div>
        )}
        <p className="text-sm text-muted-foreground">
          Grade an answer in <Link to="/app/check" className="text-primary underline-offset-2 hover:underline">Check &amp; Improve</Link> or save an attempt to unlock mistake-aware practice.
        </p>
        <div className="text-[11px] text-muted-foreground">Recommended, not required.</div>
      </section>
    );
  }

  return (
    <section className="lt-card p-5 space-y-4">
      {!bare && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" />
            <h3 className="font-display text-base font-semibold">Your latest weak area</h3>
          </div>
          <span className="lt-chip-accent">From your last saved attempt</span>
        </div>
      )}
      <div>
        <div className="text-sm">
          <span className="font-semibold text-foreground">{mistakeInsight.topicName}</span>
          {" — "}
          <span className="text-foreground/85">{mistakeInsight.mistakeLabel}</span>
        </div>
        <div className="text-xs text-muted-foreground mt-1">{mistakeInsight.detail}</div>
        {lastAttempt && (
          <div className="text-[11px] text-muted-foreground mt-2">
            Last saved: {lastAttempt.topicName} — {lastAttempt.score}/{lastAttempt.outOf}
          </div>
        )}
      </div>
      {!compact && (
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link to={buildPracticePath({ scope: "topic", subject: mistakeInsight.subject, stream: mistakeInsight.stream, topic: mistakeInsight.topicSlug, mode: "timed", source, mistake: mistakeInsight.id })}>
              <Target className="h-3.5 w-3.5" /> Run targeted drill
            </Link>
          </Button>
          <Button asChild size="sm" variant="secondary">
            <Link to={buildWorksheetPath({ scope: "topic", subject: mistakeInsight.subject, stream: mistakeInsight.stream, topic: mistakeInsight.topicSlug, mistakeAware: true, source })}>
              <ClipboardList className="h-3.5 w-3.5" /> Generate mistake-aware worksheet
            </Link>
          </Button>
          <Button asChild size="sm" variant="secondary">
            <Link to={buildPracticePath({ scope: "full-subject", subject: mistakeInsight.subject, stream: mistakeInsight.stream, mode: "full-mock", source, mistake: mistakeInsight.id })}>
              <Layers className="h-3.5 w-3.5" /> Add weak-area to mock
            </Link>
          </Button>
          <Button asChild size="sm" variant="ghost">
            <Link to={buildTopicPath(mistakeInsight.topicSlug, source)}>
              <BookOpen className="h-3.5 w-3.5" /> Open Topic Hub
            </Link>
          </Button>
        </div>
      )}
      <div className="text-[11px] text-muted-foreground">Recommended, not required.</div>
    </section>
  );
}
