import { SET_FLOW, SET_PAYLOAD } from '../constants';
import { filterObject } from '../utils';

const filterSteps = (flowSteps, payload) => {
  let filterFlowSteps = { ...flowSteps };
  // Filter steps if the order doesn't need delivery
  payload.cart.product_groups.forEach((el) => {
    if (
      el.all_edp_free_shipping ||
      el.shipping_no_required ||
      el.free_shipping ||
      !Object.keys(el.shippings).length
    ) {
      filterFlowSteps = filterObject(
        flowSteps,
        (step) => step.title !== 'Shipping',
      );
    }
  });

  return filterFlowSteps;
};

export const setFlow = (flowName, flowSteps, payload) => {
  return async (dispatch) => {
    const filterFlowSteps = filterSteps(flowSteps, payload);
    dispatch({
      type: SET_FLOW,
      payload: {
        flowName,
        filterFlowSteps,
      },
    });

    return filterFlowSteps[Object.keys(filterFlowSteps)[0]];
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
