"use client";

import { useCallback, useState } from "react";

/**
 * Hides all OpenAI communication behind a single declarative "background
 * state" — { status, imageUrl, error }. Components never talk to
 * /api/image-gen or know an LLM is involved; they just read this state and
 * call generate(prompt) to request a new one.
 */
export function useImageAgent({ initialImageUrl = null } = {}) {
  const [status, setStatus] = useState("idle"); // idle | generating | ready | error
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [error, setError] = useState(null);

  const generate = useCallback(async (prompt, options = {}) => {
    setError(null);
    setStatus("generating");

    try {
      const res = await fetch("/api/image-gen/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, size: options.size }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "画像の生成に失敗しました");
      }

      setImageUrl(data.imageUrl);
      setStatus("ready");
      return data.imageUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStatus("error");
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setImageUrl(initialImageUrl);
    setError(null);
  }, [initialImageUrl]);

  return { status, imageUrl, error, generate, reset };
}
