import API from '../services/api';
import { NativeModules, Platform } from 'react-native';
import { Navigation } from 'react-native-navigation';
import * as appActions from './appActions';
import * as nav from '../services/navigation';
import {
  SET_LANGUAGE,
  SET_CURRENCY,
  SET_DATE_FORMAT,
  GET_CURRENCIES,
  GET_LANGUAGES,
  LANGUAGE_CURRENCY_FEATURE_FLAG_OFF,
} from '../constants';

// Gets languages, currencies and date format settings and sets them to the store.
export function setStartSettings(currentLanguage, currentCurrency) {
  return async (dispatch) => {
    const platformLanguage =
      Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale ||
          NativeModules.SettingsManager.settings.AppleLanguages[0]
        : NativeModules.I18nManager.localeIdentifier;

    const deviceLanguage = platformLanguage.split('_')[0];

    try {
      // Gets lists of languages and currencies
      const {
        data: { currencies, languages, properties },
      } = await API.get('sra_storefront');

      dispatch({
        type: SET_DATE_FORMAT,
        payload: properties.settings.appearance.calendar_date_format,
      });

      if (!currentCurrency?.currencyCode) {
        currencies.forEach((el) => {
          if (el.is_default) {
            currentCurrency = {
              currencyCode: el.currency_code,
              symbol: el.symbol,
            };
          }
        });
        dispatch({
          type: SET_CURRENCY,
          payload: currentCurrency,
        });
      }

      if (!currentLanguage?.langCode) {
        // If the device language is among the languages of the store
        // use device language.
        let isDeviceLanguage = false;
        languages.forEach((el) => {
          if (el.lang_code === deviceLanguage) {
            isDeviceLanguage = true;
          }
        });

        if (isDeviceLanguage) {
          currentLanguage = {
            langCode: deviceLanguage,
            name: deviceLanguage,
          };
        } else {
          languages.forEach((el) => {
            if (el.is_default) {
              currentLanguage = {
                langCode: el.lang_code,
                name: el.name,
              };
            }
          });
        }

        dispatch({
          type: SET_LANGUAGE,
          payload: currentLanguage,
        });
      }

      // Set list of languages and currencies to store
      dispatch({
        type: GET_CURRENCIES,
        payload: currencies,
      });

      dispatch({
        type: GET_LANGUAGES,
        payload: languages,
      });
    } catch (e) {
      currentLanguage = {
        langCode: deviceLanguage,
        name: deviceLanguage,
      };
      dispatch({
        type: SET_LANGUAGE,
        payload: currentLanguage,
      });
      dispatch({
        type: LANGUAGE_CURRENCY_FEATURE_FLAG_OFF,
      });
      console.log('Error loading languages and currencies', e);
    }
  };
}

export const setLanguage = (language) => {
  return async (dispatch) => {
    dispatch({
      type: SET_LANGUAGE,
      payload: language,
    });
    await appActions.initApp();
    Navigation.setRoot(nav.setRoot());
  };
};

export const setCurrency = (currency) => {
  return async (dispatch) => {
    dispatch({
      type: SET_CURRENCY,
      payload: currency,
    });
    await appActions.initApp();
    Navigation.setRoot(nav.setRoot());
  };
};
