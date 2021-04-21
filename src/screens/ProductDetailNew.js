import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import i18n from '../utils/i18n';
import EStyleSheet from 'react-native-extended-stylesheet';
import * as nav from '../services/navigation';
import { toInteger, get } from 'lodash';
import { formatPrice, isPriceIncludesTax, stripTags } from '../utils';

// Import actions.
import * as productsActions from '../actions/productsActions';

// Components
import { ProductDetailFeatures } from '../components/ProductDetailFeatures';
import { ProductDetailOptions } from '../components/ProductDetailOptions';
import ProductImageSwiper from '../components/ProductImageSwiper';
import DiscussionList from '../components/DiscussionList';
import { QtyOption } from '../components/QtyOption';
import Section from '../components/Section';
import Rating from '../components/Rating';

const styles = EStyleSheet.create({
  descriptionBlock: {
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    paddingLeft: 14,
    paddingRight: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F1F1',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
  },
});

export const ProductDetailNew = ({
  pid,
  productsActions,
  discussion,
  componentId,
}) => {
  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState(0);

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

  const renderName = () => {
    return <Text style={styles.nameText}>{product.product}</Text>;
  };

  const renderRating = () => {
    let activeDiscussion = discussion.items[`p_${product.product_id}`];
    return (
      <Rating
        containerStyle={styles.rating}
        value={activeDiscussion.average_rating}
        count={activeDiscussion.search.total_items}
      />
    );
  };

  const renderPrice = () => {
    let discountPrice = null;
    let discountTitle = null;
    let showDiscount = false;

    if (toInteger(product.discount)) {
      discountPrice = product.base_price_formatted.price;
      discountTitle = `${i18n.t('Old price')}: `;
      showDiscount = true;
    } else if (toInteger(product.list_price)) {
      discountPrice = product.list_price_formatted.price;
      discountTitle = `${i18n.t('List price')}: `;
      showDiscount = true;
    }

    const inStock = !Number(product.amount);
    const isProductPriceZero = Math.ceil(product.price) !== 0;
    const productTaxedPrice = get(product, 'taxed_price_formatted.price', '');
    const productPrice =
      productTaxedPrice || get(product, 'price_formatted.price', '');
    const showTaxedPrice = isPriceIncludesTax(product);

    return (
      <View>
        {showDiscount && isProductPriceZero && (
          <Text style={styles.listPriceWrapperText}>
            {discountTitle}
            <Text style={styles.listPriceText}>
              {formatPrice(discountPrice)}
            </Text>
          </Text>
        )}
        {isProductPriceZero ? (
          <>
            <Text style={styles.priceText}>
              {formatPrice(productPrice)}
              {showTaxedPrice && (
                <Text style={styles.smallText}>
                  {` (${i18n.t('Including tax')})`}
                </Text>
              )}
            </Text>
          </>
        ) : (
          <Text style={styles.zeroPrice}>
            {i18n.t('Contact us for a price')}
          </Text>
        )}
        {inStock && (
          <Text style={styles.outOfStockText}>{i18n.t('Out of stock')}</Text>
        )}
      </View>
    );
  };

  const renderDesc = () => {
    if (!product.full_description) {
      return null;
    }

    return (
      <Text style={styles.descText}>{stripTags(product.full_description)}</Text>
    );
  };

  const calculatePrice = () => {
    productsActions.recalculatePrice(
      product.product_id,
      product.selectedOptions,
    );
  };

  const renderQuantitySwitcher = () => {
    const step = parseInt(product.qty_step, 10) || 1;
    const max = parseInt(product.max_qty, 10) || parseInt(product.amount, 10);
    const min = parseInt(product.min_qty, 10) || step;

    return (
      <Section>
        {!product.isProductOffer && (
          <QtyOption
            max={max}
            min={min}
            initialValue={amount || min}
            step={step}
            onChange={(val) => {
              setAmount(val);
              calculatePrice();
            }}
          />
        )}
      </Section>
    );
  };

  const renderDiscussion = () => {
    if (!product.rating) {
      return null;
    }

    let activeDiscussion = discussion.items[`p_${product.product_id}`];

    const masMore = activeDiscussion.search.total_items > 10;
    let title = i18n.t('Reviews');
    // eslint-disable-next-line eqeqeq
    if (activeDiscussion.search.total_items != 0) {
      title = i18n.t('Reviews ({{count}})', {
        count: activeDiscussion.search.total_items,
      });
    }

    return (
      <Section
        title={title}
        wrapperStyle={styles.noPadding}
        showRightButton={true}
        rightButtonText={i18n.t('Write a Review')}
        onRightButtonPress={() => {
          nav.pushWriteReview(componentId, {
            activeDiscussion,
            discussionType: 'P',
            discussionId: product.product_id,
          });
        }}>
        <DiscussionList
          items={activeDiscussion.posts.slice(0, 4)}
          type={activeDiscussion.type}
        />
        {masMore && (
          <TouchableOpacity
            style={styles.sectionBtn}
            onPress={() => {
              nav.showDiscussion(componentId);
            }}>
            <Text style={styles.sectionBtnText}>{i18n.t('View All')}</Text>
          </TouchableOpacity>
        )}
      </Section>
    );
  };

  if (!product) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {renderImage()}
        <View style={styles.descriptionBlock}>
          {renderName()}
          {renderPrice()}
          {renderDesc()}
        </View>
        {renderQuantitySwitcher()}
        {product.rating && renderRating()}
        {renderVariationsAndOptions()}
        {renderDiscussion()}
        <ProductDetailFeatures product={product} />
      </ScrollView>
    </View>
  );
};

export default connect(
  (state) => ({
    settings: state.settings,
    productDetail: state.productDetail,
    discussion: state.discussion,
  }),
  (dispatch) => ({
    productsActions: bindActionCreators(productsActions, dispatch),
  }),
)(ProductDetailNew);
