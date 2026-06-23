export default function PortraitPlaceholder({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 600 800"
      className={className}
      preserveAspectRatio="xMidYMax slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="portraitBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9a8a73" />
          <stop offset="100%" stopColor="#7d6f5c" />
        </linearGradient>
        <linearGradient id="portraitHead" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#cdbfa8" />
          <stop offset="100%" stopColor="#a89878" />
        </linearGradient>
        <linearGradient id="bottomFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#060a0a" stopOpacity="0" />
          <stop offset="85%" stopColor="#060a0a" stopOpacity="0" />
          <stop offset="100%" stopColor="#060a0a" stopOpacity="0.5" />
        </linearGradient>
      </defs>

      {/* Solid silhouette so it truly occludes the headline behind it */}
      <path
        d="M40 800 C40 540 160 440 300 440 C440 440 560 540 560 800 Z"
        fill="url(#portraitBody)"
      />
      <path
        d="M170 340 C150 230 200 110 300 100 C400 110 450 230 430 340 C430 430 380 470 300 470 C220 470 170 430 170 340 Z"
        fill="url(#portraitHead)"
      />

      {/* gentle bottom fade so the figure doesn't end on a hard edge */}
      <rect width="600" height="800" fill="url(#bottomFade)" />

      <text
        x="300"
        y="60"
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize="13"
        letterSpacing="3"
        fill="#060a0a"
        opacity="0.45"
      >
        PLACEHOLDER IMAGE
      </text>
    </svg>
  );
}
