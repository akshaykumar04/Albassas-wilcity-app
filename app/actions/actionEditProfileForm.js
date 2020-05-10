import { GET_PROFILE_FORM } from "../constants/actionTypes";
import axios from "axios";
import { axiosHandleError } from "../wiloke-elements";

export const getEditProfileForm = _ => dispatch => {
  return axios
    .get("get-my-profile-fields")
    .then(res => {
      const { data } = res;
      data.status === "success" &&
        dispatch({
          type: GET_PROFILE_FORM,
          payload: data.oResults
        });
    })
    .catch(err => {
      console.log(axiosHandleError(err));
    });
};
