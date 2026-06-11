export function LogoIcon({ size = 80 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="bookGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Open book pages */}
      <path
        d="M50 72 L18 58 L18 42 L50 56 Z"
        fill="url(#bookGrad)"
        opacity="0.9"
      />
      <path
        d="M50 72 L82 58 L82 42 L50 56 Z"
        fill="url(#goldGrad)"
        opacity="0.9"
      />
      {/* Book spine center */}
      <path
        d="M50 56 L50 72"
        stroke="#FCD34D"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Book page lines left */}
      <path d="M24 52 L46 61" stroke="#FCD34D" strokeWidth="0.8" strokeOpacity="0.5" strokeLinecap="round" />
      <path d="M24 56 L46 65" stroke="#FCD34D" strokeWidth="0.8" strokeOpacity="0.3" strokeLinecap="round" />
      {/* Book page lines right */}
      <path d="M76 52 L54 61" stroke="#FDE68A" strokeWidth="0.8" strokeOpacity="0.5" strokeLinecap="round" />
      <path d="M76 56 L54 65" stroke="#FDE68A" strokeWidth="0.8" strokeOpacity="0.3" strokeLinecap="round" />

      {/* Graduation cap board */}
      <polygon
        points="50,22 84,38 50,54 16,38"
        fill="url(#goldGrad)"
        filter="url(#glow)"
      />
      {/* Cap board shine */}
      <polygon
        points="50,22 84,38 50,32"
        fill="#FDE68A"
        opacity="0.3"
      />

      {/* Cap top button */}
      <circle cx="50" cy="22" r="3" fill="#FCD34D" />

      {/* Tassel string */}
      <line x1="50" y1="22" x2="68" y2="28" stroke="#F59E0B" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="68" y1="28" x2="68" y2="42" stroke="#F59E0B" strokeWidth="1.2" strokeLinecap="round" />
      {/* Tassel end */}
      <circle cx="68" cy="43" r="1.5" fill="#D97706" />
      <line x1="66" y1="44" x2="64" y2="50" stroke="#D97706" strokeWidth="1" strokeLinecap="round" />
      <line x1="68" y1="45" x2="68" y2="51" stroke="#D97706" strokeWidth="1" strokeLinecap="round" />
      <line x1="70" y1="44" x2="72" y2="50" stroke="#D97706" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}
