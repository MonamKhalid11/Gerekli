import React, { useEffect } from 'react';
import { View, Text, Section } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import i18n from '../utils/i18n';

// Import actions.
import * as productsActions from '../actions/productsActions';

// Components
import { ProductDetailOptions } from '../components/ProductDetailOptions';

export const ProductDetailNew = ({ pid, productDetail, productsActions }) => {
  useEffect(() => {
    async function fetchProduct() {
      await productsActions.fetch(pid);
    }
    fetchProduct();
  }, [pid]);
  // const changeVariationHandler = (variantId, variantOption) => {
  //   const { selectedVariants } = this.state;
  //   const pid = variantOption.product_id;
  //   const newVariant = { ...selectedVariants };
  //   newVariant[variantOption.variant_id] = variantOption;

  //   if (selectedVariants[variantId].product_id === pid) {
  //     return null;
  //   }

  //   this.setState(
  //     {
  //       currentPid: pid,
  //       selectedVariants: newVariant,
  //       selectedOptions: {},
  //     },
  //     () => {
  //       this.productInit(pid);
  //     },
  //   );
  // };

  // const changeOptionHandler = (optionId, selectedOptionValue) => {
  //   const { selectedOptions } = this.state;
  //   const newOptions = { ...selectedOptions };
  //   newOptions[optionId] = selectedOptionValue;

  //   this.setState(
  //     {
  //       selectedOptions: newOptions,
  //     },
  //     () => {
  //       this.calculatePrice();
  //     },
  //   );
  // };

  // const renderVariationsAndOptions = () => {
  //   const { product, selectedOptions, selectedVariants } = this.state;

  //   if (
  //     !Object.keys(selectedOptions).length &&
  //     !Object.keys(selectedVariants).length
  //   ) {
  //     return null;
  //   }

  //   return (
  //     <Section title={i18n.t('Select')}>
  //       <ProductDetailOptions
  //         options={product.convertedVariants}
  //         selectedOptions={selectedVariants}
  //         changeOptionHandler={changeVariationHandler.bind(this)}
  //       />
  //       <ProductDetailOptions
  //         options={product.convertedOptions}
  //         selectedOptions={selectedOptions}
  //         changeOptionHandler={changeOptionHandler.bind(this)}
  //       />
  //     </Section>
  //   );
  // };

  console.log('productDetail: ', productDetail.byId);

  return (
    <View>
      <Text>PD</Text>
      {/* {renderVariationsAndOptions()} */}
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
