import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

// Components
import CartProductList from './CartProductList';

const styles = EStyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: 'red',
    height: 500
  }
});

const VendorsCartsItem = ({
  item, cart, fetching, auth, navigator, handleRefresh, refreshing, cartActions
}) => {
  const products = Object.keys(item.products).map((key) => {
    const result = item.products[key];
    result.cartId = key;
    return result;
  });

  console.log('item', item)
  console.log('cart', cart)

  return (
    <View style={styles.container}>
      <Text>{item.product_groups[0].name}</Text>
      <CartProductList
        cart={item}
        products={products}
        fetching={fetching}
        auth={auth}
        navigator={navigator}
        handleRefresh={handleRefresh}
        refreshing={refreshing}
        cartActions={cartActions}
      />
    </View>
  );
};

VendorsCartsItem.propTypes = {
  item: PropTypes.shape({}),
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

export default VendorsCartsItem;
