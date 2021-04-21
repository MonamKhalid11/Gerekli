import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import i18n from '../utils/i18n';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
  stripTags,
  formatPrice,
  isPriceIncludesTax,
  formatDate,
} from '../utils';

// Import actions.
import * as productsActions from '../actions/productsActions';

// Components
import { ProductDetailOptions } from '../components/ProductDetailOptions';
import ProductImageSwiper from '../components/ProductImageSwiper';
import Section from '../components/Section';

const styles = EStyleSheet.create({
  container: {
    borderWidth: 1,
    height: '100%',
  },
});

export const ProductDetailNew = ({ pid, productsActions }) => {
  const [product, setProduct] = useState('');

  async function fetchProduct(currentPid) {
    const currentProduct = await productsActions.fetch(currentPid);
    setProduct(currentProduct);
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

  const renderDiscountLabel = () => {
    return (
      <View style={styles.listDiscountWrapper}>
        <Text style={styles.listDiscountText}>
          {`${i18n.t('Discount')} ${product.discount}%`}
        </Text>
      </View>
    );
  };

  const renderImage = () => {
    return (
      <View>
        <ProductImageSwiper>{product.images}</ProductImageSwiper>
        {product.discount && renderDiscountLabel()}
      </View>
    );
  };

  if (!product) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {renderImage()}
        {renderVariationsAndOptions()}
      </ScrollView>
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
