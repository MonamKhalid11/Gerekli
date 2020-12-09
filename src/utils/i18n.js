import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import store from '../store';

const { settings } = store.getState();

i18n.use(initReactI18next).init({
  debug: false,
  nsSeparator: ':::',
  keySeparator: false,
  lng: settings.selectedLanguage.lang_code,
  fallbackLng: settings.selectedLanguage.lang_code,
});

export default i18n;
