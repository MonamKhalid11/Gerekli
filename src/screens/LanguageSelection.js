import React from 'react';
import { RadioButtonList } from '../components/RadioButtonList';
import store from '../store';

export const LanguageSelection = () => {
  const { settings } = store.getState();

  return <RadioButtonList list={settings.languages} />;
};
