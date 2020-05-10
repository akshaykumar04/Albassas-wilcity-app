import {
  GET_MY_FAVORITES,
  TOGGLE_MY_FAVORITES,
  ADD_LISTING_DETAIL_FAVORITES,
  RESET_MY_FAVORITES,
  REMOVE_PRODUCT_FAVORITES,
  ADD_PRODUCT_FAVORITES,
  GET_FAVORITES_PRODUCTS,
  GET_FAVORITES_LOADMORE
} from "../constants/actionTypes";

export const myFavorites = (state = {}, action) => {
  switch (action.type) {
    case GET_MY_FAVORITES:
      return action.payload;
    default:
      return state;
  }
};

export const listIdPostFavorites = (state = [], action) => {
  switch (action.type) {
    case TOGGLE_MY_FAVORITES:
      return action.payload.type === "added"
        ? [...state, action.payload]
        : state.filter(item => item.id !== action.payload.id);
    case ADD_LISTING_DETAIL_FAVORITES:
      return [...state, { id: action.id, type: "added" }];
    case RESET_MY_FAVORITES:
      return [];
    default:
      return state;
  }
};

export const listIdPostFavoritesRemoved = (state = [], action) => {
  switch (action.type) {
    case TOGGLE_MY_FAVORITES:
      return action.payload.type === "removed"
        ? [...state, action.payload]
        : state.filter(item => item.id !== action.payload.id);
    case RESET_MY_FAVORITES:
      return [];
    default:
      return state;
  }
};
export const listProductFavorites = (state = { aProducts: [] }, action) => {
  switch (action.type) {
    case ADD_PRODUCT_FAVORITES:
      return { ...state, statusAdd: action.payload };
    case GET_FAVORITES_PRODUCTS:
      return {
        ...state,
        ...action.payload,
        aProducts: action.aProducts,
        totalPageProduct: action.total
      };
    case GET_FAVORITES_LOADMORE:
      return {
        ...state,
        aProducts: [...state.aProducts, ...action.aProducts]
      };

    case REMOVE_PRODUCT_FAVORITES:
      return {
        ...state,
        statusDel: action.payload,
        aProducts: state.aProducts.filter(item => item.id !== action.id)
      };
    default:
      return state;
  }
};
