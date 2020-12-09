import React from 'react';
import { RadioButtonItem } from './RadioButtonItem';

export const RadioButtonList = ({ list }) => {
  if (list) {
    return Object.keys(list).map((el) => (
      <RadioButtonItem item={list[el].name} />
    ));
  }
  return null;
};
