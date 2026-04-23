export default function PaperNoise({ opacity = 0.4 }: { opacity?: number }) {
  return (
    <svg
      width="100%" height="100%"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity, mixBlendMode: 'multiply' }}
      aria-hidden
    >
      <filter id="paperNoise">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="5" />
        <feColorMatrix values="0 0 0 0 0.55 0 0 0 0 0.45 0 0 0 0 0.30 0 0 0 0.06 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#paperNoise)" />
    </svg>
  )
}
