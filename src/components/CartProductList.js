import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  FlatList,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

// Components
import VendorsCartsItem from './VendorsCartsItem';

const styles = EStyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: 'red',
    height: '100%'
  }
});

const CartProductList = ({ product_groups, renderProductList }) => (
  <FlatList
    data={product_groups}
    keyExtractor={(item, index) => `${index}`}
    renderItem={({ item }) => (
      <VendorsCartsItem
        renderProductList={renderProductList}
        item={item}
      />)}
  />
);

CartProductList.propTypes = {
  product_groups: PropTypes.arrayOf(PropTypes.shape({})),
  renderProductList: PropTypes.func
};

export default CartProductList;
