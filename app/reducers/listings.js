import {
  GET_LISTINGS,
  GET_LISTINGS_LOADMORE,
  GET_LISTING_NEARBY
} from "../constants/actionTypes";

export const listings = (state = {}, action) => {
  switch (action.type) {
    case GET_LISTINGS:
      return {
        ...state,
        ...action.payload
      };

    case GET_LISTING_NEARBY:
      return action.payload;

    case GET_LISTINGS_LOADMORE:
      const postType = Object.keys(action.payload)[0];
      return {
        ...state,
        [postType]: {
          ...state[postType],
          status: action.payload[postType].status,
          next: action.payload[postType].next,
          oResults: [
            ...state[postType].oResults,
            ...action.payload[postType].oResults
          ]
        }
      };

    default:
      return state;
  }
};
