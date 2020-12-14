import {
  SET_CURRENCY,
  SET_LANGUAGE,
  GET_CURRENCIES,
  GET_LANGUAGES,
  RESTORE_STATE,
} from '../constants';
import { NativeModules, Platform } from 'react-native';

const platformLanguage =
  Platform.OS === 'ios'
    ? NativeModules.SettingsManager.settings.AppleLocale ||
      NativeModules.SettingsManager.settings.AppleLanguages[0]
    : NativeModules.I18nManager.localeIdentifier;

const deviceLanguage = platformLanguage.split('_')[0];

const initialState = {
  selectedCurrency: {
    symbol: '$',
    currencyCode: 'USD',
  },
  selectedLanguage: {
    langCode: deviceLanguage,
    name: deviceLanguage,
  },
  languages: null,
  currencies: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_CURRENCY:
      const newSelectedCurrency = {
        currencyCode: action.payload.currencyCode,
        symbol: action.payload.symbol,
      };
      return {
        ...state,
        selectedCurrency: newSelectedCurrency,
      };

    case GET_CURRENCIES:
      action.payload.map((el) => {
        el.currencyCode = el.currency_code;
        delete el.currency_code;
        el.selected = el.currencyCode === state.selectedCurrency.currencyCode;
        return el;
      });
      return {
        ...state,
        currencies: action.payload,
      };

    case SET_LANGUAGE:
      const newSelectedLanguage = {
        langCode: action.payload.langCode,
        name: action.payload.name,
      };
      return {
        ...state,
        selectedLanguage: newSelectedLanguage,
      };

    case GET_LANGUAGES:
      action.payload.map((el) => {
        el.langCode = el.lang_code;
        delete el.lang_code;
        el.selected = el.langCode === state.selectedLanguage.langCode;
        return el;
      });
      return {
        ...state,
        languages: action.payload,
      };

    case RESTORE_STATE:
      return {
        ...state,
        ...action.payload.settings,
      };

    default:
      return state;
  }
}
