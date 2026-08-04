"use client";

import { useEffect, useState } from "react";

/**
 * Full-bleed background image. Purely declarative: it only ever reads the
 * `src` prop and renders it — no idea an AI agent produced that URL. When
 * `src` changes it crossfades to the new image instead of popping.
 */
export function BackgroundImage({ src, alt = "", className = "" }) {
  const [displayedSrc, setDisplayedSrc] = useState(src);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (src === displayedSrc) return undefined;
    setVisible(false);
    const timeout = setTimeout(() => {
      setDisplayedSrc(src);
      setVisible(true);
    }, 250);
    return () => clearTimeout(timeout);
  }, [src, displayedSrc]);

  return (
    <div
      className={`h-full w-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-black ${
        className || "relative"
      }`}
    >
      {displayedSrc && (
        <img
          src={displayedSrc}
          alt={alt}
          className="h-full w-full object-cover transition-opacity duration-250 ease-out"
          style={{ opacity: visible ? 1 : 0 }}
        />
      )}
    </div>
  );
}
