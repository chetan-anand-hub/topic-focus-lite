import { ContextBar } from "@/components/ContextBar";

/**
 * Implementation handoff documentation.
 * Hidden from student-facing UI.
 */
export default function PrototypeNotes() {
  return (
    <div className="space-y-5">
      <ContextBar title="Implementation notes" subtitle="Engineering handoff. Hidden from student-facing UI." compact />
      <article className="lt-card p-6 prose prose-sm max-w-none text-sm space-y-5 text-foreground/90">
        <section>
          <h3 className="font-display text-lg font-semibold">Memory persistence</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>localStorage keys <code>lazytopper.memory.v1</code> (snapshot on signOut) and <code>lazytopper.active.v1</code> (live trial state).</li>
            <li>Persisted fields: auth, lastRoute, subject, stream, topicSlug, selectedTopicSlugs, paperScope, mode, mistakeAwareEnabled, lastAttempt, mistakeInsight, attemptHistory.</li>
            <li>Logout flow: snapshot → memory store → clear active session → navigate to public landing.</li>
            <li>Resume UI is gated by <code>isMeaningfulMemory()</code>.</li>
          </ul>
        </section>

        <section>
          <h3 className="font-display text-lg font-semibold">Mistake Intelligence UX</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>No global "Use mistake intelligence" toggle anywhere in the student UI.</li>
            <li>Surfaced as a contextual recommendation panel + per-action options.</li>
            <li>Copy convention: "Recommended, not required."</li>
          </ul>
        </section>

        <section>
          <h3 className="font-display text-lg font-semibold">Topic Hub — progressive disclosure</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Lightweight support cockpit, not a lesson page.</li>
            <li>First screen: compact topic strip + weightage visual + 3 board essentials + 1 next action + compact latest-mistake (only if relevant).</li>
            <li>Three sections via Accordion: Board Essentials (default open), How boards use it (collapsed preview), Mistakes &amp; next action (compact, default open).</li>
            <li>Compact action bar with 4 visible actions (Practice / Worksheet / Predicted Qs / Add to selection); Chapter Test &amp; Check Answers under "More".</li>
            <li>Right rail limited to 2 cards: Topic snapshot, Need a quick hand?</li>
          </ul>
        </section>

        <section>
          <h3 className="font-display text-lg font-semibold">Topic Hub schema (lib/topicHubContent.ts)</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li><code>keyBoardConcepts[]</code>, <code>useCards[]</code> (formula or definition), <code>problemPatterns[]</code>, <code>commonMistakes[]</code>, <code>examinerNotes</code>, optional <code>miniCheck</code>.</li>
            <li>Fallback shape via <code>getTopicHubContent()</code> for topics without rich content.</li>
          </ul>
        </section>

        <section>
          <h3 className="font-display text-lg font-semibold">Gated redirect contract</h3>
          <ul className="list-disc pl-5 space-y-1 break-all">
            <li>/app/login?reason=&lt;reason&gt;&amp;redirect=&lt;encodedFullPathWithQuery&gt;</li>
            <li>All gated CTAs use <code>buildLoginPath</code>.</li>
          </ul>
        </section>
      </article>
    </div>
  );
}
