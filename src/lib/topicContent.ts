// Topic-specific sample content for previews.

export interface TopicSampleQuestion {
  q: string;
  type: "MCQ" | "Short" | "Long" | "Case-based" | "Assertion-Reason" | "Numerical" | "Proof" | "Diagram";
  marks: number;
}

export interface TopicSample {
  hpqs: string[];
  examples: TopicSampleQuestion[];
  pitfalls: string[];
  highROI: string[];
}

export const TOPIC_CONTENT: Record<string, TopicSample> = {
  "trigonometry": {
    hpqs: [
      "Prove: (sinθ + cosecθ)² + (cosθ + secθ)² = 7 + tan²θ + cot²θ",
      "If sinθ + cosθ = √2 cosθ, find tanθ.",
      "From a point 30 m from base of a tower, angle of elevation is 60°. Find the height.",
    ],
    examples: [
      { q: "Evaluate sin30° · cos60° + cos30° · sin60°.", type: "Short", marks: 2 },
      { q: "Prove identity: (1 + tan²A)/(1 + cot²A) = tan²A.", type: "Proof", marks: 3 },
      { q: "Heights & distances: angle of depression problem from cliff.", type: "Long", marks: 5 },
    ],
    pitfalls: ["Sign errors in identity proofs", "Forgetting to convert tan→sin/cos", "Mixing degree/radian"],
    highROI: ["Identity proofs (Section C)", "Heights & distances (Section D)", "Specific values table"],
  },
  "triangles": {
    hpqs: [
      "Prove BPT (Basic Proportionality Theorem) and use it for a similar triangles problem.",
      "Areas of similar triangles ratio question.",
      "Pythagoras converse application.",
    ],
    examples: [
      { q: "If DE ∥ BC and AD/DB = 3/5, find DE/BC.", type: "Short", marks: 2 },
      { q: "Prove: ratio of areas of similar triangles equals square of ratio of sides.", type: "Proof", marks: 5 },
    ],
    pitfalls: ["Mismatching corresponding sides", "Forgetting AA criterion conditions"],
    highROI: ["BPT proof", "Similarity ratio problems"],
  },
  "circles": {
    hpqs: [
      "Tangent at any point of a circle is perpendicular to the radius — prove and apply.",
      "Two tangents from an external point are equal — prove.",
      "Quadrilateral circumscribing a circle — opposite sides sum equal.",
    ],
    examples: [
      { q: "PA and PB are tangents from external point P. ∠APB = 80°, find ∠OAB.", type: "Short", marks: 3 },
      { q: "Prove tangents from external point are equal.", type: "Proof", marks: 4 },
    ],
    pitfalls: ["Confusing tangent length vs chord", "Wrong angle at centre vs circumference"],
    highROI: ["Tangent proofs", "External point problems"],
  },
  "coordinate-geometry": {
    hpqs: [
      "Section formula: find ratio in which point divides a line segment.",
      "Area of triangle from vertices.",
      "Find point equidistant from two given points.",
    ],
    examples: [
      { q: "Find distance between (3,4) and (-2,1).", type: "Short", marks: 2 },
      { q: "Find ratio in which (1,2) divides line joining (-3,4) and (5,-2).", type: "Long", marks: 4 },
    ],
    pitfalls: ["Sign mistakes in section formula", "Forgetting absolute value in area formula"],
    highROI: ["Section formula", "Distance applications"],
  },
  "surface-areas-and-volumes": {
    hpqs: [
      "Frustum of a cone — surface area and volume.",
      "Cone on hemisphere combined solid.",
      "Conversion of solids (melting and recasting).",
    ],
    examples: [
      { q: "A cone of radius 7 cm, height 24 cm — find slant height and CSA.", type: "Short", marks: 3 },
      { q: "Frustum bucket volume problem.", type: "Long", marks: 5 },
    ],
    pitfalls: ["Wrong formula for frustum", "Mixing up CSA vs TSA"],
    highROI: ["Combined solids", "Frustum word problems"],
  },
  "quadratic-equations": {
    hpqs: [
      "Solve by quadratic formula and verify discriminant nature.",
      "Word problem: speed-time-distance leading to quadratic.",
      "Prove a real-life situation is quadratic and solve.",
    ],
    examples: [
      { q: "Solve x² - 5x + 6 = 0 by factorisation.", type: "Short", marks: 2 },
      { q: "Boat upstream/downstream word problem.", type: "Long", marks: 5 },
    ],
    pitfalls: ["Sign errors in factorisation", "Discriminant interpretation"],
    highROI: ["Word problems", "Discriminant questions"],
  },
  "real-numbers": {
    hpqs: ["Prove √2 (or √3, √5) is irrational.", "HCF/LCM problem from word context.", "Apply Fundamental Theorem of Arithmetic."],
    examples: [
      { q: "Prove √5 is irrational.", type: "Proof", marks: 3 },
      { q: "Find HCF and LCM of 96 and 404 by prime factorisation.", type: "Short", marks: 3 },
    ],
    pitfalls: ["Skipping contradiction setup in irrationality proofs"],
    highROI: ["Irrationality proof", "HCF/LCM"],
  },
  "polynomials": {
    hpqs: ["Find zeroes and verify relationship with coefficients.", "Division algorithm application."],
    examples: [
      { q: "Find zeroes of x² - 7x + 10.", type: "Short", marks: 2 },
      { q: "Verify relationship of zeroes for given polynomial.", type: "Long", marks: 4 },
    ],
    pitfalls: ["Sign confusion in sum/product of roots"],
    highROI: ["Sum/product relationships"],
  },
  "pair-of-linear-equations": {
    hpqs: ["Word problem leading to two equations.", "Graphical solution and consistency check."],
    examples: [
      { q: "Solve by elimination: 2x + 3y = 12, 4x - y = 5.", type: "Short", marks: 3 },
      { q: "Age/cost word problem.", type: "Long", marks: 5 },
    ],
    pitfalls: ["Misreading word problems", "Algebraic errors in elimination"],
    highROI: ["Word problems", "Elimination method"],
  },
  "arithmetic-progression": {
    hpqs: ["Sum of n terms application.", "Find nth term given two terms."],
    examples: [
      { q: "Find 20th term of AP: 5, 8, 11, ...", type: "Short", marks: 2 },
      { q: "Sum of first 25 multiples of 7.", type: "Long", marks: 4 },
    ],
    pitfalls: ["Wrong identification of a and d", "Off-by-one in n"],
    highROI: ["Sum problems", "Word problems"],
  },
  "areas-related-to-circles": {
    hpqs: ["Area of segment with given angle.", "Combined figure area."],
    examples: [{ q: "Find area of sector with r=14 cm, θ=60°.", type: "Short", marks: 2 }],
    pitfalls: ["Forgetting to subtract triangle for segment"],
    highROI: ["Sector and segment", "Combined figures"],
  },
  "statistics": {
    hpqs: ["Mean of grouped data by step-deviation.", "Mode/Median from frequency table.", "Ogive interpretation."],
    examples: [{ q: "Find mean by direct method for given frequency table.", type: "Long", marks: 4 }],
    pitfalls: ["Incorrect class marks", "Mixing formulas"],
    highROI: ["Mean by step-deviation", "Median formula"],
  },
  "probability": {
    hpqs: ["Card / dice / ball problems.", "Probability with replacement vs without."],
    examples: [{ q: "Probability of drawing a king from a deck of 52 cards.", type: "Short", marks: 2 }],
    pitfalls: ["Counting sample space wrong"],
    highROI: ["Cards & dice"],
  },

  "chemical-reactions-and-equations": {
    hpqs: [
      "Balance: Fe + H₂O → Fe₃O₄ + H₂",
      "Identify type: combination, decomposition, displacement, redox.",
      "Write balanced equation with state symbols.",
    ],
    examples: [
      { q: "Balance Pb(NO₃)₂ → PbO + NO₂ + O₂", type: "Short", marks: 2 },
      { q: "Define oxidation and reduction with example.", type: "Long", marks: 3 },
    ],
    pitfalls: ["Forgetting state symbols", "Imbalanced atoms after balancing"],
    highROI: ["Balancing", "Reaction types"],
  },
  "acids-bases-and-salts": {
    hpqs: ["pH and indicators.", "Preparation and uses of NaOH, bleaching powder, baking soda."],
    examples: [{ q: "Why does dry HCl gas not change colour of dry litmus?", type: "Short", marks: 2 }],
    pitfalls: ["Confusing pH > 7 with acidic"],
    highROI: ["Salts uses", "pH scale"],
  },
  "metals-and-non-metals": {
    hpqs: ["Reactivity series application.", "Extraction of metals (low/medium/high reactivity)."],
    examples: [{ q: "Why is sodium kept under kerosene?", type: "Short", marks: 2 }],
    pitfalls: ["Mixing extraction methods"],
    highROI: ["Extraction", "Corrosion prevention"],
  },
  "carbon-and-its-compounds": {
    hpqs: ["IUPAC naming with functional groups.", "Soaps vs detergents.", "Combustion and oxidation reactions."],
    examples: [
      { q: "Name CH₃-CH₂-CHO using IUPAC.", type: "Short", marks: 2 },
      { q: "Differentiate soap vs detergent action in hard water.", type: "Long", marks: 3 },
    ],
    pitfalls: ["Wrong suffix for functional group", "Counting C atoms incorrectly"],
    highROI: ["IUPAC", "Functional groups"],
  },

  "light-reflection-and-refraction": {
    hpqs: ["Mirror formula numericals.", "Lens formula numericals.", "Ray diagrams for concave/convex mirror & lens."],
    examples: [
      { q: "Object 10 cm from concave mirror f=15 cm. Find image.", type: "Numerical", marks: 3 },
      { q: "Draw ray diagram: object between F and 2F of convex lens.", type: "Diagram", marks: 3 },
    ],
    pitfalls: ["Sign convention errors", "Incorrect ray paths in diagram"],
    highROI: ["Mirror/lens numericals", "Ray diagrams"],
  },
  "human-eye-and-colourful-world": {
    hpqs: ["Defects of vision and corrections.", "Dispersion through prism.", "Why sky is blue / sunset reddish."],
    examples: [{ q: "Explain myopia and its correction with diagram.", type: "Long", marks: 3 }],
    pitfalls: ["Confusing convex vs concave for myopia/hypermetropia"],
    highROI: ["Defects & lenses", "Scattering"],
  },
  "electricity": {
    hpqs: [
      "Equivalent resistance series + parallel combination.",
      "Ohm's law numerical with V, I, R.",
      "Power and energy consumption problem.",
    ],
    examples: [
      { q: "Three resistors 6Ω, 6Ω, 6Ω connected in parallel — find R_eq.", type: "Numerical", marks: 2 },
      { q: "Bulb rated 60 W, 220 V — find resistance and current.", type: "Numerical", marks: 3 },
    ],
    pitfalls: ["Unit conversion errors (mA vs A)", "Wrong formula for parallel", "Forgetting to add then invert"],
    highROI: ["Resistor combinations", "Power & energy"],
  },
  "magnetic-effects-of-electric-current": {
    hpqs: ["Fleming's left-hand and right-hand rule.", "Working of electric motor / generator.", "Solenoid field pattern."],
    examples: [{ q: "State Fleming's left-hand rule with diagram.", type: "Short", marks: 2 }],
    pitfalls: ["Mixing left-hand vs right-hand rule"],
    highROI: ["Motor/Generator", "Fleming's rules"],
  },

  "life-processes": {
    hpqs: [
      "Diagram: human alimentary canal with labels.",
      "Diagram: human heart, double circulation.",
      "Diagram: nephron with labels.",
    ],
    examples: [
      { q: "Differentiate aerobic vs anaerobic respiration.", type: "Short", marks: 3 },
      { q: "Describe transport of water in plants.", type: "Long", marks: 5 },
    ],
    pitfalls: ["Missing diagram labels", "Skipping keywords (e.g. 'pulmonary')"],
    highROI: ["Diagrams + labels", "Comparisons"],
  },
  "control-and-coordination": {
    hpqs: ["Reflex action with arc diagram.", "Hormones in humans table.", "Plant hormones and tropisms."],
    examples: [{ q: "Draw and label reflex arc.", type: "Diagram", marks: 3 }],
    pitfalls: ["Confusing hormone functions"],
    highROI: ["Reflex arc", "Hormone table"],
  },
  "how-do-organisms-reproduce": {
    hpqs: ["Diagram: human male/female reproductive system.", "Modes of asexual reproduction with examples."],
    examples: [{ q: "Differentiate self vs cross pollination.", type: "Short", marks: 2 }],
    pitfalls: ["Missing parts in reproductive system diagram"],
    highROI: ["Diagrams", "Asexual modes"],
  },
  "heredity": {
    hpqs: ["Mendel's monohybrid cross.", "Sex determination in humans.", "Inherited vs acquired traits."],
    examples: [{ q: "Show monohybrid cross between TT and tt — give F1 and F2 ratios.", type: "Long", marks: 4 }],
    pitfalls: ["Wrong gametes", "Mixing genotype vs phenotype ratios"],
    highROI: ["Mendel cross", "Sex determination"],
  },
  "our-environment": {
    hpqs: ["Food chain & trophic levels.", "Ozone depletion causes.", "Biodegradable vs non-biodegradable."],
    examples: [{ q: "Why are crop fields considered artificial ecosystems?", type: "Short", marks: 2 }],
    pitfalls: ["Confusing food chain vs food web"],
    highROI: ["Trophic levels", "Ozone & CFCs"],
  },
};

export function getTopicSample(slug: string): TopicSample {
  return (
    TOPIC_CONTENT[slug] ?? {
      hpqs: ["Sample preview — content for this topic will appear here."],
      examples: [{ q: "Sample preview question for this topic.", type: "Short", marks: 2 }],
      pitfalls: ["Sample preview — common mistakes will be listed here."],
      highROI: ["Sample preview — high-ROI revision items will appear here."],
    }
  );
}
