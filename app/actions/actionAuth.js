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
const encodeId = id => `___${id}___`;
const decodeId = id => id.replace(/___/g, "");

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
      console.log(err);
      dispatch({
        type: LOGIN_LOADING,
        loading: false
      });
      // console.log(axiosHandleError(err));
    });
};

export const loginFb = (id, token) => async dispatch => {
  try {
    const { data } = await axios.post("fb-signin", {
      fbUserID: id,
      accessToken: token
    });
    if (data.status === "success") {
      dispatch({
        type: LOGIN,
        payload: {
          token: data.token
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export const loginApple = (
  authCode,
  identityToken,
  email
) => async dispatch => {
  try {
    const { data } = await axios.post("apple-signin", {
      authorizationCode: authCode,
      email,
      identityToken
    });
    if (data.status === "success") {
      dispatch({
        type: LOGIN,
        payload: {
          token: data.token
        }
      });
    } else {
      dispatch({
        type: LOGIN_ERROR,
        err: data.msg
      });
    }
  } catch (err) {
    console.log(err);
    dispatch({
      type: LOGIN_ERROR,
      err: "Server internal"
    });
  }
};

export const logout = myID => (dispatch, getState) => {
  dispatch({
    type: LOGOUT,
    message: "logout"
  });
  const { db } = getState();
  if (!db || !myID) return;
  db.ref(`deviceTokens/${encodeId(myID)}/token`).set("");
};

export const checkToken = myID => (dispatch, getState) => {
  return axios
    .get("is-token-living")
    .then(({ data }) => {
      dispatch({
        type: CHECK_TOKEN,
        isLoggedIn: data.status === "success" ? true : false,
        message: !!data.msg ? data.msg : ""
      });
      const { db } = getState();
      if (!db) return;
      if (data.status !== "success") {
        db.ref(`deviceTokens/${encodeId(myID)}/token`).set("");
      }
    })
    .catch(err => {
      console.log(axiosHandleError(err));
    });
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
