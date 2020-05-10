import { GET_DEVICE_TOKEN } from "../constants/actionTypes";
import { ctlGet } from "./reducerController";

export const deviceToken = (state = "", action) => {
  return ctlGet(state, action)(GET_DEVICE_TOKEN);
};
