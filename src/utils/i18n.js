import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import store from '../store';

const { settings } = store.getState();

i18n.use(initReactI18next).init({
  debug: false,
  nsSeparator: ':::',
  keySeparator: false,
  lng: settings.language,
  fallbackLng: settings.language,
});

export default i18n;
