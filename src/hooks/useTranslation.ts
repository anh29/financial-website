import { translations } from '../constants/translations'

type TranslationKey = keyof typeof translations
type SectionKey<T extends TranslationKey> = keyof typeof translations[T]

export const useTranslation = () => {
  const t = <T extends TranslationKey>(section: T, key: SectionKey<T>): string => {
    return translations[section][key] as string
  }

  return { t }
} 