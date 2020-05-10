import {
  LOGIN,
  LOGOUT,
  LOGIN_ERROR,
  LOGIN_LOADING,
  CHECK_TOKEN,
  SIGNUP,
  SIGNUP_ERROR,
  SIGNUP_LOADING
} from "../constants/actionTypes";
import axios from "axios";
import { axiosHandleError } from "../wiloke-elements";

export const login = user => dispatch => {
  dispatch({
    type: LOGIN_LOADING,
    loading: true
  });
  return axios
    .post("auth", user)
    .then(({ data }) => {
      const { token, status, msg } = data;
      if (status === "loggedIn") {
        dispatch({
          type: LOGIN,
          payload:
            status && status !== "error"
              ? {
                  token
                }
              : {}
        });
      } else if (status === "error") {
        dispatch({
          type: LOGIN_ERROR,
          err: msg
        });
      }
      dispatch({
        type: LOGIN_LOADING,
        loading: false
      });
    })
    .catch(err => {
      dispatch({
        type: LOGIN_LOADING,
        loading: false
      });
      console.log(axiosHandleError(err));
    });
};

export const logout = _ => dispatch => {
  dispatch({
    type: LOGOUT,
    message: "logout"
  });
};

export const checkToken = _ => dispatch => {
  return axios
    .get("is-token-living")
    .then(({ data }) => {
      dispatch({
        type: CHECK_TOKEN,
        isLoggedIn: data.status === "success" ? true : false,
        message: !!data.msg ? data.msg : ""
      });
    })
    .catch(err => console.log(axiosHandleError(err)));
};

export const register = user => dispatch => {
  dispatch({
    type: SIGNUP_LOADING,
    loading: true
  });
  return axios
    .post("signup", user)
    .then(({ data }) => {
      const { token } = data;
      if (data.status === "success") {
        dispatch({
          type: SIGNUP,
          payload: { token }
        });
      } else if (data.status === "error") {
        dispatch({
          type: SIGNUP_ERROR,
          err: data.msg
        });
      }
      dispatch({
        type: SIGNUP_LOADING,
        loading: false
      });
    })
    .catch(err => {
      dispatch({
        type: SIGNUP_LOADING,
        loading: false
      });
      console.log(axiosHandleError(err));
    });
};
