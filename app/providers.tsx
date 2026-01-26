'use client'
import { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react'

type ThemeContextType = {
  theme: string;
  setTheme: Dispatch<SetStateAction<string>>;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function Providers({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState('dark')
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <main className="min-h-screen">{children}</main>
    </ThemeContext.Provider>
  )
}
