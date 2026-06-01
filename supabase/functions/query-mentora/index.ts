import { GoogleGenerativeAI } from "gemini";
import { serve } from "std/http/server.ts";
import { createClient } from "supabase";

serve(async (req) => {
  const { query } = await req.json();

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  const genAI = new GoogleGenerativeAI(Deno.env.get("GEMINI_API_KEY")!);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // 1. Generate embedding for the user's question
  const embedModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
  const { embedding } = await embedModel.embedContent(query);

  // 2. Search database for relevant chunks
  const { data: chunks } = await supabase.rpc("match_document_sections", {
    query_embedding: embedding.values,
    match_threshold: 0.5,
    match_count: 5,
  });

  const contextText = chunks?.map((c: any) => c.content).join("\n\n") ?? "";

  // 3. Ask Gemini to answer based ON THE CONTEXT ONLY
  const prompt = `
    You are Mentora, an AI study assistant. Answer the user's question using ONLY the provided context.
    If the answer isn't in the context, say "Lo siento, no encontré esa información en tus libros."
    
    Context: ${contextText}
    Question: ${query}
  `;

  const result = await model.generateContent(prompt);
  return new Response(JSON.stringify({ answer: result.response.text() }), {
    headers: { "Content-Type": "application/json" },
  });
});
