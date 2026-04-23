import { useEffect } from 'react'

interface KeyboardNavOptions {
  onPrevDay: () => void
  onNextDay: () => void
  onSearch: () => void
  onArchive: () => void
}

export function useKeyboardNav({
  onPrevDay, onNextDay, onSearch, onArchive,
}: KeyboardNavOptions) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || (target as HTMLElement).isContentEditable) return

      if (e.key === 'ArrowUp') { e.preventDefault(); onPrevDay() }
      if (e.key === 'ArrowDown') { e.preventDefault(); onNextDay() }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); onSearch() }
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') { e.preventDefault(); onArchive() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onPrevDay, onNextDay, onSearch, onArchive])
}
