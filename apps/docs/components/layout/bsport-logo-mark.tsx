type BsportLogoMarkProps = {
  className?: string;
};

export function BsportLogoMark({ className }: BsportLogoMarkProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="55 5 170 223"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="bsport-docs-logo-gradient"
          x1="49.16"
          x2="147.42"
          y1="175.27"
          y2="58.16"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#2d767f" />
          <stop offset="1" stopColor="#149d7b" />
        </linearGradient>
      </defs>
      <path
        fill="#32a69e"
        d="M155.18,99.41a8.17,8.17,0,0,0-9.39,8.07V216a8.17,8.17,0,0,0,9.39,8.06,63,63,0,0,0,0-124.61Z"
      />
      <path
        fill="url(#bsport-docs-logo-gradient)"
        d="M71.5,9.3a8.17,8.17,0,0,0-9.21,8.09V152.72a72,72,0,0,0,62.79,71.41,8.16,8.16,0,0,0,9.21-8.09V80.72A72,72,0,0,0,71.5,9.3Z"
      />
    </svg>
  );
}
