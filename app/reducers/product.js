import {
  GET_PRODUCT_DETAILS,
  ADD_TO_CART,
  GET_PRODUCTS_CART,
  REMOVE_PRODUCT_CART,
  CHANGE_QUANTITY,
  GET_TOTAL_PRICE,
  ADD_TO_CART_API,
  UPDATE_CART_ERR,
  GET_BILLING_FORM,
  GET_SHIPPING_FORM,
  GET_RESULTS_BILLING,
  GET_RESULTS_SHIPPING,
  GET_METHOD_RESULT,
  UNCHECKED_FORM,
  VERIFY_PAYMENT,
  GET_METHOD_PAYMENT,
  GET_ORDER,
  GET_TEMP_TOKEN,
  GET_ORDER_ERR,
  CHANGE_QUANTITY_2,
  GET_VARIATIONS,
  SELECTED_ATTRIBUTE,
  RESET_ATTRIBUTE,
  GET_COMMENT_RATING,
  GET_RATING_STATICS,
  GET_COMMENT_RATING_LOAD_MORE,
  GET_COMMENT_ERR,
  GET_LIST_ORDER,
  GET_ORDER_DETAILS,
  CANCEL_ORDER,
  GET_LOADMORE_ORDER,
  RESET_ORDER,
  CHECK_TYPE_ORDER,
  GET_LIST_BOOKING,
  GET_MORE_BOOKING,
  GET_BOOKING_DETAILS,
  RESET_PRODUCT_DETAILS,
  WISHLIST_TOKEN,
  DEDUCT_TO_CART,
  IS_DELETE_ITEM,
  REMOVE_ALL_PRODUCT,
  SAVE_RESULT_FORM
} from "../constants/actionTypes";
import { omit } from "lodash";

const getTotalPrice = arr => {
  return arr.reduce((total, item) => {
    const price = item.sale_price ? item.sale_price : item.price;
    return (total += parseFloat(price) * parseFloat(item.quantity));
  }, 0);
};
const getTotalItems = arr => {
  return arr.reduce((totalItems, item) => {
    return (totalItems += item.quantity);
  }, 0);
};

const objectRemoveFirstProps = (data, num) => {
  const props = Object.keys(data);
  return props.reduce(
    (obj, key, index) => ({
      ...obj,
      ...(props.length > num && index === 0 ? {} : { [key]: data[key] })
    }),
    {}
  );
};

export const productReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_PRODUCT_DETAILS:
      const data = !!state[action.payload.id]
        ? {
            [action.payload.id]: {
              ...state[action.payload.id],
              details: action.payload.details
            }
          }
        : {
            [action.payload.id]: {
              details: action.payload.details
            }
          };
      const obj = { ...state, ...data };
      return objectRemoveFirstProps(obj, 20);
    case RESET_PRODUCT_DETAILS:
      return { ...state, details: null };
    case WISHLIST_TOKEN:
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          oWishlist: action.payload
        }
      };
    case GET_VARIATIONS:
      return {
        ...state,
        [action.id]: { ...state[action.id], variationsAPI: action.payload }
      };
    case SELECTED_ATTRIBUTE:
      return {
        ...state,
        results: { ...state.results, ...action.payload }
      };
    case RESET_ATTRIBUTE:
      return {
        ...state,
        results: {}
      };
    case GET_COMMENT_RATING:
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          comments: action.payload,
          totalPage: action.totalPage
        }
      };
    case GET_RATING_STATICS:
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          staticRating: action.payload
        }
      };
    case GET_COMMENT_RATING_LOAD_MORE:
      return {
        ...state,
        [action.id]: {
          comments: [...state[action.id].comments, ...action.payload]
        }
      };
    case GET_COMMENT_ERR:
      return {
        ...state,
        status: action.status
      };
    default: {
      return state;
    }
  }
};

