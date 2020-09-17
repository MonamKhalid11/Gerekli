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
import Icon from './Icon';
import CartFooter from './CartFooter';

// Links
import i18n from '../utils/i18n';
import { formatPrice } from '../utils';

// Styles
const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  emptyListContainer: {
    marginTop: '3rem',
    flexDirection: 'column',
    alignItems: 'center',
  },
  emptyListIconWrapper: {
    backgroundColor: '#3FC9F6',
    width: '12rem',
    height: '12rem',
    borderRadius: '6rem',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyListIcon: {
    backgroundColor: 'transparent',
    color: '#fff',
    fontSize: '6rem',
  },
  emptyListHeader: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: 'black',
    marginTop: '1rem',
  },
  emptyListDesc: {
    fontSize: '1rem',
    color: '#24282b',
    marginTop: '0.5rem',
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

const renderEmptyList = (fetching) => {
  if (fetching) {
    return null;
  }

  return (
    <View style={styles.emptyListContainer}>
      <View style={styles.emptyListIconWrapper}>
        <Icon name="add-shopping-cart" style={styles.emptyListIcon} />
      </View>
      <Text style={styles.emptyListHeader}>
        {i18n.t('Your shopping cart is empty.')}
      </Text>
      <Text style={styles.emptyListDesc}>
        {i18n.t('Looking for ideas?')}
      </Text>
    </View>
  );
};

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

const handlePlaceOrder = (auth, navigator, products) => {
  const newProducts = {};
  products.forEach((p) => {
    newProducts[p.product_id] = {
      product_id: p.product_id,
      amount: p.amount,
    };
  });
  if (!auth.logged) {
    navigator.push({
      screen: 'CheckoutAuth',
      backButtonTitle: '',
      passProps: {
        newProducts,
      },
    });
  } else {
    navigator.push({
      screen: 'CheckoutDelivery',
      backButtonTitle: '',
      passProps: {
        newProducts,
      },
    });
  }
};

const renderPlaceOrder = (cart, products, auth, navigator) => {
  if (!products.length) {
    return null;
  }
  return (
    <CartFooter
      totalPrice={formatPrice(cart.total_formatted.price)}
      btnText={i18n.t('Checkout').toUpperCase()}
      onBtnPress={() => handlePlaceOrder(auth, navigator, products)}
    />
  );
};

const CartProductList = ({
  cart, products, fetching, auth, navigator, handleRefresh, refreshing, cartActions
}) => (
  <View style={styles.container}>
    <FlatList
      data={products}
      keyExtractor={(item, index) => `${index}`}
      renderItem={({ item }) => <CartProductitem item={item} cartActions={cartActions} />}
      onRefresh={() => handleRefresh()}
      refreshing={refreshing}
      ListEmptyComponent={() => renderEmptyList(fetching)}
      ListFooterComponent={() => renderOrderDetail(products, cart)}
    />
    {renderPlaceOrder(cart, products, auth, navigator)}
  </View>
);

CartProductList.propTypes = {
  products: PropTypes.arrayOf(PropTypes.shape({})),
  fetching: PropTypes.bool,
  cart: PropTypes.shape({}),
  auth: PropTypes.shape({
    token: PropTypes.string,
  }),
  navigator: PropTypes.shape({
    push: PropTypes.func,
    dismissModal: PropTypes.func,
    setOnNavigatorEvent: PropTypes.func,
  }),
  refreshing: PropTypes.bool,
  handleRefresh: PropTypes.func,
  cartActions: PropTypes.shape({})
};

export default CartProductList;
