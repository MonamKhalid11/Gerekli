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
  useEffect(() => {
    async function fetchProduct() {
      setCurrentPid(pid)
      await productsActions.fetch(pid);
    }
    fetchProduct();
  }, []);

  useEffect(() => {
    if (product) {
      console.log('product use effect: ', product)
      const defaultOptions = { ...product.defaultdOptions };
      const defaultVariants = { ...product.defaultVariants };

      if (!Object.keys(defaultOptions).length) {
        product.convertedOptions.forEach((option) => {
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
        product.convertedVariants.forEach((variant) => {
          defaultVariants[
            variant.selectDefaultId
          ] = variant.selectVariants.find(
            (el) => el.selectId === variant.selectDefaultId,
          );
        });
      }

      setProduct({ ...product, defaultVariants, defaultOptions });
    }
  }, [pid, productDetail, product]);

  const [product, setProduct] = useState('');
  const [currentPid, setCurrentPid] = useState('')

  const changeVariationHandler = async (variantId, variantOption) => {
    // const { selectedVariants } = this.state;
    const newPid = variantOption.product_id;
    const newVariant = { ...product.defaultVariants };
    newVariant[variantOption.variant_id] = variantOption;

    if (product.defaultVariants[variantId].product_id === pid) {
      return null;
    }

    setCurrentPid(currentPid)

    const result = await productsActions.fetch(pid);
    console.log('result: ', result)
    setProduct(result.data);

    console.log(' changeVariationHandler product: ', product)

    // this.setState(
    //   {
    //     currentPid: pid,
    //     selectedVariants: newVariant,
    //     selectedOptions: {},
    //   },
    //   () => {
    //     this.productInit(pid);
    //   },
    // );
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

  if (
    product?.pruduct_id !== currentPid &&
    productDetail.byId[pid] &&
    !productDetail.byId[pid].fetching
  ) {
    setProduct(productDetail.byId[pid]);
  }

  // console.log('product: ', product.pruduct_id !== );

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
