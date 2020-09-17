import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: 'red',
    height: '100%'
  }
});

const VendorsCartsItem = ({ renderProductList, item }) => {
  const products = Object.keys(item.products).map((key) => {
    const result = item.products[key];
    result.cartId = key;
    return result;
  });

  return (
    <View style={styles.container}>
      <Text>{item.title}</Text>
      {renderProductList(products)}
    </View>
  );
};

VendorsCartsItem.propTypes = {
  renderProductList: PropTypes.func,
  item: PropTypes.shape({})
};

export default VendorsCartsItem;
