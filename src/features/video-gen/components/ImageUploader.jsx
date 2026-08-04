"use client";

/**
 * Presentational only: renders the drop/select control and reports the
 * chosen file via a prop callback. No fetch/MCP logic lives here — that
 * belongs to useVideoGeneration (container hook).
 */
export function ImageUploader({ onFileSelected, disabled = false, previewUrl = null }) {
  const handleChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelected(file);
    }
    event.target.value = "";
  };

  return (
    <label
      className={`flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-6 text-center text-sm transition-colors ${
        disabled
          ? "cursor-not-allowed border-white/20 text-white/40"
          : "cursor-pointer border-white/40 text-white/80 hover:border-white hover:text-white"
      }`}
    >
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleChange}
        disabled={disabled}
        className="hidden"
      />
      {previewUrl ? (
        <img
          src={previewUrl}
          alt="アップロードした写真のプレビュー"
          className="h-32 w-32 rounded-lg object-cover"
        />
      ) : (
        <>
          <span className="text-base font-medium">写真をアップロード</span>
          <span className="text-xs opacity-70">
            リストバンドや身に付けている道具の写真からAI変身動画を作れます
          </span>
        </>
      )}
    </label>
  );
}
