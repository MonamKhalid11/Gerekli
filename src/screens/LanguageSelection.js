import React from 'react';
import { RadioButtonList } from '../components/RadioButtonList';
// import store from '../store';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Import actions.
import * as settingsActions from '../actions/settingsActions';

export const LanguageSelection = ({ settingsActions, settings }) => {
  const changeLanguageHandler = (language) => {
    settingsActions.setLanguage(language);
  };

  return (
    <RadioButtonList
      list={settings.languages}
      changeLanguageHandler={changeLanguageHandler}
    />
  );
};

export default connect(
  (state) => ({
    settings: state.settings,
  }),
  (dispatch) => ({
    settingsActions: bindActionCreators(settingsActions, dispatch),
  }),
)(LanguageSelection);
