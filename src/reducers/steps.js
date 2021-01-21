import { GET_STEPS } from '../constants';

const initialState = {
  currentStep: '',
  currentSteps: [],
  checkoutSteps: {
    authentication: {
      payload: {},
    },
    profile: {
      payload: {},
    },
    shipping: {
      payload: {},
    },
    payment: {
      payload: {},
    },
  },
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_STEPS:
      return { ...state, currentSteps: action.payload.steps };

    default:
      return state;
  }
}
