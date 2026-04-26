import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { ContextBar } from "@/components/ContextBar";
import { BackToParent } from "@/components/BackToParent";
import { ScopeBuilder } from "@/components/ScopeBuilder";
import { MistakeIntelligencePanel } from "@/components/MistakeIntelligencePanel";
import { PaperBlueprint } from "@/components/PaperBlueprint";
import { useLazyTopper } from "@/context/LazyTopperContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Layers, ClipboardList, Sparkles, Timer, FileText, ScrollText, GraduationCap } from "lucide-react";
import { topicBySlug, topicsBySubject, displayTopicNames } from "@/lib/topics";
import { getTopicSample } from "@/lib/topicContent";
import { buildLoginPath, buildWorksheetPath } from "@/lib/navigation";
import type { Mode, PaperScope, Stream, Subject } from "@/lib/types";
import { toast } from "sonner";

export default function PracticePage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const {
    subject, stream, paperScope, topicSlug, selectedTopicSlugs, mistakeInsight, auth,
    setSubject, setStream, setPaperScope, setTopicSlug, setSelectedTopicSlugs, setMode, setActionSource,
  } = useLazyTopper();

  const [mockWeakArea, setMockWeakArea] = useState(false);
  const [worksheetMistakeMini, setWorksheetMistakeMini] = useState(false);
  const [drillTargeted, setDrillTargeted] = useState(false);

  useEffect(() => {
    const qScope = params.get("scope") as PaperScope | null;
    const qSubject = params.get("subject") as Subject | null;
    const qStream = params.get("stream") as Stream | null;
    const qTopic = params.get("topic");
    const qTopics = params.get("topics");
    const qMode = params.get("mode") as Mode | null;
    const qMistake = params.get("mistake");

    if (qSubject && qSubject !== subject) setSubject(qSubject);
    if (qStream) setStream(qStream);
    if (qScope) setPaperScope(qScope);
    if (qTopic) setTopicSlug(qTopic);
    if (qTopics) setSelectedTopicSlugs(qTopics.split(",").filter(Boolean));
    if (qMode) setMode(qMode);
    if (qMistake) {
      if (qMode === "full-mock") setMockWeakArea(true);
      if (qMode === "timed") setDrillTargeted(true);
    }
    setActionSource("practice");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const topicName = topicBySlug(topicSlug)?.name ?? null;
  const selectedNames = displayTopicNames(selectedTopicSlugs);

  const validateScope = () => {
    if (paperScope === "topic" && !topicSlug) { toast.error("Pick a topic in the scope builder first."); return false; }
    if (paperScope === "multi-topic" && selectedTopicSlugs.length < 2) { toast.error("Select at least 2 topics."); return false; }
    return true;
  };

  const buildRedirect = (m: Mode) => {
    const p = new URLSearchParams();
    p.set("scope", paperScope); p.set("subject", subject);
    if (subject === "Science" && stream !== "All") p.set("stream", stream);
    if (topicSlug) p.set("topic", topicSlug);
    if (selectedTopicSlugs.length) p.set("topics", selectedTopicSlugs.join(","));
    p.set("mode", m);
    p.set("source", "practice");
    if (m === "full-mock" && mockWeakArea && mistakeInsight) p.set("mistake", mistakeInsight.id);
    if (m === "timed" && drillTargeted && mistakeInsight) p.set("mistake", mistakeInsight.id);
    return `/app/practice?${p.toString()}`;
  };

  const triggerGenerate = (m: Mode, label: string) => {
    setMode(m);
    if (auth === "logged-out" && (m === "full-mock" || m === "chapter-test" || m === "timed")) {
      navigate(buildLoginPath({ reason: `start-${m}`, redirect: buildRedirect(m) }));
      return;
    }
    if (!validateScope()) return;
    toast.success(label);
  };

  const previewLine = (m: Mode) => {
    if (m === "full-mock") return `Full ${subject} mock · 80 marks · Sections A–E · 3 hrs${mockWeakArea && mistakeInsight ? ` · + weak-area mini-section: ${mistakeInsight.topicName}` : ""}`;
    if (m === "worksheet" && worksheetMistakeMini && mistakeInsight) return `${paperScope === "full-subject" ? `${subject} full-subject` : paperScope === "multi-topic" ? "Selected-topic" : (topicName ?? "—")} worksheet · + mistake-focus mini-section`;
    if (m === "timed" && drillTargeted && mistakeInsight) return `Targeted drill on ${mistakeInsight.topicName} · ${mistakeInsight.mistakeLabel}`;
    if (paperScope === "full-subject") return `${subject} full-subject ${m.replace(/-/g, " ")}`;
    if (paperScope === "multi-topic") return `${m.replace(/-/g, " ")} from ${selectedNames.join(" + ") || "selected topics"}`;
    return `${m.replace(/-/g, " ")} from ${topicName ?? "—"}`;
  };

  const sampleTopicForPreview = paperScope === "topic" ? topicSlug : selectedTopicSlugs[0] ?? topicsBySubject(subject, stream)[0]?.slug;
  const sample = sampleTopicForPreview ? getTopicSample(sampleTopicForPreview) : null;

  const PrimaryCard = ({
    icon: Icon, title, desc, mode, cta, extra,
  }: { icon: any; title: string; desc: string; mode: Mode; cta: string; extra?: React.ReactNode }) => (
    <article className="lt-card p-5 flex flex-col gap-3 hover:border-primary/40 hover:shadow-md transition">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-accent" />
        <h3 className="font-display text-base font-semibold">{title}</h3>
      </div>
      <p className="text-xs text-muted-foreground">{desc}</p>
      <div className="rounded-md bg-secondary/60 px-3 py-2 text-xs text-foreground/85 flex-1">{previewLine(mode)}</div>
      {extra}
      <Button size="sm" className="self-start" onClick={() => triggerGenerate(mode, cta)}>{cta}</Button>
    </article>
  );

  const ActionMistakeOption = ({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) =>
    mistakeInsight ? (
      <label className="flex items-center gap-2 text-[11px] text-foreground/80">
        <Checkbox checked={checked} onCheckedChange={(v) => onChange(!!v)} />
        <span>{label}</span>
      </label>
    ) : null;

  return (
    <div className="space-y-5">
      <BackToParent />
      <ContextBar
        title="Practice"
        subtitle="Pick a scope, then choose what to do."
        compact
        showMode
      />

      <ScopeBuilder location="practice" />

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <h2 className="lt-section-title text-xl">Choose what to do</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <PrimaryCard icon={Layers} title="Quick Practice" desc="A short, focused set of questions tuned to your scope." mode="practice-set" cta="Start quick practice" />
            <PrimaryCard
              icon={ClipboardList}
              title="Worksheet"
              desc="Sectioned worksheet, ready for screen or print."
              mode="worksheet"
              cta="Open worksheet builder"
              extra={
                <ActionMistakeOption
                  checked={worksheetMistakeMini}
                  onChange={setWorksheetMistakeMini}
                  label="Add mistake-focus mini-section"
                />
              }
            />
            <PrimaryCard icon={Sparkles} title="Predicted / HPQs" desc="Highly probable questions for your scope." mode="predicted" cta="See predicted questions" />
            <PrimaryCard
              icon={GraduationCap}
              title="Full Mock"
              desc={subject === "Maths" ? "Full Maths mock · 80 marks." : "Full Science mock · 80 marks."}
              mode="full-mock"
              cta={`Generate ${subject} full mock`}
              extra={
                <ActionMistakeOption
                  checked={mockWeakArea}
                  onChange={setMockWeakArea}
                  label="Add weak-area mini-section"
                />
              }
            />
          </div>

          <Accordion type="single" collapsible className="lt-card px-4">
            <AccordionItem value="more" className="border-none">
              <AccordionTrigger className="text-sm font-medium">More practice options</AccordionTrigger>
              <AccordionContent>
                <div className="grid sm:grid-cols-3 gap-3 pb-2">
                  <PrimaryCard
                    icon={Timer}
                    title="Timed Drill"
                    desc="Short focused drill with timer."
                    mode="timed"
                    cta={drillTargeted ? "Start targeted drill" : "Start timed drill"}
                    extra={
                      <ActionMistakeOption
                        checked={drillTargeted}
                        onChange={setDrillTargeted}
                        label="Make this a targeted drill"
                      />
                    }
                  />
                  <PrimaryCard icon={ScrollText} title="Chapter Test" desc="Chapter or multi-chapter test." mode="chapter-test" cta="Start chapter test" />
                  <PrimaryCard icon={FileText} title="Practice Paper" desc="Choose marks (20/40)." mode="practice-paper" cta="Generate practice paper" />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <PaperBlueprint subject={subject} stream={stream} />

          <section className="lt-card p-5 space-y-4">
            <div>
              <h3 className="lt-section-title text-lg">Predicted questions</h3>
              <p className="text-xs text-muted-foreground">Topic HPQs · Selected-topic predictions · Full-subject prediction.</p>
            </div>
            <Tabs defaultValue={paperScope === "full-subject" ? "full" : paperScope === "multi-topic" ? "selected" : "topic"}>
              <TabsList>
                <TabsTrigger value="topic">Topic HPQs</TabsTrigger>
                <TabsTrigger value="selected">Selected topics</TabsTrigger>
                <TabsTrigger value="full">Full subject</TabsTrigger>
              </TabsList>

              <TabsContent value="topic" className="pt-3 text-sm space-y-2">
                {topicSlug && sample ? (
                  <ul className="space-y-1.5 list-disc pl-5">
                    {sample.hpqs.map((q, i) => <li key={i}>{q}</li>)}
                  </ul>
                ) : <p className="text-muted-foreground">Pick a topic in the scope builder to see Highly Probable Questions.</p>}
              </TabsContent>

              <TabsContent value="selected" className="pt-3 text-sm space-y-3">
                {selectedTopicSlugs.length > 0 ? (
                  selectedTopicSlugs.map((slug) => {
                    const t = topicBySlug(slug);
                    const s = getTopicSample(slug);
                    return (
                      <div key={slug} className="rounded-md bg-secondary/60 p-3">
                        <div className="font-semibold text-sm">{t?.name}</div>
                        <ul className="text-xs mt-1 list-disc pl-4 space-y-1 text-foreground/85">
                          {s.hpqs.slice(0, 2).map((q, i) => <li key={i}>{q}</li>)}
                        </ul>
                      </div>
                    );
                  })
                ) : <p className="text-muted-foreground">Switch scope to “Multiple topics” and select 2+ topics.</p>}
              </TabsContent>

              <TabsContent value="full" className="pt-3 text-sm space-y-2">
                <div className="rounded-md bg-secondary/60 p-3 space-y-2">
                  <div className="font-semibold">{subject} 80-mark predicted paper outline</div>
                  <ul className="text-xs space-y-1 text-foreground/85">
                    <li>Section A (1m × 20): MCQ + Assertion-Reason from high-trend topics</li>
                    <li>Section B (2m × 5): Short answers from {subject === "Maths" ? "Coordinate Geometry, Polynomials, AP" : "Acids/Bases, Light, Heredity"}</li>
                    <li>Section C (3m × 6): {subject === "Maths" ? "Trigonometry identity, Triangles similarity, Quadratic word problem" : "Electricity numerical, Carbon IUPAC, Life processes diagram"}</li>
                    <li>Section D (5m × 4): Long-answer + Surface Areas / Heights & Distances / Diagrams</li>
                    <li>Section E (4m × 3): Case-based questions</li>
                  </ul>
                  <div className="text-[11px] text-muted-foreground">Sample preview.</div>
                </div>
                <Button size="sm" onClick={() => triggerGenerate("predicted", `${subject} full predicted paper`)}>
                  <Sparkles className="h-3.5 w-3.5" /> Generate {subject} full predicted paper
                </Button>
              </TabsContent>
            </Tabs>
          </section>

          {sample && (
            <section className="lt-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="lt-section-title text-lg">Sample preview</h3>
                {sampleTopicForPreview && <span className="lt-chip">{topicBySlug(sampleTopicForPreview)?.name}</span>}
              </div>
              <ul className="text-sm space-y-2">
                {sample.examples.map((e, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="lt-chip shrink-0">{e.type} · {e.marks}m</span>
                    <span className="text-foreground/85">{e.q}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="space-y-5">
          <MistakeIntelligencePanel source="practice" />

          <section className="lt-card p-5 space-y-2">
            <h3 className="font-display text-base font-semibold">Quick links</h3>
            <Link
              to={buildWorksheetPath({ scope: paperScope, subject, stream, topic: topicSlug ?? undefined, topics: selectedTopicSlugs, mistakeAware: worksheetMistakeMini, source: "practice" })}
              className="text-sm text-primary hover:underline block"
            >
              → Open worksheet with same scope
            </Link>
            <Link to="/app/check" className="text-sm text-primary hover:underline block">→ Check your own answer</Link>
            <Link to="/app/me" className="text-sm text-primary hover:underline block">→ See progress dashboard</Link>
          </section>
        </aside>
      </div>
    </div>
  );
}
