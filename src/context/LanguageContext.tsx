import React, { createContext, useContext, useState, ReactNode } from 'react'
import { useTranslation } from '../hooks/useTranslation'
import { translations } from '../constants/translations'

type Language = 'vi' | 'en'

type TranslationKey = keyof typeof translations
type SectionKey<T extends TranslationKey> = keyof (typeof translations)[T]

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: <T extends TranslationKey>(section: T, key: SectionKey<T>) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('vi')
  const { t } = useTranslation()

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
