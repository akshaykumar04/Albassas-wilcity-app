import { GET_REVIEW_FIELDS } from "../constants/actionTypes";
import { ctlGet } from "./reducerController";
export const reviewFields = (state = {}, action) => {
  return ctlGet(state, action)(GET_REVIEW_FIELDS);
};
