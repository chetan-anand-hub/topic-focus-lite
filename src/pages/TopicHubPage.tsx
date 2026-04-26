import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useLazyTopper } from "@/context/LazyTopperContext";
import { topicBySlug } from "@/lib/topics";
import {
  buildPracticePath,
  buildWorksheetPath,
  buildCheckPath,
  buildLoginPath,
} from "@/lib/navigation";
import { buildActionableTopicHubContent } from "@/lib/topicHubContent";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Layers,
  ClipboardList,
  Sparkles,
  ChevronDown,
  Plus,
  Check as CheckIcon,
  Lightbulb,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Target,
  ArrowRight,
} from "lucide-react";
import { MistakeIntelligencePanel } from "@/components/MistakeIntelligencePanel";
import { BackToParent } from "@/components/BackToParent";

export default function TopicHubPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    auth,
    setActionSource,
    setSubject,
    setStream,
    setTopicSlug,
    selectedTopicSlugs,
    toggleSelectedTopic,
    mistakeInsight,
  } = useLazyTopper();

  const [showAllConcepts, setShowAllConcepts] = useState(false);

  const topic = topicBySlug(slug);

  useEffect(() => {
    setActionSource("topicHub");
  }, [setActionSource]);

  const content = useMemo(
    () => (slug ? buildActionableTopicHubContent(slug) : null),
    [slug]
  );

  if (!topic || !content) {
    return (
      <div className="lt-card p-6">
        <h1 className="font-display text-xl font-semibold">Topic not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">Pick a topic from Home or Trends.</p>
        <Button asChild size="sm" className="mt-3">
          <Link to="/app">Back to Home</Link>
        </Button>
      </div>
    );
  }

  const source = "topicHub" as const;
  const subject = topic.subject;
  const stream = topic.stream;
  const isSelected = selectedTopicSlugs.includes(topic.slug);
  // Return-to for any child of Topic Hub: this exact URL.
  const returnTo = `${location.pathname}${location.search}`;

  const handle = () => {
    setSubject(topic.subject);
    if (topic.subject === "Science") setStream(topic.stream);
    setTopicSlug(topic.slug);
  };

  const gated = (path: string, reason: string) => {
    if (auth === "trial-active") navigate(path);
    else navigate(buildLoginPath({ reason, redirect: path }));
  };

  // Derived data
  const concepts = content.boardEssentials;
  const visibleConcepts = showAllConcepts ? concepts : concepts.slice(0, 3);
  const featured = content.formulaUsePreview;
  const fullMap = content.fullFormulaUseMap;
  const hpqCount = content.hpqSummary.count;

  const trendLabel =
    topic.trendTier === "high" ? "High trend" : topic.trendTier === "medium" ? "Medium trend" : "Low trend";

  const personalMistakeForThisTopic =
    mistakeInsight?.topicSlug === topic.slug ? mistakeInsight : null;

  // Recommended next action
  const recommendedPath = personalMistakeForThisTopic
    ? buildWorksheetPath({ scope: "topic", subject, stream, topic: topic.slug, source, mistakeAware: true, returnTo })
    : buildPracticePath({ scope: "topic", subject, stream, topic: topic.slug, mode: "predicted", source, returnTo });
  const recommendedLabel = personalMistakeForThisTopic
    ? "Run mistake-aware worksheet"
    : "Practise predicted Qs";

  return (
    <div className="space-y-2">
      <BackToParent fallbackPath="/app/trends" fallbackLabel="Back to Exam Trends" />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_280px]">
        {/* Main column */}
        <div className="space-y-4">
          {/* Topic strip */}
          <header className="lt-card p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{topic.subject}</span>
                  {topic.subject === "Science" && <span>· {topic.stream}</span>}
                  <span>· Class 10</span>
                </div>
                <h1 className="font-display text-xl font-semibold leading-tight">{topic.name}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{topic.blurb}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="rounded-full">{trendLabel}</Badge>
                <Badge className="rounded-full" variant="outline">~{topic.weight} marks</Badge>
              </div>
            </div>

            {/* Compact weightage visual */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Weight in board paper</span>
                <span>{topic.weight}/12</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${Math.min(100, (topic.weight / 12) * 100)}%` }}
                />
              </div>
            </div>

            {/* Compact action bar — 4 visible primary actions */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                onClick={() => {
                  handle();
                  navigate(buildPracticePath({ scope: "topic", subject, stream, topic: topic.slug, mode: "practice-set", source, returnTo }));
                }}
              >
                <Layers className="h-3.5 w-3.5" /> Practice
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  handle();
                  navigate(buildWorksheetPath({ scope: "topic", subject, stream, topic: topic.slug, source, returnTo }));
                }}
              >
                <ClipboardList className="h-3.5 w-3.5" /> Worksheet
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  handle();
                  navigate(buildPracticePath({ scope: "topic", subject, stream, topic: topic.slug, mode: "predicted", source, returnTo }));
                }}
              >
                <Sparkles className="h-3.5 w-3.5" /> Predicted Qs
              </Button>
              <Button
                size="sm"
                variant={isSelected ? "default" : "outline"}
                onClick={() => toggleSelectedTopic(topic.slug)}
              >
                {isSelected ? <CheckIcon className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                {isSelected ? "In selection" : "Add to selection"}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="ghost">
                    More <ChevronDown className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      handle();
                      gated(
                        buildPracticePath({ scope: "topic", subject, stream, topic: topic.slug, mode: "chapter-test", source, returnTo }),
                        "open-chapter-test"
                      );
                    }}
                  >
                    Chapter Test
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      handle();
                      gated(buildCheckPath({ topic: topic.slug, source, returnTo }), "open-check");
                    }}
                  >
                    Check answer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Recommended next action */}
          <section className="lt-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Target className="h-3.5 w-3.5" />
                  <span>Recommended next</span>
                </div>
                <div className="mt-0.5 font-display text-base font-semibold">{recommendedLabel}</div>
                <div className="text-xs text-muted-foreground">
                  Based on {personalMistakeForThisTopic ? "your latest mistake in this topic" : "what boards repeat here"}.
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    handle();
                    navigate(recommendedPath);
                  }}
                >
                  Start <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">Recommended, not required.</div>
          </section>

          {/* Latest personal mistake — only if for THIS topic */}
          {personalMistakeForThisTopic && (
            <section className="lt-card p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-500" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-muted-foreground">Your latest mistake here</div>
                  <div className="text-sm font-medium">{personalMistakeForThisTopic.mistakeLabel}</div>
                  <div className="text-xs text-muted-foreground">{personalMistakeForThisTopic.detail}</div>
                </div>
              </div>
            </section>
          )}

          {/* Progressive 3-section experience — only Board Essentials open by default */}
          <Accordion type="multiple" defaultValue={["essentials"]} className="space-y-3">
            {/* A. Board Essentials */}
            <AccordionItem value="essentials" className="lt-card border-0 px-4">
              <AccordionTrigger className="py-3">
                <div className="flex items-center gap-2 text-left">
                  <span className="font-display text-base font-semibold">Board Essentials</span>
                  <Badge variant="secondary" className="rounded-full text-[10px]">{concepts.length} concepts</Badge>
                  {content.isSamplePreview && (
                    <Badge variant="outline" className="rounded-full text-[10px]">Sample preview</Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="space-y-2">
                  {visibleConcepts.map((c, i) => (
                    <div key={i} className="rounded-lg border border-border/60 bg-background/50 p-3">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-sm font-medium">{c.name}</div>
                          <div className="mt-0.5 text-xs text-muted-foreground">{c.oneLineUse}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="rounded-full text-[10px]">{c.marks}</Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              handle();
                              navigate(
                                buildPracticePath({ scope: "topic", subject, stream, topic: topic.slug, mode: "practice-set", source, returnTo })
                              );
                            }}
                          >
                            Practise this
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {concepts.length > 3 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowAllConcepts((s) => !s)}
                    >
                      {showAllConcepts ? "Show fewer concepts" : `Show all ${concepts.length} concepts`}
                    </Button>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* B. How boards use it — collapsed by default */}
            <AccordionItem value="boards" className="lt-card border-0 px-4">
              <AccordionTrigger className="py-3">
                <div className="flex items-center gap-2 text-left">
                  <span className="font-display text-base font-semibold">How boards use it</span>
                  <Badge variant="secondary" className="rounded-full text-[10px]">
                    1 highlighted {featured.kind}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="space-y-3">
                  <FormulaCard
                    item={featured}
                    onPractice={() => {
                      handle();
                      navigate(buildPracticePath({ scope: "topic", subject, stream, topic: topic.slug, mode: "practice-set", source, returnTo }));
                    }}
                    onMiniDrill={() => {
                      handle();
                      navigate(buildWorksheetPath({ scope: "topic", subject, stream, topic: topic.slug, source, returnTo }));
                    }}
                  />

                  {fullMap.length > 0 && (
                    <Accordion type="single" collapsible>
                      <AccordionItem value="all-formulas" className="border-0">
                        <AccordionTrigger className="py-2 text-sm">
                          View formula use map ({fullMap.length})
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            {fullMap.map((f, i) => (
                              <FormulaCard
                                key={i}
                                item={f}
                                onPractice={() => {
                                  handle();
                                  navigate(buildPracticePath({ scope: "topic", subject, stream, topic: topic.slug, mode: "practice-set", source, returnTo }));
                                }}
                                onMiniDrill={() => {
                                  handle();
                                  navigate(buildWorksheetPath({ scope: "topic", subject, stream, topic: topic.slug, source, returnTo }));
                                }}
                              />
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}

                  {/* HPQs compact card */}
                  {hpqCount > 0 && (
                    <div className="rounded-lg border border-border/60 bg-background/50 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-sm font-medium">Highly probable questions available</div>
                          <div className="text-xs text-muted-foreground">{hpqCount} likely board-style Qs identified.</div>
                        </div>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            handle();
                            navigate(buildPracticePath({ scope: "topic", subject, stream, topic: topic.slug, mode: "predicted", source, returnTo }));
                          }}
                        >
                          See HPQs
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* C. Mistakes & next action — collapsed by default */}
            <AccordionItem value="mistakes" className="lt-card border-0 px-4">
              <AccordionTrigger className="py-3">
                <div className="flex items-center gap-2 text-left">
                  <span className="font-display text-base font-semibold">Mistakes &amp; next action</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-2 text-sm">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 text-amber-500" />
                    <div>
                      <div className="text-xs text-muted-foreground">Top common mistake</div>
                      <div>{content.commonMistake}</div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-border/60 bg-background/50 p-3">
                    <div className="text-xs text-muted-foreground">Examiner warning</div>
                    <div className="mt-0.5 text-sm">{content.examinerWarning}</div>
                  </div>

                  {personalMistakeForThisTopic && (
                    <div className="rounded-lg border border-accent/40 bg-accent-soft/30 p-3">
                      <div className="text-xs text-muted-foreground">Your latest mistake here</div>
                      <div className="mt-0.5 text-sm font-medium">{personalMistakeForThisTopic.mistakeLabel}</div>
                      <div className="text-xs text-muted-foreground">{personalMistakeForThisTopic.detail}</div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        handle();
                        navigate(buildPracticePath({ scope: "topic", subject, stream, topic: topic.slug, mode: "timed", source, returnTo, mistake: personalMistakeForThisTopic?.id }));
                      }}
                    >
                      Run targeted drill
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        handle();
                        navigate(buildWorksheetPath({ scope: "topic", subject, stream, topic: topic.slug, source, returnTo, mistakeAware: true }));
                      }}
                    >
                      Mistake-aware worksheet
                    </Button>
                    <Button size="sm" variant="ghost">
                      Review formula use
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Right rail — only 2 cards */}
        <aside className="space-y-3">
          <section className="lt-card p-4">
            <h3 className="font-display text-sm font-semibold">Topic snapshot</h3>
            <dl className="mt-2 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Weightage</dt>
                <dd className="font-medium">~{topic.weight} marks</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Trend</dt>
                <dd className="font-medium">{trendLabel}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Likely section</dt>
                <dd className="font-medium">{content.topicSnapshot.likelySection}</dd>
              </div>
            </dl>
          </section>

          <section className="lt-card p-4">
            <h3 className="font-display text-sm font-semibold">Need a quick hand?</h3>
            <p className="mt-1 text-xs text-muted-foreground">Optional support — not a tutor.</p>
            <div className="mt-3 space-y-2">
              <SupportSheet
                triggerLabel="Explain concept"
                icon={<Lightbulb className="h-3.5 w-3.5" />}
                title={`What's ${topic.name} really about?`}
                body={`${topic.blurb} In the board paper, this usually shows up in ${content.topicSnapshot.likelySection}.`}
              />
              <SupportSheet
                triggerLabel="Show visual"
                icon={<Eye className="h-3.5 w-3.5" />}
                title="Quick visual"
                body="A simple diagram or worked example would appear here to ground the concept."
              />
              <SupportSheet
                triggerLabel="Mini check"
                icon={<CheckCircle2 className="h-3.5 w-3.5" />}
                title="Mini check"
                body="A 2-question check to confirm you've understood — short, low pressure."
              />
            </div>
          </section>

          {/* Mistake intelligence (compact) only if relevant for THIS topic */}
          {personalMistakeForThisTopic && (
            <MistakeIntelligencePanel source="topicHub" compact bare />
          )}
        </aside>
      </div>
    </div>
  );
}

