interface IconProps {
  name: keyof typeof paths
  size?: number
  color?: string
  strokeWidth?: number
}

const paths = {
  search:   <><circle cx="10" cy="10" r="6.5" fill="none" /><path d="M14.8,14.8 L19,19" /></>,
  plus:     <><path d="M12,5 L12,19 M5,12 L19,12" /></>,
  book:     <><path d="M4,4 L4,20 L20,20 L20,4 Z M12,4 L12,20" /></>,
  calendar: <><rect x="4" y="6" width="16" height="14" rx="1" fill="none"/><path d="M4,10 L20,10 M9,3 L9,8 M15,3 L15,8"/></>,
  chart:    <><path d="M4,20 L20,20 M6,16 L10,11 L13,14 L18,7"/></>,
  settings: <><circle cx="12" cy="12" r="2.5" fill="none"/><path d="M12,3 L12,6 M12,18 L12,21 M3,12 L6,12 M18,12 L21,12 M5.5,5.5 L7.5,7.5 M16.5,16.5 L18.5,18.5 M5.5,18.5 L7.5,16.5 M16.5,7.5 L18.5,5.5"/></>,
  menu:     <><path d="M4,7 L20,7 M4,12 L20,12 M4,17 L20,17"/></>,
  close:    <><path d="M6,6 L18,18 M18,6 L6,18"/></>,
  back:     <><path d="M15,5 L8,12 L15,19"/></>,
  more:     <><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></>,
  cmd:      <><path d="M8,6 L8,18 M16,6 L16,18 M6,8 A2,2 0 1,1 8,10 M18,8 A2,2 0 1,0 16,10 M6,16 A2,2 0 1,0 8,14 M18,16 A2,2 0 1,1 16,14"/></>,
  leaf:     <><path d="M5,19 Q5,8 16,5 Q19,12 12,18 Q8,20 5,19 Z M5,19 L12,12"/></>,
  bookmark: <><path d="M6,4 L18,4 L18,21 L12,17 L6,21 Z"/></>,
  arrowUp:  <><path d="M12,19 L12,5 M6,11 L12,5 L18,11"/></>,
} as const

export default function Icon({ name, size = 20, color, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color ?? 'var(--ink)'}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block' }}
    >
      {paths[name]}
    </svg>
  )
}
