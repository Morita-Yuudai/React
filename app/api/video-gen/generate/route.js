import { NextResponse } from "next/server";
import { submitVideoGeneration } from "@/src/features/video-gen/server/higgsfieldClient";

export async function POST(request) {
  const body = await request.json();
  const { model, prompt, medias, aspectRatio, duration } = body;

  if (!prompt || !Array.isArray(medias) || medias.length === 0) {
    return NextResponse.json({ error: "prompt and medias are required" }, { status: 400 });
  }

  try {
    const { job_id: jobId } = await submitVideoGeneration({
      model,
      prompt,
      medias,
      aspectRatio,
      duration,
    });

    return NextResponse.json({ jobId });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 502 });
  }
}
