import React, { useEffect, useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect, RootStateOrAny } from 'react-redux';
import { View, ScrollView, TouchableOpacity, Text, Switch } from 'react-native';
import {
  FEATURE_TYPE_DATE,
  FEATURE_TYPE_CHECKBOX,
  FEATURE_TYPE_SELECT,
  FEATURE_TYPE_BRAND,
  FEATURE_TYPE_CHECKBOX_MULTIPLE,
} from '../../constants';
import EStyleSheet from 'react-native-extended-stylesheet';
import i18n from '../../utils/i18n';
import { format } from 'date-fns';
import * as nav from '../../services/navigation';

// Components
import BottomActions from '../../components/BottomActions';

// Actions
import * as productsActions from '../../actions/vendorManage/productsActions';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    padding: '$containerPadding',
  },
  featureWrapper: {
    borderBottomWidth: 1,
    borderColor: '$mediumGrayColor',
    paddingVertical: 14,
  },
  checkboxWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowDescriptionWrapper: {
    width: '40%',
    flexDirection: 'row',
  },
  rowVariantWrapper: {
    width: '40%',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  text: {
    fontSize: '0.8rem',
    color: '$darkColor',
  },
  noFeaturesMessageWrapper: {
    padding: '$containerPadding',
  },
  noFeaturesMessageText: {
    textAlign: 'center',
    fontSize: '0.8rem',
    color: '$mediumGrayColor',
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
    selected: boolean;
  }[];
}

interface FeatureForSend {
  feature_id: number;
  value: string | number;
  value_int?: number;
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

      setProductFeatures(result);
    };
    getProductFeatures();
  }, [productId, productsActions]);

  const renderCheckbox = (feature: Feature) => {
    const { value, description } = feature;
    const switcherValue = value === 'Y';

    return (
      <View
        style={{ ...styles.checkboxWrapper, ...styles.featureWrapper }}
        key={feature.feature_id}>
        <View style={styles.rowDescriptionWrapper}>
          <Text style={styles.text}>{description}: </Text>
        </View>
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
        key={feature.feature_id}
        style={styles.featureWrapper}
        onPress={() => {
          nav.showModalScrollPicker({
            pickerValues: pickerValues,
            changePickerValueHandler: changeSelectValueHandler,
            selectValue: variant,
            title: i18n.t('Select Feature'),
            additionalData: feature,
          });
        }}>
        <View style={styles.row}>
          <View style={styles.rowDescriptionWrapper}>
            <Text style={styles.text}>{description}</Text>
          </View>
          <View style={styles.rowVariantWrapper}>
            <Text style={styles.text}>{variant}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderDate = (feature: Feature) => {
    const { description, value_int } = feature;
    const date = format(value_int * 1000, settings.dateFormat);

    return (
      <TouchableOpacity
        key={feature.feature_id}
        style={styles.featureWrapper}
        onPress={() => {
          nav.showModalDatePickerScreen({
            feature: feature,
            startDate: date,
            changeDateHandler,
            title: i18n.t('Select Date'),
          });
        }}>
        <View style={styles.row}>
          <View style={styles.rowDescriptionWrapper}>
            <Text style={styles.text}>{description}</Text>
          </View>
          <View style={styles.rowVariantWrapper}>
            <Text style={styles.text}>{date}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderMultipleCheckbox = (feature: Feature) => {
    const { description, variants } = feature;

    return (
      <TouchableOpacity
        key={feature.feature_id}
        style={styles.featureWrapper}
        onPress={() => {
          nav.showModalMultipleCheckboxPicker({
            feature: feature,
            changeMultipleCheckboxValueHandler: changeMultipleCheckboxValueHandler,
            title: i18n.t('Select Features'),
          });
        }}>
        <View style={styles.row}>
          <View style={styles.rowDescriptionWrapper}>
            <Text style={styles.text}>{description}</Text>
          </View>
          <View style={styles.rowVariantWrapper}>
            {variants.map((variant) => {
              if (variant.selected) {
                return <Text style={styles.text}>{variant.variant}</Text>;
              }
            })}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const changeDateHandler = (feature: Feature, date: Date) => {
    if (!productFeatures) {
      return;
    }

    productFeatures[feature.feature_id].value_int = date.getTime() / 1000;
    setProductFeatures({ ...productFeatures });
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

  const changeMultipleCheckboxValueHandler = (
    featureId: number,
    feature: Feature,
  ) => {
    if (!productFeatures) {
      return;
    }

    productFeatures[featureId] = feature;
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

      if (productFeatures[productFeaturesKeys[i]].value_int) {
        feature.value = productFeatures[productFeaturesKeys[i]].value_int;
      }

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

    await productsActions.updateProductFeatures(productId, sentProductFeatures);
  };

  const renderNoFeaturesMessage = () => {
    return (
      <View style={styles.noFeaturesMessageWrapper}>
        <Text style={styles.noFeaturesMessageText}>
          {i18n.t('There is no features yet.')}
        </Text>
      </View>
    );
  };

  const renderFeatureItem = (feature: Feature) => {
    const { feature_type } = feature;

    // let newValue: string;
    let renderElement = null;

    switch (feature_type) {
      case FEATURE_TYPE_DATE:
        // newValue = format(value_int * 1000, settings.dateFormat);
        renderElement = () => renderDate(feature);
        break;
      case FEATURE_TYPE_CHECKBOX:
        renderElement = () => renderCheckbox(feature);
        break;
      case FEATURE_TYPE_SELECT:
      case FEATURE_TYPE_BRAND:
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

  if (!features.length) {
    return renderNoFeaturesMessage();
  }

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
