import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from '../components/Icon';

const styles = EStyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
    paddingBottom: 8,
    paddingTop: 8,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  nameText: {
    fontWeight: 'bold',
  },
  valueWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    fontSize: '1.2rem',
    marginHorizontal: 5,
  },
});

/**
 * Renders row with name and value.
 *
 * @param {object} option - Option information.
 * @param {string} value - Option value.
 * @param {boolean} last - Last row in the list or not.
 *
 * @return {JSX.Element}
 */
const SelectBoxOption = ({ option, value, onChange, style }) => {
  return (
    <TouchableOpacity
      onPress={() => console.log('it works')}
      style={{ ...styles.container, ...style }}>
      <View style={styles.name}>
        <Text style={styles.nameText}>{option.name}</Text>
      </View>
      <View style={styles.valueWrapper}>
        <View style={styles.value}>
          {/* <Text style={styles.valueText}>{value}</Text> */}
        </View>
        <Icon name="arrow-drop-down" style={styles.menuItemIcon} />
      </View>
    </TouchableOpacity>
  );
};

/**
 * @ignore
 */
SelectBoxOption.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  last: PropTypes.bool,
};

export default SelectBoxOption;
