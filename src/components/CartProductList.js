import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  FlatList,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { get } from 'lodash';

// Components
import CartProductitem from './CartProductItem';
import CartFooter from './CartFooter';
import EmptyCart from './EmptyCart';

// Links
import i18n from '../utils/i18n';
import { formatPrice } from '../utils';
import * as nav from '../services/navigation';

// Styles
const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  totalWrapper: {
    marginTop: 6,
    marginLeft: 20,
    marginRight: 20,
  },
  totalText: {
    textAlign: 'right',
    marginTop: 4,
    color: '#979797',
  }
});

/**
 * Renders order detail.
 *
 * @return {JSX.Element}
 */
const renderOrderDetail = (products, cart) => {
  if (!products.length) {
    return null;
  }

  return (
    <View style={styles.totalWrapper}>
      <Text style={styles.totalText}>
        {`${i18n.t('Subtotal')}: ${get(cart, 'subtotal_formatted.price', '')}`}
      </Text>
      <Text style={styles.totalText}>
        {`${i18n.t('Shipping')}: ${get(cart, 'shipping_cost_formatted.price', '')}`}
      </Text>
      <Text style={styles.totalText}>
        {`${i18n.t('Taxes')}: ${get(cart, 'tax_subtotal_formatted.price', '')}`}
      </Text>
    </View>
  );
};

/**
 * Renders component.
 *
 * @param {object} cart - Cart information.
 * @param {object} auth - Auth information.
 * @param {object} navigator - Navigator.
 * @param {func} handleRefresh - Refreshes cart state.
 * @param {boolean} refreshing - Set this true while waiting for new data from a refresh.
 * @param {object} cartActions - Cart actions.
 *
 * @return {JSX.Element}
 */
const CartProductList = ({
  cart, auth, componentId, handleRefresh, refreshing, cartActions
}) => {
  let newProducts = [];
  if (cart) {
    newProducts = Object.keys(cart.products).map((key) => {
      const result = { ...cart.products[key] };
      result.cartId = key;
      return result;
    });
  }

  /**
   * Moves to the next page.
   */
  const handlePlaceOrder = (auth, products, cart) => {
    const newProducts = {};
    products.forEach((p) => {
      newProducts[p.product_id] = {
        product_id: p.product_id,
        amount: p.amount,
      };
    });
    if (!auth.logged) {
      nav.pushCheckoutAuth(componentId, { newProducts });
    } else {
      nav.showCheckoutDelivery({
        newProducts,
        cart,
      });
    }
  };

  /**
   * Renders cart footer.
   *
   * @return {JSX.Element}
   */
    const renderPlaceOrder = (cart, products, auth) => {
      if (!products.length) {
        return null;
      }
      return (
        <CartFooter
          totalPrice={formatPrice(cart.total_formatted.price)}
          btnText={i18n.t('Checkout').toUpperCase()}
          onBtnPress={
            () => handlePlaceOrder(
              auth, products, cart
            )
          }
        />
      );
    };

  return (
    <View style={styles.container}>
      <FlatList
        data={newProducts}
        keyExtractor={(item, index) => `${index}`}
        renderItem={({ item }) => <CartProductitem item={item} cartActions={cartActions} />}
        onRefresh={() => handleRefresh()}
        refreshing={refreshing}
        ListEmptyComponent={() => <EmptyCart />}
        ListFooterComponent={() => renderOrderDetail(newProducts, cart)}
      />
      {renderPlaceOrder(cart, newProducts, auth)}
    </View>
  );
};

CartProductList.propTypes = {
  cart: PropTypes.shape({}),
  auth: PropTypes.shape({
    token: PropTypes.string,
  }),
  refreshing: PropTypes.bool,
  handleRefresh: PropTypes.func,
  cartActions: PropTypes.shape({})
};

export default CartProductList;
