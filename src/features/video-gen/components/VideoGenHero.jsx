"use client";

import { useState } from "react";
import { useVideoAssembler } from "../hooks/useVideoAssembler";
import { useVideoGeneration } from "../hooks/useVideoGeneration";
import { BackgroundVideo } from "./BackgroundVideo";
import { ImageUploader } from "./ImageUploader";

const STATUS_LABEL = {
  uploading: "アップロード中...",
  generating: "AI変身動画を生成中です（数分かかります）...",
};

/**
 * Composition root for the feature: hero background video + the
 * "make your own" panel. This is the only file other app code should
 * import from src/features/video-gen (see index.js).
 */
export function VideoGenHero({ demoVideoSrc, demoPoster }) {
  const assembler = useVideoAssembler();
  const generation = useVideoGeneration();
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileSelected = (file) => {
    setPreviewUrl(URL.createObjectURL(file));
    generation.submit(file, assembler.buildRequest);
  };

  const isBusy = generation.status === "uploading" || generation.status === "generating";
  const activeSrc = generation.videoUrl ?? demoVideoSrc;

  return (
    <section className="relative min-h-screen w-full">
      <BackgroundVideo src={activeSrc} poster={demoPoster} className="absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/60" />

      <div className="pointer-events-none relative z-[1] flex min-h-screen flex-col justify-end gap-6 p-6 sm:p-10">
        <div className="pointer-events-auto max-w-md rounded-2xl border border-white/10 bg-black/50 p-6 backdrop-blur">
          <h2 className="text-xl font-semibold">自分だけのAI変身動画をつくる</h2>
          <p className="mt-1 text-sm text-white/70">
            リストバンドや道具の写真から、ズームインとTikTok風トランジションで変身する動画を生成します。
          </p>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="text-xs text-white/70">
              変身パターン
              <select
                value={assembler.selectedTransformationId}
                onChange={(event) => assembler.setTransformationId(event.target.value)}
                disabled={isBusy}
                className="mt-1 w-full rounded-md border border-white/20 bg-black/60 p-2 text-sm text-white"
              >
                {assembler.transformationOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-xs text-white/70">
              トランジション
              <select
                value={assembler.selectedTransitionId}
                onChange={(event) => assembler.setTransitionId(event.target.value)}
                disabled={isBusy}
                className="mt-1 w-full rounded-md border border-white/20 bg-black/60 p-2 text-sm text-white"
              >
                {assembler.transitionOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4">
            <ImageUploader
              onFileSelected={handleFileSelected}
              disabled={isBusy}
              previewUrl={previewUrl}
            />
          </div>

          {STATUS_LABEL[generation.status] && (
            <p className="mt-3 text-xs text-white/70">{STATUS_LABEL[generation.status]}</p>
          )}
          {generation.status === "error" && (
            <p role="alert" className="mt-3 text-xs text-red-400">
              {generation.error}
            </p>
          )}
        </div>

        <p className="text-xs text-white/50">
          背景動画上で右クリックすると再生／停止を切り替えられます。
        </p>
      </div>
    </section>
  );
}
