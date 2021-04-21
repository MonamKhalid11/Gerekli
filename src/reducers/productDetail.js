import {
  FETCH_ONE_PRODUCT_FAIL,
  RECALCULATE_PRODUCT_PRICE_SUCCESS,
} from '../constants';

const initialState = {
  byId: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case RECALCULATE_PRODUCT_PRICE_SUCCESS:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.pid]: {
            ...state.byId[action.payload.pid],
            ...action.payload.product,
            options: Object.keys(action.payload.product.product_options).map(
              (k) => action.payload.product.product_options[k],
            ),
            fetching: false,
            qty_step: parseInt(action.payload.product.qty_step, 10) || 1,
            amount: parseInt(action.payload.product.amount, 10) || 0,
            selectedAmount: parseInt(action.payload.product.qty_step, 10) || 1,
          },
        },
      };

    case FETCH_ONE_PRODUCT_FAIL:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.pid]: {
            ...state.byId[action.payload.pid],
            fetching: false,
          },
        },
      };

    default:
      return state;
  }
}
