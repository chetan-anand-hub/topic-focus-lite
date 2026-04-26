// Production-ready Topic Hub Lite content contract.
// Adapter: buildActionableTopicHubContent(slug) returns a normalised payload
// the Topic Hub Lite UI consumes. Seeded for high-priority topics; safe
// "Sample preview" fallback for the rest.

import { topicBySlug } from "./topics";
import { TOPIC_CONTENT, type TopicSampleQuestion } from "./topicContent";

export interface BoardConcept {
  name: string;
  oneLineUse: string;
  marks: string;
}

export interface FormulaUseCard {
  kind: "formula" | "definition";
  /** Short label e.g. "sin²θ + cos²θ = 1" or "Ohm's Law (V = IR)" */
  title: string;
  whenToUse: string[]; // max 2 bullets
  commonTrap: string;
  directUse?: string;
  hiddenUse?: string;
  combinedUse?: string;
}

export interface ActionableTopicHubContent {
  topicSnapshot: {
    likelySection: string;
    examinerNotes: string;
  };
  boardEssentials: BoardConcept[];
  formulaUsePreview: FormulaUseCard;
  fullFormulaUseMap: FormulaUseCard[];
  hpqSummary: { count: number; label: string };
  commonMistake: string;
  examinerWarning: string;
  isSamplePreview: boolean;
}

