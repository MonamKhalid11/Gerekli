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

export const ProductDetailNew = ({ pid, productDetail, productsActions }) => {
  const [product, setProduct] = useState('');

  async function fetchProduct(currentPid) {
    const result = await productsActions.fetch(currentPid);

    if (!result.data) {
      return;
    }

    const currentProduct = { ...result.data };
    const defaultOptions = { ...currentProduct.defaultdOptions };
    const defaultVariants = { ...currentProduct.defaultVariants };

    if (!Object.keys(defaultOptions).length) {
      currentProduct.convertedOptions.forEach((option) => {
        if (option.option_type === OPTION_TYPE_CHECKBOX) {
          defaultOptions[option.selectDefaultId] = option.selectVariants.find(
            (el) => parseInt(el.position, 10) === 0,
          );
        } else {
          defaultOptions[option.selectDefaultId] = option.selectVariants.find(
            (el) => el.selectId === option.selectDefaultId,
          );
        }
      });
    }

    if (!Object.keys(defaultVariants).length) {
      currentProduct.convertedVariants.forEach((variant) => {
        defaultVariants[variant.selectDefaultId] = variant.selectVariants.find(
          (el) => el.selectId === variant.selectDefaultId,
        );
      });
    }

    setProduct({ ...currentProduct, defaultVariants, defaultOptions });
  }

  useEffect(() => {
    fetchProduct(pid);
  }, []);

  console.log('useEffect product: ', product);

  const changeVariationHandler = async (variantId, variantOption) => {
    const selectedVariationPid = variantOption.product_id;
    const newVariant = { ...product.defaultVariants };
    newVariant[variantOption.variant_id] = variantOption;

    if (
      product.defaultVariants[variantId].product_id === selectedVariationPid
    ) {
      return null;
    }

    fetchProduct(selectedVariationPid);
  };

  const changeOptionHandler = (optionId, selectedOptionValue) => {
    const { selectedOptions } = this.state;
    const newOptions = { ...selectedOptions };
    newOptions[optionId] = selectedOptionValue;

    this.setState(
      {
        selectedOptions: newOptions,
      },
      () => {
        this.calculatePrice();
      },
    );
  };

  const renderVariationsAndOptions = () => {
    if (!product.defaultOptions && !product.defaultVariants) {
      return null;
    }

    return (
      <Section title={i18n.t('Select')}>
        <ProductDetailOptions
          options={product.convertedVariants}
          selectedOptions={product.defaultVariants}
          changeOptionHandler={changeVariationHandler}
        />
        <ProductDetailOptions
          options={product.convertedOptions}
          selectedOptions={product.defaultOptions}
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
