import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import toInteger from 'lodash/toInteger';
import debounce from 'lodash/debounce';
import { connect } from 'react-redux';
import {
  View,
  Text,
  Share,
  Platform,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import format from 'date-fns/format';
import EStyleSheet from 'react-native-extended-stylesheet';
import ActionSheet from 'react-native-actionsheet';
import get from 'lodash/get';
import {
  stripTags,
  formatPrice,
  getProductImagesPaths,
  isPriceIncludesTax,
} from '../utils';
import * as nav from '../services/navigation';

// Import actions.
import * as cartActions from '../actions/cartActions';
import * as productsActions from '../actions/productsActions';
import * as wishListActions from '../actions/wishListActions';
import * as vendorActions from '../actions/vendorActions';

// Components
import ProductImageSwiper from '../components/ProductImageSwiper';
import DiscussionList from '../components/DiscussionList';
import InAppPayment from '../components/InAppPayment';
import SelectOption from '../components/SelectOption';
import InputOption from '../components/InputOption';
import { QtyOption } from '../components/QtyOption';
import SwitchOption from '../components/SwitchOption';
import SectionRow from '../components/SectionRow';
import { Seller } from '../components/Seller';
import Spinner from '../components/Spinner';
import Section from '../components/Section';
import Rating from '../components/Rating';
import { AddToCartButton } from '../components/AddToCartButton';

import i18n from '../utils/i18n';
import config from '../config';
import { iconsMap } from '../utils/navIcons';

import {
  DISCUSSION_COMMUNICATION_AND_RATING,
  DISCUSSION_RATING,
  DISCUSSION_DISABLED,
  VERSION_MVE,
  FEATURE_TYPE_DATE,
  FEATURE_TYPE_CHECKBOX,
} from '../constants';
import { Navigation } from 'react-native-navigation';
import theme from '../config/theme';

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
  nameText: {
    fontSize: '1.2rem',
    color: '$darkColor',
    marginBottom: 5,
    textAlign: 'left',
  },
  priceText: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '$darkColor',
    textAlign: 'left',
  },
  smallText: {
    fontSize: '0.8rem',
    fontWeight: 'normal',
    color: '$darkColor',
  },
  outOfStockText: {
    color: '$dangerColor',
    marginTop: 10,
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
  listPriceText: {
    textDecorationLine: 'line-through',
    color: '$darkColor',
    textAlign: 'left',
  },
  listPriceWrapperText: {
    textAlign: 'left',
  },
  promoText: {
    marginBottom: 10,
  },
  descText: {
    marginTop: 10,
    color: 'gray',
    textAlign: 'left',
  },
  noFeaturesText: {
    textAlign: 'left',
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
  noPadding: {
    padding: 0,
    paddingTop: 6,
    paddingBottom: 6,
  },
  sectionBtn: {
    paddingLeft: 14,
    paddingRight: 14,
    paddingTop: 12,
    paddingBottom: 6,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  sectionBtnText: {
    color: '$primaryColor',
    fontSize: '0.9rem',
    textAlign: 'left',
    maxWidth: 100,
  },
  vendorWrapper: {
    paddingLeft: 14,
    paddingRight: 14,
    paddingTop: 8,
    paddingBottom: 8,
    marginBottom: 10,
  },
  vendorName: {
    fontSize: '1rem',
    fontWeight: 'bold',
    textAlign: 'left',
    marginRight: 100,
  },
  vendorProductCount: {
    fontSize: '0.7rem',
    color: 'gray',
    marginBottom: 13,
    textAlign: 'left',
  },
  vendorDescription: {
    color: 'gray',
    fontSize: '0.9rem',
    textAlign: 'left',
  },
  vendorInfoBtn: {
    position: 'absolute',
    top: 10,
    right: '1rem',
  },
  rating: {
    marginLeft: -10,
    marginRight: -10,
    marginTop: -4,
  },
  keyboardAvoidingContainer: {
    marginBottom: Platform.OS === 'ios' ? 122 : 132,
  },
  listDiscountWrapper: {
    backgroundColor: '$productDiscountColor',
    position: 'absolute',
    top: 4,
    right: 4,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 4,
    paddingRight: 4,
    borderRadius: 2,
  },
  listDiscountText: {
    color: '#fff',
  },
  inAppPaymentWrapper: {
    flex: 2,
    marginRight: 10,
  },
  zeroPrice: {
    paddingTop: 10,
  },
});

/**
 * Renders product detail screen.
 *
 * @reactProps {object} wishListActions - Wishlist actions.
 * @reactProps {string or number} pid - Product id.
 * @reactProps {boolean} hideSearch - Showing search or not.
 * @reactProps {boolean} hideWishList - Showing wishlist or not.
 * @reactProps {object} discussion - Comments about the product.
 * @reactProps {object} productDetail - Product information.
 * @reactProps {object} productsActions - Products actions.
 * @reactProps {object} cartActions - Cart actions.
 * @reactProps {object} auth - Auth setup.
 * @reactProps {object} cart - Cart information.
 * @reactProps {object} vendorActions - Vendor actions.
 * @reactProps {object} vendors - Information about vendors who has this product.
 */
export class ProductDetail extends Component {
  /**
   * @ignore
   */
  static propTypes = {
    wishListActions: PropTypes.shape({
      add: PropTypes.func,
    }),
    pid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    hideSearch: PropTypes.bool,
    hideWishList: PropTypes.bool,
    discussion: PropTypes.shape({
      posts: PropTypes.arrayOf(PropTypes.shape({})),
    }),
    productDetail: PropTypes.shape({}),
    productsActions: PropTypes.shape({
      recalculatePrice: PropTypes.func,
    }),
    cartActions: PropTypes.shape({
      add: PropTypes.func,
    }),
    auth: PropTypes.shape({
      token: PropTypes.string,
      logged: PropTypes.bool,
    }),
    cart: PropTypes.shape({
      fetching: PropTypes.bool,
    }),
    vendorActions: PropTypes.shape({
      fetch: PropTypes.func,
    }),
    vendors: PropTypes.shape({}),
  };

  /**
   * @ignore
   */
  constructor(props) {
    super(props);

    this.isVendorFetchRequestSent = false;

    this.state = {
      images: [],
      product: {},
      currentFeatureVariants: {},
      discussion: {},
      vendor: null,
      fetching: true,
      selectedOptions: {},
      canWriteComments: false,
      amount: 0,
      currentPid: false,
      showSwiper: true,
      productOffers: null,
    };

    Navigation.events().bindComponent(this);
  }

  /**
   *  Gets product information and sets to store.
   */
  componentDidMount() {
    this.productInit();
  }

  /**
   * Updates all data in the state when new props are received.
   */
  componentWillReceiveProps(nextProps) {
    const {
      productDetail,
      wishList,
      vendors,
      discussion,
      auth,
      vendorActions,
      hideWishList,
    } = nextProps;
    const product = productDetail;

    if (!product) {
      return;
    }

    // If we haven't images put main image.
    const images = getProductImagesPaths(product);

    // Fixme
    if (
      config.version === VERSION_MVE &&
      !vendors.items[product.company_id] &&
      !vendors.fetching &&
      product.company_id &&
      !this.isVendorFetchRequestSent
    ) {
      this.isVendorFetchRequestSent = true;
      vendorActions.fetch(product.company_id);
    }

    const defaultOptions = { ...this.state.selectedOptions };
    if (!Object.keys(defaultOptions).length) {
      product.options.forEach((option) => {
        // Fixme: Server returned inconsistent data.
        if (!option.variants) {
          option.variants = [];
        }

        if (option.variants[option.value]) {
          defaultOptions[option.option_id] = option.variants[option.value];
        } else if (Object.values(option.variants).length) {
          defaultOptions[option.option_id] = Object.values(option.variants)[0];
        }
      });
    }

    // Get active discussion.
    let activeDiscussion = discussion.items[`p_${product.product_id}`];
    if (!activeDiscussion) {
      activeDiscussion = {
        average_rating: 0,
        disable_adding: true,
        posts: [],
        search: {
          page: 1,
          total_items: 0,
        },
      };
    }

    this.setState({
      images,
      product,
      discussion: activeDiscussion,
      selectedOptions: defaultOptions,
      vendor: vendors.items[product.company_id] || null,
      canWriteComments:
        !activeDiscussion.disable_adding &&
        productDetail.discussion_type !== DISCUSSION_DISABLED &&
        auth.logged,
    });

    const topBar = {
      title: {
        text: product.product,
      },
    };

    if (!hideWishList) {
      const wishListActive = wishList.items.some(
        (item) => parseInt(item.product_id, 10) === productDetail.product_id,
      );
      topBar.rightButtons = [
        {
          id: 'wishlist',
          icon: iconsMap.favorite,
          color: wishListActive
            ? theme.$primaryColor
            : theme.$navBarButtonColor,
        },
        {
          id: 'share',
          icon: iconsMap.share,
        },
      ];
    }

    Navigation.mergeOptions(this.props.componentId, {
      topBar,
    });
  }

  async productInit(productId = false) {
    const { productsActions, pid } = this.props;

    const product = await productsActions.fetch(productId || pid);

    if (parseInt(product.data.master_product_offers_count, 10)) {
      const productOffers = await productsActions.fetchProductOffers(
        productId || pid,
      );

      this.setState({ productOffers: productOffers.data });
    }

    const minQty = parseInt(get(product.data, 'min_qty', 0), 10);
    this.setState(
      {
        currentPid: productId || false,
        amount: minQty || 1,
        fetching: minQty !== 0,
        showSwiper: false,
      },
      () => {
        if (minQty !== 0) {
          this.calculatePrice();
        }
      },
    );
    this.setState({ showSwiper: true });
  }

  /**
   * Listens buttons events.
   */
  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'wishlist') {
      this.handleAddToWishList();
    }

    if (buttonId === 'share') {
      this.handleShare();
    }
  }

  /**
   * Recalculates the price of an item.
   * Takes into account the quantity and other options.
   */
  calculatePrice = () => {
    const { productsActions } = this.props;
    const { product, selectedOptions } = this.state;
    productsActions
      .recalculatePrice(product.product_id, selectedOptions)
      .then(() => this.setState({ fetching: false }));
  };

  /**
   * Share event.
   */
  handleShare = () => {
    const { product } = this.state;
    const url = `${config.siteUrl}index.php?dispatch=products.view&product_id=${product.product_id}`;
    Share.share(
      {
        message: url,
        title: product.product,
        url,
      },
      {
        dialogTitle: product.product,
        tintColor: 'black',
      },
    );
  };

  /**
   * Pay with apple pay.
   */
  handleApplePay = async (next) => {
    const { cartActions } = this.props;

    try {
      await cartActions.clear();
      const cartData = await this.handleAddToCart(false);

      if (!cartData.data.message) {
        setTimeout(() => next(), 400);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  /**
   * Adds the product to cart.
   *
   * @param {boolean} showNotification - Showing notifications or not.
   * @param {object} productOffer - Product offer of the selected seller.
   */
  handleAddToCart = (showNotification = true, productOffer) => {
    const productOptions = {};
    const { product, selectedOptions, amount } = this.state;
    const { auth, cartActions } = this.props;

    if (!auth.logged) {
      return nav.showLogin();
    }

    const currentProduct = productOffer || product;

    // Convert product options to the option_id: variant_id array.
    Object.keys(selectedOptions).forEach((k) => {
      productOptions[k] = selectedOptions[k];
      if (selectedOptions[k].variant_id) {
        productOptions[k] = selectedOptions[k].variant_id;
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

  /**
   * Adds the product to wishlist.
   */
  handleAddToWishList() {
    const productOptions = {};
    const { product, selectedOptions } = this.state;
    const { auth, wishListActions, componentId } = this.props;

    if (!auth.logged) {
      return nav.showLogin();
    }

    // Convert product options to the option_id: variant_id array.
    Object.keys(selectedOptions).forEach((k) => {
      productOptions[k] = selectedOptions[k];
      if (selectedOptions[k].variant_id) {
        productOptions[k] = selectedOptions[k].variant_id;
      }
    });

    const products = {
      [product.product_id]: {
        product_id: product.product_id,
        amount: product.selectedAmount,
        product_options: productOptions,
      },
    };
    return wishListActions.add({ products }, componentId);
  }

  /**
   * Adds the selected option.
   *
   * @param {string} name - Option name.
   * @param {string} val - Option value.
   */
  handleOptionChange(name, val) {
    const { selectedOptions } = this.state;
    const newOptions = { ...selectedOptions };
    newOptions[name] = val;

    this.setState(
      {
        selectedOptions: newOptions,
      },
      debounce(this.calculatePrice, 1000, { trailing: true }),
    );
  }

  /**
   * Renders label with discount information.
   *
   * @return {JSX.Element}
   */
  renderDiscountLabel() {
    const { product } = this.state;

    if (!product.list_discount_prc && !product.discount_prc) {
      return null;
    }

    const discount = product.list_discount_prc || product.discount_prc;

    return (
      <View style={styles.listDiscountWrapper}>
        <Text style={styles.listDiscountText}>
          {`${i18n.t('Discount')} ${discount}%`}
        </Text>
      </View>
    );
  }

  /**
   * Renders swiper with product images.
   *
   * @return {JSX.Element}
   */
  renderImage() {
    const { images, showSwiper } = this.state;

    if (!showSwiper) {
      return <View />;
    }

    return (
      <View>
        <ProductImageSwiper>{images}</ProductImageSwiper>
        {this.renderDiscountLabel()}
      </View>
    );
  }

  /**
   * Renders product name.
   *
   * @return {JSX.Element}
   */
  renderName() {
    const { product } = this.state;
    if (!product.product) {
      return null;
    }
    return <Text style={styles.nameText}>{product.product}</Text>;
  }

  /**
   * Renders product rating.
   *
   * @return {JSX.Element}
   */
  renderRating() {
    const { discussion } = this.state;

    if (
      discussion.type !== DISCUSSION_RATING &&
      discussion.type !== DISCUSSION_COMMUNICATION_AND_RATING
    ) {
      return null;
    }

    return (
      <Rating
        containerStyle={styles.rating}
        value={discussion.average_rating}
        count={discussion.search.total_items}
      />
    );
  }

  /**
   * Renders product description.
   *
   * @return {JSX.Element}
   */
  renderDesc() {
    const { product } = this.state;
    if (product.full_description) {
      return (
        <Text style={styles.descText}>
          {stripTags(product.full_description)}
        </Text>
      );
    }
    return null;
  }

  /**
   * Renders product price or a message about the price.
   *
   * @return {JSX.Element}
   */
  renderPrice() {
    const { product } = this.state;
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
  }

  /**
   * Renders product comments.
   *
   * @return {JSX.Element}
   */
  renderDiscussion() {
    const { productDetail } = this.props;
    const { discussion, canWriteComments } = this.state;
    if (
      discussion.average_rating === '' ||
      discussion.type === DISCUSSION_DISABLED ||
      productDetail.discussion_type === DISCUSSION_DISABLED ||
      !productDetail.discussion_type
    ) {
      return null;
    }

    const masMore = discussion.search.total_items > 10;
    let title = i18n.t('Reviews');
    // eslint-disable-next-line eqeqeq
    if (discussion.search.total_items != 0) {
      title = i18n.t('Reviews ({{count}})', {
        count: discussion.search.total_items,
      });
    }
    return (
      <Section
        title={title}
        wrapperStyle={styles.noPadding}
        showRightButton={canWriteComments}
        rightButtonText={i18n.t('Write a Review')}
        onRightButtonPress={() => {
          nav.pushWriteReview(this.props.componentId, {
            activeDiscussion: discussion,
            discussionType: 'P',
            discussionId: productDetail.product_id,
          });
        }}>
        <DiscussionList
          items={discussion.posts.slice(0, 4)}
          type={discussion.type}
        />
        {masMore && (
          <TouchableOpacity
            style={styles.sectionBtn}
            onPress={() => {
              nav.showDiscussion(this.props.componentId);
            }}>
            <Text style={styles.sectionBtnText}>{i18n.t('View All')}</Text>
          </TouchableOpacity>
        )}
      </Section>
    );
  }

  /**
   * Renders different options.
   * "Memory capacity" for example.
   *
   * @param {object} item - Option information.
   *
   * @return {JSX.Element}
   */
  renderOptionItem = (item) => {
    const option = { ...item };
    const { selectedOptions } = this.state;
    // FIXME: Brainfuck code to convert object to array.
    option.variants = Object.keys(option.variants).map(
      (k) => option.variants[k],
    );
    const defaultValue = selectedOptions[option.option_id];

    switch (item.option_type) {
      case 'I':
      case 'T':
        return (
          <InputOption
            option={option}
            value={defaultValue}
            key={item.option_id}
            onChange={(val) => this.handleOptionChange(option.option_id, val)}
          />
        );

      case 'S':
      case 'R':
        return (
          <SelectOption
            option={option}
            value={defaultValue}
            key={item.option_id}
            onChange={(val) => this.handleOptionChange(option.option_id, val)}
          />
        );

      case 'C':
        return (
          <SwitchOption
            option={option}
            value={defaultValue}
            key={item.option_id}
            onChange={(val) => this.handleOptionChange(option.option_id, val)}
          />
        );
      default:
        return null;
    }
  };

  /**
   * Renders options list.
   *
   * @return {JSX.Element}
   */
  renderOptions() {
    const { product } = this.state;

    const step = parseInt(product.qty_step, 10) || 1;
    const max = parseInt(product.max_qty, 10) || parseInt(product.amount, 10);
    const min = parseInt(product.min_qty, 10) || step;

    return (
      <Section>
        {product.options.map((o) => this.renderOptionItem(o))}
        <QtyOption
          max={max}
          min={min}
          initialValue={this.state.amount || min}
          step={step}
          onChange={(val) => {
            this.setState({ amount: val }, this.calculatePrice);
          }}
        />
      </Section>
    );
  }

  /**
   * Renders product feature.
   * "Brand" for example.
   *
   * @param {object} feature - Feature information.
   * @param {number} index - Feature index.
   *
   * @return {JSX.Element}
   */
  renderFeatureItem = (feature, index, last, isVariation) => {
    const { description, feature_type, value_int, value, variant } = feature;

    let newValue = null;
    switch (feature_type) {
      case FEATURE_TYPE_DATE:
        newValue = format(value_int * 1000, 'MM/DD/YYYY');
        break;
      case FEATURE_TYPE_CHECKBOX:
        newValue = feature.value === 'Y' ? i18n.t('Yes') : i18n.t('No');
        break;
      default:
        newValue = value || variant;
    }

    return (
      <SectionRow
        name={description}
        value={newValue}
        last={last}
        key={index}
        onPress={this.showActionSheet}
        isVariation={isVariation}
      />
    );
  };

  /**
   * Renders feature list.
   *
   * @return {JSX.Element}
   */
  renderFeatures() {
    const { product } = this.state;
    const features = Object.keys(product.product_features).map(
      (k) => product.product_features[k],
    );
    const lastElement = features.length - 1;
    const isVariation = product.variation_features_variants ? true : false;

    return (
      <Section title={i18n.t('Features')}>
        {features.length !== 0 ? (
          features.map((item, index) =>
            this.renderFeatureItem(
              item,
              index,
              index === lastElement && true,
              isVariation,
            ),
          )
        ) : (
          <Text style={styles.noFeaturesText}>
            {` ${i18n.t('There are no features.')} `}
          </Text>
        )}
      </Section>
    );
  }

  /**
   * Renders vendor information
   *
   * @return {JSX.Element}
   */
  renderVendorInfo() {
    const { vendor } = this.state;

    if (config.version !== VERSION_MVE || !vendor) {
      return null;
    }

    return (
      <Section title={i18n.t('Vendor')} wrapperStyle={styles.noPadding}>
        <View style={styles.vendorWrapper}>
          <Text style={styles.vendorName}>{vendor.company}</Text>
          <Text style={styles.vendorProductCount}>
            {i18n.t('{{count}} item(s)', { count: vendor.products_count })}
          </Text>
          <Text style={styles.vendorDescription}>
            {stripTags(vendor.description)}
          </Text>
          <TouchableOpacity
            style={styles.vendorInfoBtn}
            onPress={() => {
              nav.showModalVendorDetail({
                vendorId: vendor.company_id,
              });
            }}>
            <Text
              style={styles.sectionBtnText}
              numberOfLines={1}
              ellipsizeMode="tail">
              {i18n.t('Details')}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.sectionBtn}
          onPress={() => {
            nav.showModalVendor({
              companyId: vendor.company_id,
            });
          }}>
          <Text style={styles.sectionBtnText}>{i18n.t('Go To Store')}</Text>
        </TouchableOpacity>
      </Section>
    );
  }

  /**
   * Renders an add to cart button.
   *
   * @return {JSX.Element}
   */
  renderAddToCart() {
    const canPayWithApplePay = Platform.OS === 'ios' && config.applePay;

    return (
      <View style={styles.addToCartContainer}>
        {canPayWithApplePay && (
          <View style={styles.inAppPaymentWrapper}>
            <InAppPayment onPress={this.handleApplePay} />
          </View>
        )}
        <AddToCartButton onPress={() => this.handleAddToCart()} />
      </View>
    );
  }

  showActionSheet = (value) => {
    const { product } = this.state;

    // Gets all variations and product_ids for the selected feature.
    // {white: "123", black: "124"}
    const featureVariants = {};
    Object.keys(product.variation_features_variants).forEach((feature) => {
      const currentFeature = product.variation_features_variants[feature];
      if (currentFeature.description === value) {
        Object.keys(currentFeature.variants).forEach((variant) => {
          const currentVariant = currentFeature.variants[variant];
          if (currentVariant.product_id) {
            featureVariants[currentVariant.variant] = currentVariant.product_id;
          }
        });
      }
    });

    this.setState({ currentFeatureVariants: featureVariants }, () =>
      this.ActionSheet.show(),
    );
  };

  variationChangeHandler(index) {
    const { currentFeatureVariants, currentPid } = this.state;

    const featuresArray = Object.keys(currentFeatureVariants);
    const pid = currentFeatureVariants[featuresArray[index]];

    // if 'cancel', do nothing
    if (index !== featuresArray.length && pid !== currentPid) {
      this.productInit(pid);
    }
  }

  renderSellers() {
    const { productOffers } = this.state;

    if (productOffers) {
      return (
        <Section title={i18n.t('Sellers')} wrapperStyle={styles.noPadding}>
          {productOffers.products.map((el, index) => {
            return (
              <Seller
                productOffer={el}
                lastVendor={productOffers.products.length - 1 === index}
                key={index}
                onPress={() => this.handleAddToCart(true, el)}
              />
            );
          })}
        </Section>
      );
    } else {
      return null;
    }
  }

  /**
   * Renders component
   *
   * @return {JSX.Element}
   */
  render() {
    const { fetching, productOffers } = this.state;

    if (fetching) {
      return <Spinner visible />;
    }

    const cancelButtonIndex = Object.keys(this.state.currentFeatureVariants)
      .length;
    const actionSheetOptions = Object.keys(
      this.state.currentFeatureVariants,
    ).map((el) => i18n.t(el));

    return (
      <View style={styles.container}>
        <KeyboardAvoidingView
          contentContainerStyle={
            !productOffers && styles.keyboardAvoidingContainer
          }
          behavior="position">
          <ScrollView>
            {this.renderImage()}
            <View style={styles.descriptionBlock}>
              {this.renderName()}
              {this.renderRating()}
              {this.renderPrice()}
              {this.renderDesc()}
            </View>
            {this.renderOptions()}
            {this.renderSellers()}
            {this.renderDiscussion()}
            {this.renderFeatures()}
            {this.renderVendorInfo()}
          </ScrollView>
          {!productOffers && (
            <View style={styles.addToCartContainerWrapper}>
              {this.renderAddToCart()}
            </View>
          )}
        </KeyboardAvoidingView>
        <ActionSheet
          ref={(ref) => {
            this.ActionSheet = ref;
          }}
          options={[...actionSheetOptions, i18n.t('Cancel')]}
          cancelButtonIndex={cancelButtonIndex}
          destructiveButtonIndex={cancelButtonIndex}
          onPress={(index) => this.variationChangeHandler(index)}
        />
      </View>
    );
  }
}

export default connect(
  (state) => ({
    cart: state.cart,
    auth: state.auth,
    vendors: state.vendors,
    wishList: state.wishList,
    discussion: state.discussion,
    productDetail: state.productDetail,
  }),
  (dispatch) => ({
    cartActions: bindActionCreators(cartActions, dispatch),
    vendorActions: bindActionCreators(vendorActions, dispatch),
    productsActions: bindActionCreators(productsActions, dispatch),
    wishListActions: bindActionCreators(wishListActions, dispatch),
  }),
)(ProductDetail);
