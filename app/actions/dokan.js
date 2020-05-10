import axios from "axios";
import {
  GET_SUBMENU_DOKAN,
  GET_PRODUCTS_DOKAN,
  GET_PRODUCTS_DOKAN_LOADMORE,
  GET_ORDER_DOKAN,
  GET_ORDER_DOKAN_LOADMORE,
  GET_STATICS_DOKAN,
  GET_WITHDRAW_DOKAN,
  GET_STATUS_DRAWN_DOKAN,
  MAKE_REQUEST_DOKAN,
  CANCEL_REQUEST_DOKAN,
  POST_REQUEST_DOKAN,
  GET_TAB_DOKAN
} from "../constants/actionTypes";
export const getSubMenuDokan = token => async dispatch => {
  const endpoint = "/dokan/sub-menus";
  try {
    const { data } = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch({
      type: GET_SUBMENU_DOKAN,
      payload: data.status === "success" ? data.oResults : []
    });
  } catch (err) {
    console.log(err);
  }
};
export const getDokanProducts = (token, page = 1) => async dispatch => {
  const endpoint = `/dokan/products?page=${page}`;
  try {
    const { data } = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (page < 2) {
      dispatch({
        type: GET_PRODUCTS_DOKAN,
        payload: data.status === "success" ? data.items : [],
        total: data.status === "success" ? Math.ceil(data.totals / 10) : 1,
        error: data.status === "error" ? data : {}
      });
    } else {
      dispatch({
        type: GET_PRODUCTS_DOKAN_LOADMORE,
        payload: data.items
      });
    }
  } catch (err) {
    console.log(err);
  }
};
export const getDokanOrders = (token, page = 1) => async dispatch => {
  const endpoint = `/dokan/orders?page=${page}`;
  try {
    const { data } = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (page < 2) {
      dispatch({
        type: GET_ORDER_DOKAN,
        payload: data.status === "success" ? data.data.aOrders : [],
        total: data.status === "success" ? Math.ceil(data.data.total / 10) : 1,
        error: data.status === "error" ? data : {}
      });
    } else {
      dispatch({
        type: GET_ORDER_DOKAN_LOADMORE,
        payload: data.data.aOrders
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export const getStaticsDokan = token => async dispatch => {
  const endpoint = "dokan/statistic";
  try {
    const { data } = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (data.status === "success") {
      dispatch({
        type: GET_STATICS_DOKAN,
        payload: data.oResults
      });
    }
  } catch (err) {
    console.log(err);
  }
};
export const getWithDrawnDokan = token => async dispatch => {
  const endpoint = "/dokan/withdrawn?count=4";
  try {
    const { data } = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (data.status === "success") {
      dispatch({
        type: GET_WITHDRAW_DOKAN,
        payload: data.oResults,
        error: {}
      });
    } else {
      dispatch({
        type: GET_WITHDRAW_DOKAN,
        error: data
      });
    }
  } catch (err) {
    console.log(err);
  }
};
export const getRequestStatusDokan = (
  token,
  endpoint,
  page = 1
) => async dispatch => {
  try {
    const { data } = await axios.get(
      endpoint,
      {
        params: {
          page
        }
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    if (page < 2) {
      console.log(data);
      dispatch({
        type: GET_STATUS_DRAWN_DOKAN,
        payload: data.status === "success" ? data.oResults : [],
        total: 1,
        msg: data.status === "error" ? data.msg : ""
      });
    }
  } catch (err) {
    console.log(err);
  }
};
export const makeRequestDokan = token => async dispatch => {
  const endpoint = "/dokan/withdrawn/request";
  try {
    const { data } = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch({
      type: MAKE_REQUEST_DOKAN,
      payload: data
    });
  } catch (err) {
    console.log(err);
  }
};
export const postRequestDokan = (token, result) => async dispatch => {
  const endpoint = "/dokan/withdrawn/request";
  try {
    const { data } = await axios.post(
      endpoint,
      {
        amount: result.amount,
        method: result.method
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    dispatch({
      type: POST_REQUEST_DOKAN,
      payload: data
    });
  } catch (err) {
    console.log(err);
  }
};
export const cancelRequest = (token, id) => async dispatch => {
  const endpoint = `/dokan/withdrawn/request/${id}`;
  try {
    const { data } = await axios.delete(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch({
      type: CANCEL_REQUEST_DOKAN,
      payload: data
    });
  } catch (err) {
    console.log(err);
  }
};
export const getTabsDokan = token => async dispatch => {
  const endpoint = "dokan/withdrawn/status";
  try {
    const { data } = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch({
      type: GET_TAB_DOKAN,
      payload: data.status === "success" ? data.aResults : []
    });
  } catch (err) {
    console.log(err);
  }
};
