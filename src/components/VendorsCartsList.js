import React from 'react';
import PropTypes from 'prop-types';
import {
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

const VendorsCartsList = ({
  vendorCarts, fetching, auth, navigator, handleRefresh, refreshing, cartActions
}) => (
  <FlatList
    data={vendorCarts}
    keyExtractor={(item, index) => `${index}`}
    renderItem={({ item }) => (
      <VendorsCartsItem
        item={item}
        fetching={fetching}
        auth={auth}
        navigator={navigator}
        handleRefresh={handleRefresh}
        refreshing={refreshing}
        cartActions={cartActions}
      />)}
  />
);

VendorsCartsList.propTypes = {
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
  cartActions: PropTypes.shape({}),
  vendorCarts: PropTypes.arrayOf(PropTypes.shape({}))
};

export default VendorsCartsList;
