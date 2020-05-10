import { GET_POST_TYPES } from "../constants/actionTypes";
import { ctlGet } from "./reducerController";

export const postTypes = (state = [], action) => {
  return ctlGet(state, action)(GET_POST_TYPES);
};
