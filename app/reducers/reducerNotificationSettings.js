import {
  GET_NOTIFICATION_SETTING,
  SET_NOTIFICATION_SETTING,
  GET_NOTIFICATION_ADMIN_SETTING
} from "../constants/actionTypes";

export const notificationSettings = (state = {}, action) => {
  switch (action.type) {
    case GET_NOTIFICATION_SETTING:
    case SET_NOTIFICATION_SETTING:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export const notificationAdminSettings = (state = [], action) => {
  switch (action.type) {
    case GET_NOTIFICATION_ADMIN_SETTING:
      return action.payload;
    default:
      return state;
  }
};
