import { useLocation, useNavigate } from "react-router-dom";
import { useLazyTopper } from "@/context/LazyTopperContext";
import { topicBySlug } from "@/lib/topics";
import { buildPracticePath, buildWorksheetPath, buildTopicPath, buildLoginPath, buildCheckPath } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { Layers, ClipboardList, Sparkles, Timer, BookOpen } from "lucide-react";
import type { ActionSource } from "@/lib/types";

interface TopicActionsProps {
  topicSlug: string;
  source: ActionSource;
}

export function TopicActions({ topicSlug, source }: TopicActionsProps) {
  const { auth, setActionSource, setSubject, setStream, setTopicSlug } = useLazyTopper();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = `${location.pathname}${location.search}`;

  const t = topicBySlug(topicSlug);
  const topicSubject = t?.subject ?? "Maths";
  const topicStream = t?.stream ?? "All";

  const openTopicHub = () => {
    if (t) {
      setSubject(t.subject);
      if (t.subject === "Science") setStream(t.stream);
      setTopicSlug(t.slug);
    }
    setActionSource(source);
    navigate(buildTopicPath(topicSlug, source, returnTo));
  };

  const handle = () => setActionSource(source);

  const gated = (path: string, reason: string) => {
    if (auth === "trial-active") {
      navigate(path);
    } else {
      navigate(buildLoginPath({ reason, redirect: path }));
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="secondary" size="sm" onClick={openTopicHub}>
        <BookOpen className="h-3.5 w-3.5" /> Topic Hub
      </Button>
      <Button
        variant="default"
        size="sm"
        onClick={() => { handle(); navigate(buildPracticePath({ scope: "topic", subject: topicSubject, stream: topicStream, topic: topicSlug, mode: "practice-set", source })); }}
      >
        <Layers className="h-3.5 w-3.5" /> Practice
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => { handle(); navigate(buildPracticePath({ scope: "topic", subject: topicSubject, stream: topicStream, topic: topicSlug, mode: "predicted", source })); }}
      >
        <Sparkles className="h-3.5 w-3.5" /> Predicted Qs
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => { handle(); gated(buildPracticePath({ scope: "topic", subject: topicSubject, stream: topicStream, topic: topicSlug, mode: "chapter-test", source }), "open-chapter-test"); }}
      >
        <Timer className="h-3.5 w-3.5" /> Chapter Test
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => { handle(); navigate(buildWorksheetPath({ scope: "topic", subject: topicSubject, stream: topicStream, topic: topicSlug, source })); }}
      >
        <ClipboardList className="h-3.5 w-3.5" /> Worksheet
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => { handle(); gated(buildCheckPath({ topic: topicSlug, source }), "open-check"); }}
      >
        Check answers
      </Button>
    </div>
  );
}
