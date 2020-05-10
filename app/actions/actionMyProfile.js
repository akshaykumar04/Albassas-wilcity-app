import {
  GET_MY_PROFILE,
  POST_MY_PROFILE,
  POST_MY_PROFILE_ERROR,
  CHANGE_PASSWORD_SUCCESS,
  LOGOUT,
  GET_SHORT_PROFILE
} from "../constants/actionTypes";
import axios from "axios";
import { mapObjectToFormData, axiosHandleError } from "../wiloke-elements";

export const getMyProfile = _ => dispatch => {
  return axios
    .get("get-profile")
    .then(({ data }) => {
      if (data.status === "success") {
        dispatch({
          type: GET_MY_PROFILE,
          payload: data.oResults
        });
      }
    })
    .catch(err => {
      console.log(err);
      console.log(axiosHandleError(err));
    });
};

export const postMyProfile = results => dispatch => {
  const formData = mapObjectToFormData(results, "toString");
  return axios
    .post("put-my-profile", formData, {
      headers: {
        "content-type": "multipart/form-data"
      }
    })
    .then(({ data }) => {
      if (data.status === "success") {
        dispatch({
          type: POST_MY_PROFILE,
          payload: data.oResults
        });
        dispatch({
          type: POST_MY_PROFILE_ERROR,
          messageError: ""
        });
        data.msg === "passwordHasBeenUpdated" &&
          dispatch({
            type: LOGOUT,
            message: data.msg
          });
      } else if (data.status === "error") {
        dispatch({
          type: POST_MY_PROFILE_ERROR,
          messageError: data.msg
        });
      }
    })
    .catch(err => console.log(axiosHandleError(err)));
};

export const getShortProfile = () => dispatch => {
  return axios
    .get("get-short-profile")
    .then(({ data }) => {
      if (data.status === "success") {
        dispatch({
          type: GET_SHORT_PROFILE,
          payload: data.oResult
        });
      }
    })
    .catch(err => console.log(err));
};
