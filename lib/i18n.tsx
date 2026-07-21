import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export type Lang = 'ro' | 'en'

interface LanguageContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  t: (roText: string, enText?: string) => string
  pick: <T,>(ro: T, en: T | undefined) => T
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

const STORAGE_KEY = 'cosimo-lang'

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('ro')

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Lang | null
      if (saved === 'ro' || saved === 'en') setLangState(saved)
    } catch {}
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    try { localStorage.setItem(STORAGE_KEY, l) } catch {}
  }

  const t = (roText: string, enText?: string) => (lang === 'en' && enText ? enText : roText)
  const pick = <T,>(ro: T, en: T | undefined): T => (lang === 'en' && en !== undefined ? en : ro)

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, pick }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider')
  return ctx
}
