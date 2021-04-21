import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import i18n from '../utils/i18n';

// Import actions.
import * as productsActions from '../actions/productsActions';

// Components
import { ProductDetailOptions } from '../components/ProductDetailOptions';
import Section from '../components/Section';
import EStyleSheet from 'react-native-extended-stylesheet';

const OPTION_TYPE_CHECKBOX = 'C';

const styles = EStyleSheet.create({
  container: {
    borderWidth: 1,
    height: '100%',
  },
});

export const ProductDetailNew = ({ pid, productsActions }) => {
  const [product, setProduct] = useState('');

  async function fetchProduct(currentPid) {
    const result = await productsActions.fetch(currentPid);

    if (!result.data) {
      return;
    }

    const currentProduct = { ...result.data };
    const selectedOptions = { ...currentProduct.selectedOptions };
    const selectedVariants = { ...currentProduct.selectedVariants };

    if (!Object.keys(selectedOptions).length) {
      currentProduct.convertedOptions.forEach((option) => {
        if (option.option_type === OPTION_TYPE_CHECKBOX) {
          selectedOptions[option.selectDefaultId] = option.selectVariants.find(
            (el) => parseInt(el.position, 10) === 0,
          );
        } else {
          selectedOptions[option.selectDefaultId] = option.selectVariants.find(
            (el) => el.selectId === option.selectDefaultId,
          );
        }
      });
    }

    if (!Object.keys(selectedVariants).length) {
      currentProduct.convertedVariants.forEach((variant) => {
        selectedVariants[variant.selectDefaultId] = variant.selectVariants.find(
          (el) => el.selectId === variant.selectDefaultId,
        );
      });
    }

    setProduct({ ...currentProduct, selectedVariants, selectedOptions });
  }

  useEffect(() => {
    fetchProduct(pid);
  }, []);

  const changeVariationHandler = async (variantId, variantOption) => {
    const selectedVariationPid = variantOption.product_id;
    const currnetVariationPid = product.selectedVariants[variantId].product_id;

    if (currnetVariationPid === selectedVariationPid) {
      return null;
    }

    fetchProduct(selectedVariationPid);
  };

  const changeOptionHandler = (optionId, selectedOptionValue) => {
    const newOptions = { ...product.selectedOptions };
    newOptions[optionId] = selectedOptionValue;
    setProduct({ ...product, selectedOptions: newOptions });
  };

  const renderVariationsAndOptions = () => {
    return (
      <Section title={i18n.t('Select')}>
        <ProductDetailOptions
          options={product.convertedVariants}
          selectedOptions={product.selectedVariants}
          changeOptionHandler={changeVariationHandler}
        />
        <ProductDetailOptions
          options={product.convertedOptions}
          selectedOptions={product.selectedOptions}
          changeOptionHandler={changeOptionHandler}
        />
      </Section>
    );
  };

  if (!product) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text>PD</Text>
      {renderVariationsAndOptions()}
    </View>
  );
};

export default connect(
  (state) => ({
    settings: state.settings,
    productDetail: state.productDetail,
  }),
  (dispatch) => ({
    productsActions: bindActionCreators(productsActions, dispatch),
  }),
)(ProductDetailNew);
