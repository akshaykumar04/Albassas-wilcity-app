import { GET_SIGNUP_FORM } from "../constants/actionTypes";
import { ctlGet } from "./reducerController";

export const signUpForm = (state = [], action) => {
  return ctlGet(state, action)(GET_SIGNUP_FORM);
};