const defaultState = {
  cart: {},
  products: [],
  total: 0,
  totalItems: 0,
  update: false
};
export const cartReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      return {
        ...state,
        statusAddToCart: action.status
      };
    case DEDUCT_TO_CART:
      return {
        ...state,
        statusDeductCart: action.status
      };
    case GET_PRODUCTS_CART:
      return {
        ...state,
        cart: action.payload,
        products: action.products
      };
    case GET_TOTAL_PRICE:
      return {
        ...state,
        total: Number(getTotalPrice(state.products)),
        totalItems: Number(getTotalItems(state.products))
      };
    case REMOVE_PRODUCT_CART:
      return {
        ...state,
        products: state.products.filter(item => item.cartKey !== action.key),
        msg: action.msg
      };
    case IS_DELETE_ITEM:
      return {
        ...state,
        isDeleteItem: action.payload
      };
    case REMOVE_ALL_PRODUCT:
      return {
        ...state,
        products: [],
        msg: action.msg
      };

    case CHANGE_QUANTITY:
      return {
        ...state,
        products: state.products.map(currentItem => {
          if (currentItem.cartKey === action.payload.cartKey) {
            return {
              ...currentItem,
              quantity: currentItem.quantity + action.payload.quantity
            };
          } else return currentItem;
        })
      };
    case CHANGE_QUANTITY_2:
      return {
        ...state,
        products: state.products.map(currentItem => {
          if (currentItem.cartKey === action.payload.cartKey) {
            return {
              ...currentItem,
              quantity: action.payload.quantity
            };
          } else return currentItem;
        })
      };

    default:
      return state;
  }
};

const defaultPaymentState = {
  billingForm: [],
  shippingForm: [],
  billingResult: {},
  shippingResult: {},
  methodResult: {}
};

export const paymentReducer = (state = defaultPaymentState, action) => {
  switch (action.type) {
    case GET_BILLING_FORM:
      return {
        ...state,
        billingForm: action.payload
      };
    case GET_SHIPPING_FORM:
      return {
        ...state,
        shippingForm: action.shipping
      };
    case GET_RESULTS_BILLING:
      return {
        ...state,
        billingResult: { ...state.billingResult, ...action.result },
        updateBilling: action.status !== "success" ? action.msg : true
      };
    case GET_RESULTS_SHIPPING:
      return {
        ...state,
        shippingResult: { ...state.shippingResult, ...action.result },
        updateShipping: action.status !== "success" ? action.msg : true
      };
    case GET_METHOD_RESULT:
      return {
        ...state,
        methodResult: { ...state.methodResult, ...action.result }
      };
    case SAVE_RESULT_FORM: {
      return {
        ...state,
        billingResult: { ...state.billingResult, ...action.result1 },
        shippingResult: { ...state.shippingResult, ...action.result2 }
      };
    }
    case UNCHECKED_FORM:
      return {
        ...state,
        fields: omit(state.fields, "shippingForm")
      };
    case GET_METHOD_PAYMENT:
      return { ...state, method: action.payload };
    default:
      return state;
  }
};
export const orderReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_ORDER:
      return {
        ...state,
        orders: action.payload,
        statusOrder: { status: "success" }
      };
    case RESET_ORDER:
      return { ...state, orders: {}, statusPayment: "" };
    case CHECK_TYPE_ORDER:
      return { ...state, type: action.payload, statusPayment: action.status };
    case GET_TEMP_TOKEN:
      return { ...state, urlCheckout: action.payload };
    case VERIFY_PAYMENT:
      return { ...state, statusPayment: action.payload, msg: action.msg };
    case GET_ORDER_ERR:
      return { ...state, statusOrder: action.error };
    case GET_LIST_ORDER:
      return {
        ...state,
        aOrders: action.aOrders,
        totalPageOrder: action.total,
        errorList: action.error
      };
    case GET_ORDER_DETAILS:
      return { ...state, orderDetails: action.payload };
    case CANCEL_ORDER:
      return { ...state, cancelOrder: action.status };
    case GET_LOADMORE_ORDER:
      return { ...state, aOrders: [...state.aOrders, ...action.aOrders] };
    default:
      return state;
  }
};
export const bookingReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_LIST_BOOKING:
      return {
        ...state,
        aBookings: action.payload,
        total: action.total,
        errorBooking: action.error
      };
    case GET_MORE_BOOKING:
      return { ...state, aBookings: [...state.aBookings, ...action.payload] };
    case GET_BOOKING_DETAILS:
      return { ...state, bookingDetails: action.payload };
    default:
      return state;
  }
};
