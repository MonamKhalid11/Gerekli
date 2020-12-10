import { SET_LANGUAGE, SET_CURRENCY } from '../constants';
import * as appActions from './appActions';
import { DevSettings } from 'react-native';

export const setLanguage = (language) => {
  return async (dispatch) => {
    dispatch({
      type: SET_LANGUAGE,
      payload: language,
    });
    DevSettings.reload();
    await appActions.initApp();
  };
};

export const setCurrency = (currency) => {
  return (dispatch) => {
    dispatch({
      type: SET_CURRENCY,
      payload: currency,
    });
  };
};
