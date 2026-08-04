"use client";

import { useImageAgent } from "../hooks/useImageAgent";
import { BackgroundImage } from "./BackgroundImage";
import { PromptComposer } from "./PromptComposer";

const STATUS_LABEL = {
  generating: "AIが背景画像を生成中です...",
};

/**
 * Composition root for the feature: hero background image driven entirely
 * by useImageAgent's declarative state, plus the prompt panel that
 * requests new ones. This is the only file other app code should import
 * from src/features/image-gen (see index.js).
 */
export function ImageGenHero() {
  const agent = useImageAgent();
  const isBusy = agent.status === "generating";

  return (
    <section className="relative min-h-screen w-full">
      <BackgroundImage src={agent.imageUrl} className="absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/60" />

      <div className="pointer-events-none relative z-[1] flex min-h-screen flex-col justify-end gap-6 p-6 sm:p-10">
        <div className="pointer-events-auto max-w-md rounded-2xl border border-white/10 bg-black/50 p-6 backdrop-blur">
          <h2 className="text-xl font-semibold">AIエージェントで背景を生成</h2>
          <p className="mt-1 text-sm text-white/70">
            言葉で説明するだけで、OpenAIが背景画像をその場で生成し、即座にページの背景へ反映されます。
          </p>

          <div className="mt-4">
            <PromptComposer onSubmit={agent.generate} disabled={isBusy} />
          </div>

          {STATUS_LABEL[agent.status] && (
            <p className="mt-3 text-xs text-white/70">{STATUS_LABEL[agent.status]}</p>
          )}
          {agent.status === "error" && (
            <p role="alert" className="mt-3 text-xs text-red-400">
              {agent.error}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
