import { GoogleGenerativeAI } from "gemini";
import { Buffer } from "node:buffer";
import { S3Client } from "npm:@bradenmacdonald/s3-lite-client";
import pdf from "pdf-parse";
import { serve } from "std/http/server.ts";
import { createClient } from "supabase";

// Helper function maximized for Gemini's large context window to minimize chunk count
function chunkText(text: string, maxLength = 8000, overlap = 800): string[] {
  const chunks: string[] = [];
  let i = 0;

  const cleanText = text.replace(/\s+/g, " ").trim();

  while (i < cleanText.length) {
    chunks.push(cleanText.slice(i, i + maxLength));
    i += maxLength - overlap;
  }
  return chunks;
}

serve(async (req) => {
  try {
    const body = await req.json();
    console.log("Processing pipeline started for payload:", body);

    const key = body.key || body.r2Key;
    if (!key) {
      throw new Error(
        "Missing target storage file 'key' or 'r2Key' in request body.",
      );
    }

    // 1. Initialize Cloudflare R2 Client
    const rawEndpoint = Deno.env.get("R2_ENDPOINT") || "";
    const cleanEndpoint = rawEndpoint.replace(/^https?:\/\//, "");

    const s3Client = new S3Client({
      endPoint: cleanEndpoint,
      accessKey: Deno.env.get("R2_ACCESS_KEY_ID")!,
      secretKey: Deno.env.get("R2_SECRET_ACCESS_KEY")!,
      bucket: Deno.env.get("R2_BUCKET_NAME")!,
      region: "auto",
      useSSL: true,
    });

    // 2. Download the binary PDF file from R2
    console.log(`Downloading file from R2: ${key}`);
    const s3Object = await s3Client.getObject(key);
    const pdfArrayBuffer = await s3Object.arrayBuffer();
    const pdfBuffer = Buffer.from(pdfArrayBuffer);

    // 3. Extract the text data from the PDF Buffer
    console.log("Parsing PDF text content...");
    const parsedPdf = await pdf(pdfBuffer);
    const rawText = parsedPdf.text;

    if (!rawText || rawText.trim().length === 0) {
      throw new Error(
        "PDF processing completed, but no text content could be extracted.",
      );
    }

    // High-capacity chunks mean drastically fewer total network requests
    const chunks = chunkText(rawText);
    console.log(
      `Successfully generated ${chunks.length} high-density text chunks.`,
    );

    // 4. Initialize Database & AI Clients
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey =
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ||
      Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const genAI = new GoogleGenerativeAI(Deno.env.get("GEMINI_API_KEY")!);
    const embeddingModel = genAI.getGenerativeModel({
      model: "gemini-embedding-001",
    });

    // 5. Create Parent Record in 'documents' table
    const fileName = key.split("/").pop() || "uploaded-document.pdf";
    const { data: documentRecord, error: docError } = await supabase
      .from("documents")
      .insert({
        file_name: fileName,
        r2_path: key,
      })
      .select()
      .single();

    if (docError)
      throw new Error(
        `Database error creating parent document: ${docError.message}`,
      );
    const documentId = documentRecord.id;

    // 6. Batch Generate Vector Embeddings with Linear Rate-Limit Throttling
    console.log(
      `Preparing to safely embed ${chunks.length} chunks via linear pacing...`,
    );

    // Processing 5 chunks with a 3.5s pause keeps consumption locked at ~85 RPM max
    const BATCH_SIZE = 5;
    const totalEmbeddings: number[][] = [];

    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
      const currentBatchChunks = chunks.slice(i, i + BATCH_SIZE);

      console.log(
        `Embedding chunks ${i + 1} to ${Math.min(i + BATCH_SIZE, chunks.length)} of ${chunks.length}...`,
      );

      const batchResponse = await embeddingModel.batchEmbedContents({
        requests: currentBatchChunks.map((chunkContent) => ({
          content: { parts: [{ text: chunkContent }] },
          outputDimensionality: 768,
        })),
      });

      const batchVectors = batchResponse.embeddings.map((e) => e.values);
      totalEmbeddings.push(...batchVectors);

      // Linear pacing pause to guarantee we stay below the 100 rolling requests-per-minute threshold
      if (i + BATCH_SIZE < chunks.length) {
        await new Promise((resolve) => setTimeout(resolve, 3500));
      }
    }

    // 7. Bulk Save all chunks and embeddings into Supabase
    console.log("Assembling bulk insertion payload...");

    const sectionsToInsert = chunks.map((chunkContent, index) => ({
      document_id: documentId,
      content: chunkContent,
      embedding: totalEmbeddings[index],
    }));

    console.log(
      `Persisting ${sectionsToInsert.length} sections to 'document_sections' tables...`,
    );
    const { error: bulkError } = await supabase
      .from("document_sections")
      .insert(sectionsToInsert);

    if (bulkError) {
      throw new Error(
        `Database error performing bulk section insert: ${bulkError.message}`,
      );
    }

    console.log("Pipeline processing successfully concluded!");
    return new Response(
      JSON.stringify({
        success: true,
        message: "Document parsed, indexed, and embedded successfully.",
        documentId,
        chunksProcessed: chunks.length,
      }),
      { headers: { "Content-Type": "application/json" }, status: 200 },
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown pipeline error";
    console.error("Critical Execution Failure:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
});
