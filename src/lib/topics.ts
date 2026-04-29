import type { Topic } from "./types";

export const TOPICS: Topic[] = [
  // ===== MATHS =====
  { slug: "real-numbers", name: "Real Numbers", subject: "Maths", stream: "All", weight: 6, trendTier: "medium", blurb: "Euclid's lemma, HCF/LCM, irrationals." },
  { slug: "polynomials", name: "Polynomials", subject: "Maths", stream: "All", weight: 6, trendTier: "medium", blurb: "Zeroes, division algorithm, relationships." },
  { slug: "pair-of-linear-equations", name: "Pair of Linear Equations", subject: "Maths", stream: "All", weight: 6, trendTier: "high", blurb: "Substitution, elimination, graphical." },
  { slug: "quadratic-equations", name: "Quadratic Equations", subject: "Maths", stream: "All", weight: 6, trendTier: "high", blurb: "Factorisation, formula, discriminant, word problems." },
  { slug: "arithmetic-progression", name: "Arithmetic Progression", subject: "Maths", stream: "All", weight: 5, trendTier: "high", blurb: "nth term, sum, application problems." },
  { slug: "triangles", name: "Triangles", subject: "Maths", stream: "All", weight: 7, trendTier: "high", blurb: "Similarity, BPT, area ratios, Pythagoras." },
  { slug: "coordinate-geometry", name: "Coordinate Geometry", subject: "Maths", stream: "All", weight: 6, trendTier: "high", blurb: "Distance, section formula, area of triangle." },
  { slug: "trigonometry", name: "Trigonometry", subject: "Maths", stream: "All", weight: 12, trendTier: "high", blurb: "Ratios, identities, applications, heights & distances." },
  { slug: "circles", name: "Circles", subject: "Maths", stream: "All", weight: 6, trendTier: "high", blurb: "Tangent properties, proofs from a point." },
  { slug: "areas-related-to-circles", name: "Areas Related to Circles", subject: "Maths", stream: "All", weight: 4, trendTier: "medium", blurb: "Sector, segment, combined figures." },
  { slug: "surface-areas-and-volumes", name: "Surface Areas and Volumes", subject: "Maths", stream: "All", weight: 7, trendTier: "high", blurb: "Combinations of solids, frustum, conversions." },
  { slug: "statistics", name: "Statistics", subject: "Maths", stream: "All", weight: 6, trendTier: "medium", blurb: "Mean, median, mode of grouped data, ogives." },
  { slug: "probability", name: "Probability", subject: "Maths", stream: "All", weight: 5, trendTier: "medium", blurb: "Classical probability, dice/cards/balls." },

  // ===== SCIENCE — CHEMISTRY =====
  { slug: "chemical-reactions-and-equations", name: "Chemical Reactions & Equations", subject: "Science", stream: "Chemistry", weight: 6, trendTier: "high", blurb: "Balancing, types of reactions, redox." },
  { slug: "acids-bases-and-salts", name: "Acids Bases & Salts", subject: "Science", stream: "Chemistry", weight: 6, trendTier: "high", blurb: "pH, indicators, common salts, reactions." },
  { slug: "metals-and-non-metals", name: "Metals & Non-metals", subject: "Science", stream: "Chemistry", weight: 6, trendTier: "high", blurb: "Reactivity series, extraction, corrosion." },
  { slug: "carbon-and-its-compounds", name: "Carbon & its Compounds", subject: "Science", stream: "Chemistry", weight: 7, trendTier: "high", blurb: "Bonding, IUPAC, functional groups, soaps." },

  // ===== SCIENCE — PHYSICS =====
  { slug: "light-reflection-and-refraction", name: "Light - Reflection & Refraction", subject: "Science", stream: "Physics", weight: 7, trendTier: "high", blurb: "Mirrors, lenses, formulae, ray diagrams." },
  { slug: "human-eye-and-colourful-world", name: "Human Eye & Colourful World", subject: "Science", stream: "Physics", weight: 5, trendTier: "medium", blurb: "Defects, dispersion, scattering." },
  { slug: "electricity", name: "Electricity", subject: "Science", stream: "Physics", weight: 7, trendTier: "high", blurb: "Ohm's law, resistor combinations, power." },
  { slug: "magnetic-effects-of-electric-current", name: "Magnetic Effects of Electric Current", subject: "Science", stream: "Physics", weight: 6, trendTier: "high", blurb: "Field lines, Fleming's rules, motors, generators." },

  // ===== SCIENCE — BIOLOGY =====
  { slug: "life-processes", name: "Life Processes", subject: "Science", stream: "Biology", weight: 8, trendTier: "high", blurb: "Nutrition, respiration, transport, excretion." },
  { slug: "control-and-coordination", name: "Control & Coordination", subject: "Science", stream: "Biology", weight: 6, trendTier: "high", blurb: "Nervous system, hormones, plant tropisms." },
  { slug: "how-do-organisms-reproduce", name: "How do Organisms Reproduce", subject: "Science", stream: "Biology", weight: 6, trendTier: "medium", blurb: "Reproduction modes, human reproductive system." },
  { slug: "heredity", name: "Heredity", subject: "Science", stream: "Biology", weight: 5, trendTier: "medium", blurb: "Mendel, inheritance, sex determination." },
  { slug: "our-environment", name: "Our Environment", subject: "Science", stream: "Biology", weight: 4, trendTier: "low", blurb: "Ecosystems, food chains, ozone, waste." },
];

// Slug aliases — map external/legacy slugs to the canonical locked slugs.
export const SLUG_ALIASES: Record<string, string> = {
  "trigonometry-heights-distances": "trigonometry",
  "introduction-to-trigonometry": "trigonometry",
  "some-applications-of-trigonometry": "trigonometry",
  "acids-bases-salts": "acids-bases-and-salts",
  "light-reflection-refraction": "light-reflection-and-refraction",
  "pair-of-linear-equations-in-two-variables": "pair-of-linear-equations",
  "arithmetic-progressions": "arithmetic-progression",
};

export function resolveSlug(slug: string | null | undefined): string | undefined {
  if (!slug) return undefined;
  return SLUG_ALIASES[slug] ?? slug;
}

export function topicBySlug(slug: string | null | undefined) {
  if (!slug) return undefined;
  const canonical = SLUG_ALIASES[slug] ?? slug;
  return TOPICS.find((t) => t.slug === canonical);
}

export function topicsBySubject(subject: "Maths" | "Science", stream: "All" | "Physics" | "Chemistry" | "Biology" = "All") {
  return TOPICS.filter((t) => {
    if (t.subject !== subject) return false;
    if (subject === "Science" && stream !== "All") return t.stream === stream;
    return true;
  });
}

export function displayTopicNames(slugs: string[]): string[] {
  return slugs.map((s) => topicBySlug(s)?.name ?? s);
}
