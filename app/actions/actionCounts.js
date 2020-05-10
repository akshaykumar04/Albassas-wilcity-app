import {
  GET_COUNT_MESSAGES,
  GET_COUNT_NOTIFICATIONS,
  GET_COUNT_NOTIFICATIONS_REALTIMEFAKER
} from "../constants/actionTypes";
import axios from "axios";
import { axiosHandleError } from "../wiloke-elements";

export const getCountNotifications = _ => dispatch => {
  return axios
    .get("count-new-notifications")
    .then(({ data }) => {
      if (data.status === "success") {
        dispatch({
          type: GET_COUNT_NOTIFICATIONS,
          payload: data.msg
        });
      }
    })
    .catch(err => {
      console.log(axiosHandleError(err));
    });
};

export const getCountNotificationsRealTimeFaker = _ => dispatch => {
  return axios
    .get("count-new-notifications")
    .then(({ data }) => {
      if (data.status === "success") {
        dispatch({
          type: GET_COUNT_NOTIFICATIONS_REALTIMEFAKER,
          payload: data.msg
        });
      }
    })
    .catch(err => {
      console.log(axiosHandleError(err));
    });
};
