import { GET_SETTINGS } from "../constants/actionTypes";
import axios from "axios";
import { axiosHandleError } from "../wiloke-elements";
export const getSettings = _ => dispatch => {
  return axios
    .get("general-settings")
    .then(res => {
      dispatch({
        type: GET_SETTINGS,
        payload: res.data
      });
    })
    .catch(err => console.log(axiosHandleError(err)));
};
