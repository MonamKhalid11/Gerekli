import { SET_FLOW, SET_NEXT_STEP } from '../constants';
import { filterObject } from '../utils';

const filterFlowSteps = (flowSteps, payload) => {
  let filteredFlowSteps = { ...flowSteps };
  // Filter steps if the order doesn't need delivery
  payload.cart?.product_groups.forEach((productGroup) => {
    if (
      productGroup.all_edp_free_shipping ||
      productGroup.shipping_no_required ||
      productGroup.free_shipping ||
      !Object.keys(productGroup.shippings).length
    ) {
      filteredFlowSteps = filterObject(
        flowSteps,
        (step) => step.title !== 'Shipping',
      );
    }
  });

  // Add step numbers
  Object.keys(filteredFlowSteps).forEach((stepKey, index) => {
    filteredFlowSteps[stepKey].stepNumber = index;
  });

  return filteredFlowSteps;
};

export const setFlow = (flowName, flowSteps, payload) => {
  return async (dispatch) => {
    const filteredFlowSteps = filterFlowSteps(flowSteps, payload);
    dispatch({
      type: SET_FLOW,
      payload: {
        flowName,
        filteredFlowSteps,
      },
    });

    return filteredFlowSteps[Object.keys(filteredFlowSteps)[0]];
  };
};

export const setNextStep = (nextStep) => {
  return (dispatch) => {
    dispatch({
      type: SET_NEXT_STEP,
      payload: nextStep,
    });
  };
};
