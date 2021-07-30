import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import i18n from '../utils/i18n';
import EStyleSheet from 'react-native-extended-stylesheet';
import DatePicker from 'react-native-date-picker';
import { Navigation } from 'react-native-navigation';

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

interface FeatureVariant {
  variant: string;
  variant_id: number;
  selected: boolean;
}

interface Feature {
  description: string;
  feature_id: number;
  feature_type: string;
  value: string;
  variant: string;
  variant_id: number;
  value_int: number;
  variants: [FeatureVariant];
}

interface DatePickerScreenProps {
  componentId: string;
  feature: Feature;
  changeDateHandler: Function;
  title: string;
}

export const DatePickerScreen: React.FC<DatePickerScreenProps> = ({
  componentId,
  feature,
  changeDateHandler,
  title,
}) => {
  const [date, setDate] = useState(new Date(feature.value_int * 1000));

  return (
    <View style={styles.container}>
      <DatePicker date={date} onDateChange={setDate} mode={'date'} />
      <TouchableOpacity onPress={() => {
          changeDateHandler(feature, date)
          Navigation.dismissModal(componentId);
        }}>
        <Text>Ok</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DatePickerScreen;
