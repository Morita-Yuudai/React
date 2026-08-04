"use client";

import { useState } from "react";

/**
 * Presentational only: collects the user's description and reports it via
 * a prop callback. No fetch/agent logic lives here — that belongs to
 * useImageAgent (container hook).
 */
export function PromptComposer({
  onSubmit,
  disabled = false,
  placeholder = "背景に生成したいイメージを言葉で説明してください",
}) {
  const [value, setValue] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        rows={3}
        className="w-full resize-none rounded-md border border-white/20 bg-black/60 p-2 text-sm text-white placeholder:text-white/40 disabled:cursor-not-allowed disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="self-end rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        背景を生成
      </button>
    </form>
  );
}
