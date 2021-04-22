import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import i18n from '../utils/i18n';
import EStyleSheet from 'react-native-extended-stylesheet';
import * as nav from '../services/navigation';
import { toInteger, get } from 'lodash';
import { formatPrice, isPriceIncludesTax, stripTags } from '../utils';
import config from '../config';
import { isEmpty } from 'lodash';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';

// Import actions.
import * as productsActions from '../actions/productsActions';
import * as wishListActions from '../actions/wishListActions';
import * as cartActions from '../actions/cartActions';

// Components
import { ProductDetailVendorInfo } from '../components/ProductDetailVendorInfo';
import { ProductDetailFeatures } from '../components/ProductDetailFeatures';
import { ProductDetailOptions } from '../components/ProductDetailOptions';
import ProductImageSwiper from '../components/ProductImageSwiper';
import { AddToCartButton } from '../components/AddToCartButton';
import DiscussionList from '../components/DiscussionList';
import InAppPayment from '../components/InAppPayment';
import { QtyOption } from '../components/QtyOption';
import { Seller } from '../components/Seller';
import Section from '../components/Section';
import Rating from '../components/Rating';
import Spinner from '../components/Spinner';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$screenBackgroundColor',
  },
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
  addToCartContainerWrapper: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 24,
  },
  addToCartContainer: {
    paddingLeft: 14,
    paddingRight: 14,
    paddingBottom: 16,
    paddingTop: 8,
    backgroundColor: '#fff',
    flexDirection: 'row',
  },
});

export const ProductDetailNew = ({
  pid,
  productsActions,
  wishListActions,
  discussion,
  componentId,
  auth,
  cartActions,
}) => {
  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState(1);

  const fetchProduct = async (currentPid) => {
    const currentProduct = await productsActions.fetch(currentPid);
    const step = parseInt(currentProduct.qty_step, 10) || 1;
    setAmount(step);
    setProduct(currentProduct);
  };

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

  const changeOptionHandler = async (optionId, selectedOptionValue) => {
    const newOptions = { ...product.selectedOptions };
    newOptions[optionId] = selectedOptionValue;
    const recalculatedProduct = await productsActions.recalculatePrice(
      product.product_id,
      newOptions,
    );
    setProduct({ ...recalculatedProduct });
  };

  const renderVariationsAndOptions = () => {
    if (isEmpty(product.selectedOptions) && isEmpty(product.selectedVariants)) {
      return null;
    }

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
    if (!product.rating) {
      return null;
    }

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

  const renderQuantitySwitcher = () => {
    const step = parseInt(product.qty_step, 10) || 1;
    const max = parseInt(product.max_qty, 10) || parseInt(product.amount, 10);
    const min = parseInt(product.min_qty, 10) || step;

    if (product.isProductOffer) {
      return null;
    }

    return (
      <Section>
        <QtyOption
          max={max}
          min={min}
          initialValue={amount || min}
          step={step}
          onChange={(val) => {
            setAmount(val);
          }}
        />
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

  const handleAddToWishList = (productOffer) => {
    const productOptions = {};

    const currentProduct = productOffer || product;

    if (!auth.logged) {
      return nav.showLogin();
    }

    // Convert product options to the option_id: variant_id array.
    Object.keys(product.selectedOptions).forEach((k) => {
      productOptions[k] = product.selectedOptions[k];
      if (product.selectedOptions[k].variant_id) {
        productOptions[k] = product.selectedOptions[k].variant_id;
      }
    });

    const products = {
      [currentProduct.product_id]: {
        product_id: currentProduct.product_id,
        amount: currentProduct.selectedAmount || 1,
        product_options: productOptions,
      },
    };

    return wishListActions.add({ products }, componentId);
  };

  const renderSellers = () => {
    if (!product.isProductOffer) {
      return null;
    }

    return (
      <Section title={i18n.t('Sellers')} wrapperStyle={styles.noPadding}>
        {product.productOffers.products.map((el, index) => {
          return (
            <Seller
              productOffer={el}
              handleAddToWishList={() => handleAddToWishList(el)}
              isLastVendor={product.productOffers.products.length - 1 === index}
              key={index}
              onPress={() => handleAddToCart(true, el)}
            />
          );
        })}
      </Section>
    );
  };

  const handleAddToCart = (showNotification = true, productOffer) => {
    const productOptions = {};

    if (!auth.logged) {
      return nav.showLogin();
    }

    const currentProduct = productOffer || product;

    // Convert product options to the option_id: variant_id array.
    Object.keys(product.selectedOptions).forEach((k) => {
      productOptions[k] = product.selectedOptions[k];
      if (product.selectedOptions[k].variant_id) {
        productOptions[k] = product.selectedOptions[k].variant_id;
      }
    });

    const products = {
      [currentProduct.product_id]: {
        product_id: currentProduct.product_id,
        amount,
        product_options: productOptions,
      },
    };

    return cartActions.add({ products }, showNotification);
  };

  const renderAddToCart = () => {
    const canPayWithApplePay = Platform.OS === 'ios' && config.applePay;

    if (product.isProductOffer) {
      return null;
    }

    return (
      <View style={styles.addToCartContainerWrapper}>
        <View style={styles.addToCartContainer}>
          {canPayWithApplePay && (
            <View style={styles.inAppPaymentWrapper}>
              <InAppPayment onPress={this.handleApplePay} />
            </View>
          )}
          <AddToCartButton onPress={() => handleAddToCart()} />
        </View>
      </View>
    );
  };

  if (!product) {
    return <Spinner visible={true} />;
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {renderImage()}
        <View style={styles.descriptionBlock}>
          {renderName()}
          {renderRating()}
          {renderPrice()}
          {renderDesc()}
        </View>
        {renderQuantitySwitcher()}
        {renderVariationsAndOptions()}
        {renderDiscussion()}
        <ProductDetailFeatures product={product} />
        <ProductDetailVendorInfo vendor={product.vendor} />
        {renderSellers()}
      </ScrollView>
      {renderAddToCart()}
    </View>
  );
};

export default connect(
  (state) => ({
    settings: state.settings,
    productDetail: state.productDetail,
    discussion: state.discussion,
    auth: state.auth,
  }),
  (dispatch) => ({
    cartActions: bindActionCreators(cartActions, dispatch),
    productsActions: bindActionCreators(productsActions, dispatch),
    wishListActions: bindActionCreators(wishListActions, dispatch),
  }),
)(ProductDetailNew);
