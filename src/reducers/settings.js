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
    currency_code: 'USD',
  },
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
        selectedCurrency: action.payload,
      };

    case GET_CURRENCIES:
      action.payload.map((el) => {
        if (el.currency_code === state.selectedCurrency.currency_code) {
          el.selected = true;
        } else {
          el.selected = false;
        }
        return el;
      });
      return {
        ...state,
        currencies: action.payload,
      };

    case SET_LANGUAGE:
      return {
        ...state,
        selectedLanguage: action.payload,
      };

    case GET_LANGUAGES:
      action.payload.map((el) => {
        if (el.lang_code === state.selectedLanguage.lang_code) {
          el.selected = true;
        } else {
          el.selected = false;
        }
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
