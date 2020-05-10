import {
  SEARCH_USERS,
  SEARCH_USERS_ERROR,
  GET_USER,
  GET_USERS_FROM_FIREBASE,
  GET_USERS_FROM_FIREBASE_LOADING,
  GET_USERS_FROM_FIREBASE_ERROR,
  GET_KEY_FIREBASE,
  GET_KEY_FIREBASE2,
  USER_CONNECTION,
  POST_USER_CONNECTION,
  LOGOUT
} from "../constants/actionTypes";
import { ctlGet } from "./reducerController";

export const users = (state = [], action) => {
  switch (action.type) {
    case SEARCH_USERS:
      return action.payload;
    case LOGOUT:
      return [];
    default:
      return state;
  }
};

export const usersError = (state = "", action) => {
  switch (action.type) {
    case SEARCH_USERS_ERROR:
      return action.message;
    default:
      return state;
  }
};

export const user = (state = {}, action) => {
  switch (action.type) {
    case GET_USER:
      return action.payload;
    case LOGOUT:
      return {};
    default:
      return state;
  }
};

export const usersFromFirebase = (state = [], action) => {
  switch (action.type) {
    case GET_USERS_FROM_FIREBASE:
      return action.payload;
    case GET_USERS_FROM_FIREBASE_ERROR:
    case LOGOUT:
      return [];
    default:
      return state;
  }
};

export const usersFromFirebaseLoading = (state = true, action) => {
  return ctlGet(state, action)(GET_USERS_FROM_FIREBASE_LOADING);
};

export const usersFromFirebaseError = (state = "", action) => {
  switch (action.type) {
    case GET_USERS_FROM_FIREBASE_ERROR:
      return "error";
    default:
      return state;
  }
};

export const keyFirebase = (state = "", action) => {
  return ctlGet(state, action)(GET_KEY_FIREBASE);
};

export const keyFirebase2 = (state = "", action) => {
  return ctlGet(state, action)(GET_KEY_FIREBASE2);
};

export const userConnections = (state = {}, action) => {
  switch (action.type) {
    case USER_CONNECTION:
      return action.payload;
    case POST_USER_CONNECTION:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
