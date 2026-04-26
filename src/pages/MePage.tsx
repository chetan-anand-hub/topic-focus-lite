import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useLazyTopper } from "@/context/LazyTopperContext";
import { ContextBar } from "@/components/ContextBar";
import { BackToParent } from "@/components/BackToParent";
import { Button } from "@/components/ui/button";
import { buildLoginPath, buildPracticePath, buildWorksheetPath, buildTopicPath } from "@/lib/navigation";
import { Target, ClipboardList, BookOpen, Lock, ArrowRight, TrendingUp, Sparkles } from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";
import type { AttemptRecord, MistakeType } from "@/lib/types";

const MISTAKE_LABELS: Record<MistakeType, string> = {
  conceptual: "Conceptual",
  calculation: "Calculation",
  silly: "Silly",
  presentation: "Presentation",
};

const MISTAKE_COLORS: Record<MistakeType, string> = {
  conceptual: "hsl(var(--chart-1))",
  calculation: "hsl(var(--chart-2))",
  silly: "hsl(var(--chart-4))",
  presentation: "hsl(var(--chart-5))",
};

function buildScoreTrend(history: AttemptRecord[]) {
  return [...history].reverse().map((a, i) => ({
    n: i + 1,
    label: new Date(a.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    pct: Math.round((a.score / a.outOf) * 100),
    topic: a.topicName,
  }));
}

function buildSubjectBars(history: AttemptRecord[]) {
  const buckets: Record<string, { name: string; total: number; outOf: number; count: number }> = {};
  history.forEach((a) => {
    const key = a.subject === "Science" && a.stream !== "All" ? `Science · ${a.stream}` : a.subject;
    if (!buckets[key]) buckets[key] = { name: key, total: 0, outOf: 0, count: 0 };
    buckets[key].total += a.score;
    buckets[key].outOf += a.outOf;
    buckets[key].count += 1;
  });
  return Object.values(buckets).map((b) => ({
    name: b.name,
    pct: b.outOf ? Math.round((b.total / b.outOf) * 100) : 0,
    attempts: b.count,
  }));
}

function buildMistakeMix(history: AttemptRecord[]) {
  const counts: Record<MistakeType, number> = { conceptual: 0, calculation: 0, silly: 0, presentation: 0 };
  history.forEach((a) => { if (a.mistakeType) counts[a.mistakeType] += 1; });
  return (Object.keys(counts) as MistakeType[])
    .filter((k) => counts[k] > 0)
    .map((k) => ({ name: MISTAKE_LABELS[k], value: counts[k], key: k }));
}

function buildMarksLost(history: AttemptRecord[]) {
  const byTopic: Record<string, { topic: string; lost: number }> = {};
  history.forEach((a) => {
    if (!byTopic[a.topicName]) byTopic[a.topicName] = { topic: a.topicName, lost: 0 };
    byTopic[a.topicName].lost += a.outOf - a.score;
  });
  return Object.values(byTopic).sort((a, b) => b.lost - a.lost).slice(0, 6);
}

export default function MePage() {
  const { auth, attemptHistory, lastAttempt, mistakeInsight, setActionSource } = useLazyTopper();
  useEffect(() => { setActionSource("me"); }, [setActionSource]);

  const hasAttempts = attemptHistory.length > 0;
  const scoreTrend = useMemo(() => buildScoreTrend(attemptHistory), [attemptHistory]);
  const subjectBars = useMemo(() => buildSubjectBars(attemptHistory), [attemptHistory]);
  const mistakeMix = useMemo(() => buildMistakeMix(attemptHistory), [attemptHistory]);
  const marksLost = useMemo(() => buildMarksLost(attemptHistory), [attemptHistory]);

  const avgScore = hasAttempts
    ? Math.round((attemptHistory.reduce((s, a) => s + a.score / a.outOf, 0) / attemptHistory.length) * 100)
    : 0;
  const bestPct = hasAttempts ? Math.max(...attemptHistory.map((a) => Math.round((a.score / a.outOf) * 100))) : 0;
  const totalMistakes = mistakeMix.reduce((s, m) => s + m.value, 0);

  if (auth === "logged-out") {
    return (
      <div className="space-y-5">
        <ContextBar title="Me / Progress" subtitle="Your saved attempts, weak areas and next actions." compact />
        <section className="lt-card p-6 space-y-5">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-display text-lg font-semibold">Progress needs saved attempts</h3>
          </div>
          <p className="text-sm text-muted-foreground max-w-xl">Start a free trial to save attempts and unlock your personal dashboard.</p>
          <div>
            <Button asChild>
              <Link to={buildLoginPath({ reason: "open-progress", redirect: "/app/me" })}>
                Start free trial <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-4 pt-2">
            <DashboardSkeleton title="Score trend" icon={<TrendingUp className="h-4 w-4 text-accent" />} variant="line" />
            <DashboardSkeleton title="Mistake mix" icon={<Sparkles className="h-4 w-4 text-accent" />} variant="pie" />
            <DashboardSkeleton title="Marks lost by topic" icon={<Target className="h-4 w-4 text-accent" />} variant="bars" />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <ContextBar
        title="Me / Progress"
        subtitle={hasAttempts ? "Based on your saved attempts." : "Save an attempt to start filling your dashboard."}
        compact
        right={<span className="lt-chip-accent">Trial active</span>}
      />

      {!hasAttempts ? (
        <section className="lt-card p-6 space-y-4">
          <h3 className="font-display text-lg font-semibold">Your dashboard is waiting for your first attempt</h3>
          <p className="text-sm text-muted-foreground">Grade an answer in Check &amp; Improve, or save a practice/mock attempt — your charts will appear here automatically.</p>
          <div className="flex flex-wrap gap-2">
            <Button asChild><Link to="/app/check"><Sparkles className="h-3.5 w-3.5" /> Grade an answer</Link></Button>
            <Button asChild variant="secondary"><Link to="/app/practice"><Target className="h-3.5 w-3.5" /> Start practice</Link></Button>
          </div>
          <div className="grid sm:grid-cols-3 gap-3 pt-3">
            <StatCard label="Average score" value="—" />
            <StatCard label="Best" value="—" />
            <StatCard label="Saved attempts" value="0" />
          </div>
        </section>
      ) : (
        <>
          <section className="grid sm:grid-cols-3 gap-3">
            <StatCard label="Average score" value={`${avgScore}%`} />
            <StatCard label="Best score" value={`${bestPct}%`} />
            <StatCard label="Saved attempts" value={String(attemptHistory.length)} sub={totalMistakes ? `${totalMistakes} mistakes tagged` : undefined} />
          </section>

          <div className="grid lg:grid-cols-3 gap-5">
            <section className="lt-card p-5 lg:col-span-2 space-y-3">
              <h3 className="font-display text-base font-semibold flex items-center gap-2"><TrendingUp className="h-4 w-4 text-accent" /> Score trend</h3>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={scoreTrend} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" />
                    <Tooltip
                      contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                      formatter={(v: any, _n, p: any) => [`${v}%`, p?.payload?.topic ?? "Score"]}
                    />
                    <Line type="monotone" dataKey="pct" stroke="hsl(var(--accent))" strokeWidth={2.5} dot={{ r: 3, fill: "hsl(var(--accent))" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="lt-card p-5 space-y-3">
              <h3 className="font-display text-base font-semibold flex items-center gap-2"><Sparkles className="h-4 w-4 text-accent" /> Mistake mix</h3>
              {mistakeMix.length > 0 ? (
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={mistakeMix} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2}>
                        {mistakeMix.map((m) => (
                          <Cell key={m.key} fill={MISTAKE_COLORS[m.key]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No mistake tags yet.</p>
              )}
            </section>
          </div>

          <div className="grid lg:grid-cols-2 gap-5">
            <section className="lt-card p-5 space-y-3">
              <h3 className="font-display text-base font-semibold">Subject performance</h3>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectBars} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} formatter={(v: any) => [`${v}%`, "Average"]} />
                    <Bar dataKey="pct" fill="hsl(var(--chart-1))" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="lt-card p-5 space-y-3">
              <h3 className="font-display text-base font-semibold">Marks lost by topic</h3>
              {marksLost.length > 0 ? (
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={marksLost} layout="vertical" margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" />
                      <YAxis type="category" dataKey="topic" width={120} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))" />
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} formatter={(v: any) => [`${v} marks`, "Lost"]} />
                      <Bar dataKey="lost" fill="hsl(var(--chart-4))" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No marks-lost data yet.</p>
              )}
            </section>
          </div>

          {mistakeInsight && (
            <section className="lt-card-elevated p-5 space-y-3 border-accent/40">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="font-display text-base font-semibold">Latest weak area</h3>
                <span className="lt-chip-accent">{MISTAKE_LABELS[mistakeInsight.mistakeType]}</span>
              </div>
              <div className="text-sm">
                <span className="font-semibold text-foreground">{mistakeInsight.topicName}</span> — <span className="text-foreground/85">{mistakeInsight.mistakeLabel}</span>
              </div>
              <div className="text-xs text-muted-foreground">{mistakeInsight.detail}</div>
              <div className="flex flex-wrap gap-2 pt-1 border-t border-border">
                <Button asChild size="sm">
                  <Link to={buildPracticePath({ scope: "topic", subject: mistakeInsight.subject, stream: mistakeInsight.stream, topic: mistakeInsight.topicSlug, mode: "timed", source: "me", mistake: mistakeInsight.id })}>
                    <Target className="h-3.5 w-3.5" /> Run targeted drill
                  </Link>
                </Button>
                <Button asChild size="sm" variant="secondary">
                  <Link to={buildWorksheetPath({ scope: "topic", subject: mistakeInsight.subject, stream: mistakeInsight.stream, topic: mistakeInsight.topicSlug, mistakeAware: true, source: "me" })}>
                    <ClipboardList className="h-3.5 w-3.5" /> Mistake-aware worksheet
                  </Link>
                </Button>
                <Button asChild size="sm" variant="secondary">
                  <Link to={buildPracticePath({ scope: "full-subject", subject: mistakeInsight.subject, stream: mistakeInsight.stream, mode: "full-mock", source: "me", mistake: mistakeInsight.id })}>
                    Add weak-area to next mock
                  </Link>
                </Button>
                <Button asChild size="sm" variant="ghost">
                  <Link to={buildTopicPath(mistakeInsight.topicSlug, "me")}>
                    <BookOpen className="h-3.5 w-3.5" /> Open Topic Hub
                  </Link>
                </Button>
              </div>
              <div className="text-[11px] text-muted-foreground">Recommended, not required.</div>
            </section>
          )}

          <section className="lt-card p-5 space-y-3">
            <h3 className="font-display text-base font-semibold">Recent attempts</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {attemptHistory.slice(0, 6).map((a) => {
                const pct = Math.round((a.score / a.outOf) * 100);
                return (
                  <article key={a.id} className="rounded-lg border border-border p-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold truncate">{a.topicName}</div>
                      <div className="text-[11px] text-muted-foreground">{new Date(a.date).toLocaleDateString()}</div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="font-display text-lg font-semibold">{a.score}/{a.outOf}</div>
                        <div className="text-[10px] text-muted-foreground">{pct}%</div>
                      </div>
                      <Button asChild size="sm" variant="ghost"><Link to={buildTopicPath(a.topicSlug, "me")}>Open</Link></Button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </>
      )}

      {!hasAttempts && lastAttempt && (
        <section className="lt-card p-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Last attempt</div>
          <div className="font-display text-lg font-semibold mt-1">{lastAttempt.topicName} · {lastAttempt.score}/{lastAttempt.outOf}</div>
        </section>
      )}
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="lt-card p-4">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-display text-3xl font-semibold mt-1 text-foreground">{value}</div>
      {sub && <div className="text-[11px] text-muted-foreground mt-1">{sub}</div>}
    </div>
  );
}
