import { openai } from "@ai-sdk/openai";
import { Agent, createTool, stepCountIs } from "@convex-dev/agent";
import z from "zod";
import { components } from "../_generated/api";
import { getMcpClient } from "../lib/mcp/context7/client";
import { mcpContext7ToolsWithClient } from "../lib/mcp/context7/index";

export const findRelevantContext = createTool({
  description:
    "Fetch up-to-date documentation from Context7 for a specific library/framework. If `library` is not a Context7 ID ('/org/project[/version]'), this tool will resolve it from a common name (e.g., 'react router v7'). Use this for API docs, code examples, setup/config instructions, or version-specific references. Returns the documentation as a single string.",
  args: z.object({
    query: z
      .string()
      .describe(
        "User question or keywords. Used as a signal to resolve the library when `library` is not provided. Include product and version when relevant (e.g., 'react router v7 data routers').",
      ),
    library: z
      .string()
      .describe(
        "Library common name (e.g., 'react router v7') or Context7 ID ('/org/project[/version]'). If a common name is provided, the tool will resolve it to the correct ID. If an ID is provided, resolution is skipped.",
      )
      .optional(),
    topic: z
      .string()
      .describe(
        "Optional topic focus to narrow the docs. Examples: 'routing', 'data routers', 'loaders/actions', 'hooks', 'navigation', 'migrations v7', 'SSR'.",
      )
      .optional(),
    tokens: z
      .number()
      .describe(
        "Maximum tokens to retrieve from Context7 (default 4000, up to 5000). Use 1500–3000 for concise focus, 4000–5000 for broader coverage.",
      )
      .optional(),
  }),
  handler: async (ctx, { query, library, topic, tokens }) => {
    const client = await getMcpClient();
    const tools = mcpContext7ToolsWithClient(client);

    // Helper: check if provided string already looks like a Context7-compatible ID
    const isContext7Id = (s: string) =>
      s.startsWith("/") && s.split("/").length >= 3;

    // Helper: extract a Context7-compatible ID from resolver output
    const extractIdFromResolver = (text: string): string | null => {
      // Prefer an explicit "Selected library ID:" line if present
      const explicit = text.match(
        /Selected\s+library\s+ID:\s*(\/[\w.-]+\/[\w.-]+(?:\/[\w@./-]+)*)/i,
      );
      if (explicit?.[1]) return explicit[1];
      // Fallback: first path-like "/org/project[/version]" occurrence
      const anyPath = text.match(
        /\/[a-z0-9._-]+\/[a-z0-9._-]+(?:\/[a-z0-9._@/.-]+)?/i,
      );
      return anyPath?.[0] ?? null;
    };

    // 1) Determine library ID: use provided `library` if context7 ID; otherwise resolve from `library || query`
    let libraryId: string | null = null;
    const candidate = library?.trim() || query;
    if (candidate && isContext7Id(candidate)) {
      libraryId = candidate;
    } else {
      try {
        const resolver = tools.resolvelibraryid as unknown as {
          execute: (input: { libraryName: string }) => Promise<string>;
        };
        const resolvedRaw = await resolver.execute({ libraryName: candidate });
        const resolvedId = extractIdFromResolver(resolvedRaw);
        if (resolvedId) libraryId = resolvedId;
        console.debug("context7 resolve", { candidate, resolvedId });
      } catch (error) {
        console.warn("ctx-retrieve resolve tool error", { candidate, error });
      }
    }

    if (!libraryId) {
      console.warn("ctx-retrieve context7: missing libraryId", {
        candidate,
      });
      return "";
    }

    // 2) Fetch docs for the resolved library ID
    try {
      const getDocs = tools.getlibrarydocs as unknown as {
        execute: (input: {
          context7CompatibleLibraryID: string;
          topic?: string;
          tokens?: number;
        }) => Promise<string>;
      };
      const result = await getDocs.execute({
        context7CompatibleLibraryID: libraryId,
        topic,
        tokens: tokens ?? 4000,
      });

      console.debug("findRelevantContext context7 results", {
        libraryId,
        topic: topic ?? null,
        length: result?.length ?? 0,
      });

      // Note: limit isn't directly applicable to the freeform docs string,
      // but we keep it in args for backward compatibility.
      return result;
    } catch (error) {
      console.error("findRelevantContext context7 docs error", {
        libraryId,
        error,
      });
      return "";
    }
  },
});

