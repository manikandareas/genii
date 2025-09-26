import { Doc } from "./_generated/dataModel";
import { MutationCtx, QueryCtx } from "./_generated/server";

export const ensureAuthenticated = async (ctx: QueryCtx | MutationCtx) => {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    return null;
  }

  return identity;
};

export const ensureAdmin = async (ctx: QueryCtx | MutationCtx) => {
  const identity = await ensureAuthenticated(ctx);

  if (!identity || identity.role !== "admin") {
    return null;
  }

  return identity;
};

// ===== Types sesuai input terbaru =====
type Level = "beginner" | "intermediate" | "advanced";
type FocusArea =
  | "web-development"
  | "mobile-development"
  | "ui-ux-design"
  | "data-science"
  | "cloud-computing"
  | "devops";

type Prefs = {
  explanationStyle?: string;
  languagePreference?: "id" | "en";
  level?: Level;
  // NOTE: learningGoals di sini adalah daftar focus area (bukan teks bebas)
  learningGoals?: string[];
};

// ===== Pemetaan fokus -> anchor keywords (selaras 15 kursus kurasi) =====
const focusAnchors: Record<FocusArea, string[]> = {
  "web-development": [
    "html",
    "css",
    "javascript",
    "dom",
    "a11y",
    "responsive",
    "semantics",
    "typescript",
    "react",
    "react router v7",
    "ssr",
    "seo",
    "code splitting",
    "tailwindcss",
    "design system",
    "storybook",
    "design tokens",
    "node.js",
    "express",
    "postgresql",
    "prisma",
    "rest",
    "validation",
    "testing",
    "sanity",
    "clerk",
    "hono",
    "edge",
    "web performance",
    "core web vitals",
  ],
  "mobile-development": [
    "react native",
    "state management",
    "navigation",
    "material design",
    "release management",
    "crashlytics",
    "cross-platform",
  ],
  "ui-ux-design": [
    "ui/ux design",
    "foundations",
    "heuristics",
    "information architecture",
    "wireframe",
    "prototype",
    "usability",
    "figma",
    "auto-layout",
    "variants",
    "ux research",
    "interview",
    "survey",
    "analysis",
    "prioritization",
    "conversion",
  ],
  "data-science": [
    "python",
    "numpy",
    "pandas",
    "eda",
    "data cleaning",
    "jupyter",
    "sql",
    "normalization",
    "indexes",
    "data warehouse",
    "etl basics",
    "scikit-learn",
    "pipeline",
    "feature engineering",
    "metrics",
    "deployment",
    "model serving",
    "streamlit",
    "gradio",
  ],
  "cloud-computing": [
    "cloud computing",
    "aws",
    "gcp",
    "azure",
    "iam",
    "networking",
    "cost",
    "serverless",
    "aws lambda",
    "api gateway",
    "cdn",
    "caching",
    "routing",
    "image optimization",
    "architecture",
    "scalability",
    "resilience",
    "cost optimization",
    "well-architected",
    "autoscaling",
  ],
  devops: [
    "git",
    "github",
    "branching",
    "code review",
    "conventional commits",
    "ci/cd",
    "docker",
    "containers",
    "images",
    "multi-stage",
    "registry",
    "pipelines",
    "environments",
    "observability",
    "logging",
    "monitoring",
    "tracing",
    "otel",
    "alerts",
    "slo",
  ],
};

// ===== Sinonim level & preferensi gaya/bahasa =====
const levelSyn: Record<Level, string[]> = {
  beginner: ["beginner", "pemula", "dasar", "fundamentals", "intro"],
  intermediate: ["intermediate", "menengah", "lanjutan", "praktis"],
  advanced: ["advanced", "mahir", "expert", "production", "pro"],
};

const styleMap: Record<NonNullable<Prefs["explanationStyle"]>, string[]> = {
  simple: ["ringkas", "to the point", "praktis", "contoh kode"],
  detailed: ["mendalam", "komprehensif", "best practices", "teori"],
  analogy: ["analogi", "storytelling", "contoh nyata", "intuisi"],
};

