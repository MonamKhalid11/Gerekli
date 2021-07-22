import React, { useEffect, useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect, RootStateOrAny } from 'react-redux';
import { View, ScrollView, TouchableOpacity, Text, Switch } from 'react-native';
import {
  FEATURE_TYPE_DATE,
  FEATURE_TYPE_CHECKBOX,
  FEATURE_TYPE_SELECT_S,
  FEATURE_TYPE_SELECT_E,
  FEATURE_TYPE_CHECKBOX_MULTIPLE,
} from '../../constants';
import EStyleSheet from 'react-native-extended-stylesheet';
import i18n from '../../utils/i18n';
import { format } from 'date-fns';
import * as nav from '../../services/navigation';

// Components
import BottomActions from '../../components/BottomActions';
import SectionRow from '../../components/SectionRow';

// Actions
import * as productsActions from '../../actions/vendorManage/productsActions';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  checkboxWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scrollContainer: {
    paddingBottom: 14,
  },
  itemDescription: {
    fontSize: '0.9rem',
  },
});

interface Feature {
  description: string;
  feature_id: number;
  feature_type: string;
  value: string;
  variant: string;
  variant_id: number;
  value_int: number;
  variants: {
    variant: string;
    variant_id: number;
    selected?: boolean;
  }[];
}

interface FeatureForSend {
  feature_id: number;
  value: string;
  variants: {
    variant: string;
    variant_id: number;
    selected?: boolean;
  }[];
}

interface ProductFeatures {
  [key: string]: Feature;
}

interface FeaturesProps {
  productId: string;
  productsActions: {
    [key: string]: Function;
  };
}