export const geniiAgent = new Agent(components.agent, {
  languageModel: openai.chat("gpt-5"),
  textEmbeddingModel: openai.textEmbeddingModel("text-embedding-3-small"),
  name: "Genii Agent",
  instructions: `
Kamu adalah asisten AI bernama "Genii" untuk platform belajar Genii. Gaya tutur santai, rapi, profesional, dan proaktif. Utamakan konteks percakapan/riwayat pengguna dan data yang tersedia.

Tujuan:
- Memberikan jawaban yang dinamis, ringkas namun kaya informasi, dengan contoh/praktik.
- Mengambil keputusan alat yang tepat (termasuk web_search) agar jawaban tetap akurat dan up-to-date.

Aturan Bahasa & Nada:
- Gunakan Bahasa Indonesia secara default. Jika pengguna bertanya dalam bahasa lain, balas dalam bahasa yang sama.
- Gunakan Markdown: heading, subheading, bullet, tabel bila relevan, dan blok kode berpenanda bahasa.

Kebijakan Keakuratan & Up-to-date:
- Lakukan penalaran: apakah topik bersifat cepat berubah (berita, rilis versi, harga, API docs, kerentanan, statistik, kebijakan, tanggal)? Jika ya ATAU pengguna meminta "terkini/up to date/sumber", WAJIB gunakan tool web_search untuk memverifikasi.
- Saat menggunakan web_search:
  - Ambil 2–5 sumber tepercaya.
  - Ringkas temuan, kutip judul/situs, dan sertakan tautan.
  - Catat "Diakses: YYYY-MM-DD".
- Jika tidak ada sumber kredibel atau informasi bertentangan, jelaskan ketidakpastian dan minta konfirmasi.

Penggunaan Tools (Penting):
- Gunakan 'find_relevant_context' saat pengguna meminta:
  - Dokumentasi/Referensi API library/framework
  - Contoh kode lebih banyak/detail
  - Setup/configuration steps
  - Informasi versi spesifik (mis. v7)
- Saat memanggil 'find_relevant_context':
  - Isi 'library' dengan nama umum (mis. 'react router v7') atau Context7 ID (mis. '/remix-run/react-router' atau '/remix-run/react-router/7.6.2'). Jika ragu, cukup isi 'query' dan biarkan tool resolve otomatis.
  - Isi 'topic' bila pengguna fokus pada area tertentu (mis. 'routing', 'data routers', 'loaders/actions', 'hooks').
  - 'tokens' default 4000; gunakan 2000–3000 untuk jawaban ringkas, 4000–5000 untuk cakupan lebih luas.
- Gunakan 'web_search' untuk berita/tren/rilis terbaru atau rujukan non-dokumentasi resmi (blog/artikel pihak ketiga).
- Hindari memanggil keduanya tanpa alasan. Prioritaskan 'find_relevant_context' untuk docs; 'web_search' untuk berita/rujukan eksternal.

Pemanfaatan Konteks:
- Selalu rangkum pemahaman atas pertanyaan sebelum menjawab.
- Jika instruksi ambigu, ajukan 1–3 pertanyaan klarifikasi yang spesifik.
- Hindari halusinasi. Jika tidak yakin, katakan "saya belum yakin" dan tawarkan langkah verifikasi (termasuk web_search).

Format Jawaban (tetap ringkas):
1) Judul (H2) berisi inti pertanyaan.
2) Ringkasan cepat – maks 3 bullet poin.
3) Jawaban utama – fokus pada solusi yang paling relevan dengan konteks pengguna.
4) Langkah praktis / contoh kode (jika cocok).
5) Sumber/Referensi (jika memakai web_search) dengan tautan + tanggal akses.
6) Langkah lanjut (opsional) untuk memperdalam atau mengeksekusi.

Standar Teknis:
- Untuk kode, gunakan blok kode berfence tiga-backtick dengan penanda bahasa (misal: ts), sertai komentar singkat dan best practice.
- Sertakan peringatan "periksa versi" bila API/library mungkin berbeda antar versi.
- Jangan membocorkan kredensial; sarankan penggunaan variabel lingkungan.

Kualitas Layanan:
- Prioritaskan jawaban yang dapat ditindaklanjuti.
- Hindari paragraf panjang; gunakan daftar berpoin dengan judul tebal bila membantu.
`,

  stopWhen: stepCountIs(8),
  tools: {
    find_relevant_context: findRelevantContext,
  },

  contextOptions: {
    searchOptions: {
      limit: 5,
      messageRange: { before: 2, after: 1 },
    },
  },
});
