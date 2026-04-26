import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLazyTopper } from "@/context/LazyTopperContext";
import { ContextBar } from "@/components/ContextBar";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { topicsBySubject, topicBySlug } from "@/lib/topics";
import { TopicActions } from "@/components/TopicActions";
import { Plus, Check, Trash2, Layers, ClipboardList, Sparkles, GraduationCap } from "lucide-react";
import { buildPracticePath, buildWorksheetPath } from "@/lib/navigation";
import type { Stream, Subject } from "@/lib/types";
import { cn } from "@/lib/utils";

const TIER_LABEL: Record<string, string> = { high: "High trend", medium: "Medium trend", low: "Low trend" };
const TIER_CLASS: Record<string, string> = {
  high: "bg-accent-soft text-accent-soft-foreground border-accent/30",
  medium: "bg-secondary text-secondary-foreground border-border",
  low: "bg-muted text-muted-foreground border-border",
};

export default function TrendsPage() {
  const { subject, stream, selectedTopicSlugs, toggleSelectedTopic, clearSelectedTopics, setSubject, setStream, setActionSource, setPaperScope } = useLazyTopper();
  useEffect(() => { setActionSource("trends"); }, [setActionSource]);

  const topics = topicsBySubject(subject, stream).sort((a, b) =>
    a.trendTier === b.trendTier ? b.weight - a.weight : a.trendTier === "high" ? -1 : b.trendTier === "high" ? 1 : 0
  );

  return (
    <div className="space-y-5">
      <ContextBar
        title="Exam Trends"
        subtitle="Tier-ranked topics. Select multiple to build a combined worksheet, mock or predicted paper."
        compact
      />

      <section className="lt-card p-4 flex flex-wrap items-center gap-3">
        <ToggleGroup type="single" value={subject} onValueChange={(v) => v && setSubject(v as Subject)}>
          <ToggleGroupItem value="Maths">Maths</ToggleGroupItem>
          <ToggleGroupItem value="Science">Science</ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup type="single" value={stream} onValueChange={(v) => v && setStream(v as Stream)} disabled={subject !== "Science"}>
          {(["All","Physics","Chemistry","Biology"] as Stream[]).map((s) => (
            <ToggleGroupItem key={s} value={s} disabled={subject !== "Science"}>{s}</ToggleGroupItem>
          ))}
        </ToggleGroup>
      </section>

      {selectedTopicSlugs.length > 0 && (
        <section className="lt-card-elevated p-4 sticky top-3 z-20 bg-card border-accent/40">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Selected topics</div>
              <div className="font-semibold mt-0.5">{selectedTopicSlugs.map((s) => topicBySlug(s)?.name).filter(Boolean).join(" + ")}</div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm" onClick={() => setPaperScope("multi-topic")}>
                <Link to={buildPracticePath({ scope: "multi-topic", subject, stream, topics: selectedTopicSlugs, mode: "practice-set", source: "trends" })}>
                  <Layers className="h-3.5 w-3.5" /> Practice selected topics
                </Link>
              </Button>
              <Button asChild size="sm" variant="secondary" onClick={() => setPaperScope("multi-topic")}>
                <Link to={buildWorksheetPath({ scope: "multi-topic", subject, stream, topics: selectedTopicSlugs, source: "trends" })}>
                  <ClipboardList className="h-3.5 w-3.5" /> Generate worksheet
                </Link>
              </Button>
              <Button asChild size="sm" variant="secondary" onClick={() => setPaperScope("multi-topic")}>
                <Link to={buildPracticePath({ scope: "multi-topic", subject, stream, topics: selectedTopicSlugs, mode: "predicted", source: "trends" })}>
                  <Sparkles className="h-3.5 w-3.5" /> Predicted Qs
                </Link>
              </Button>
              <Button asChild size="sm" variant="secondary" onClick={() => setPaperScope("multi-topic")}>
                <Link to={buildPracticePath({ scope: "multi-topic", subject, stream, topics: selectedTopicSlugs, mode: "chapter-test", source: "trends" })}>
                  <GraduationCap className="h-3.5 w-3.5" /> Mock / practice paper
                </Link>
              </Button>
              <Button size="sm" variant="ghost" onClick={clearSelectedTopics}><Trash2 className="h-3.5 w-3.5" /> Clear</Button>
            </div>
          </div>
        </section>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {topics.map((t) => {
          const inTray = selectedTopicSlugs.includes(t.slug);
          return (
            <article key={t.slug} className="lt-card p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-display text-lg font-semibold">{t.name}</div>
                  <p className="text-xs text-muted-foreground mt-1">{t.blurb}</p>
                </div>
                <span className={cn("lt-chip border", TIER_CLASS[t.trendTier])}>{TIER_LABEL[t.trendTier]} · ~{t.weight}m</span>
              </div>
              <TopicActions topicSlug={t.slug} source="trends" />
              <button
                type="button"
                onClick={() => toggleSelectedTopic(t.slug)}
                className={cn(
                  "text-xs px-2.5 py-1.5 rounded-full border transition-colors",
                  inTray ? "bg-accent text-accent-foreground border-accent" : "bg-card hover:bg-secondary border-border text-foreground/80"
                )}
              >
                {inTray ? <><Check className="inline h-3 w-3 mr-1" />Added</> : <><Plus className="inline h-3 w-3 mr-1" />Add to selection</>}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
