import React from 'react';
import { RadioButtonItem } from './RadioButtonItem';

export const RadioButtonList = ({ list, changeLanguageHandler }) => {
  if (list) {
    return Object.keys(list).map((el) => (
      <RadioButtonItem item={list[el]} onPress={changeLanguageHandler} />
    ));
  }
  return null;
};
