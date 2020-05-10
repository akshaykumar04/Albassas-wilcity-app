import * as types from "../constants/actionTypes";

export const loading = (state = true, action) => {
  switch (action.type) {
    case types.LOADING:
      return action.loading;
    default:
      return state;
  }
};

export const loadingListingDetail = (state = true, action) => {
  switch (action.type) {
    case types.LOADING_LISTING_DETAIL:
      return action.loading;
    default:
      return state;
  }
};

export const loadingReview = (state = true, action) => {
  switch (action.type) {
    case types.LOADING_REVIEW:
      return action.loading;
    default:
      return state;
  }
};
