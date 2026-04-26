import { useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useLazyTopper } from "@/context/LazyTopperContext";
import { ContextBar } from "@/components/ContextBar";
import { ScopeBuilder } from "@/components/ScopeBuilder";
import { MistakeIntelligencePanel } from "@/components/MistakeIntelligencePanel";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ClipboardList, Sparkles, Lock, Save } from "lucide-react";
import { topicBySlug, displayTopicNames } from "@/lib/topics";
import { buildLoginPath, buildCheckPath, buildWorksheetPath } from "@/lib/navigation";
import { toast } from "sonner";

const SECTIONS = [
  { id: "A", label: "Section A · MCQ / Assertion-Reason (1m)" },
  { id: "B", label: "Section B · Short Answer I (2m)" },
  { id: "C", label: "Section C · Short Answer II (3m)" },
  { id: "D", label: "Section D · Long Answer (5m)" },
  { id: "E", label: "Section E · Case-based (4m)" },
];

export default function WorksheetPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const {
    subject, stream, paperScope, topicSlug, selectedTopicSlugs, auth, mistakeAwareEnabled, mistakeInsight,
    setSubject, setStream, setPaperScope, setTopicSlug, setSelectedTopicSlugs, setMistakeAwareEnabled, setMode, setActionSource,
  } = useLazyTopper();

  useEffect(() => {
    const qScope = params.get("scope") as any;
    const qSubject = params.get("subject") as any;
    const qStream = params.get("stream") as any;
    const qTopic = params.get("topic");
    const qTopics = params.get("topics");
    const qMistake = params.get("mistakeAware");
    if (qSubject) setSubject(qSubject);
    if (qStream) setStream(qStream);
    if (qScope) setPaperScope(qScope);
    if (qTopic) setTopicSlug(qTopic);
    if (qTopics) setSelectedTopicSlugs(qTopics.split(",").filter(Boolean));
    if (qMistake === "1") setMistakeAwareEnabled(true);
    setMode("worksheet");
    setActionSource("worksheet");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const topicName = topicBySlug(topicSlug)?.name;
  const selectedNames = displayTopicNames(selectedTopicSlugs);

  const cta = (() => {
    if (mistakeAwareEnabled) return "Generate mistake-aware worksheet";
    if (paperScope === "full-subject") return `Generate ${subject} full-subject worksheet`;
    if (paperScope === "multi-topic") return "Generate selected-topic worksheet";
    return `Generate ${topicName ?? subject} worksheet`;
  })();

  const previewLine = (() => {
    if (paperScope === "full-subject") return `Full ${subject}${stream !== "All" && subject === "Science" ? ` ${stream}` : ""} worksheet · Sections A–E`;
    if (paperScope === "multi-topic") return `Worksheet across ${selectedNames.join(" + ") || "selected topics"}`;
    return `${topicName ?? "—"} worksheet · Sections A–D`;
  })();

  const currentWorksheetPath = () => buildWorksheetPath({
    scope: paperScope, subject, stream,
    topic: paperScope === "topic" ? topicSlug ?? undefined : undefined,
    topics: paperScope === "multi-topic" ? selectedTopicSlugs : undefined,
    mistakeAware: mistakeAwareEnabled,
    source: "worksheet",
  });

  const onGenerate = () => {
    if (paperScope === "topic" && !topicSlug) return toast.error("Pick a topic.");
    if (paperScope === "multi-topic" && selectedTopicSlugs.length < 2) return toast.error("Select 2+ topics.");
    toast.success(cta, { description: previewLine });
  };

  const onSave = () => {
    if (auth === "logged-out") {
      navigate(buildLoginPath({ reason: "save-worksheet", redirect: currentWorksheetPath() }));
      return;
    }
    toast.success("Saved to your history.");
  };

  return (
    <div className="space-y-5">
      <ContextBar
        title="Worksheet"
        subtitle="Build a worksheet for one topic, a topic combination, or a full subject."
        compact
        showMode
        right={
          <label className="flex items-center gap-2 lt-card px-3 py-1.5 cursor-pointer">
            <Checkbox
              id="mistake-aware-mini"
              checked={mistakeAwareEnabled}
              onCheckedChange={(v) => {
                if (auth === "logged-out") {
                  navigate(buildLoginPath({
                    reason: "mistake-aware-worksheet",
                    redirect: buildWorksheetPath({
                      scope: paperScope, subject, stream,
                      topic: paperScope === "topic" ? topicSlug ?? undefined : undefined,
                      topics: paperScope === "multi-topic" ? selectedTopicSlugs : undefined,
                      mistakeAware: true,
                      source: "worksheet",
                    }),
                  }));
                  return;
                }
                if (!!v && !mistakeInsight) return toast.error("No saved attempts yet. Grade an answer first.");
                setMistakeAwareEnabled(!!v);
              }}
            />
            <span className="text-xs flex items-center gap-1">
              {auth === "logged-out" && <Lock className="h-3 w-3" />}
              Add mistake-focus mini-section
            </span>
          </label>
        }
      />

      <ScopeBuilder location="worksheet" />

      <div className="grid lg:grid-cols-3 gap-5">
        <section className="lt-card p-5 lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="lt-section-title text-xl flex items-center gap-2"><ClipboardList className="h-5 w-5 text-accent" /> Worksheet preview</h2>
            <span className="lt-chip">{previewLine}</span>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Sections</div>
            <div className="space-y-2">
              {SECTIONS.map((s) => (
                <label key={s.id} className="flex items-center gap-3 rounded-md border border-border px-3 py-2 hover:bg-secondary/50 cursor-pointer">
                  <Checkbox defaultChecked={s.id !== "E" || paperScope !== "topic"} id={`sec-${s.id}`} />
                  <span className="text-sm">{s.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Formats</div>
            <div className="flex flex-wrap gap-2">
              {["MCQ", "Short answer", "Long answer", "Case-based", "Assertion-Reason", "Diagram", "Numerical", "Proof"].map((f) => (
                <span key={f} className="lt-chip">{f}</span>
              ))}
            </div>
          </div>

          {mistakeAwareEnabled && mistakeInsight && (
            <div className="rounded-lg p-4 bg-accent-soft text-accent-soft-foreground text-sm">
              <div className="flex items-center gap-2 font-semibold"><Sparkles className="h-4 w-4" /> Mistake-focus mini-section</div>
              <div className="text-xs mt-1.5">
                {mistakeInsight.topicName} — {mistakeInsight.mistakeLabel}.
                {paperScope === "full-subject" || paperScope === "multi-topic"
                  ? " Added as an 8-mark mini-section so it doesn't override the rest."
                  : " Worksheet will include a focused mini-section on this exact mistake type."}
              </div>
              <div className="text-[11px] mt-1 opacity-80">Recommended, not required.</div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
            <Button onClick={onGenerate}><ClipboardList className="h-3.5 w-3.5" /> {cta}</Button>
            <Button variant="secondary" onClick={onSave}>
              {auth === "logged-out" && <Lock className="h-3.5 w-3.5" />}
              <Save className="h-3.5 w-3.5" /> Save worksheet
            </Button>
            <Button asChild variant="ghost">
              <Link to={buildCheckPath({ topic: topicSlug ?? undefined, source: "worksheet" })}>
                Upload your answers →
              </Link>
            </Button>
          </div>
        </section>

        <aside className="space-y-5">
          <MistakeIntelligencePanel source="worksheet" compact />
          <section className="lt-card p-5 text-sm space-y-2">
            <h3 className="font-display text-base font-semibold">Tip</h3>
            <p className="text-muted-foreground">For full-subject or multi-topic worksheets with mistake-focus on, the weak area becomes a mini-section — it never replaces the whole paper.</p>
            <p className="text-[11px] text-muted-foreground">Recommended, not required.</p>
          </section>
        </aside>
      </div>
    </div>
  );
}
