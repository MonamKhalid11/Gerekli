import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { get } from 'lodash';
import {
  STORE_KEY,
  RESTORE_STATE,
  GET_LANGUAGES,
  GET_CURRENCIES,
} from '../constants';
import API from '../services/api';
import store from '../store';
import i18n from '../utils/i18n';

const covertLangCodes = (translations = []) => {
  const result = {};

  translations.forEach((translation) => {
    result[`${translation.original_value}`] = translation.value;
  });

  return result;
};

const getLocalTranslations = (langCode) => {
  let translation;
  const AVAILABLE_LANGS = ['ar', 'ru', 'en', 'fr', 'it', 'es', 'pt'];

  if (AVAILABLE_LANGS.includes(langCode)) {
    switch (langCode) {
      case 'ru':
        translation = require('../config/locales/ru.json');
        break;
      case 'ar':
        translation = require('../config/locales/ar.json');
        break;
      case 'fr':
        translation = require('../config/locales/fr.json');
        break;
      case 'it':
        translation = require('../config/locales/it.json');
        break;
      case 'es':
        translation = require('../config/locales/es.json');
        break;
      case 'pt':
        translation = require('../config/locales/pt.json');
        break;
      default:
        translation = require('../config/locales/en.json');
    }
  }

  return translation;
};

export async function initApp() {
  const persist = await AsyncStorage.getItem(STORE_KEY);
  if (persist) {
    store.dispatch({
      type: RESTORE_STATE,
      payload: JSON.parse(persist),
    });
  }

  // Gets lists of languages and currencies and sets them to store.
  const resLanguages = await API.get('/sra_languages');
  const resCurrencies = await API.get('/sra_currencies');

  store.dispatch({
    type: GET_CURRENCIES,
    payload: resCurrencies.data.currencies,
  });

  store.dispatch({
    type: GET_LANGUAGES,
    payload: resLanguages.data.languages,
  });

  const currentLanguage = get(
    JSON.parse(persist),
    'settings.selectedLanguage.langCode',
    'en',
  );

  I18nManager.allowRTL(true);
  I18nManager.forceRTL(['ar', 'he'].includes(currentLanguage));

  try {
    // Load remote lang variables
    const transResult = await API.get(
      `/sra_translations/?name=mobile_app.mobile_&lang_code=${currentLanguage}`,
    );
    i18n.addResourceBundle(currentLanguage, 'translation', {
      ...getLocalTranslations(currentLanguage),
      ...covertLangCodes(transResult.data.langvars),
    });
  } catch (error) {
    i18n.addResourceBundle(
      currentLanguage,
      'translation',
      getLocalTranslations(currentLanguage),
    );
    console.log('Error loading translations', error);
  }

  i18n.changeLanguage(currentLanguage);
}
