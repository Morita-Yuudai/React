"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Full-bleed background video player. Right-click opens a small custom
 * menu (instead of the browser's native context menu) offering play/stop,
 * per the requirement that visitors can cancel the background playback.
 */
export function BackgroundVideo({ src, poster, className = "" }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [menuPosition, setMenuPosition] = useState(null);

  const togglePlayback = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
    setMenuPosition(null);
  }, []);

  const handleContextMenu = useCallback((event) => {
    event.preventDefault();
    const bounds = containerRef.current?.getBoundingClientRect();
    setMenuPosition({
      x: event.clientX - (bounds?.left ?? 0),
      y: event.clientY - (bounds?.top ?? 0),
    });
  }, []);

  useEffect(() => {
    if (!menuPosition) return undefined;
    const closeMenu = () => setMenuPosition(null);
    window.addEventListener("click", closeMenu);
    window.addEventListener("scroll", closeMenu, true);
    return () => {
      window.removeEventListener("click", closeMenu);
      window.removeEventListener("scroll", closeMenu, true);
    };
  }, [menuPosition]);

  return (
    <div
      ref={containerRef}
      onContextMenu={handleContextMenu}
      className={`h-full w-full overflow-hidden ${className || "relative"}`}
    >
      <video
        ref={videoRef}
        key={src}
        src={src}
        poster={poster}
        autoPlay
        loop
        muted
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className="h-full w-full object-cover"
      />
      {menuPosition && (
        <div
          className="absolute z-10 rounded-md border border-white/10 bg-black/90 text-sm text-white shadow-lg backdrop-blur"
          style={{ left: menuPosition.x, top: menuPosition.y }}
        >
          <button
            type="button"
            onClick={togglePlayback}
            className="block w-full px-4 py-2 text-left hover:bg-white/10"
          >
            {isPlaying ? "背景動画を停止" : "背景動画を再生"}
          </button>
        </div>
      )}
    </div>
  );
}
