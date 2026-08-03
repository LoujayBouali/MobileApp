import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import fr from './fr.json';
import ar from './ar.json';
import en from './en.json';
import { I18nManager } from 'react-native';

export const switchToArabic = () => {
  I18nManager.forceRTL(true);
};
i18n.use(initReactI18next).init({
  resources: { fr: { translation: fr }, ar: { translation: ar }, en: { translation: en } },
  lng: 'fr',
  fallbackLng: 'fr',
});

export default i18n;