import {
  GET_MY_LISTINGS,
  GET_MY_LISTINGS_LOADMORE,
  GET_MY_LISTING_ERROR,
  RESET_MY_LISTING
} from "../constants/actionTypes";

export const myListings = (state = { oResults: [] }, action) => {
  switch (action.type) {
    case GET_MY_LISTINGS:
      return action.payload;
    case GET_MY_LISTINGS_LOADMORE:
      return {
        ...state,
        next: action.payload.next,
        oResults: [...state.oResults, ...action.payload.oResults]
      };
    case GET_MY_LISTING_ERROR:
      return { oResults: [] };
    case RESET_MY_LISTING:
      return { oResults: [] };
    default:
      return state;
  }
};

export const myListingError = (state = "", action) => {
  switch (action.type) {
    case GET_MY_LISTING_ERROR:
      return action.messageError;
    default:
      return state;
  }
};
