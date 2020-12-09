import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import theme from '../config/theme';

const styles = EStyleSheet.create({
  itemWrapper: {
    paddingRight: '1rem',
    paddingVertical: '1.2rem',
    marginLeft: '1rem',
    borderBottomWidth: 1,
    borderColor: theme.$menuItemsBorderColor,
  },
  itemText: {
    color: '#424040',
    fontSize: '0.8rem',
  },
});

export const RadioButtonItem = ({ item }) => {
  return (
    <TouchableOpacity
      onPress={() => console.log('It works!')}
      style={styles.itemWrapper}>
      <Text style={styles.itemText}>{item}</Text>
    </TouchableOpacity>
  );
};
