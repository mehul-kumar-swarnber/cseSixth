'use client'
import { createContext, useContext, useState, useEffect } from 'react'
export const ThemeContext = createContext()
export function Providers({ children }) {
  const [theme, setTheme] = useState('dark')
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <main className="min-h-screen">{children}</main>
    </ThemeContext.Provider>
  )
}
