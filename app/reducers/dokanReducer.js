import {
  GET_SUBMENU_DOKAN,
  GET_PRODUCTS_DOKAN,
  GET_PRODUCTS_DOKAN_LOADMORE,
  GET_ORDER_DOKAN_LOADMORE,
  GET_ORDER_DOKAN,
  GET_STATICS_DOKAN,
  GET_WITHDRAW_DOKAN,
  GET_STATUS_DRAWN_DOKAN,
  MAKE_REQUEST_DOKAN,
  POST_REQUEST_DOKAN,
  CANCEL_REQUEST_DOKAN,
  TABS_DOKAN,
  GET_TAB_DOKAN,
  UPDATE_TOTAL_REQUESTS
} from "../constants/actionTypes";
const dokanReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_SUBMENU_DOKAN:
      return { ...state, dokanMenu: action.payload };
    case GET_PRODUCTS_DOKAN:
      return {
        ...state,
        dokanProducts: action.payload,
        totalPage1: action.total,
        errorProductDokan: action.error
      };
    case GET_PRODUCTS_DOKAN_LOADMORE:
      return {
        ...state,
        dokanProducts: [...state.dokanProducts, ...action.payload]
      };
    case GET_ORDER_DOKAN:
      return {
        ...state,
        dokanOrders: action.payload,
        totalPage2: action.total,
        errorOrderDokan: action.error
      };
    case GET_ORDER_DOKAN_LOADMORE:
      return {
        ...state,
        dokanOrders: [...state.dokanOrders, ...action.payload]
      };
    case GET_STATICS_DOKAN:
      return {
        ...state,
        staticDokan: action.payload
      };
    case GET_WITHDRAW_DOKAN:
      return {
        ...state,
        withdrawnDokan: action.payload,
        errorWithDrawDokan: action.error
      };
    case GET_STATUS_DRAWN_DOKAN:
      return {
        ...state,
        requestStatusDokan: action.payload,
        totalPage3: action.total,
        msgErrorStatusDraw: action.msg
      };
    case MAKE_REQUEST_DOKAN:
      return {
        ...state,
        makeStatusRequest: action.payload
      };
    case POST_REQUEST_DOKAN:
      return {
        ...state,
        postRequestResults: action.payload
      };
    case CANCEL_REQUEST_DOKAN:
      return {
        ...state,
        cancelRequestStatus: action.payload
      };
    case GET_TAB_DOKAN:
      return {
        ...state,
        tabsDokan: action.payload
      };
    default:
      return state;
  }
};
export default dokanReducer;
