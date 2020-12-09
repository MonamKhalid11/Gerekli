import {
  SET_CURRENCY,
  SET_LANGUAGE,
  GET_CURRENCIES,
  GET_LANGUAGES,
} from '../constants';
import { NativeModules, Platform } from 'react-native';

const platformLanguage =
  Platform.OS === 'ios'
    ? NativeModules.SettingsManager.settings.AppleLocale ||
      NativeModules.SettingsManager.settings.AppleLanguages[0]
    : NativeModules.I18nManager.localeIdentifier;

const deviceLanguage = platformLanguage.split('_')[0];

const initialState = {
  currency: '',
  selectedLanguage: {
    lang_code: deviceLanguage,
    name: deviceLanguage,
  },
  languages: null,
  currencies: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_CURRENCY:
      return {
        ...state,
        currency: action.payload,
      };

    case GET_CURRENCIES:
      return {
        ...state,
        currencies: action.payload,
      };

    case SET_LANGUAGE:
      return {
        ...state,
        language: action.payload,
      };

    case GET_LANGUAGES:
      return {
        ...state,
        languages: action.payload,
      };

    default:
      return state;
  }
}
