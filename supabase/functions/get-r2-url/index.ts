import { S3Client } from "npm:@bradenmacdonald/s3-lite-client";
import { serve } from "std/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log("Incoming get-r2-url payload:", body);

    // Fallback protection in case Postman sends fileName or filename
    const fileName = body.fileName || body.filename;
    if (!fileName) {
      throw new Error("Missing 'fileName' property in request body.");
    }

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

    const key = `library/${Date.now()}-${fileName}`;

    // Generates the presigned upload URL securely using the key string
    const uploadUrl = await s3Client.getPresignedUrl("PUT", key, {
      expirySeconds: 3600,
    });

    return new Response(JSON.stringify({ uploadUrl, key }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