const SEEDS: Record<string, Partial<ActionableTopicHubContent>> = {
  trigonometry: {
    boardEssentials: [
      { name: "sin²θ + cos²θ = 1", oneLineUse: "Identity proofs and simplifying mixed sin/cos terms.", marks: "2–3m" },
      { name: "Specific value table", oneLineUse: "Direct evaluation Qs in Section A.", marks: "1–2m" },
      { name: "Heights & distances", oneLineUse: "Long answer with angle of elevation/depression.", marks: "5m" },
      { name: "tanθ = sinθ / cosθ", oneLineUse: "Rewriting steps inside identity proofs.", marks: "2–3m" },
      { name: "1 + tan²θ = sec²θ", oneLineUse: "Combined-use inside multi-step proofs.", marks: "3m" },
    ],
    formulaUsePreview: {
      kind: "formula",
      title: "sin²θ + cos²θ = 1",
      whenToUse: [
        "sin² and cos² appear together in the question.",
        "Identity proof or simplification needed.",
      ],
      commonTrap: "Changing both sides of an identity instead of one — or a sign error mid-step.",
      directUse: "Simplify expressions where both sin² and cos² are present.",
      hiddenUse: "Embedded as a single step inside a longer identity transformation.",
      combinedUse: "Used together with tanθ = sinθ/cosθ and 1 + tan²θ = sec²θ.",
    },
    examinerWarning:
      "Marks come from the identity used, the logical steps shown, the simplification, and the final conclusion.",
    commonMistake: "Changing both sides of an identity, or losing the negative sign during expansion.",
  },

  electricity: {
    boardEssentials: [
      { name: "Ohm's Law (V = IR)", oneLineUse: "1m definition · 2m relation · 3m numerical.", marks: "1–3m" },
      { name: "Series & parallel R_eq", oneLineUse: "Frequent 2–3m calculation Q.", marks: "2–3m" },
      { name: "Power & energy (P = VI)", oneLineUse: "Bulb / appliance numericals.", marks: "3m" },
      { name: "Heating effect (H = I²Rt)", oneLineUse: "Long-answer numerical with units.", marks: "3–5m" },
    ],
    formulaUsePreview: {
      kind: "formula",
      title: "Ohm's Law — V = IR (at constant temperature)",
      whenToUse: [
        "Current is directly proportional to potential difference across a conductor.",
        "Numericals asking for V, I or R given the other two.",
      ],
      commonTrap: "Forgetting the constant-temperature condition or dropping the unit in the final answer.",
      directUse: "1-mark definition asking for the law statement with conditions.",
      hiddenUse: "2-mark V–I graph interpretation question.",
      combinedUse: "3-mark numerical chaining V = IR with series/parallel R_eq.",
    },
    examinerWarning:
      "Marks come from formula, substitution, calculation, and final answer with the correct unit.",
    commonMistake: "Missing unit in the final answer or omitting the constant-temperature condition.",
  },

  "life-processes": {
    boardEssentials: [
      { name: "Photosynthesis equation", oneLineUse: "Definition + balanced word/chemical equation.", marks: "2–3m" },
      { name: "Human alimentary canal", oneLineUse: "Labelled diagram, 5-mark Section D.", marks: "5m" },
      { name: "Double circulation", oneLineUse: "Labelled heart diagram + explanation.", marks: "3–5m" },
      { name: "Nephron structure", oneLineUse: "Labelled diagram + filtration function.", marks: "3–5m" },
    ],
    formulaUsePreview: {
      kind: "definition",
      title: "Photosynthesis — keyword-complete definition",
      whenToUse: [
        "1m definition asking for the process.",
        "3m diagram + function explanation.",
      ],
      commonTrap: "Vague wording or skipping keywords like 'chlorophyll', 'sunlight', 'CO₂', 'glucose'.",
      directUse: "1-mark direct definition.",
      hiddenUse: "Inside a 3-mark diagram-based question on the leaf.",
      combinedUse: "Linked with respiration in a 5-mark comparison question.",
    },
    examinerWarning:
      "Marks come from correct keywords, a labelled diagram, and a complete function explanation.",
    commonMistake: "Vague wording or missing diagram labels.",
  },

  triangles: {
    formulaUsePreview: {
      kind: "formula",
      title: "Basic Proportionality Theorem (BPT)",
      whenToUse: [
        "A line is drawn parallel to one side of a triangle.",
        "Ratios of intercepted segments are asked.",
      ],
      commonTrap: "Mismatching corresponding sides when applying similarity.",
    },
    examinerWarning:
      "Marks come from stated theorem, correct correspondence of sides, and final ratio with justification.",
    commonMistake: "Mismatching corresponding sides; forgetting the AA criterion check.",
  },

  "quadratic-equations": {
    formulaUsePreview: {
      kind: "formula",
      title: "Discriminant: D = b² − 4ac",
      whenToUse: [
        "Asked about the nature of roots without solving.",
        "Need to verify real / equal / no real roots.",
      ],
      commonTrap: "Sign errors substituting b and c, or misreading 'real and equal' vs 'real and distinct'.",
    },
    examinerWarning:
      "Marks come from formula, substitution, calculation of D, and the conclusion about nature of roots.",
    commonMistake: "Sign errors in factorisation or wrong conclusion from discriminant value.",
  },

  "coordinate-geometry": {
    formulaUsePreview: {
      kind: "formula",
      title: "Section formula — internal division",
      whenToUse: [
        "Point divides a line segment in a given ratio.",
        "Need to find the ratio given the dividing point.",
      ],
      commonTrap: "Sign mistake in (m·x₂ + n·x₁) / (m + n) — swapping m and n.",
    },
    examinerWarning:
      "Marks come from formula, correct substitution with signs, simplification, and final coordinates.",
    commonMistake: "Sign mistakes in section formula; forgetting absolute value in area.",
  },

  "surface-areas-and-volumes": {
    formulaUsePreview: {
      kind: "formula",
      title: "Frustum: V = ⅓πh(r₁² + r₂² + r₁r₂)",
      whenToUse: [
        "Bucket / glass / lampshade word problems.",
        "Combined solid involves a frustum section.",
      ],
      commonTrap: "Confusing CSA with TSA, or using cone formula instead of frustum.",
    },
    examinerWarning: "Marks come from correct formula choice, substitution, calculation, and unit.",
    commonMistake: "Wrong formula for frustum; mixing CSA vs TSA.",
  },

  "light-reflection-and-refraction": {
    formulaUsePreview: {
      kind: "formula",
      title: "Mirror formula: 1/v + 1/u = 1/f",
      whenToUse: [
        "Image distance, object distance, or focal length numerical.",
        "Sign convention applied for concave/convex mirrors.",
      ],
      commonTrap: "Sign-convention errors — distances measured from pole are negative when on object side.",
    },
    examinerWarning:
      "Marks come from sign convention, formula, substitution, calculation, and nature of image.",
    commonMistake: "Sign convention errors; incorrect ray paths in diagrams.",
  },

  "magnetic-effects-of-electric-current": {
    formulaUsePreview: {
      kind: "definition",
      title: "Fleming's left-hand rule",
      whenToUse: [
        "Direction of force on a current-carrying conductor in a magnetic field.",
        "Working principle of an electric motor.",
      ],
      commonTrap: "Confusing left-hand (motor) with right-hand (generator) rule.",
    },
    examinerWarning:
      "Marks come from rule statement, finger assignment, and correct direction with diagram.",
    commonMistake: "Mixing left-hand and right-hand rules.",
  },

  "chemical-reactions-and-equations": {
    formulaUsePreview: {
      kind: "definition",
      title: "Balancing chemical equations",
      whenToUse: [
        "Skeleton equation given — balance atoms on both sides.",
        "Add state symbols (s), (l), (g), (aq).",
      ],
      commonTrap: "Forgetting state symbols or leaving atoms unbalanced after coefficient change.",
    },
    examinerWarning:
      "Marks come from balanced atoms, correct state symbols, and reaction-type identification.",
    commonMistake: "Forgetting state symbols; imbalanced atoms after balancing.",
  },

  "acids-bases-and-salts": {
    formulaUsePreview: {
      kind: "definition",
      title: "pH scale — acidic, neutral, basic",
      whenToUse: [
        "1m or 2m question on pH ranges and colour change.",
        "Identify nature of a salt from pH given.",
      ],
      commonTrap: "Confusing pH > 7 (basic) with acidic, or misreading neutralisation products.",
    },
    examinerWarning: "Marks come from correct pH range, indicator colour, and nature of solution.",
    commonMistake: "Confusing pH > 7 with acidic; wrong indicator colour.",
  },

  "carbon-and-its-compounds": {
    formulaUsePreview: {
      kind: "definition",
      title: "IUPAC naming with functional groups",
      whenToUse: [
        "Name a given organic compound.",
        "Identify functional group and its position.",
      ],
      commonTrap: "Wrong suffix for functional group (-ol vs -al vs -one) or miscounting carbon atoms.",
    },
    examinerWarning:
      "Marks come from carbon-chain count, correct suffix, and locant for the functional group.",
    commonMistake: "Wrong suffix for functional group; miscounting carbons.",
  },

  heredity: {
    formulaUsePreview: {
      kind: "definition",
      title: "Mendel's monohybrid cross",
      whenToUse: [
        "Cross between two pure parents (TT × tt) — give F1 and F2.",
        "Asked for genotype and phenotype ratios.",
      ],
      commonTrap: "Wrong gametes or mixing up genotype (1:2:1) with phenotype (3:1) ratio.",
    },
    examinerWarning:
      "Marks come from correct gametes, Punnett square, and clear genotype/phenotype ratio.",
    commonMistake: "Wrong gametes; mixing genotype vs phenotype ratios.",
  },

  "control-and-coordination": {
    formulaUsePreview: {
      kind: "definition",
      title: "Reflex arc — labelled diagram",
      whenToUse: [
        "3m diagram + flow of impulse explanation.",
        "Differentiate reflex action from voluntary action.",
      ],
      commonTrap: "Missing labels (receptor, sensory neuron, spinal cord, motor neuron, effector).",
    },
    examinerWarning:
      "Marks come from labelled arc, direction of impulse, and definition of reflex action.",
    commonMistake: "Missing labels; confusing hormone functions in the related Q.",
  },
};

