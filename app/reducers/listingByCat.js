import {
  GET_LISTING_BY_CAT,
  GET_LISTING_BY_CAT_LOADMORE
} from "../constants/actionTypes";

export const listingByCat = (state = { oResults: [] }, action) => {
  switch (action.type) {
    case GET_LISTING_BY_CAT:
      return action.payload;

    case GET_LISTING_BY_CAT_LOADMORE:
      return {
        ...state,
        next: action.payload.next,
        oResults: [...state.oResults, ...action.payload.oResults]
      };

    default:
      return state;
  }
};
