import type { Category } from "@/lib/types";

/**
 * 실제 제품 사진 대신 사용하는 온-브랜드 추상 아트.
 * 카테고리별 모티프 + 제품 accent 색을 사용해 일관된 인상을 준다.
 * (운영 시 next/image 실제 사진으로 교체)
 */
function hexToRgba(hex: string, a: number): string {
  const h = hex.replace("#", "");
  const n = parseInt(
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h,
    16,
  );
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

const MOTIF: Record<Category, "leaf" | "drop" | "spark" | "root" | "grain" | "moon"> = {
  유산균: "spark",
  오메가3: "drop",
  비타민: "spark",
  발효홍삼: "root",
  단백질: "grain",
  "수면·이완": "moon",
};

export function ProductArt({
  accent,
  category,
  label,
  className,
}: {
  accent: string;
  category: Category;
  label?: string;
  className?: string;
}) {
  const motif = MOTIF[category] ?? "leaf";
  const gid = `g-${accent.replace("#", "")}-${category}`;

  return (
    <svg
      viewBox="0 0 400 400"
      role="img"
      aria-label={label ? `${label} 제품 이미지` : "제품 이미지"}
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={hexToRgba(accent, 0.16)} />
          <stop offset="100%" stopColor="#faf7f0" />
        </linearGradient>
      </defs>

      <rect width="400" height="400" fill={`url(#${gid})`} />

      {/* 유기적 배경 블롭 */}
      <circle cx="308" cy="86" r="120" fill={hexToRgba(accent, 0.14)} />
      <circle cx="70" cy="330" r="96" fill={hexToRgba(accent, 0.1)} />

      {/* 병/파우치 실루엣 */}
      <g transform="translate(148 96)">
        <rect
          x="18"
          y="44"
          width="68"
          height="176"
          rx="26"
          fill={hexToRgba(accent, 0.9)}
        />
        <rect x="38" y="20" width="28" height="34" rx="7" fill={hexToRgba(accent, 0.9)} />
        <rect
          x="30"
          y="96"
          width="44"
          height="70"
          rx="8"
          fill={hexToRgba("#faf7f0", 0.92)}
        />
      </g>

      {/* 카테고리 모티프 */}
      {motif === "leaf" && (
        <g fill={hexToRgba(accent, 0.85)}>
          <path d="M96 150c40-46 100-46 118-10-40 46-100 46-118 10z" />
        </g>
      )}
      {motif === "drop" && (
        <path
          d="M300 250c0 20-16 34-34 34s-34-14-34-34c0-22 34-58 34-58s34 36 34 58z"
          fill={hexToRgba(accent, 0.8)}
        />
      )}
      {motif === "spark" && (
        <g stroke={hexToRgba(accent, 0.85)} strokeWidth="7" strokeLinecap="round">
          <line x1="300" y1="232" x2="300" y2="286" />
          <line x1="273" y1="259" x2="327" y2="259" />
          <line x1="281" y1="240" x2="319" y2="278" />
          <line x1="281" y1="278" x2="319" y2="240" />
        </g>
      )}
      {motif === "root" && (
        <g stroke={hexToRgba(accent, 0.85)} strokeWidth="6" fill="none" strokeLinecap="round">
          <path d="M300 226v70" />
          <path d="M300 250c-16 6-24 18-26 34" />
          <path d="M300 262c16 6 24 18 26 34" />
        </g>
      )}
      {motif === "grain" && (
        <g fill={hexToRgba(accent, 0.8)}>
          <ellipse cx="286" cy="250" rx="9" ry="16" />
          <ellipse cx="308" cy="262" rx="9" ry="16" />
          <ellipse cx="298" cy="284" rx="9" ry="16" />
        </g>
      )}
      {motif === "moon" && (
        <path
          d="M322 250a34 34 0 1 1-40-33 26 26 0 0 0 40 33z"
          fill={hexToRgba(accent, 0.8)}
        />
      )}
    </svg>
  );
}
