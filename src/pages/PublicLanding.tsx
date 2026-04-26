import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Target, ClipboardCheck, GraduationCap, BookOpen, Brain, RotateCcw } from "lucide-react";
import { useLazyTopper } from "@/context/LazyTopperContext";
import { topicBySlug } from "@/lib/topics";

export default function PublicLanding() {
  const { hasMeaningfulMemory, memory, clearMemory } = useLazyTopper();
  const navigate = useNavigate();

  const lastTopic = memory?.topicSlug ? topicBySlug(memory.topicSlug)?.name : null;
  const resumeTo = memory?.lastRoute && memory.lastRoute.startsWith("/app") ? memory.lastRoute : "/app";

  const continueLine = (() => {
    if (!memory) return "Continue where you left off";
    if (memory.lastAttempt) return `Continue from ${memory.lastAttempt.topicName} ${memory.mode.replace(/-/g, " ")}`;
    if (lastTopic) return `Continue from ${lastTopic}`;
    return "Continue where you left off";
  })();

  const lastSavedLine = memory?.lastAttempt
    ? `Last saved: ${memory.lastAttempt.topicName} · ${memory.lastAttempt.score}/${memory.lastAttempt.outOf}`
    : memory?.topicSlug && lastTopic
    ? `Last focus: ${memory.subject}${memory.subject === "Science" && memory.stream !== "All" ? ` · ${memory.stream}` : ""} • ${lastTopic}`
    : "Continue where you left off";

  const onResume = () => navigate(`/app/login?reason=login&redirect=${encodeURIComponent(resumeTo)}`);
  const onStartFresh = () => {
    clearMemory();
    navigate("/app/login?reason=start-trial&redirect=/app");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/60 backdrop-blur sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground grid place-items-center font-display font-bold">L</div>
            <span className="font-display text-xl font-semibold">LazyTopper</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#why" className="hover:text-foreground">Why</a>
            <a href="#loop" className="hover:text-foreground">How it works</a>
            <a href="#cockpit" className="hover:text-foreground">The cockpit</a>
            <a href="#trial" className="hover:text-foreground">Trial</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/app/login?reason=login&redirect=/app">Log in</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/app/login?reason=start-trial&redirect=/app">
                Start free trial <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 lt-chip-accent mb-5">
              <Sparkles className="h-3.5 w-3.5" /> CBSE Class 10 · Maths &amp; Science
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-semibold leading-[1.05] tracking-tight">
              Know what matters. Practise what helps. <span className="text-accent">Fix what costs marks.</span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-xl">
              LazyTopper is your action companion for the boards. Pick a topic, generate a worksheet, attempt a full 80-mark mock, or check your own answers.
              Every mistake quietly powers your next practice — no rigid timetable, ever.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/app/login?reason=start-trial&redirect=/app">
                  Start free trial <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link to="/app">Explore the cockpit</Link>
              </Button>
            </div>
            <div className="mt-6 text-xs text-muted-foreground">
              Free trial unlocks personalised practice. No card. No timetable. Cancel anytime.
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            {hasMeaningfulMemory && memory && (
              <div className="lt-card-elevated p-5 border-accent/40 bg-accent-soft/30 animate-fade-in">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-accent text-accent-foreground grid place-items-center shrink-0">
                    <RotateCcw className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-foreground">Welcome back</div>
                    <div className="text-xs text-muted-foreground mt-0.5 truncate">{continueLine}</div>
                    <div className="text-[11px] text-muted-foreground mt-1 truncate">{lastSavedLine}</div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Button size="sm" onClick={onResume}>
                        Resume <ArrowRight className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={onStartFresh}>Start fresh</Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="lt-card-elevated p-6 space-y-4">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Today’s loop</div>
              <div className="rounded-lg bg-secondary/60 p-4 text-sm">
                <div className="font-semibold text-foreground">Trigonometry · 7/10</div>
                <div className="text-xs text-muted-foreground mt-1">Main issue: sign error in identity proof.</div>
              </div>
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">Suggested next, optional:</div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="lt-chip-accent">Targeted drill</span>
                  <span className="lt-chip">Mistake-aware worksheet</span>
                  <span className="lt-chip">Add weak-area to mock</span>
                </div>
              </div>
              <div className="text-[11px] text-muted-foreground border-t border-border pt-3">
                Sample preview.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="why" className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Why LazyTopper</div>
            <h2 className="font-display text-3xl md:text-4xl font-semibold mt-2">A connected exam cockpit, not a shop of tools.</h2>
            <p className="mt-3 text-muted-foreground">
              Most apps give you locked timetables or unrelated tools. LazyTopper gives you one calm cockpit where every action — practice, worksheet, mock, predicted questions, answer check — feeds into one mistake-aware loop.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5 mt-10">
            {[
              { icon: Target, title: "Intent-first", body: "Pick what you want to do now. Subject → topic(s) → action → result. No fixed path." },
              { icon: Brain, title: "Mistake-aware", body: "Every saved attempt updates your weak areas. Drills, worksheets, and mocks adapt accordingly." },
              { icon: ClipboardCheck, title: "Full board prep", body: "Single-topic, multi-topic, or full 80-mark mocks for Maths or Science. Predicted questions included." },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="lt-card p-6">
                <div className="h-10 w-10 rounded-lg bg-accent-soft text-accent-soft-foreground grid place-items-center mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="font-display text-lg font-semibold">{title}</div>
                <p className="text-sm text-muted-foreground mt-1.5">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="loop" className="border-b border-border bg-secondary/40">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">The core loop</div>
          <h2 className="font-display text-3xl md:text-4xl font-semibold mt-2">Subject → Topic(s) → Action → Result → Mistake insight → Optional next.</h2>
          <ol className="mt-10 grid md:grid-cols-5 gap-3">
            {[
              { n: "1", t: "Pick scope", d: "Single topic, multi-topic combination, or full subject." },
              { n: "2", t: "Choose action", d: "Practice, worksheet, predicted, timed, or full mock." },
              { n: "3", t: "Attempt", d: "On-screen or upload your handwritten answers." },
              { n: "4", t: "Result + mistake", d: "Score plus a clear mistake insight tagged by type." },
              { n: "5", t: "Optional next", d: "Targeted drill, mistake-aware worksheet, or weak-area mock." },
            ].map((s) => (
              <li key={s.n} className="lt-card p-5">
                <div className="text-accent font-display text-2xl font-semibold">{s.n}</div>
                <div className="font-semibold mt-1">{s.t}</div>
                <p className="text-xs text-muted-foreground mt-1">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="cockpit" className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Inside the cockpit</div>
            <h2 className="font-display text-3xl md:text-4xl font-semibold mt-2">One quiet workspace for the whole board year.</h2>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                ["Home", "Your latest attempt and a soft set of next-action suggestions."],
                ["Practice", "Quick practice, worksheets, predicted questions, and full 80-mark mocks across any scope."],
                ["Worksheet", "Single-topic, multi-topic, or full-subject worksheets with sections A–E."],
                ["Exam Trends", "Tiered topic cards and multi-topic actions."],
                ["Check & Improve", "Paste an answer, get feedback and a mistake tag."],
                ["Me / Progress", "Visual dashboard of saved attempts, mistake mix, and weak areas."],
              ].map(([k, v]) => (
                <li key={k as string} className="flex gap-3">
                  <BookOpen className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                  <div><span className="font-semibold">{k}</span> — <span className="text-muted-foreground">{v}</span></div>
                </li>
              ))}
            </ul>
          </div>

          <div className="lt-card-elevated p-2 overflow-hidden">
            <div className="rounded-lg bg-sidebar text-sidebar-foreground p-5 text-xs leading-relaxed">
              <div className="text-sidebar-foreground/60 uppercase tracking-wider text-[10px] mb-2">Preview · Sidebar</div>
              <div className="space-y-1.5">
                {["Home", "Practice", "Exam Trends", "Check & Improve", "Me / Progress"].map((l, i) => (
                  <div key={l} className={`px-3 py-2 rounded-md ${i === 1 ? "bg-sidebar-accent text-white" : "text-sidebar-foreground/85"}`}>{l}</div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-sidebar-border">
                <div className="text-[10px] uppercase tracking-wider text-sidebar-foreground/55">Current focus</div>
                <div className="text-white text-sm mt-1">Maths</div>
                <div className="text-sidebar-foreground/70 text-[11px]">Trigonometry</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="trial" className="border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 lt-chip mb-4"><GraduationCap className="h-3.5 w-3.5" /> Free trial</div>
          <h2 className="font-display text-4xl font-semibold">Try the cockpit, end-to-end.</h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            The trial unlocks saved attempts, mistake intelligence, mistake-aware worksheets, and full 80-mark mocks for Maths and Science.
          </p>
          <div className="mt-6 flex justify-center gap-3 flex-wrap">
            <Button asChild size="lg">
              <Link to="/app/login?reason=start-trial&redirect=/app">Start free trial <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link to="/app/trends">Browse exam trends</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="py-10 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} LazyTopper
      </footer>
    </div>
  );
}
