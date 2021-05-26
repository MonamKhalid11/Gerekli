import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from '../components/Icon';
import Picker from 'react-native-picker-view';
import RawBottomSheet from 'react-native-raw-bottom-sheet';

const styles = EStyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    paddingBottom: 8,
    paddingTop: 8,
    marginVertical: 10,
  },
  selectWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconAndValueWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectBoxText: {
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
  const currentSelectBoxIndex = option.selectVariants
    .map((variant) => variant.selectValue)
    .indexOf(value.selectValue);

  const refRawBottomSheet = useRef();
  const [selectBoxIndex, setSelectBoxIndex] = useState(currentSelectBoxIndex);
  if (!value) {
    return null;
  }

  const pickerValues = option.selectVariants.map(
    (variant) => variant.selectValue,
  );

  const changePickerValueHandler = (value) => {
    const selectedVariant = option.selectVariants.find(
      (variant) => variant.selectValue.toLowerCase() === value.toLowerCase(),
    );
    onChange(selectedVariant);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => refRawBottomSheet.current.open()}
        style={styles.container}>
        <View style={styles.selectWrapper}>
          <Text style={styles.selectBoxText}>{option.selectTitle}</Text>
          <View style={styles.iconAndValueWrapper}>
            <Text style={styles.selectBoxText}>{value.selectValue}</Text>
            <Icon name="arrow-drop-down" style={styles.menuItemIcon} />
          </View>
        </View>
      </TouchableOpacity>

      <RawBottomSheet
        ref={refRawBottomSheet}
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
      </RawBottomSheet>
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