import {
  GET_COUNT_MESSAGES,
  GET_COUNT_NOTIFICATIONS,
  GET_COUNT_NOTIFICATIONS_REALTIMEFAKER
} from "../constants/actionTypes";
import { ctlGet } from "./reducerController";

export const countNotify = (state = 0, action) => {
  return ctlGet(state, action)(GET_COUNT_NOTIFICATIONS);
};

export const countNotifyRealTimeFaker = (state = 0, action) => {
  return ctlGet(state, action)(GET_COUNT_NOTIFICATIONS_REALTIMEFAKER);
};
