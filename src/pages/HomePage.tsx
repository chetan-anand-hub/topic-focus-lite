import { Link, useNavigate } from "react-router-dom";
import { useLazyTopper } from "@/context/LazyTopperContext";
import { ContextBar } from "@/components/ContextBar";
import { MistakeIntelligencePanel } from "@/components/MistakeIntelligencePanel";
import { Button } from "@/components/ui/button";
import { ArrowRight, Layers, ClipboardList, TrendingUp, ClipboardCheck, Target, RotateCcw } from "lucide-react";
import { buildPracticePath, buildWorksheetPath, buildLoginPath } from "@/lib/navigation";
import { topicBySlug } from "@/lib/topics";

const QUICK = [
  { to: "/app/practice", title: "Practice", desc: "Quick practice or full mock.", icon: Layers },
  { to: "/app/practice/worksheet", title: "Worksheet", desc: "Build a worksheet by topic or subject.", icon: ClipboardList },
  { to: "/app/trends", title: "Exam Trends", desc: "Tier-ranked topics with one-click actions.", icon: TrendingUp },
  { to: "/app/check", title: "Check & Improve", desc: "Get feedback on your answer.", icon: ClipboardCheck },
];

export default function HomePage() {
  const { auth, lastAttempt, mistakeInsight, subject, memory, hasMeaningfulMemory } = useLazyTopper();
  const navigate = useNavigate();

  const memTopic = memory?.topicSlug ? topicBySlug(memory.topicSlug)?.name : null;
  const memoryStrip = hasMeaningfulMemory && memory && (
    <section className="lt-card border-accent/30 bg-accent-soft/30 p-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <RotateCcw className="h-4 w-4 text-accent" />
        <div className="text-sm">
          <span className="font-semibold text-foreground">Last time:</span>{" "}
          <span className="text-foreground/85">
            {memory.subject}
            {memory.subject === "Science" && memory.stream !== "All" ? ` · ${memory.stream}` : ""}
            {memTopic ? ` • ${memTopic}` : ""}
          </span>
        </div>
      </div>
      {memory.lastRoute && memory.lastRoute !== "/app" && (
        <Button size="sm" variant="secondary" onClick={() => navigate(memory.lastRoute)}>
          Continue where you left off <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      )}
    </section>
  );

  return (
    <div className="space-y-6">
      <ContextBar
        title="Home"
        subtitle="Pick what to do now. LazyTopper softly suggests — never forces."
        compact
        right={
          auth === "logged-out" ? (
            <Button asChild>
              <Link to={buildLoginPath({ reason: "start-trial", redirect: "/app" })}>Start free trial <ArrowRight className="h-3.5 w-3.5" /></Link>
            </Button>
          ) : (
            <span className="lt-chip-accent">Trial active</span>
          )
        }
      />

      {auth === "trial-active" && memoryStrip}

      {auth === "trial-active" && lastAttempt && (
        <section className="lt-card-elevated p-6 grid md:grid-cols-12 gap-5 items-center bg-gradient-to-br from-card to-secondary/40">
          <div className="md:col-span-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Latest saved attempt</div>
            <div className="font-display text-2xl font-semibold mt-1">{lastAttempt.topicName}</div>
            <div className="text-sm text-muted-foreground">
              {lastAttempt.score}/{lastAttempt.outOf}
            </div>
          </div>
          <div className="md:col-span-7">
            {mistakeInsight ? (
              <>
                <div className="text-sm">
                  <span className="font-semibold">Main issue:</span>{" "}
                  <span className="text-foreground/85">{mistakeInsight.mistakeLabel}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Button asChild size="sm">
                    <Link to={buildPracticePath({ scope: "topic", subject: mistakeInsight.subject, stream: mistakeInsight.stream, topic: mistakeInsight.topicSlug, mode: "timed", source: "home", mistake: mistakeInsight.id })}>
                      <Target className="h-3.5 w-3.5" /> Targeted drill
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="secondary">
                    <Link to={buildWorksheetPath({ scope: "topic", subject: mistakeInsight.subject, stream: mistakeInsight.stream, topic: mistakeInsight.topicSlug, mistakeAware: true, source: "home" })}>
                      <ClipboardList className="h-3.5 w-3.5" /> Mistake-aware worksheet
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="ghost">
                    <Link to={buildPracticePath({ scope: "full-subject", subject: mistakeInsight.subject, mode: "full-mock", source: "home", mistake: mistakeInsight.id })}>
                      Add weak-area to next mock
                    </Link>
                  </Button>
                </div>
                <div className="text-[11px] text-muted-foreground mt-2">Recommended, not required.</div>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">Save an attempt to unlock mistake-aware suggestions.</div>
            )}
          </div>
        </section>
      )}

      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {QUICK.map((q) => (
          <Link key={q.to} to={q.to} className="lt-card p-5 hover:border-primary/40 hover:shadow-md transition group">
            <q.icon className="h-5 w-5 text-accent mb-3" />
            <div className="font-display text-lg font-semibold group-hover:text-primary transition-colors">{q.title}</div>
            <p className="text-xs text-muted-foreground mt-1">{q.desc}</p>
          </Link>
        ))}
      </section>

      <div className="grid lg:grid-cols-3 gap-6">
        <section className="lt-card p-5 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="lt-section-title text-lg">Quick generate</h3>
            <Link to="/app/practice" className="text-xs text-primary hover:underline">All practice modes →</Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <Link to={buildPracticePath({ scope: "full-subject", subject: "Maths", mode: "full-mock", source: "home" })}
              className="rounded-lg bg-secondary/60 p-4 hover:bg-secondary transition">
              <div className="text-xs text-muted-foreground">Full mock</div>
              <div className="font-semibold mt-0.5">Maths · 80 marks</div>
              <div className="text-[11px] text-muted-foreground mt-1">Sections A–E · 3 hours</div>
            </Link>
            <Link to={buildPracticePath({ scope: "full-subject", subject: "Science", mode: "full-mock", source: "home" })}
              className="rounded-lg bg-secondary/60 p-4 hover:bg-secondary transition">
              <div className="text-xs text-muted-foreground">Full mock</div>
              <div className="font-semibold mt-0.5">Science · 80 marks</div>
              <div className="text-[11px] text-muted-foreground mt-1">Phy + Chem + Bio · 3 hours</div>
            </Link>
            <Link to={buildPracticePath({ scope: "full-subject", subject, mode: "predicted", source: "home" })}
              className="rounded-lg bg-secondary/60 p-4 hover:bg-secondary transition">
              <div className="text-xs text-muted-foreground">Predicted paper</div>
              <div className="font-semibold mt-0.5">{subject} · full subject</div>
              <div className="text-[11px] text-muted-foreground mt-1">Likely Section A → E breakdown</div>
            </Link>
            <Link to={buildWorksheetPath({ scope: "multi-topic", subject, source: "home" })}
              className="rounded-lg bg-secondary/60 p-4 hover:bg-secondary transition">
              <div className="text-xs text-muted-foreground">Worksheet</div>
              <div className="font-semibold mt-0.5">Multi-topic worksheet</div>
              <div className="text-[11px] text-muted-foreground mt-1">Pick topics in scope builder</div>
            </Link>
          </div>
        </section>

        <MistakeIntelligencePanel source="home" />
      </div>
    </div>
  );
}
