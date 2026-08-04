"use client";

import { useCallback, useState } from "react";

const POLL_INTERVAL_MS = 3000;
const MAX_POLL_ATTEMPTS = 60;

/**
 * Container-side logic for submitting a customer photo to the video-gen
 * pipeline: upload -> generate -> poll. Talks only to our own Next.js API
 * routes (app/api/video-gen/*), which in turn call Higgsfield server-side.
 * Kept separate from ImageUploader (presentational) so the UI can be tested
 * and restyled without touching this fetch/state logic.
 */
export function useVideoGeneration() {
  const [status, setStatus] = useState("idle"); // idle | uploading | generating | ready | error
  const [videoUrl, setVideoUrl] = useState(null);
  const [error, setError] = useState(null);

  const reset = useCallback(() => {
    setStatus("idle");
    setVideoUrl(null);
    setError(null);
  }, []);

  const submit = useCallback(async (file, buildRequest) => {
    setError(null);
    setStatus("uploading");

    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("/api/video-gen/upload", {
        method: "POST",
        body: formData,
      });
      if (!uploadRes.ok) {
        throw new Error("画像のアップロードに失敗しました");
      }
      const { mediaId } = await uploadRes.json();

      setStatus("generating");
      const generateRes = await fetch("/api/video-gen/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildRequest(mediaId)),
      });
      if (!generateRes.ok) {
        throw new Error("動画生成の開始に失敗しました");
      }
      const { jobId } = await generateRes.json();

      for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));

        const statusRes = await fetch(`/api/video-gen/status/${jobId}`);
        if (!statusRes.ok) {
          throw new Error("生成状況の取得に失敗しました");
        }
        const data = await statusRes.json();

        if (data.state === "completed") {
          setVideoUrl(data.videoUrl);
          setStatus("ready");
          return data.videoUrl;
        }
        if (data.state === "failed") {
          throw new Error(data.message || "動画生成に失敗しました");
        }
      }

      throw new Error("動画生成がタイムアウトしました");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStatus("error");
      return null;
    }
  }, []);

  return { status, videoUrl, error, submit, reset };
}
