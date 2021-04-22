import {
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_FAIL,
  FETCH_PRODUCTS_SUCCESS,
  SEARCH_PRODUCTS_REQUEST,
  SEARCH_PRODUCTS_FAIL,
  SEARCH_PRODUCTS_SUCCESS,
  FETCH_ONE_PRODUCT_REQUEST,
  FETCH_ONE_PRODUCT_FAIL,
  FETCH_ONE_PRODUCT_SUCCESS,
  RECALCULATE_PRODUCT_PRICE_REQUEST,
  RECALCULATE_PRODUCT_PRICE_FAIL,
  RECALCULATE_PRODUCT_PRICE_SUCCESS,
  FETCH_DISCUSSION_REQUEST,
  FETCH_DISCUSSION_SUCCESS,
  FETCH_DISCUSSION_FAIL,
  POST_DISCUSSION_REQUEST,
  POST_DISCUSSION_SUCCESS,
  POST_DISCUSSION_FAIL,
  NOTIFICATION_SHOW,
  DISCUSSION_DISABLED,
  CHANGE_PRODUCTS_SORT,
  FETCH_COMMON_PRODUCTS_REQUEST,
  FETCH_COMMON_PRODUCTS_FAIL,
  FETCH_COMMON_PRODUCTS_SUCCESS,
} from '../constants';
import Api from '../services/api';
import i18n from '../utils/i18n';
import { convertProduct, formatOptionsToUrl } from '../services/productDetail';

export function fetchDiscussion(id, params = { page: 1 }, type = 'P') {
  return (dispatch) => {
    dispatch({
      type: FETCH_DISCUSSION_REQUEST,
    });

    return Api.get(
      `/sra_discussion/?object_type=${type}&object_id=${id}&params[page]=${params.page}`,
    )
      .then((response) => {
        dispatch({
          type: FETCH_DISCUSSION_SUCCESS,
          payload: {
            id: `${type.toLowerCase()}_${id}`,
            page: params.page,
            discussion: response.data,
          },
        });
        return response;
      })
      .catch((error) => {
        dispatch({
          type: FETCH_DISCUSSION_FAIL,
          error,
        });
      });
  };
}

export function postDiscussion(data) {
  return (dispatch) => {
    dispatch({
      type: POST_DISCUSSION_REQUEST,
    });

    return Api.post('/sra_discussion', data)
      .then(() => {
        dispatch({
          type: POST_DISCUSSION_SUCCESS,
        });

        dispatch({
          type: NOTIFICATION_SHOW,
          payload: {
            type: 'success',
            title: i18n.t('Thank you for your post.'),
            text: i18n.t('Your post will be checked before it gets published.'),
          },
        });
        // Reload discussion.
        fetchDiscussion(
          data.discussionId,
          { page: 1 },
          data.discussionType,
        )(dispatch);
      })
      .catch((error) => {
        dispatch({
          type: POST_DISCUSSION_FAIL,
          error,
        });
      });
  };
}

export function recalculatePrice(pid, options) {
  return async (dispatch) => {
    dispatch({ type: RECALCULATE_PRODUCT_PRICE_REQUEST });

    const optionsUrl = formatOptionsToUrl(options);

    try {
      const response = await Api.get(`sra_products/${pid}/?${optionsUrl}`);
      const product = convertProduct(response.data);
      dispatch({ type: RECALCULATE_PRODUCT_PRICE_SUCCESS });
      return product;
    } catch (error) {
      dispatch({
        type: RECALCULATE_PRODUCT_PRICE_FAIL,
        error,
      });
    }
  };
}

export function fetch(pid) {
  return async (dispatch) => {
    dispatch({
      type: FETCH_ONE_PRODUCT_REQUEST,
    });

    try {
      const response = await Api.get(`/sra_products/${pid}`);
      const product = convertProduct(response.data);

      if (product.rating) {
        await fetchDiscussion(pid)(dispatch);
      }

      if (product.isProductOffer) {
        product.productOffers = await fetchProductOffers(pid)(dispatch);
      }

      dispatch({
        type: FETCH_ONE_PRODUCT_SUCCESS,
      });

      return product;
    } catch (error) {
      dispatch({
        type: FETCH_ONE_PRODUCT_FAIL,
        error,
      });
    }
  };
}

export function fetchProductOffers(pid) {
  return (dispatch) => {
    dispatch({ type: FETCH_COMMON_PRODUCTS_REQUEST });

    return Api.get(
      `/sra_products/?vendor_products_by_product_id=${pid}&sort_by=price`,
    )
      .then((response) => {
        dispatch({
          type: FETCH_COMMON_PRODUCTS_SUCCESS,
        });
        return response.data;
      })
      .catch((error) => {
        dispatch({
          type: FETCH_COMMON_PRODUCTS_FAIL,
          error,
        });
      });
  };
}

export function search(params = {}) {
  return (dispatch) => {
    dispatch({ type: SEARCH_PRODUCTS_REQUEST });

    return Api.get('/sra_products', {
      params: {
        items_per_page: 50,
        ...params,
      },
    })
      .then((response) => {
        dispatch({
          type: SEARCH_PRODUCTS_SUCCESS,
          payload: response.data,
        });
      })
      .catch((error) => {
        dispatch({
          type: SEARCH_PRODUCTS_FAIL,
          error,
        });
      });
  };
}

export function fetchByCategory(
  categoryId,
  page = 1,
  companyId = false,
  advParams = {},
) {
  const params = {
    page,
    subcats: 'Y',
    items_per_page: 10,
    company_id: companyId || '',
    get_filters: true,
    ...advParams,
  };

  return (dispatch) => {
    dispatch({ type: FETCH_PRODUCTS_REQUEST });
    return Api.get(`/categories/${categoryId}/sra_products`, { params })
      .then((response) => {
        dispatch({
          type: FETCH_PRODUCTS_SUCCESS,
          payload: response.data,
        });
      })
      .catch((error) => {
        dispatch({
          type: FETCH_PRODUCTS_FAIL,
          error,
        });
      });
  };
}

export function changeSort(params) {
  return (dispatch) => {
    dispatch({
      type: CHANGE_PRODUCTS_SORT,
      payload: params,
    });
  };
}
