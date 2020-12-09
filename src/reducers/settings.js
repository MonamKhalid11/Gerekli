import { SET_CURRENCY, SET_LANGUAGE } from '../constants';
import { NativeModules, Platform } from 'react-native';

const platformLanguage =
  Platform.OS === 'ios'
    ? NativeModules.SettingsManager.settings.AppleLocale ||
      NativeModules.SettingsManager.settings.AppleLanguages[0]
    : NativeModules.I18nManager.localeIdentifier;

const deviceLanguage = platformLanguage.split('_')[0];

const initialState = {
  currency: '',
  language: 'en',
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_CURRENCY:
      return {
        ...state,
        currency: action.payload,
      };

    case SET_LANGUAGE:
      return {
        ...state,
        language: action.payload,
      };

    default:
      return state;
  }
}
