import React from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
} from 'react-native';

// Components
import VendorsCartsItem from './VendorsCartsItem';
import EmptyCart from './EmptyCart';

/**
 * Renders a list of vendor carts.
 *
 * @param {array} cart - Array of vendor carts.
 * @param {object} auth - Auth information.
 * @param {object} navigator - Navigator.
 * @param {func} handleRefresh - Refreshes cart state.
 * @param {boolean} refreshing - Set this true while waiting for new data from a refresh.
 * @param {object} cartActions - Cart actions.
 *
 * @return {JSX.Element}
 */
const VendorsCartsList = ({
  carts, auth, navigator, handleRefresh, refreshing, cartActions
}) => (
  <FlatList
    data={carts}
    keyExtractor={(item, index) => `${index}`}
    renderItem={({ item }) => (
      <VendorsCartsItem
        item={item}
        auth={auth}
        navigator={navigator}
        handleRefresh={handleRefresh}
        refreshing={refreshing}
        cartActions={cartActions}
      />)}
    ListEmptyComponent={() => <EmptyCart />}
  />
);

VendorsCartsList.propTypes = {
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
  carts: PropTypes.arrayOf(PropTypes.shape({}))
};

export default VendorsCartsList;
