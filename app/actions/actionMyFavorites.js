import {
  GET_MY_FAVORITES,
  TOGGLE_MY_FAVORITES,
  RESET_MY_FAVORITES,
  ADD_PRODUCT_FAVORITES,
  REMOVE_PRODUCT_FAVORITES,
  GET_FAVORITES_PRODUCTS,
  GET_FAVORITES_LOADMORE
} from "../constants/actionTypes";
import axios from "axios";
import { axiosHandleError } from "../wiloke-elements";

export const getMyFavorites = _ => dispatch => {
  return axios
    .get("get-my-favorites")
    .then(({ data }) => {
      dispatch({
        type: GET_MY_FAVORITES,
        payload: data
      });
    })
    .catch(err => {
      console.log(axiosHandleError(err));
    });
};

export const addMyFavorites = id => dispatch => {
  return axios
    .post("add-to-my-favorites", {
      postID: id
    })
    .then(res => {
      const { data } = res;
      data.status === "success" &&
        dispatch({
          type: TOGGLE_MY_FAVORITES,
          payload: {
            id,
            type: data.is
          }
        });
    })
    .catch(err => {
      console.log(axiosHandleError(err));
    });
};

export const resetMyFavorites = _ => dispatch => {
  dispatch({
    type: RESET_MY_FAVORITES
  });
};
export const getProductFavorites = (token, page = 1) => async dispatch => {
  const endpoint = "/wc/wishlists";
  const params = {
    postsPerPage: 10,
    page
  };
  try {
    const { data } = await axios.get(
      endpoint,
      {
        params
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    if (page < 2) {
      dispatch({
        type: GET_FAVORITES_PRODUCTS,
        payload: data,
        aProducts: data.status === "success" ? data.data.aProducts : [],
        total: data.status === "success" ? data.data.pages : 1
      });
    } else {
      if (data.status === "success") {
        dispatch({
          type: GET_FAVORITES_LOADMORE,
          aProducts: data.data.aProducts
        });
      }
    }
  } catch (err) {
    console.log(axiosHandleError(err));
  }
};
export const addProductFavorites = (
  token,
  productID,
  quantity = 1
) => async dispatch => {
  const endpoint = "/wc/wishlists";
  try {
    const { data } = await axios.post(
      endpoint,
      {
        productID,
        productQuantity: quantity
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    dispatch({
      type: ADD_PRODUCT_FAVORITES,
      payload: data
    });
  } catch (err) {
    console.log(axiosHandleError(err));
  }
};
export const deleteProductFavorites = (
  token,
  productID,
  wishlistToken,
  wishlistID
) => async dispatch => {
  const endpoint = `/wc/wishlists?productID=${productID}&wishlistToken=${wishlistToken}&wishlistID=${wishlistID}`;
  try {
    const { data } = await axios.delete(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (data.status === "success") {
      dispatch({
        type: REMOVE_PRODUCT_FAVORITES,
        payload: data,
        id: productID
      });
    } else {
      dispatch({
        type: REMOVE_PRODUCT_FAVORITES,
        payload: data,
        id: null
      });
    }
  } catch (err) {
    console.log(err);
    console.log(axiosHandleError(err));
  }
};
