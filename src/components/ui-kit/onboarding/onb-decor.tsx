const O_INK = '#1A1611';
const O_BRICK = '#F26F1B';
const O_MINT = '#4DA66E';
const O_CREAM = '#F4ECD9';

export function OnbDecorNama() {
  return (
    <svg
      viewBox="0 0 220 110"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g fill="none" stroke={O_INK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.5">
        <path d="M 80 18 q -4 -6 2 -10 q 6 -4 2 -10" />
        <path d="M 96 22 q -4 -6 2 -10" opacity="0.7" />
      </g>
      <line x1="110" y1="14" x2="110" y2="36" stroke={O_INK} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="110" cy="14" r="2" fill={O_INK} />
      <g transform="translate(48 36) rotate(-3 62 22)">
        <rect x="0" y="0" width="124" height="44" rx="6" fill={O_CREAM} stroke={O_INK} strokeWidth="1.8" />
        <path
          d="M 16 22 q 4 -8 8 0 q 4 8 8 0 t 8 0"
          fill="none"
          stroke={O_INK}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 52 22 q 4 -8 8 0 q 4 8 8 0"
          fill="none"
          stroke={O_INK}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="84" y="14" width="26" height="16" rx="3" fill={O_BRICK} />
      </g>
      <circle cx="184" cy="50" r="3" fill={O_MINT} />
      <circle cx="32" cy="64" r="1.8" fill={O_INK} opacity="0.35" />
      <circle cx="40" cy="92" r="1.4" fill={O_INK} opacity="0.25" />
    </svg>
  );
}

export function OnbDecorLokasi() {
  return (
    <svg
      viewBox="0 0 220 110"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="56" cy="50" r="20" fill={O_BRICK} opacity="0.16" />
      <circle cx="56" cy="50" r="12" fill={O_BRICK} opacity="0.35" />
      <line x1="14" y1="86" x2="206" y2="86" stroke={O_INK} strokeWidth="1.8" strokeLinecap="round" />
      <g fill="none" stroke={O_INK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 36 86 L 36 64 L 52 54 L 68 64 L 68 86" />
        <path d="M 84 86 L 84 56 L 110 40 L 136 56 L 136 86" fill={O_CREAM} />
        <rect x="104" y="68" width="12" height="18" fill={O_CREAM} />
        <path d="M 152 86 L 152 60 L 168 50 L 184 60 L 184 86" />
      </g>
      <g transform="translate(110 34)">
        <path
          d="M 0 14 C -7 6 -7 -2 0 -2 C 7 -2 7 6 0 14 Z"
          fill={O_BRICK}
          stroke={O_INK}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <circle cx="0" cy="2" r="2.2" fill={O_CREAM} />
      </g>
      <circle cx="200" cy="22" r="3" fill={O_MINT} />
      <circle cx="14" cy="20" r="1.4" fill={O_INK} opacity="0.3" />
      <circle cx="178" cy="98" r="1.4" fill={O_INK} opacity="0.25" />
    </svg>
  );
}

export function OnbDecorMenu() {
  return (
    <svg
      viewBox="0 0 220 110"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g fill="none" stroke={O_INK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.5">
        <path d="M 104 14 q -4 -6 2 -10 q 6 -4 2 -10" />
        <path d="M 120 18 q -4 -6 2 -10" opacity="0.7" />
      </g>
      <g transform="translate(110 70)">
        <ellipse rx="80" ry="22" fill={O_CREAM} stroke={O_INK} strokeWidth="1.8" />
        <ellipse rx="68" ry="14" fill="none" stroke={O_INK} strokeWidth="1" opacity="0.35" />
      </g>
      <g
        transform="translate(64 68) rotate(-12 0 0)"
        fill="none"
        stroke={O_INK}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M -16 0 q 6 -10 18 -8 q 12 2 18 6 l 8 -4 l -2 6 l 2 6 l -8 -4 q -6 4 -18 6 q -12 2 -18 -8 z"
          fill={O_CREAM}
        />
        <circle cx="0" cy="-2" r="1.2" fill={O_INK} />
      </g>
      <g transform="translate(112 66)" fill={O_CREAM} stroke={O_INK} strokeWidth="1.8" strokeLinejoin="round">
        <rect x="-10" y="-8" width="20" height="14" rx="3" />
        <line x1="-6" y1="-2" x2="6" y2="-2" stroke={O_INK} strokeWidth="1" opacity="0.4" strokeLinecap="round" />
      </g>
      <g
        transform="translate(156 66)"
        stroke={O_INK}
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <path d="M -10 6 q -4 -14 10 -14 q 14 0 10 14 q -10 4 -20 0 z" fill={O_BRICK} />
      </g>
      <g
        transform="translate(40 60)"
        fill="none"
        stroke={O_MINT}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M 0 0 q 6 -6 12 -2" />
        <path d="M 6 -3 q 0 -4 4 -4" />
      </g>
    </svg>
  );
}
