import { GET_ACCOUNT_NAV } from "../constants/actionTypes";
import axios from "axios";
import { axiosHandleError } from "../wiloke-elements";

export const getAccountNav = _ => dispatch => {
  return axios
    .get("get-dashboard-navigator")
    .then(res => {
      const { data } = res;
      data.status === "success" &&
        dispatch({
          type: GET_ACCOUNT_NAV,
          payload: data.oResults
        });
    })
    .catch(err => {
      console.log(axiosHandleError(err));
    });
};
