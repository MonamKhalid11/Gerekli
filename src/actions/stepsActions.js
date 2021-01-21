import { GET_STEPS } from '../constants';

export const getSteps = (steps) => {
  return async (dispatch) => {
    dispatch({
      type: GET_STEPS,
      payload: {
        steps,
      },
    });
  };
};
