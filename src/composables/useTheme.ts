import { ref, watchEffect } from 'vue'

type Theme = 'light' | 'dark'

const THEME_KEY = 'dashboard-theme'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  
  const stored = localStorage.getItem(THEME_KEY) as Theme | null
  if (stored) return stored
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const theme = ref<Theme>(getInitialTheme())

function applyTheme(newTheme: Theme) {
  document.documentElement.classList.toggle('dark', newTheme === 'dark')
  localStorage.setItem(THEME_KEY, newTheme)
}

function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

watchEffect(() => {
  applyTheme(theme.value)
})

const mediaQuery = typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)') : null

if (mediaQuery) {
  const handleChange = (e: MediaQueryListEvent) => {
    const stored = localStorage.getItem(THEME_KEY)
    if (!stored) {
      theme.value = e.matches ? 'dark' : 'light'
    }
  }
  
  mediaQuery.addEventListener('change', handleChange)
}

export function useTheme() {
  return {
    theme,
    toggleTheme,
    isDark: () => theme.value === 'dark'
  }
}