function defaultBoardEssentials(slug: string): BoardConcept[] {
  const sample = TOPIC_CONTENT[slug];
  if (sample?.highROI?.length) {
    return sample.highROI.slice(0, 5).map((name) => ({
      name,
      oneLineUse: "Boards reuse this — expect 2–3 mark direct or part of a bigger Q.",
      marks: "2–3m",
    }));
  }
  return [{ name: "Sample preview — concepts will appear here.", oneLineUse: "Sample preview.", marks: "—" }];
}

function defaultFormulaCard(slug: string): FormulaUseCard {
  const sample = TOPIC_CONTENT[slug];
  const first: TopicSampleQuestion | undefined = sample?.examples?.[0];
  return {
    kind: "formula",
    title: first?.q ?? "Sample preview — formula or definition will appear here.",
    whenToUse: [
      "When the question setup matches this pattern.",
      "When this is the most efficient route to the answer.",
    ],
    commonTrap: sample?.pitfalls?.[0] ?? "Sample preview — common trap will appear here.",
  };
}

function defaultFullMap(slug: string): FormulaUseCard[] {
  const sample = TOPIC_CONTENT[slug];
  if (!sample?.examples?.length) return [];
  return sample.examples.slice(1, 4).map((e) => ({
    kind: "formula" as const,
    title: e.q,
    whenToUse: ["When the question matches this setup.", "When this is the most efficient route."],
    commonTrap: "Skipping a step or sign error in working.",
  }));
}

export function buildActionableTopicHubContent(slug: string): ActionableTopicHubContent {
  const topic = topicBySlug(slug);
  const seed = SEEDS[slug] ?? {};
  const sample = TOPIC_CONTENT[slug];
  const isSeeded = !!SEEDS[slug];

  const weight = topic?.weight ?? 0;
  const likelySection =
    weight >= 7 ? "Section C / D" : weight >= 5 ? "Section B / C" : "Section A / B";

  return {
    topicSnapshot: {
      likelySection,
      examinerNotes:
        seed.examinerWarning ??
        "Marks come from the formula/definition, working steps, and a clearly stated final answer.",
    },
    boardEssentials: seed.boardEssentials ?? defaultBoardEssentials(slug),
    formulaUsePreview: seed.formulaUsePreview ?? defaultFormulaCard(slug),
    fullFormulaUseMap: seed.fullFormulaUseMap ?? defaultFullMap(slug),
    hpqSummary: {
      count: sample?.hpqs?.length ?? 0,
      label: "Highly probable questions available",
    },
    commonMistake: seed.commonMistake ?? sample?.pitfalls?.[0] ?? "Sample preview — common mistake will appear here.",
    examinerWarning:
      seed.examinerWarning ??
      "Watch for sign errors and skipped steps — examiners cut marks for missing working even when the final answer is right.",
    isSamplePreview: !isSeeded,
  };
}
