import { useAppStore } from '../../store/useAppStore';
import { TRANSLATIONS, Translations } from './translations';
import { LanguageTrack } from '../../types';

export const useTranslation = () => {
  const interfaceLanguage: LanguageTrack = useAppStore(state => state.interfaceLanguage || state.profile.interfaceLanguage || 'en');
  const t: Translations = TRANSLATIONS[interfaceLanguage] || TRANSLATIONS.en;

  return {
    t,
    currentLanguage: interfaceLanguage,
    isKorean: interfaceLanguage === 'ko',
    isJapanese: interfaceLanguage === 'ja',
    isEnglish: interfaceLanguage === 'en',
    getLanguageName: (lang: LanguageTrack) => {
      if (interfaceLanguage === 'ko') {
        return lang === 'ko' ? '한국어' : lang === 'ja' ? '일본어' : '영어';
      }
      if (interfaceLanguage === 'ja') {
        return lang === 'ko' ? '韓国語' : lang === 'ja' ? '日本語' : '英語';
      }
      return lang === 'ko' ? 'Korean' : lang === 'ja' ? 'Japanese' : 'English';
    }
  };
};

export default useTranslation;
