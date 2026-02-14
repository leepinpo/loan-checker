type Props = {
  value: number; // 0 - 100
};

export default function ConfidenceGauge({ value }: Props) {
  const angle = -180 + (value / 100) * 180;

  return (
    <svg width="160" height="100" viewBox="0 0 200 120">
      {/* gradient arc */}
      <defs>
        <linearGradient id="grad">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
      </defs>

      {/* arc */}
      <path
        d="M20 100 A80 80 0 0 1 180 100"
        fill="none"
        stroke="url(#grad)"
        strokeWidth="14"
      />

      {/* needle */}
      <line
        x1="100"
        y1="100"
        x2={100 + 70 * Math.cos((angle * Math.PI) / 180)}
        y2={100 + 70 * Math.sin((angle * Math.PI) / 180)}
        stroke="black"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* center dot */}
      <circle cx="100" cy="100" r="5" fill="black" />

      {/* label */}
      <text
        x="100"
        y="118"
        textAnchor="middle"
        fontSize="14"
        fontWeight="bold"
      >
        {value}%
      </text>
    </svg>
  );
}