const langMap: Record<NonNullable<Prefs["languagePreference"]>, string[]> = {
  id: ["bahasa indonesia penuh", "materi lokal", "terminologi indonesia"],
  en: ["english only", "global terms", "terminology english"],
};

// ===== Util =====
const dedupe = (arr: string[]) => [
  ...new Set(arr.map((s) => s.trim()).filter(Boolean)),
];

// ===== Builder utama =====
export function buildPreferenceEmbeddingText(p: Prefs): string {
  const segLevel = p.level
    ? `LEVEL: ${dedupe(levelSyn[p.level]).join(", ")}`
    : "";

  const segStyle = p.explanationStyle
    ? `STYLE: ${dedupe(styleMap[p.explanationStyle]).join(", ")}`
    : "";

  const segLang = p.languagePreference
    ? `LANG: ${dedupe(langMap[p.languagePreference]).join(", ")}`
    : "";

  // learningGoals = daftar FocusArea -> kumpulkan anchors
  const focusTokens = (p.learningGoals || []).flatMap(
    (f) => focusAnchors[f as FocusArea],
  );
  const segFocus = focusTokens.length
    ? `FOCUS: ${dedupe(focusTokens).join(", ")}`
    : "";

  // Sedikit boosting pada LEVEL & FOCUS agar berpengaruh ke vektor
  const boost = (s: string, n = 2) => (s ? Array(n).fill(s).join(" ") : "");

  return [boost(segLevel, 2), boost(segFocus, 2), segStyle, segLang]
    .filter(Boolean)
    .join(" | ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

type Difficulty = "beginner" | "intermediate" | "advanced";

export function buildCourseQuery({
  title = "",
  slug = "",
  description = "",
  difficulty,
  topics = [],
}: {
  title: string;
  slug: string;
  description: string;
  difficulty?: Difficulty;
  topics?: string[];
}) {
  // --- utils ---
  const dedupe = (arr: string[]) => [
    ...new Set(arr.map((s) => s.trim()).filter(Boolean)),
  ];

  const fromSlug = (s: string) =>
    (s || "").replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();

  const short = (s: string, max = 360) =>
    s.length <= max ? s : s.slice(0, max) + "…";

  const boost = (s: string, n = 2) => (s ? Array(n).fill(s).join(" ") : "");

  // --- difficulty expansions (selaras copy onboarding) ---
  const diffs: Record<Difficulty, string[]> = {
    beginner: ["beginner", "pemula", "dasar", "fundamentals", "intro"],
    intermediate: ["intermediate", "menengah", "lanjutan", "praktis"],
    advanced: ["advanced", "mahir", "expert", "production", "pro"],
  };
  const diffTokens = difficulty ? diffs[difficulty] : [];

  // --- anchor keywords yang “nyambung” dgn 15 kursus & onboarding ---
  const anchors = [
    // Web dasar
    "html",
    "css",
    "javascript",
    "dom",
    "a11y",
    "responsive",
    "semantics",
    // TypeScript & tooling
    "typescript",
    "types",
    "eslint",
    "prettier",
    "best practices",
    // React stack
    "react",
    "react router v7",
    "ssr",
    "data loading",
    "seo",
    "error boundary",
    "code splitting",
    // UI engineering / DS
    "tailwindcss",
    "design system",
    "storybook",
    "design tokens",
    // Backend
    "backend",
    "node.js",
    "express",
    "postgresql",
    "prisma",
    "rest",
    "validation",
    "testing",
    "migrations",
    // Full-stack platform
    "full-stack",
    "hono",
    "sanity",
    "clerk",
    "edge",
    "cms",
    // Perf / Ops
    "web performance",
    "core web vitals",
    "observability",
    "logging",
    "monitoring",
    "bundle analysis",
    // Capstone / QR
    "qr",
    // Mobile
    "react native",
    "navigation",
    "state management",
    // UI/UX & Research
    "ui/ux design",
    "foundations",
    "heuristics",
    "information architecture",
    "wireframe",
    "prototype",
    "usability",
    "figma",
    "auto-layout",
    "variants",
    "ux research",
    "interview",
    "survey",
    "analysis",
    "prioritization",
    "conversion",
    // Data/ML
    "python",
    "numpy",
    "pandas",
    "eda",
    "data cleaning",
    "jupyter",
    "sql",
    "normalization",
    "indexes",
    "data warehouse",
    "etl basics",
    "scikit-learn",
    "pipeline",
    "feature engineering",
    "metrics",
    // Cloud
    "cloud computing",
    "aws",
    "gcp",
    "azure",
    "iam",
    "networking",
    "cost",
    "serverless",
    "aws lambda",
    "api gateway",
    "cdn",
    "caching",
    "routing",
    "image optimization",
    "architecture",
    "scalability",
    "resilience",
    "cost optimization",
    "well-architected",
    "autoscaling",
    // Security/Auth
    "oauth 2.1",
    "oidc",
    "jwt",
    "rbac",
    "session management",
    "secrets",
    // AI Apps
    "vector database",
    "embeddings",
    "similarity search",
    "ann",
    "rag",
    "vercel ai sdk",
    "prompt engineering",
    "retrieval",
    "streaming",
    // DevOps/Collab
    "devops",
    "git",
    "github",
    "branching",
    "code review",
    "conventional commits",
    "ci/cd",
    "docker",
    "containers",
    "images",
    "multi-stage",
    "registry",
    "pipelines",
    "environments",
    "tracing",
    "otel",
    "alerts",
    "slo",
  ];

  const text = [title, fromSlug(slug), description].join(" ").toLowerCase();
  const matchedKeywords = anchors.filter((k) => {
    const token = k.split(" ")[0]; // cek token awal utk cepat & robust
    return text.includes(token);
  });

  const slugTokens = fromSlug(slug);
  const topicTokens = dedupe(topics).join(", ");

  // --- query literal final (single-line, mudah diparse/score) ---
  const query = `
title:"${title}" title_boost:"${boost(title, 3)}"
slug:"${slugTokens}" slug_boost:"${boost(slugTokens, 2)}"
desc:"${short(description)}"
level:${diffTokens.join(",")}
${topics.length ? `topics:(${topicTokens})` : ""}
keywords:${dedupe(matchedKeywords).join(",")}
  `
    .trim()
    .replace(/\n+/g, " ")
    .replace(/\s{2,}/g, " ");

  return query;
}

export const buildRecommendationPrompt = (
  userQuery: string,
  courses: Doc<"courses">[],
) => {
  return `PERTANYAAN USER: "${userQuery}"

DAFTAR KURSUS TERSEDIA:
${courses
  .map(
    (course, index) => `
${index + 1}. ID Kursus: ${course._id}
   Judul: ${course.title}
   Deskripsi: ${course.description}
   Level: ${course.difficulty}
   Hasil Belajar: ${course.learningOutcomes?.join(", ") || "Belum ditentukan"}
   Topik: ${course.topicIds?.length || 0} topik
`,
  )
  .join("")}

TUGAS:
1. Analisis pertanyaan user untuk memahami tujuan belajar, level saat ini, dan minat.  
2. Susun kursus jadi jalur belajar yang progresif (misalnya: pemula → menengah → lanjut kalau sesuai).  
3. Pastikan setiap kursus melengkapi kursus sebelumnya, bukan sekadar daftar random.  
4. Pilih kursus yang paling relevan dengan tujuan user.  

OUTPUT YANG DIBUTUHKAN:
Untuk tiap kursus rekomendasi, berikan:
- courseId: ID kursus
- reason: 2–3 kalimat alasan relevansi dan posisi kursus di jalur belajar
- order: urutan kursus (1 untuk pertama, 2 untuk kedua, dst.)

Lalu beri ringkasan akhir (3–4 kalimat) yang menjelaskan:
- Strategi jalur belajar secara keseluruhan
- Kenapa urutannya masuk akal
- Apa yang user bakal capai kalau ngikutin urutan ini`;
};
