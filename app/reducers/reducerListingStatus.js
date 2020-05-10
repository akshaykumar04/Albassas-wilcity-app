import { GET_LISTING_STATUS, GET_EVENT_STATUS } from "../constants/actionTypes";
import { ctlGet } from "./reducerController";

export const listingStatus = (state = [], action) => {
  return ctlGet(state, action)(GET_LISTING_STATUS);
};

export const eventStatus = (state = [], action) => {
  return ctlGet(state, action)(GET_EVENT_STATUS);
};
