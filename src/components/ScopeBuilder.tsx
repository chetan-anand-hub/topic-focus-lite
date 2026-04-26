import { useLazyTopper } from "@/context/LazyTopperContext";
import { topicsBySubject } from "@/lib/topics";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { X } from "lucide-react";
import type { PaperScope, Stream, Subject } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ScopeBuilderProps {
  location?: "practice" | "worksheet" | "predicted" | "mock";
  className?: string;
}

const SUBJECTS: Subject[] = ["Maths", "Science"];
const STREAMS: Stream[] = ["All", "Physics", "Chemistry", "Biology"];
const SCOPES: { value: PaperScope; label: string }[] = [
  { value: "topic", label: "Single topic" },
  { value: "multi-topic", label: "Multiple topics" },
  { value: "full-subject", label: "Full subject" },
];

export function ScopeBuilder({ location = "practice", className }: ScopeBuilderProps) {
  const {
    subject, stream, paperScope, topicSlug, selectedTopicSlugs,
    setSubject, setStream, setPaperScope, setTopicSlug, toggleSelectedTopic, clearSelectedTopics,
  } = useLazyTopper();

  const availableTopics = topicsBySubject(subject, stream);

  const summary = (() => {
    if (paperScope === "full-subject") {
      if (subject === "Maths") return "Maths full subject — 80 marks";
      if (stream === "All") return "Science full subject — Physics + Chemistry + Biology, 80 marks";
      return `Science ${stream} — full stream`;
    }
    if (paperScope === "multi-topic") {
      const names = selectedTopicSlugs.map((s) => availableTopics.find((t) => t.slug === s)?.name).filter(Boolean);
      if (names.length === 0) return `${subject} — pick topics to combine`;
      return `${subject}${subject === "Science" && stream !== "All" ? ` ${stream}` : ""} — ${names.join(" + ")}`;
    }
    const t = availableTopics.find((t) => t.slug === topicSlug);
    return `${subject}${subject === "Science" && stream !== "All" ? ` ${stream}` : ""} — ${t?.name ?? "pick a topic"}`;
  })();

  return (
    <section className={cn("lt-card p-5 space-y-5", className)}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">What do you want to work on?</div>
          <div className="font-display text-lg font-semibold mt-0.5">Choose subject, stream, scope</div>
        </div>
        <div className="text-sm text-foreground/85 bg-secondary/60 px-3 py-1.5 rounded-md font-medium">
          {summary}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Subject</label>
          <ToggleGroup type="single" value={subject} onValueChange={(v) => v && setSubject(v as Subject)} className="mt-2 justify-start">
            {SUBJECTS.map((s) => (
              <ToggleGroupItem key={s} value={s} className="px-4">{s}</ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Science stream</label>
          <ToggleGroup
            type="single"
            value={stream}
            onValueChange={(v) => v && setStream(v as Stream)}
            disabled={subject !== "Science"}
            className="mt-2 justify-start flex-wrap"
          >
            {STREAMS.map((s) => (
              <ToggleGroupItem key={s} value={s} className="px-3" disabled={subject !== "Science"}>
                {s}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          {subject !== "Science" && (
            <p className="text-[11px] text-muted-foreground mt-1.5">Streams apply only to Science.</p>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Scope</label>
          <ToggleGroup type="single" value={paperScope} onValueChange={(v) => v && setPaperScope(v as PaperScope)} className="mt-2 justify-start flex-wrap">
            {SCOPES.map((s) => (
              <ToggleGroupItem key={s.value} value={s.value} className="px-3">{s.label}</ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>

      {paperScope === "topic" && (
        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Pick a topic</div>
          <div className="flex flex-wrap gap-1.5">
            {availableTopics.map((t) => (
              <button
                key={t.slug}
                type="button"
                onClick={() => setTopicSlug(t.slug)}
                className={cn(
                  "text-xs px-2.5 py-1.5 rounded-full border transition-colors",
                  topicSlug === t.slug
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card hover:bg-secondary border-border text-foreground/80"
                )}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {paperScope === "multi-topic" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Combine topics</div>
            {selectedTopicSlugs.length > 0 && (
              <button onClick={clearSelectedTopics} className="text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline">
                Clear all
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {availableTopics.map((t) => {
              const active = selectedTopicSlugs.includes(t.slug);
              return (
                <button
                  key={t.slug}
                  type="button"
                  onClick={() => toggleSelectedTopic(t.slug)}
                  className={cn(
                    "text-xs px-2.5 py-1.5 rounded-full border transition-colors",
                    active
                      ? "bg-accent text-accent-foreground border-accent"
                      : "bg-card hover:bg-secondary border-border text-foreground/80"
                  )}
                >
                  {active ? "✓ " : "+ "}{t.name}
                </button>
              );
            })}
          </div>
          {selectedTopicSlugs.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border">
              <span className="text-[11px] text-muted-foreground self-center mr-1">Selected:</span>
              {selectedTopicSlugs.map((slug) => {
                const t = availableTopics.find((x) => x.slug === slug);
                return (
                  <span key={slug} className="lt-chip-accent !py-1 !px-2.5">
                    {t?.name ?? slug}
                    <button onClick={() => toggleSelectedTopic(slug)} className="ml-1 hover:opacity-70" aria-label="Remove">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                );
              })}
            </div>
          )}
        </div>
      )}

      {paperScope === "full-subject" && (
        <div className="rounded-lg bg-secondary/60 p-3 text-xs text-foreground/80">
          <strong className="text-foreground">Full {subject} subject</strong>{" "}
          — questions will be drawn across all {subject === "Science" && stream !== "All" ? `${stream} ` : ""}topics in proportion to exam weight.
          Use this for full 80-mark mocks or full-subject predicted papers.
        </div>
      )}
    </section>
  );
}
