import {
  GET_LISTING_FILTERS,
  PUT_NEW_TAG_LISTING_FILTERS
} from "../constants/actionTypes";

export const listingFilters = (state = [], action) => {
  switch (action.type) {
    case GET_LISTING_FILTERS:
      return action.payload;
    case PUT_NEW_TAG_LISTING_FILTERS:
      return action.payload
        ? state.map(item => ({
            ...item,
            options: item.key === "listing_tag" ? action.payload : item.options
          }))
        : state.map(item => ({
            ...item,
            options:
              item.key === "listing_tag" ? item.startOptions : item.options
          }));
    default:
      return state;
  }
};
