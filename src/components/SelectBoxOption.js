import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from '../components/Icon';
import Picker from 'react-native-picker-view';
import RBSheet from 'react-native-raw-bottom-sheet';
import { capitalizeFirstLetter } from '../utils/index';

const styles = EStyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    paddingBottom: 8,
    paddingTop: 8,
    marginBottom: 15,
  },
  valueWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerValueText: {
    fontSize: '0.9rem',
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
 *
 * @return {JSX.Element}
 */
const SelectBoxOption = ({ option, value, onChange }) => {
  const refRBSheet = useRef();
  const [selectBoxIndex, setSelectBoxIndex] = useState(0);
  const pickerValues = option.variants.map((variant) =>
    capitalizeFirstLetter(variant.variant_name),
  );

  const changePickerValueHandler = (value) => {
    const selectedVariant = option.variants.find(
      (variant) => variant.variant_name.toLowerCase() === value.toLowerCase(),
    );
    onChange(selectedVariant);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => refRBSheet.current.open()}
        style={styles.container}>
        <View style={styles.valueWrapper}>
          <Text style={styles.pickerValueText}>
            {capitalizeFirstLetter(value.variant_name)}
          </Text>
          <Icon name="arrow-drop-down" style={styles.menuItemIcon} />
        </View>
      </TouchableOpacity>

      <RBSheet
        ref={refRBSheet}
        customStyles={{
          wrapper: {
            backgroundColor: 'transparent',
          },
          draggableIcon: {
            backgroundColor: '#000',
          },
        }}>
        <Picker
          values={pickerValues}
          selected={selectBoxIndex}
          onSelect={(value, index) => {
            setSelectBoxIndex(index);
            changePickerValueHandler(value);
          }}
        />
      </RBSheet>
    </>
  );
};

/**
 * @ignore
 */
SelectBoxOption.propTypes = {
  value: PropTypes.object,
};

export default SelectBoxOption;
