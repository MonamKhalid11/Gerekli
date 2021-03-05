import React from 'react';
import { connect } from 'react-redux';
import CouponCodeInput from './CouponCodeInput';
import { bindActionCreators } from 'redux';
import * as cartActions from '../actions/cartActions';

export const CouponCodeBlock = ({ cartActions, cart }) => {
  if (!cart) {
    return null;
  }

  const shipping_id = cart.chosen_shipping[0];

  return (
    <CouponCodeInput
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
  }),
  (dispatch) => ({
    cartActions: bindActionCreators(cartActions, dispatch),
  }),
)(CouponCodeBlock);
