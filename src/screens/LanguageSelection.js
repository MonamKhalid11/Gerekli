import React from 'react';
import { RadioButtonItem } from '../components/RadioButtonItem';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { omit } from 'lodash';

// Import actions.
import * as settingsActions from '../actions/settingsActions';

export const LanguageSelection = ({ settingsActions, settings }) => {
  const changeLanguageHandler = (language) => {
    const omitLanguage = omit(language, ['selected']);
    settingsActions.setLanguage(omitLanguage);
  };

  if (settings.currencies) {
    return Object.keys(settings.languages).map((el, index) => (
      <RadioButtonItem
        key={index}
        item={settings.languages[el]}
        onPress={changeLanguageHandler}
        title={settings.languages[el].name}
      />
    ));
  }
  return null;
};

export default connect(
  (state) => ({
    settings: state.settings,
  }),
  (dispatch) => ({
    settingsActions: bindActionCreators(settingsActions, dispatch),
  }),
)(LanguageSelection);
