import React from 'react';
import { connect } from 'react-redux';
import CouponCodes from './CouponCodes';
import { bindActionCreators } from 'redux';
import * as cartActions from '../actions/cartActions';

export const CouponCodeBlock = ({ cartActions, cart }) => {
  const shipping_id = cart.carts.general.chosen_shipping[0];

  return (
    <CouponCodes
      items={cart.coupons}
      onAddPress={(value) => {
        cartActions.addCoupon(value);
        setTimeout(() => {
          cartActions.recalculateTotal(shipping_id, this.props.cart.coupons);
        }, 400);
      }}
      onRemovePress={(value) => {
        cartActions.removeCoupon(value);
        setTimeout(() => {
          cartActions.recalculateTotal(shipping_id, this.props.cart.coupons);
        }, 400);
      }}
    />
  );
};

export default connect(
  (state) => ({
    auth: state.auth,
    cart: state.cart,
  }),
  (dispatch) => ({
    cartActions: bindActionCreators(cartActions, dispatch),
  }),
)(CouponCodeBlock);
