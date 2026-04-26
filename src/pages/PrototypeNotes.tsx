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
          <h3 className="font-display text-lg font-semibold">Topic Hub Lite is the final UX pattern</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Topic Hub is a <em>support feature</em>, not the main product. It must never become a tutor/course page.</li>
            <li>Only Board Essentials open by default. "How boards use it" and "Mistakes &amp; next action" stay collapsed.</li>
            <li>First screen scannable within 10s: topic strip + weightage bar + 4 primary actions + recommended next.</li>
            <li>Right rail capped at 2 cards (Topic snapshot, Need a quick hand?). Optional 3rd card only if a personal mistake exists for this topic.</li>
          </ul>
        </section>

        <section>
          <h3 className="font-display text-lg font-semibold">Production content contract</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Topic Hub is fed by <code>buildActionableTopicHubContent(slug)</code> in <code>src/lib/topicHubContent.ts</code>.</li>
            <li>Output shape: <code>topicSnapshot</code>, <code>boardEssentials[]</code>, <code>formulaUsePreview</code>, <code>fullFormulaUseMap[]</code>, <code>hpqSummary</code>, <code>commonMistake</code>, <code>examinerWarning</code>, <code>isSamplePreview</code>.</li>
            <li>Seeded topics: Trigonometry, Triangles, Quadratic Equations, Coordinate Geometry, Surface Areas &amp; Volumes, Electricity, Light, Magnetic Effects, Chemical Reactions, Acids/Bases/Salts, Carbon, Life Processes, Heredity, Control &amp; Coordination.</li>
            <li>Other topics fall back to safe sample-preview content; UI flags this with a <em>Sample preview</em> badge in Board Essentials.</li>
            <li>Production should swap the seeded map with API-driven data without touching the UI.</li>
          </ul>
        </section>

        <section>
          <h3 className="font-display text-lg font-semibold">Parent-aware back navigation</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Component: <code>BackToParent</code> (small ghost link, never primary).</li>
            <li>Resolution priority: <code>returnTo</code> &gt; <code>source</code> &gt; <code>actionSource</code> from context &gt; fallback.</li>
            <li>Source mapping: trends → /app/trends; practice → /app/practice; worksheet → /app/practice/worksheet; check → /app/check; me → /app/me; home → /app; topicHub → previous page or /app/trends.</li>
            <li>Rendered on TopicHub, Practice, Worksheet, Check, and on Me when a returnTo/source exists.</li>
            <li>Never on Public landing or App Home top-level.</li>
          </ul>
        </section>

        <section>
          <h3 className="font-display text-lg font-semibold">source / returnTo route contract</h3>
          <ul className="list-disc pl-5 space-y-1 break-all">
            <li>All builders accept optional <code>returnTo</code>: <code>buildTopicPath</code>, <code>buildPracticePath</code>, <code>buildWorksheetPath</code>, <code>buildCheckPath</code>.</li>
            <li>Examples:
              <ul className="list-disc pl-5 mt-1">
                <li>Trends → Topic Hub: <code>/app/topic/trigonometry?source=trends&amp;returnTo=/app/trends</code></li>
                <li>Topic Hub → Practice: <code>/app/practice?...&amp;source=topicHub&amp;returnTo=/app/topic/trigonometry</code></li>
                <li>Worksheet → Check: <code>/app/check?topic=...&amp;source=worksheet&amp;returnTo=/app/practice/worksheet?...</code></li>
                <li>Me → Topic Hub: <code>/app/topic/...?source=me&amp;returnTo=/app/me</code></li>
              </ul>
            </li>
            <li>Login redirects continue to use <code>buildLoginPath</code> with the full target URL preserved.</li>
          </ul>
        </section>

        <section>
          <h3 className="font-display text-lg font-semibold">Me / Progress dashboard sources</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Charts: score trend (LineChart), mistake mix (PieChart), subject performance (BarChart), marks lost by topic (horizontal BarChart).</li>
            <li>Empty/logged-out states render <code>DashboardSkeleton</code> placeholders matching real chart shapes — no fake numbers.</li>
            <li>Recent attempts and weak-area links open Topic Hub with <code>source=me&amp;returnTo=/app/me</code>.</li>
          </ul>
        </section>

        <section>
          <h3 className="font-display text-lg font-semibold">Mistake Intelligence loop</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Flow: Check → Mistake Insight → Me → Topic Hub / Practice / Worksheet / Mock.</li>
            <li>No global toggle — surfaced as recommendation panel and per-action "Add mistake-focus" options.</li>
            <li>Copy convention: <em>Recommended, not required.</em></li>
          </ul>
        </section>

        <section>
          <h3 className="font-display text-lg font-semibold">Memory persistence</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>localStorage keys <code>lazytopper.memory.v1</code> (snapshot on signOut) and <code>lazytopper.active.v1</code> (live trial state).</li>
            <li>Resume UI gated by <code>isMeaningfulMemory()</code>.</li>
          </ul>
        </section>
      </article>
    </div>
  );
}
