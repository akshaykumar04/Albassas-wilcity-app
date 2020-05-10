import * as types from "../constants/actionTypes";

const reducers = type => (state = false, action) => {
  switch (action.type) {
    case type:
      return action.isTimeout;
    default:
      return state;
  }
};
export const requestTimeout = reducers(types.REQUEST_TIMEOUT);
export const isHomeRequestTimeout = reducers(types.HOME_REQUEST_TIMEOUT);
export const isListingRequestTimeout = reducers(types.LISTING_REQUEST_TIMEOUT);
export const isListingSearchRequestTimeout = reducers(
  types.LISTING_SEARCH_REQUEST_TIMEOUT
);
export const isEventRequestTimeout = reducers(types.EVENT_REQUEST_TIMEOUT);
export const isListingDetailDesRequestTimeout = reducers(
  types.LISTING_DETAIL_DES_REQUEST_TIMEOUT
);
export const isListingDetailPhotosRequestTimeout = reducers(
  types.LISTING_DETAIL_PHOTOS_REQUEST_TIMEOUT
);
export const isListingDetailVideosRequestTimeout = reducers(
  types.LISTING_DETAIL_VID_REQUEST_TIMEOUT
);
export const isListingDetailListRequestTimeout = reducers(
  types.LISTING_DETAIL_LIST_REQUEST_TIMEOUT
);
export const isListingDetailReviewsRequestTimeout = reducers(
  types.LISTING_DETAIL_REVIEWS_REQUEST_TIMEOUT
);
export const isListingDetailEventRequestTimeout = reducers(
  types.LISTING_DETAIL_EVENT_REQUEST_TIMEOUT
);
export const isEventSearchRequestTimeout = reducers(
  types.EVENT_SEARCH_REQUEST_TIMEOUT
);
export const isListingDetailSidebarRequestTimeout = reducers(
  types.LISTING_DETAIL_SIDEBAR_REQUEST_TIMEOUT
);
export const isArticleRequestTimeout = reducers(types.ARTICLE_REQUEST_TIMEOUT);
export const isMenuRequestTimeout = reducers(types.MENU_REQUEST_TIMEOUT);
export const isProductDetailsTimeout = reducers(types.PRODUCT_TIMEOUT);
export const isPaymentTimeOut = reducers(types.PAYMENT_TIMEOUT);
