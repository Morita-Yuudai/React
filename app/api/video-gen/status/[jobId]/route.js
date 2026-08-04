import { NextResponse } from "next/server";
import { getGenerationStatus } from "@/src/features/video-gen/server/higgsfieldClient";

export async function GET(_request, { params }) {
  const { jobId } = await params;

  try {
    const data = await getGenerationStatus(jobId);
    return NextResponse.json({
      state: data.state,
      videoUrl: data.video_url ?? null,
      message: data.message ?? null,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 502 });
  }
}
