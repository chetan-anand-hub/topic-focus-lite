import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useLazyTopper } from "@/context/LazyTopperContext";
import { ContextBar } from "@/components/ContextBar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Lock, Sparkles, Save, ArrowRight, Target, ClipboardList } from "lucide-react";
import { buildLoginPath, buildPracticePath, buildWorksheetPath, buildTopicPath } from "@/lib/navigation";
import { topicBySlug, TOPICS } from "@/lib/topics";
import { SAMPLE_MISTAKE_LIBRARY } from "@/lib/mistakeData";
import { toast } from "sonner";
import type { ActionSource } from "@/lib/types";

export default function CheckPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { auth, recordAttempt, setMistakeInsight, mistakeInsight, lastAttempt, subject, stream, setTopicSlug, topicSlug, setActionSource } = useLazyTopper();
  const [topicChoice, setTopicChoice] = useState<string>(params.get("topic") ?? topicSlug ?? "trigonometry");
  const [answer, setAnswer] = useState("");
  const [graded, setGraded] = useState(false);

  useEffect(() => {
    const t = params.get("topic"); if (t) { setTopicSlug(t); setTopicChoice(t); }
    setActionSource("check");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const grade = () => {
    if (auth === "logged-out") {
      const redirect = `/app/check?topic=${topicChoice}${params.get("source") ? `&source=${params.get("source")}` : ""}`;
      navigate(buildLoginPath({ reason: "grade-answer", redirect }));
      return;
    }
    if (!answer.trim()) return toast.error("Paste your answer first.");
    const t = topicBySlug(topicChoice)!;
    const insight = SAMPLE_MISTAKE_LIBRARY.find((m) => m.topicSlug === t.slug) ?? SAMPLE_MISTAKE_LIBRARY[0];
    const score = Math.max(2, Math.min(9, 5 + Math.floor(answer.length / 60)));
    const att = recordAttempt({
      topicSlug: t.slug, topicName: t.name, subject: t.subject, stream: t.stream,
      mode: "check-answer", score, outOf: 10,
      mistakes: [insight.mistakeLabel],
      mistakeType: insight.mistakeType,
      source: (params.get("source") as ActionSource) ?? "check",
    }, insight);
    setMistakeInsight(insight);
    setGraded(true);
    toast.success("Saved to your history", { description: `${t.name} · ${att.score}/${att.outOf}` });
  };

  const sourceTopic = topicBySlug(topicChoice);

  return (
    <div className="space-y-5">
      <ContextBar
        title="Check & Improve"
        subtitle="Paste your answer to get feedback and a mistake tag that powers your next steps."
        compact
      />

      <div className="grid lg:grid-cols-3 gap-5">
        <section className="lt-card p-5 lg:col-span-2 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Topic</label>
            <select
              value={topicChoice}
              onChange={(e) => { setTopicChoice(e.target.value); setTopicSlug(e.target.value); }}
              className="rounded-md border border-input bg-background px-2.5 py-1.5 text-sm"
            >
              {TOPICS.filter((t) => t.subject === subject && (subject === "Maths" || stream === "All" || t.stream === stream)).map((t) => (
                <option key={t.slug} value={t.slug}>{t.name}</option>
              ))}
            </select>
            {sourceTopic && <span className="lt-chip">{sourceTopic.subject}{sourceTopic.subject === "Science" ? ` · ${sourceTopic.stream}` : ""}</span>}
          </div>

          <Textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Paste your answer here. Include the question, your steps, and the final answer."
            className="min-h-[220px]"
          />

          <div className="flex flex-wrap gap-2">
            <Button onClick={grade}>
              {auth === "logged-out" && <Lock className="h-3.5 w-3.5" />}
              <Sparkles className="h-3.5 w-3.5" /> Grade my answer
            </Button>
          </div>

          {graded && lastAttempt && mistakeInsight && (
            <div className="rounded-lg border border-border bg-secondary/40 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Result · saved to history</div>
                  <div className="font-display text-2xl font-semibold">{lastAttempt.score}/{lastAttempt.outOf}</div>
                </div>
                <span className="lt-chip-accent"><Save className="h-3 w-3" /> Saved</span>
              </div>
              <div>
                <div className="text-sm font-semibold">Feedback</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Strong setup, but {mistakeInsight.mistakeLabel.toLowerCase()}. {mistakeInsight.detail}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 pt-1 border-t border-border">
                <Button asChild size="sm">
                  <Link to={buildPracticePath({ scope: "topic", subject: mistakeInsight.subject, stream: mistakeInsight.stream, topic: mistakeInsight.topicSlug, mode: "timed", source: "check", mistake: mistakeInsight.id })}>
                    <Target className="h-3.5 w-3.5" /> Run targeted drill
                  </Link>
                </Button>
                <Button asChild size="sm" variant="secondary">
                  <Link to={buildWorksheetPath({ scope: "topic", subject: mistakeInsight.subject, stream: mistakeInsight.stream, topic: mistakeInsight.topicSlug, mistakeAware: true, source: "check" })}>
                    <ClipboardList className="h-3.5 w-3.5" /> Build mistake-aware worksheet
                  </Link>
                </Button>
                <Button asChild size="sm" variant="ghost">
                  <Link to={buildPracticePath({ scope: "full-subject", subject: mistakeInsight.subject, mode: "full-mock", source: "check", mistake: mistakeInsight.id })}>
                    Add weak-area to next mock
                  </Link>
                </Button>
                <Button asChild size="sm" variant="ghost">
                  <Link to="/app/me">See progress <ArrowRight className="h-3 w-3" /></Link>
                </Button>
                <Button asChild size="sm" variant="ghost">
                  <Link to={buildTopicPath(mistakeInsight.topicSlug, "check")}>Open Topic Hub</Link>
                </Button>
              </div>
            </div>
          )}
        </section>

        <aside className="lt-card p-5 space-y-3 text-sm">
          <h3 className="font-display text-base font-semibold">How feedback works</h3>
          <ol className="list-decimal pl-5 space-y-1.5 text-muted-foreground">
            <li>Your mistake is tagged by type — conceptual, calculation, silly, or presentation.</li>
            <li>Your weak areas update instantly in Me / Progress.</li>
            <li>Practice, worksheet and mocks can use it — only if you opt in.</li>
          </ol>
        </aside>
      </div>
    </div>
  );
}
