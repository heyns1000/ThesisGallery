import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark" | "hyper"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  isHyperMode: boolean
  toggleHyperMode: () => void
}

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
  toggleTheme: () => null,
  isHyperMode: false,
  toggleHyperMode: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "seedwave-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )
  const [isHyperMode, setIsHyperMode] = useState(false)

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove("light", "dark", "hyper-mode")

    if (theme === "hyper") {
      root.classList.add("dark", "hyper-mode")
      setIsHyperMode(true)
    } else {
      root.classList.add(theme)
      setIsHyperMode(false)
    }
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
    toggleTheme: () => {
      const nextTheme = theme === "light" ? "dark" : "light"
      localStorage.setItem(storageKey, nextTheme)
      setTheme(nextTheme)
    },
    isHyperMode,
    toggleHyperMode: () => {
      const nextTheme = theme === "hyper" ? "dark" : "hyper"
      localStorage.setItem(storageKey, nextTheme)
      setTheme(nextTheme)
    }
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
