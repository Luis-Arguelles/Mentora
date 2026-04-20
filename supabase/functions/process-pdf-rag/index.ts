import { GoogleGenerativeAI } from "gemini";
import { Buffer } from "node:buffer";
import pdf from "pdf-parse";
import { GetObjectCommand, S3Client } from "s3";
import { serve } from "std/http/server.ts";
import { createClient } from "supabase";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS")
    return new Response("ok", { headers: corsHeaders });

  try {
    const { r2Key, originalName, documentId } = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const genAI = new GoogleGenerativeAI(Deno.env.get("GEMINI_API_KEY")!);
    const embeddingModel = genAI.getGenerativeModel({
      model: "text-embedding-004",
    });

    const r2Client = new S3Client({
      region: "auto",
      endpoint: Deno.env.get("R2_ENDPOINT")!,
      credentials: {
        accessKeyId: Deno.env.get("R2_ACCESS_KEY_ID")!,
        secretAccessKey: Deno.env.get("R2_SECRET_ACCESS_KEY")!,
      },
    });

    // 1. Fetch PDF from R2
    const { Body } = await r2Client.send(
      new GetObjectCommand({
        Bucket: Deno.env.get("R2_BUCKET_NAME"),
        Key: r2Key,
      }),
    );
    const pdfBytes = await Body?.transformToByteArray()!;

    // 2. Extract Text
    const pdfData = await pdf(Buffer.from(pdfBytes));
    const fullText = pdfData.text;

    // 3. Chunking with Overlap
    // size: 2000 chars (~300-400 words)
    // overlap: 200 chars (~30-40 words)
    const chunks = chunkTextWithOverlap(fullText, 2000, 200);

    // 4. Vectorize and Store
    for (const chunk of chunks) {
      const result = await embeddingModel.embedContent(chunk);
      const embedding = result.embedding.values;

      const { error } = await supabase.from("document_sections").insert({
        document_id: documentId,
        content: chunk,
        embedding: embedding,
        metadata: {
          source: originalName,
          r2_path: r2Key,
          processed_at: new Date().toISOString(),
        },
      });

      if (error) throw error;
    }

    return new Response(
      JSON.stringify({
        message: `Successfully processed ${chunks.length} chunks.`,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    const err = error as Error;
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

/**
 * Creates overlapping chunks of text
 * @param text The full text string
 * @param size Target characters per chunk
 * @param overlap How many characters to "re-read" from the previous chunk
 */

function chunkTextWithOverlap(
  text: string,
  size: number,
  overlap: number,
): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = start + size;
    const chunk = text.substring(start, end);
    chunks.push(chunk);

    // Move start pointer forward, but subtract overlap
    start += size - overlap;

    // Safety check to avoid infinite loops if overlap >= size
    if (size <= overlap) break;
  }

  return chunks;
}
