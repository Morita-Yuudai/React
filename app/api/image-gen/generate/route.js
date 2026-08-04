import { NextResponse } from "next/server";
import { generateImage } from "@/src/features/image-gen/server/openaiClient";

export async function POST(request) {
  const body = await request.json();
  const { prompt, size } = body;

  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ error: "prompt is required" }, { status: 400 });
  }

  try {
    const { url } = await generateImage({ prompt, size });
    if (!url) {
      throw new Error("OpenAI returned no image data");
    }
    return NextResponse.json({ imageUrl: url });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 502 });
  }
}
