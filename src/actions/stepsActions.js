import { SET_FLOW, SET_PAYLOAD } from '../constants';

const filterCheckoutSteps = (currentSteps, payload) => {
  // Filter steps if the order doesn't need delivery
  payload.cart.product_groups.forEach((el) => {
    if (
      el.all_edp_free_shipping ||
      el.shipping_no_required ||
      el.free_shipping ||
      !Object.keys(el.shippings).length
    ) {
      currentSteps = currentSteps.filter((step) => step !== 'Shipping');
    }
  });

  return currentSteps;
};

export const setFlow = (flow, currentSteps, payload) => {
  return async (dispatch) => {
    if (flow === 'checkoutFlow') {
      currentSteps = filterCheckoutSteps(currentSteps, payload);
    }

    dispatch({
      type: SET_FLOW,
      payload: {
        flow,
        currentSteps,
      },
    });
    return currentSteps[0];
  };
};

export const setPayload = (payload) => {
  return async (dispatch) => {
    dispatch({
      type: SET_PAYLOAD,
      payload,
    });
  };
};
