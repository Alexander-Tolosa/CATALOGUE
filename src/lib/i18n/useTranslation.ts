import { useAppStore } from '../../store/useAppStore';
import { TRANSLATIONS, Translations } from './translations';
import { LanguageTrack } from '../../types';

export const useTranslation = () => {
  const selectedLanguage: LanguageTrack = useAppStore(state => state.profile.selectedLanguage || 'en');
  const t: Translations = TRANSLATIONS[selectedLanguage] || TRANSLATIONS.en;

  return {
    t,
    currentLanguage: selectedLanguage,
    isKorean: selectedLanguage === 'ko',
    isJapanese: selectedLanguage === 'ja',
    isEnglish: selectedLanguage === 'en',
    getLanguageName: (lang: LanguageTrack) => {
      if (selectedLanguage === 'ko') {
        return lang === 'ko' ? '한국어' : lang === 'ja' ? '일본어' : '영어';
      }
      if (selectedLanguage === 'ja') {
        return lang === 'ko' ? '韓国語' : lang === 'ja' ? '日本語' : '英語';
      }
      return lang === 'ko' ? 'Korean' : lang === 'ja' ? 'Japanese' : 'English';
    }
  };
};

export default useTranslation;
