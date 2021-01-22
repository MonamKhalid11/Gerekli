import { SET_FLOW, SET_PAYLOAD } from '../constants';

const initialState = {
  currentFlow: '',
  currentSteps: [],
  currentStep: '',
  flows: {
    checkoutFlow: {
      profile: {
        title: 'Profile',
        screenName: 'CheckoutProfile',
        payload: {},
      },
      shipping: {
        title: 'Shipping',
        payload: {},
      },
      payment: {
        title: 'Payment method',
        payload: {},
      },
    },
  },
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_FLOW:
      const { flow, currentSteps } = action.payload;

      return {
        ...state,
        currentFlow: flow,
        currentSteps,
        currentStep: currentSteps[0],
      };

    case SET_PAYLOAD:
      const newState = { ...state };
      Object.keys(newState.flows[state.currentFlow]).forEach((el) => {
        if (newState.flows[state.currentFlow][el].title === state.currentStep) {
          newState.flows[state.currentFlow][el].payload = action.payload;
        }
      });

      return { ...newState };

    default:
      return state;
  }
}
