import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useLazyTopper } from "@/context/LazyTopperContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Sparkles } from "lucide-react";

const REASON_TEXT: Record<string, string> = {
  "start-trial": "Start your free trial to unlock saved attempts and mistake-aware practice.",
  "save-worksheet": "Sign in to save your worksheet to your history.",
  "upload-answers": "Sign in to upload and check your answers.",
  "grade-answer": "Sign in to grade your answer and save it to history.",
  "open-progress": "Sign in to view your progress and saved attempts.",
  "personal-drill": "Sign in to run a personalised drill from your weak areas.",
  "mistake-aware": "Sign in to enable mistake-aware practice.",
  "mistake-aware-worksheet": "Sign in to build a worksheet from your mistakes.",
  "open-chapter-test": "Sign in to start a chapter test.",
  "start-full-mock": "Sign in to start a full 80-mark mock.",
  "open-check": "Sign in to use Check & Improve.",
  "login": "Welcome back. Log in to continue.",
  "open-app": "Sign in to enter your LazyTopper cockpit.",
};

export default function LoginGate() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { startTrial, hasMeaningfulMemory } = useLazyTopper();
  const reason = params.get("reason") ?? "start-trial";
  const redirect = params.get("redirect") ?? "/app";

  const onTrial = () => {
    startTrial();
    navigate(redirect, { replace: true });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <section className="hidden lg:flex flex-col justify-between bg-sidebar text-sidebar-foreground p-10">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground grid place-items-center font-display font-bold">L</div>
          <span className="font-display text-xl text-white">LazyTopper</span>
        </Link>
        <div className="space-y-3 max-w-md">
          <h1 className="font-display text-3xl text-white">A calm cockpit for CBSE Class 10.</h1>
          <p className="text-sidebar-foreground/75">Practice, worksheets, predicted papers and full 80-mark mocks — all powered by your own mistakes. No timetables. No noise.</p>
          <div className="flex gap-2 flex-wrap">
            <span className="lt-chip-accent">Mistake-aware</span>
            <span className="lt-chip">80-mark mocks</span>
            <span className="lt-chip">Topic combinations</span>
          </div>
        </div>
        <div className="text-xs text-sidebar-foreground/60">© LazyTopper</div>
      </section>

      <section className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div>
            <div className="lt-chip-accent inline-flex"><Sparkles className="h-3 w-3" /> {hasMeaningfulMemory ? "Welcome back" : "Free trial"}</div>
            <h2 className="font-display text-3xl font-semibold mt-3">{hasMeaningfulMemory ? "Log in to continue" : "Sign in / Start trial"}</h2>
            <p className="text-sm text-muted-foreground mt-1.5">{REASON_TEXT[reason] ?? "Sign in to continue."}</p>
          </div>

          <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); onTrial(); }}>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@school.in" defaultValue="student@school.in" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" defaultValue="demo-pass" />
            </div>
            <Button type="submit" className="w-full">
              {hasMeaningfulMemory ? "Resume LazyTopper" : "Start free trial"} <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="text-xs text-muted-foreground text-center">
            <Link to="/" className="hover:underline">← Back to landing</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
