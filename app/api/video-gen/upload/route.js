import { NextResponse } from "next/server";
import { confirmMedia, requestUploadUrl } from "@/src/features/video-gen/server/higgsfieldClient";

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }

  try {
    const { media_id: mediaId, upload_url: uploadUrl } = await requestUploadUrl(
      file.name,
      file.type
    );

    await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    await confirmMedia(mediaId);

    return NextResponse.json({ mediaId });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 502 });
  }
}
