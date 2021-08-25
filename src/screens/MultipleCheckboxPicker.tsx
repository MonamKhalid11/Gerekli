import React, { useEffect, useState } from 'react';
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

interface MultipleCheckboxPickerProps {
  componentId: string;
  feature: Feature;
  changeMultipleCheckboxValueHandler: Function;
  title: string;
}

export const MultipleCheckboxPicker: React.FC<MultipleCheckboxPickerProps> = ({
  componentId,
  feature,
  changeMultipleCheckboxValueHandler,
  title,
}) => {
  const listener = {
    navigationButtonPressed: ({ buttonId }) => {
      if (buttonId === 'close') {
        Navigation.dismissModal(componentId);
      }
    },
  };

  const [currentFeature, setCurrentFeature] = useState<Feature | null>(null);

  useEffect(() => {
    Navigation.mergeOptions(componentId, {
      topBar: {
        title: {
          text: title.toUpperCase(),
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

    setCurrentFeature(feature);

    return () => {
      listeners.remove();
    };
  }, []);

  const { feature_id } = feature;

  const changeHandler = (variantId: number) => {
    if (!currentFeature) {
      return;
    }

    currentFeature.variants.map((variant) => {
      if (variant.variant_id === variantId) {
        variant.selected = !variant.selected;
      }
      return variant;
    });

    setCurrentFeature({ ...currentFeature });
    changeMultipleCheckboxValueHandler(feature_id, currentFeature);
  };

  const renderItem = (featureVariant: FeatureVariant, index: number) => {
    const { variant, selected, variant_id } = featureVariant;

    return (
      <View style={styles.itemWrapper} key={index}>
        <Text style={styles.itemText}>{variant}</Text>
        <Switch
          value={selected}
          onValueChange={() => changeHandler(variant_id)}
        />
      </View>
    );
  };

  if (!currentFeature) {
    return <View />;
  }

  return (
    <ScrollView style={styles.container}>
      {currentFeature.variants.map((featureVariant, index) => {
        return renderItem(featureVariant, index);
      })}
    </ScrollView>
  );
};

export default MultipleCheckboxPicker;
