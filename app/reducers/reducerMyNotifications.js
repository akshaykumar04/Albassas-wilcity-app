import {
  GET_MY_NOTIFICATIONS,
  GET_MY_NOTIFICATIONS_LOADMORE,
  GET_MY_NOTIFICATION_ERROR,
  DELETE_MY_NOTIFICATION,
  DELETE_MY_NOTIFICATION_ERROR
} from "../constants/actionTypes";

export const myNotifications = (state = { oResults: [] }, action) => {
  switch (action.type) {
    case GET_MY_NOTIFICATIONS:
      return action.payload;
    case GET_MY_NOTIFICATIONS_LOADMORE:
      return {
        ...state,
        next: action.payload.next,
        oResults: [...state.oResults, ...action.payload.oResults]
      };
    case DELETE_MY_NOTIFICATION:
      return {
        ...state,
        oResults: state.oResults.filter(item => item.ID !== action.id)
      };
    case GET_MY_NOTIFICATION_ERROR:
      return { oResults: [] };
    default:
      return state;
  }
};

export const myNotificationError = (state = "", action) => {
  switch (action.type) {
    case GET_MY_NOTIFICATION_ERROR:
      return action.messageError;
    default:
      return state;
  }
};

export const deleteMyNotificationError = (state = "", action) => {
  switch (action.type) {
    case DELETE_MY_NOTIFICATION_ERROR:
      return action.message;
    default:
      return state;
  }
};
