import {
  GET_MY_PROFILE,
  POST_MY_PROFILE,
  POST_MY_PROFILE_ERROR,
  LOGOUT,
  GET_SHORT_PROFILE
} from "../constants/actionTypes";

export const myProfile = (state = {}, action) => {
  switch (action.type) {
    case GET_MY_PROFILE:
      return action.payload;
    case POST_MY_PROFILE:
      return action.payload;
    case LOGOUT:
      return {};
    default:
      return state;
  }
};

export const myProfileError = (state = "", action) => {
  switch (action.type) {
    case POST_MY_PROFILE_ERROR:
      return action.messageError;
    default:
      return state;
  }
};

export const shortProfile = (state = {}, action) => {
  switch (action.type) {
    case GET_SHORT_PROFILE:
      return action.payload;
    case LOGOUT:
      return {};
    default:
      return state;
  }
};
