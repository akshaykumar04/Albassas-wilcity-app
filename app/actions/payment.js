import axios from "axios";
import {
  PAYMENT_TIMEOUT,
  UNCHECKED_FORM,
  GET_BILLING_FORM,
  GET_SHIPPING_FORM,
  GET_RESULTS_BILLING,
  GET_RESULTS_SHIPPING,
  GET_METHOD_RESULT,
  GET_TEMP_TOKEN,
  GET_ORDER,
  GET_METHOD_PAYMENT,
  GET_ORDER_ERR,
  VERIFY_PAYMENT,
  GET_LIST_ORDER,
  GET_ORDER_DETAILS,
  CANCEL_ORDER,
  RESET_ORDER,
  CHECK_TYPE_ORDER,
  GET_LOADMORE_ORDER,
  IS_DELETE_ITEM,
  SAVE_RESULT_FORM
} from "../constants/actionTypes";
import { axiosHandleError, ActionSheet } from "../wiloke-elements";

export const getBillingForm = token => async dispatch => {
  try {
    const endpoint = "wc/billing-fields";
    const { data } = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (data.status === "success") {
      dispatch({
        type: GET_BILLING_FORM,
        payload: data.oFields
      });
      dispatch({
        type: PAYMENT_TIMEOUT,
        isTimeout: false
      });
    } else {
      dispatch({
        type: PAYMENT_TIMEOUT,
        isTimeout: true
      });
    }
  } catch (err) {
    axiosHandleError(err);
    dispatch({
      type: PAYMENT_TIMEOUT,
      isTimeout: true
    });
  }
};

export const getShippingForm = token => async dispatch => {
  try {
    const endpoint = "wc/shipping-fields";
    const { data } = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (data.status === "success") {
      dispatch({
        type: GET_SHIPPING_FORM,
        shipping: data.oFields.fields
      });
      dispatch({
        type: PAYMENT_TIMEOUT,
        isTimeout: false
      });
    }
  } catch (err) {
    console.log(err);
    throw err;
    dispatch({
      type: PAYMENT_TIMEOUT,
      isTimeout: true
    });
  }
};

export const getResultsBilling = (result, token) => async dispatch => {
  const endpoint = "wc/billing-fields";
  try {
    const { data } = await axios.post(
      endpoint,
      {
        data: result
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    dispatch({
      type: GET_RESULTS_BILLING,
      result,
      status: data.status,
      msg: data.msg
    });
  } catch (err) {
    console.log(err);
  }
};
export const getResultsShipping = (result, token) => async dispatch => {
  const endpoint = "wc/shipping-fields";
  try {
    const { data } = await axios.post(
      endpoint,
      {
        data: result
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    dispatch({
      type: GET_RESULTS_SHIPPING,
      result,
      status: data.status,
      msg: data.msg
    });
  } catch (err) {
    console.log(err);
  }
};
export const saveResultLocal = (result1, result2) => dispatch => {
  dispatch({
    type: SAVE_RESULT_FORM,
    result1,
    result2
  });
};
export const getMethodResult = result => dispatch => {
  dispatch({
    type: GET_METHOD_RESULT,
    result
  });
};
export const getMethodPayment = () => async dispatch => {
  try {
    const endpoint = "wc/payment-gateways";
    const { data } = await axios.get(endpoint);
    if (data.status === "success") {
      dispatch({
        type: GET_METHOD_PAYMENT,
        payload: data.oGateways
      });
      dispatch({
        type: PAYMENT_TIMEOUT,
        isTimeout: false
      });
    }
  } catch (err) {
    axiosHandleError(err);
    dispatch({
      type: PAYMENT_TIMEOUT,
      isTimeout: true
    });
    console.log(err);
  }
};

export const getTempToken = (
  orderID,
  token,
  paymentMethod
) => async dispatch => {
  const endpoint = `/wc/temp-auth?payment_method=${paymentMethod}`;
  try {
    const { data } = await axios.post(
      endpoint,
      {
        orderID: orderID
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    dispatch({
      type: PAYMENT_TIMEOUT,
      isTimeout: false
    });
    dispatch({
      type: GET_TEMP_TOKEN,
      payload: data.status === "success" ? data.checkoutURL : ""
    });
  } catch (err) {
    dispatch({
      type: PAYMENT_TIMEOUT,
      isTimeout: true
    });
    console.log("4545454545", err);
  }
};
export const getOrder = (result, token, orderID) => async dispatch => {
  const endpoint = !orderID ? "/wc/orders" : `/wc/orders/${orderID}`;
  try {
    const { data } = await axios.post(endpoint, result, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (data.status === "success") {
      dispatch({
        type: GET_ORDER,
        payload: data.oOrder
      });
    } else {
      dispatch({
        type: GET_ORDER_ERR,
        error: data
      });
    }
  } catch (err) {
    console.log("123");
    console.log(err);
  }
};
export const verifyPayment = (orderId, token) => async dispatch => {
  const endpoint = `/wc/orders/${orderId}/status`;
  try {
    const { data } = await axios.get(
      endpoint,
      {
        params: {
          orderId
        }
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    dispatch({
      type: VERIFY_PAYMENT,
      payload: data.order.status,
      msg: data.msg
    });
    dispatch({
      type: IS_DELETE_ITEM,
      payload: true
    });
  } catch (err) {
    axiosHandleError(err);
  }
};

export const getListOrder = (token, page = 1) => async dispatch => {
  const endpoint = "/wc/orders";
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
      dispatch({
        type: GET_LIST_ORDER,
        aOrders: data.status === "success" ? data.data.aOrders : [],
        total: data.status === "success" ? Math.ceil(data.data.total / 10) : 1,
        error: data.status === "error" ? data : {}
      });
    } else {
      dispatch({
        type: GET_LOADMORE_ORDER,
        aOrders: data.status === "success" ? data.data.aOrders : []
      });
    }
  } catch (err) {
    console.log(err);
    dispatch({
      type: PAYMENT_TIMEOUT,
      isTimeout: true
    });
  }
};
export const getOrderDetails = (token, orderID) => async dispatch => {
  const endpoint = `/wc/orders/${orderID}`;
  try {
    const { data } = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch({
      type: GET_ORDER_DETAILS,
      payload: data
    });
  } catch (err) {
    console.log(err);
  }
};
export const cancelOrder = (token, orderID) => async dispatch => {
  const endpoint = `wc/orders/${orderID}`;
  try {
    const { data } = await axios.post(
      endpoint,
      {
        params: {
          status: "cancelled"
        }
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    dispatch({
      type: CANCEL_ORDER,
      status: data
    });
  } catch (err) {
    console.log(err);
  }
};
export const resetOrder = () => async dispatch => {
  dispatch({
    type: RESET_ORDER
  });
};
export const checkTypeOrder = (typeOrder, status = "") => dispatch => {
  dispatch({
    type: CHECK_TYPE_ORDER,
    payload: typeOrder,
    status
  });
};
