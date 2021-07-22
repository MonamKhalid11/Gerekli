import React, { useEffect } from 'react';
import { ScrollView, Text, View, Switch } from 'react-native';
import { Navigation } from 'react-native-navigation';
import i18n from '../utils/i18n';
import { iconsMap } from '../utils/navIcons';
import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  container: {
    padding: 10,
  },
  itemWrapper: {
    marginVertical: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemText: {
    fontSize: '1rem',
  },
});

interface ScrollPickerProps {
  componentId: string;
  pickerValues: [string];
  changeMultipleCheckboxValueHandler: Function;
  selectValue: string;
  title: string;
  additionalData: {
    [key: string]: any;
  };
}

export const MultipleCheckboxPicker: React.FC<ScrollPickerProps> = ({
  componentId,
  pickerValues,
  changeMultipleCheckboxValueHandler,
  selectValue,
  title,
  additionalData,
}) => {
  const listener = {
    navigationButtonPressed: ({ buttonId }) => {
      if (buttonId === 'close') {
        Navigation.dismissModal(componentId);
      }
    },
  };

  useEffect(() => {
    Navigation.mergeOptions(componentId, {
      topBar: {
        title: {
          text: `${i18n.t('Select')} ${title}`.toUpperCase(),
        },
        rightButtons: [
          {
            id: 'close',
            icon: iconsMap.close,
          },
        ],
      },
    });

    const listeners = Navigation.events().registerComponentListener(
      listener,
      componentId,
    );

    return () => {
      listeners.remove();
    };
  });

  const renderItem = (value: string) => {
    const isItemActive = value === selectValue;

    return (
      <View style={styles.itemWrapper}>
        <Text style={styles.itemText}>{value}</Text>
        <Switch
          value={isItemActive}
          onValueChange={() => changeMultipleCheckboxValueHandler(value, additionalData)}
        />
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {pickerValues.map((value) => {
        return renderItem(value);
      })}
    </ScrollView>
  );
};

export default MultipleCheckboxPicker;
