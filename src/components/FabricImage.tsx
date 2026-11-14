import { useState } from "react";

interface FabricImageProps {
  src?: string;
  alt: string;
  swatchColor: string;
  title?: string;
  className?: string;
  imgClassName?: string;
}

export function FabricImage({
  src,
  alt,
  swatchColor,
  title,
  className = "",
  imgClassName = "",
}: FabricImageProps) {
  const [hasError, setHasError] = useState(false);
  const showFallback = !src || src.trim() === "" || hasError;

  if (showFallback) {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden ${className}`}
        style={{
          backgroundColor: swatchColor || "#1e3a5f",
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(255,255,255,0.14) 0%, transparent 55%),
            repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 2px, transparent 2px, transparent 8px),
            repeating-linear-gradient(-45deg, rgba(0,0,0,0.08) 0px, rgba(0,0,0,0.08) 2px, transparent 2px, transparent 8px)
          `,
        }}
        role="img"
        aria-label={alt}
      >
        <div className="relative z-10 flex flex-col items-center gap-2 px-6 text-center text-white/95">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
            className="opacity-85"
          >
            <path d="M4 6h16M4 12h16M4 18h16M8 4v16M16 4v16" />
          </svg>
          {title && (
            <span className="font-display text-sm font-medium tracking-wide text-white/90 line-clamp-2 max-w-[200px]">
              {title}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#F3EFEA] ${className}`}>
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className={`h-full w-full object-cover ${imgClassName}`}
      />
    </div>
  );
}
