export default function TropicalDecor({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="leafGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2D5016" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#4A7C23" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="leafGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#E5C76B" stopOpacity="0.06" />
        </linearGradient>
      </defs>
      
      <g opacity="0.6">
        <path
          d="M30 180 Q50 140 40 100 Q30 60 50 30"
          fill="none"
          stroke="url(#leafGradient1)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M35 160 Q55 150 70 165"
          fill="none"
          stroke="url(#leafGradient1)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M38 140 Q58 130 73 145"
          fill="none"
          stroke="url(#leafGradient1)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M42 120 Q62 110 77 125"
          fill="none"
          stroke="url(#leafGradient1)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M45 100 Q65 90 80 105"
          fill="none"
          stroke="url(#leafGradient1)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        
        <path
          d="M170 180 Q150 140 160 100 Q170 60 150 30"
          fill="none"
          stroke="url(#leafGradient2)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M165 160 Q145 150 130 165"
          fill="none"
          stroke="url(#leafGradient2)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M162 140 Q142 130 127 145"
          fill="none"
          stroke="url(#leafGradient2)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M158 120 Q138 110 123 125"
          fill="none"
          stroke="url(#leafGradient2)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M155 100 Q135 90 120 105"
          fill="none"
          stroke="url(#leafGradient2)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        
        <circle cx="100" cy="40" r="8" fill="url(#leafGradient2)" />
        <circle cx="85" cy="55" r="5" fill="url(#leafGradient1)" />
        <circle cx="115" cy="55" r="5" fill="url(#leafGradient1)" />
        <circle cx="75" cy="70" r="4" fill="url(#leafGradient2)" />
        <circle cx="125" cy="70" r="4" fill="url(#leafGradient2)" />
      </g>
    </svg>
  );
}
