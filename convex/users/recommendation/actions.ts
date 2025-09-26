import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { v } from "convex/values";
import { internalAction } from "../../_generated/server";
import { vv } from "../../schema";
import { buildRecommendationPrompt } from "../../utils";
import { recommendationSchema } from "./schema";

export const similarCourses = internalAction({
  args: {
    embedding: v.array(v.float64()),
  },
  handler: async (ctx, { embedding }) => {
    const results = await ctx.vectorSearch("courses", "by_embedding", {
      vector: embedding,
      limit: 5,
    });
    return results;
  },
});

export const sortCandidatesAndGenerateReasons = internalAction({
  args: {
    userQuery: v.string(),
    candidates: v.array(vv.doc("courses")),
  },
  handler: async (_, { userQuery, candidates }) => {
    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: recommendationSchema,
      system: `
      Lo adalah AI mentor belajar yang ngomong santai kayak temen. Gunakan gaya bahasa "lo–gue" yang ringan, jelas, dan percaya diri tanpa sok jago. Hindari jargon berlebihan, jangan kaku, dan tulis dengan kalimat pendek–sedang biar gampang dicerna.

    Selalu terapkan formula KASIAN BAGINDA (Kenapa, Apa, Siapa, Kapan, Gimana, Di mana) secara natural dalam penjelasan:
    - Jawab "kenapa" biar pembaca ngerti alasan atau urgensinya.
    - Jelasin "apa" dengan konkret, bukan teori abstrak.
    - Sebut "siapa" kalau relevan (target user, role, audiens).
    - Kasih sense "kapan" (urutan, timing, langkah progres).
    - Tunjukin "gimana" dengan contoh sederhana atau skenario nyata.
    - Tambahin "di mana" kalau konteksnya butuh lokasi atau ruang lingkup.

    Tujuan lo bukan cuma listing fakta, tapi bikin narasi runut dan relatable: user merasa dipandu dari satu titik ke titik berikutnya. Pakai contoh mini atau skenario kalau bisa, biar lebih nempel.

    Output harus praktis, ringkas, dan actionable. Jangan pakai heading template (Problem/Solution, AIDA, dll.) secara eksplisit. Cukup ikutin alurnya.

    Akhiri tiap penjelasan dengan satu CTA ringan yang jelas, misalnya:
    - “Coba sekarang — lo bakal lihat hasilnya langsung.”
    - “Mulai dulu dari step ini, sisanya ngikut.”
      `,
      prompt: buildRecommendationPrompt(userQuery, candidates),
    });
    return object;
  },
});