export const Features: React.FC<FeaturesProps> = ({
  productsActions,
  productId,
  settings,
}) => {
  const [
    productFeatures,
    setProductFeatures,
  ] = useState<ProductFeatures | null>(null);

  useEffect(() => {
    const getProductFeatures = async () => {
      const result = await productsActions.fetchProductFeatures(productId);
      // console.log('result:', result);

      setProductFeatures(result);
    };
    getProductFeatures();
  }, [productId, productsActions]);

  const renderCheckbox = (feature: Feature) => {
    const { value, description } = feature;
    const switcherValue = value === 'Y';

    return (
      <View style={styles.checkboxWrapper}>
        <Text style={styles.itemDescription}>{description}: </Text>
        <Switch
          value={switcherValue}
          onValueChange={() =>
            changeCheckboxValueHandler(feature, switcherValue)
          }
        />
      </View>
    );
  };

  const renderSelect = (feature: Feature) => {
    const { variant, description } = feature;
    const pickerValues = feature.variants.map((variant) => variant.variant);

    return (
      <TouchableOpacity
        onPress={() => {
          nav.showModalScrollPicker({
            pickerValues: pickerValues,
            changePickerValueHandler: changeSelectValueHandler,
            selectValue: variant,
            title: i18n.t('Edit features'),
            additionalData: feature,
          });
        }}>
        <SectionRow name={description} value={variant} />
      </TouchableOpacity>
    );
  };

  const renderDate = () => {
    return null;
  };

  const renderMultipleCheckbox = (feature: Feature) => {
    const { variant, description } = feature;
    const pickerValues = feature.variants.map((variant) => variant.variant);

    return (
      <TouchableOpacity
        onPress={() => {
          nav.showModalMultipleCheckboxPicker({
            pickerValues: pickerValues,
            changeMultipleCheckboxValueHandler: changeMultipleCheckboxValueHandler,
            selectValue: variant,
            title: i18n.t('Edit features'),
            additionalData: feature,
          });
        }}>
        <SectionRow name={description} value={variant} />
      </TouchableOpacity>
    );
  };

  const changeSelectValueHandler = (
    selectedFeatureVariant: string,
    feature: { [key: string]: any },
  ) => {
    const { feature_id } = feature;
    let selectedFeatureVariantId;

    for (let i = 0; i < feature.variants.length; i++) {
      if (feature.variants[i].variant === selectedFeatureVariant) {
        selectedFeatureVariantId = feature.variants[i].variant_id;
      }
    }

    if (!productFeatures) {
      return;
    }

    productFeatures[feature_id].variant_id = selectedFeatureVariantId;
    productFeatures[feature_id].variant = selectedFeatureVariant;

    setProductFeatures({ ...productFeatures });
  };

  const changeCheckboxValueHandler = (
    feature: Feature,
    switcherValue: boolean,
  ) => {
    const { feature_id } = feature;

    if (!productFeatures) {
      return;
    }

    productFeatures[feature_id].value = switcherValue ? 'N' : 'Y';
    setProductFeatures({ ...productFeatures });
  };

  const changeMultipleCheckboxValueHandler = (feature, data) => {
    const { feature_id } = data;
    let chosenVariant;
    data.variants.map((variant) => {
      if (variant.variant === feature) {
        chosenVariant = variant;
      }
    });

    if (!productFeatures || !chosenVariant) {
      return;
    }

    console.log('chosenVariant: ', feature, data, chosenVariant);
    productFeatures[feature_id].variant = chosenVariant.variant;
    productFeatures[feature_id].variant_id = chosenVariant.variant_id;
    setProductFeatures({ ...productFeatures });
  };

  const saveHandler = async () => {
    if (!productFeatures) {
      return;
    }

    const sentProductFeatures: { [key: number]: FeatureForSend } = {};
    const productFeaturesKeys = Object.keys(productFeatures);

    for (let i = 0; i < productFeaturesKeys.length; i++) {
      const feature: FeatureForSend = {
        feature_id: 0,
        value: '',
        variants: [],
      };
      feature.feature_id = productFeatures[productFeaturesKeys[i]].feature_id;
      feature.value = productFeatures[productFeaturesKeys[i]].value;

      if (productFeatures[productFeaturesKeys[i]].variants.length) {
        feature.variants = productFeatures[productFeaturesKeys[i]].variants.map(
          (variant) => {
            if (
              variant.variant_id ===
              productFeatures[productFeaturesKeys[i]].variant_id
            ) {
              variant.selected = true;
            }
            return variant;
          },
        );
      }

      sentProductFeatures[
        productFeatures[productFeaturesKeys[i]].feature_id
      ] = feature;
    }

    console.log('sentProductFeatures: ', sentProductFeatures);

    await productsActions.updateProductFeatures(productId, sentProductFeatures);
  };

  const renderFeatureItem = (feature: Feature) => {
    const { feature_type } = feature;
    console.log('feature: ', feature);

    // let newValue: string;
    let renderElement = null;

    switch (feature_type) {
      case FEATURE_TYPE_DATE:
        // newValue = format(value_int * 1000, settings.dateFormat);
        renderElement = () => renderDate();
        break;
      case FEATURE_TYPE_CHECKBOX:
        renderElement = () => renderCheckbox(feature);
        break;
      case FEATURE_TYPE_SELECT_S:
      case FEATURE_TYPE_SELECT_E:
        renderElement = () => renderSelect(feature);
        break;
      case FEATURE_TYPE_CHECKBOX_MULTIPLE:
        renderElement = () => renderMultipleCheckbox(feature);
        break;
      default:
        return;
    }

    return renderElement();
  };

  if (!productFeatures) {
    return null;
  }

  const features = Object.keys(productFeatures).map(
    (k: string) => productFeatures[k],
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {features.map((item) => renderFeatureItem(item))}
      </ScrollView>
      <BottomActions onBtnPress={saveHandler} />
    </View>
  );
};

export default connect(
  (state: RootStateOrAny) => ({
    product: state.vendorManageProducts.current,
    settings: state.settings,
  }),
  (dispatch) => ({
    productsActions: bindActionCreators(productsActions, dispatch),
  }),
)(Features);
