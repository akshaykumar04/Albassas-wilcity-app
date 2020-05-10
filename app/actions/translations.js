import { GET_TRANSLATIONS } from "../constants/actionTypes";
import axios from "axios";
import { isEmpty, axiosHandleError } from "../wiloke-elements";
import { decodeObject } from "../utils/decodeObject";

export const getTranslations = _ => dispatch => {
  return axios
    .get("translations")
    .then(res => {
      dispatch({
        type: GET_TRANSLATIONS,
        payload: isEmpty(res.data.oResults)
          ? {}
          : decodeObject(res.data.oResults)
      });
    })
    .catch(err => console.log(axiosHandleError(err)));
};
