interface HandUnderlineProps {
  width?: number
  color?: string
  strokeWidth?: number
  seed?: number
  style?: React.CSSProperties
}

const PATHS = [
  'M2,6 Q20,3 40,5 T80,4 T120,6',
  'M2,5 Q30,8 60,4 T120,5',
  'M3,4 Q25,7 50,3 T100,6 T130,4',
]

export default function HandUnderline({
  width = 80,
  color,
  strokeWidth = 2,
  seed = 0,
  style = {},
}: HandUnderlineProps) {
  return (
    <svg
      width={width} height={10}
      viewBox="0 0 130 10"
      preserveAspectRatio="none"
      style={{ display: 'block', ...style }}
    >
      <path
        d={PATHS[seed % PATHS.length]}
        fill="none"
        stroke={color ?? 'var(--accent)'}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  )
}
