import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useLazyTopper } from "@/context/LazyTopperContext";
import { topicBySlug } from "@/lib/topics";
import { TOPIC_CONTENT } from "@/lib/topicContent";
import {
  buildPracticePath,
  buildWorksheetPath,
  buildCheckPath,
  buildLoginPath,
} from "@/lib/navigation";
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

export default function TopicHubPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const {
    auth,
    setActionSource,
    setSubject,
    setStream,
    setTopicSlug,
    selectedTopicSlugs,
    toggleSelectedTopic,
    lastAttempt,
    mistakeInsight,
  } = useLazyTopper();

  const [showAllConcepts, setShowAllConcepts] = useState(false);
  const [showAllMistakes, setShowAllMistakes] = useState(false);

  const topic = topicBySlug(slug);
  const sample = useMemo(() => (slug ? TOPIC_CONTENT[slug] : undefined), [slug]);

  if (!topic) {
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

  const handle = () => {
    setActionSource(source);
    setSubject(topic.subject);
    if (topic.subject === "Science") setStream(topic.stream);
    setTopicSlug(topic.slug);
  };

  const gated = (path: string, reason: string) => {
    if (auth === "trial-active") navigate(path);
    else navigate(buildLoginPath({ reason, redirect: path }));
  };

  // Derived data
  const concepts = (sample?.highROI ?? []).slice(0, 6);
  const visibleConcepts = showAllConcepts ? concepts : concepts.slice(0, 3);
  const formulaCards = sample?.examples ?? [];
  const featuredFormula = formulaCards[0];
  const hpqs = sample?.hpqs ?? [];
  const pitfalls = sample?.pitfalls ?? [];
  const visiblePitfalls = showAllMistakes ? pitfalls : pitfalls.slice(0, 1);

  const trendLabel =
    topic.trendTier === "high" ? "High trend" : topic.trendTier === "medium" ? "Medium trend" : "Low trend";

  const likelySection = topic.weight >= 7 ? "Section C / D" : topic.weight >= 5 ? "Section B / C" : "Section A / B";

  const personalMistakeForThisTopic =
    mistakeInsight?.topicSlug === topic.slug ? mistakeInsight : null;

  // Recommended next action
  const recommendedPath = personalMistakeForThisTopic
    ? buildWorksheetPath({ scope: "topic", subject, stream, topic: topic.slug, source, mistakeAware: true })
    : buildPracticePath({ scope: "topic", subject, stream, topic: topic.slug, mode: "predicted", source });
  const recommendedLabel = personalMistakeForThisTopic
    ? "Run mistake-aware worksheet"
    : "Practise predicted Qs";

  return (
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

          {/* Compact action bar */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              onClick={() => {
                handle();
                navigate(buildPracticePath({ scope: "topic", subject, stream, topic: topic.slug, mode: "practice-set", source }));
              }}
            >
              <Layers className="h-3.5 w-3.5" /> Practice
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                handle();
                navigate(buildWorksheetPath({ scope: "topic", subject, stream, topic: topic.slug, source }));
              }}
            >
              <ClipboardList className="h-3.5 w-3.5" /> Worksheet
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                handle();
                navigate(buildPracticePath({ scope: "topic", subject, stream, topic: topic.slug, mode: "predicted", source }));
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
                      buildPracticePath({ scope: "topic", subject, stream, topic: topic.slug, mode: "chapter-test", source }),
                      "open-chapter-test"
                    );
                  }}
                >
                  Chapter Test
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    handle();
                    gated(buildCheckPath({ topic: topic.slug, source }), "open-check");
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
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  handle();
                  navigate(buildPracticePath({ scope: "topic", subject, stream, topic: topic.slug, mode: "practice-set", source }));
                }}
              >
                Quick practice
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  handle();
                  navigate(buildWorksheetPath({ scope: "topic", subject, stream, topic: topic.slug, source }));
                }}
              >
                Worksheet
              </Button>
            </div>
          </div>
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

        {/* Progressive 3-section experience */}
        <Accordion type="multiple" defaultValue={["essentials"]} className="space-y-3">
          {/* A. Board Essentials — open by default */}
          <AccordionItem value="essentials" className="lt-card border-0 px-4">
            <AccordionTrigger className="py-3">
              <div className="flex items-center gap-2 text-left">
                <span className="font-display text-base font-semibold">Board Essentials</span>
                <Badge variant="secondary" className="rounded-full text-[10px]">{concepts.length || 0} concepts</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              {concepts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No concept previews available yet for this topic.</p>
              ) : (
                <div className="space-y-2">
                  {visibleConcepts.map((c, i) => (
                    <div key={i} className="rounded-lg border border-border/60 bg-background/50 p-3">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-sm font-medium">{c}</div>
                          <div className="mt-0.5 text-xs text-muted-foreground">
                            Boards reuse this — expect 2–3 mark direct or part of a bigger Q.
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="rounded-full text-[10px]">2–3 marks</Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              handle();
                              navigate(
                                buildPracticePath({ scope: "topic", subject, stream, topic: topic.slug, mode: "practice-set", source })
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
              )}
            </AccordionContent>
          </AccordionItem>

          {/* B. How boards use it — collapsed by default */}
          <AccordionItem value="boards" className="lt-card border-0 px-4">
            <AccordionTrigger className="py-3">
              <div className="flex items-center gap-2 text-left">
                <span className="font-display text-base font-semibold">How boards use it</span>
                <Badge variant="secondary" className="rounded-full text-[10px]">
                  {formulaCards.length} formula/use patterns
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              {/* Featured preview */}
              {featuredFormula ? (
                <div className="space-y-3">
                  <FormulaCard
                    item={featuredFormula}
                    onPractice={() => {
                      handle();
                      navigate(buildPracticePath({ scope: "topic", subject, stream, topic: topic.slug, mode: "practice-set", source }));
                    }}
                    onMiniDrill={() => {
                      handle();
                      navigate(buildWorksheetPath({ scope: "topic", subject, stream, topic: topic.slug, source }));
                    }}
                  />

                  {formulaCards.length > 1 && (
                    <Accordion type="single" collapsible>
                      <AccordionItem value="all-formulas" className="border-0">
                        <AccordionTrigger className="py-2 text-sm">
                          View formula use map ({formulaCards.length})
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            {formulaCards.slice(1).map((f, i) => (
                              <FormulaCard
                                key={i}
                                item={f}
                                onPractice={() => {
                                  handle();
                                  navigate(buildPracticePath({ scope: "topic", subject, stream, topic: topic.slug, mode: "practice-set", source }));
                                }}
                                onMiniDrill={() => {
                                  handle();
                                  navigate(buildWorksheetPath({ scope: "topic", subject, stream, topic: topic.slug, source }));
                                }}
                              />
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="combinations" className="border-0">
                        <AccordionTrigger className="py-2 text-sm">
                          Formula combinations
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="rounded-lg border border-border/60 bg-background/50 p-3 text-sm">
                            <div className="text-xs text-muted-foreground">Sample combined-use pattern</div>
                            <div className="mt-1">
                              Boards often chain {topic.name.toLowerCase()} with one earlier concept inside the same long answer.
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No formula previews available yet.</p>
              )}

              {/* HPQs compact card */}
              {hpqs.length > 0 && (
                <div className="mt-3 rounded-lg border border-border/60 bg-background/50 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-sm font-medium">Highly probable questions available</div>
                      <div className="text-xs text-muted-foreground">{hpqs.length} likely board-style Qs identified.</div>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        handle();
                        navigate(buildPracticePath({ scope: "topic", subject, stream, topic: topic.slug, mode: "predicted", source }));
                      }}
                    >
                      See HPQs
                    </Button>
                  </div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* C. Mistakes + next action */}
          <AccordionItem value="mistakes" className="lt-card border-0 px-4">
            <AccordionTrigger className="py-3">
              <div className="flex items-center gap-2 text-left">
                <span className="font-display text-base font-semibold">Mistakes &amp; next action</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="space-y-3">
                {visiblePitfalls.length > 0 && (
                  <div className="space-y-2">
                    {visiblePitfalls.map((p, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 text-amber-500" />
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="rounded-lg border border-border/60 bg-background/50 p-3">
                  <div className="text-xs text-muted-foreground">Examiner warning</div>
                  <div className="mt-0.5 text-sm">
                    Watch for sign errors and skipped steps — examiners cut marks for missing working even when the final answer is right.
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      handle();
                      navigate(buildPracticePath({ scope: "topic", subject, stream, topic: topic.slug, mode: "practice-set", source }));
                    }}
                  >
                    Run targeted drill
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      handle();
                      navigate(buildWorksheetPath({ scope: "topic", subject, stream, topic: topic.slug, source, mistakeAware: true }));
                    }}
                  >
                    Mistake-aware worksheet
                  </Button>
                  <Button size="sm" variant="ghost">
                    Review formula use
                  </Button>
                </div>

                {pitfalls.length > 1 && (
                  <Button size="sm" variant="ghost" onClick={() => setShowAllMistakes((s) => !s)}>
                    {showAllMistakes ? "Show fewer mistakes" : `Show more mistakes (${pitfalls.length - 1})`}
                  </Button>
                )}
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
              <dd className="font-medium">{likelySection}</dd>
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
              body={`${topic.blurb} In the board paper, this usually shows up in ${likelySection}.`}
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

        {/* Mistake intelligence (compact) only if relevant for THIS topic, else skip */}
        {personalMistakeForThisTopic && (
          <MistakeIntelligencePanel source="topicHub" compact bare />
        )}
      </aside>
    </div>
  );
}

function FormulaCard({
  item,
  onPractice,
  onMiniDrill,
}: {
  item: { q: string; type: string; marks: number };
  onPractice: () => void;
  onMiniDrill: () => void;
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-background/50 p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-sm font-medium">{item.q}</div>
          <ul className="mt-1.5 list-disc space-y-0.5 pl-4 text-xs text-muted-foreground">
            <li>When to use: when the question setup matches this pattern.</li>
            <li>Common trap: skipping a step or wrong sign in working.</li>
          </ul>
        </div>
        <Badge variant="outline" className="rounded-full text-[10px]">
          {item.type} · {item.marks}m
        </Badge>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <Button size="sm" variant="secondary" onClick={onPractice}>Practise this</Button>
        <Button size="sm" variant="ghost" onClick={onMiniDrill}>Generate mini-drill</Button>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="how" className="border-0">
            <AccordionTrigger className="py-1 text-xs">See how boards use this</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc space-y-1 pl-4 text-xs text-muted-foreground">
                <li>Direct use: standalone short-answer question.</li>
                <li>Hidden use: embedded inside a longer multi-step problem.</li>
                <li>Combined use: chained with one earlier concept in the same Q.</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
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