function FormulaCard({
  item,
  onPractice,
  onMiniDrill,
}: {
  item: { kind: "formula" | "definition"; title: string; whenToUse: string[]; commonTrap: string; directUse?: string; hiddenUse?: string; combinedUse?: string };
  onPractice: () => void;
  onMiniDrill: () => void;
}) {
  const hasUseMap = !!(item.directUse || item.hiddenUse || item.combinedUse);
  return (
    <div className="rounded-lg border border-border/60 bg-background/50 p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-sm font-medium">{item.title}</div>
          <ul className="mt-1.5 list-disc space-y-0.5 pl-4 text-xs text-muted-foreground">
            {item.whenToUse.slice(0, 2).map((w, i) => (
              <li key={i}>When to use: {w}</li>
            ))}
            <li>Common trap: {item.commonTrap}</li>
          </ul>
        </div>
        <Badge variant="outline" className="rounded-full text-[10px] capitalize">
          {item.kind}
        </Badge>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <Button size="sm" variant="secondary" onClick={onPractice}>Practise this</Button>
        <Button size="sm" variant="ghost" onClick={onMiniDrill}>Generate mini-drill</Button>
        {hasUseMap && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="how" className="border-0">
              <AccordionTrigger className="py-1 text-xs">See how boards use this</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc space-y-1 pl-4 text-xs text-muted-foreground">
                  {item.directUse && <li>Direct use: {item.directUse}</li>}
                  {item.hiddenUse && <li>Hidden use: {item.hiddenUse}</li>}
                  {item.combinedUse && <li>Combined use: {item.combinedUse}</li>}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>
    </div>
  );
}

function SupportSheet({
  triggerLabel,
  icon,
  title,
  body,
}: {
  triggerLabel: string;
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="sm" variant="ghost" className="w-full justify-start">
          {icon} {triggerLabel}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{body}</SheetDescription>
        </SheetHeader>
        <div className="mt-4 text-xs text-muted-foreground">
          Optional support. Use it when stuck — your main flow is Practice and Worksheet.
        </div>
      </SheetContent>
    </Sheet>
  );
}
