"use client";

import { useRef, useState } from "react";

/**
 * Presentational only: collects the user's description (and an optional
 * reference image) and reports both via a prop callback. No fetch/agent
 * logic lives here — that belongs to useImageAgent (container hook).
 */
export function PromptComposer({
  onSubmit,
  disabled = false,
  placeholder = "背景に生成したいイメージを言葉で説明してください",
}) {
  const [value, setValue] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageDataUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImageDataUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed, { image: imageDataUrl ?? undefined });
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

      {imageDataUrl ? (
        <div className="flex items-center gap-2">
          <img src={imageDataUrl} alt="" className="h-12 w-12 rounded object-cover" />
          <button
            type="button"
            onClick={clearImage}
            disabled={disabled}
            className="text-xs text-white/60 underline hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            画像を削除
          </button>
        </div>
      ) : (
        <label className="self-start text-xs text-white/60 underline hover:text-white cursor-pointer">
          参考画像をアップロード
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={disabled}
            className="hidden"
          />
        </label>
      )}

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
