import React from 'react';
import { RadioButtonItem } from './RadioButtonItem';

const arr = ['1', '2', '3'];

export const RadioButtonList = () => {
  return arr.map((el) => <RadioButtonItem item={el} />);
};
