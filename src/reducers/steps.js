import { SET_FLOW, SET_PAYLOAD, SET_NEXT_STEP } from '../constants';

const initialState = {
  currentFlow: '',
  flowSteps: {},
  flows: {
    checkoutFlow: {
      profile: {
        title: 'Profile',
        screenName: 'CheckoutProfile',
        payload: {},
      },
      shipping: {
        title: 'Shipping',
        screenName: 'CheckoutShipping',
        payload: {},
      },
      payment: {
        title: 'Payment method',
        screenName: 'CheckoutPayment',
        payload: {},
      },
    },
  },
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_FLOW:
      const { flowName, filterFlowSteps } = action.payload;

      return {
        ...state,
        currentFlow: flowName,
        flowSteps: filterFlowSteps,
        currentStep: filterFlowSteps[Object.keys(filterFlowSteps)[0]],
        currentStepNumber: 0,
      };

    case SET_PAYLOAD:
      const newState = { ...state };
      // Writing payload to the current step.
      Object.keys(newState.flows[state.currentFlow]).forEach((el) => {
        if (newState.flows[state.currentFlow][el].title === state.currentStep) {
          newState.flows[state.currentFlow][el].payload = action.payload;
        }
      });

      return { ...newState };

    case SET_NEXT_STEP:
      return {
        ...state,
        currentStep: action.payload,
        currentStepNumber: state.currentStepNumber + 1,
      };

    default:
      return state;
  }
}
