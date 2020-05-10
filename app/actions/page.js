import { GET_PAGE } from "../constants/actionTypes";
import axios from "axios";
import { axiosHandleError } from "../wiloke-elements";

export const getPage = pageId => dispatch => {
  axios
    .get(`pages/${pageId}`)
    .then(res => {
      if (res.status === 200) {
        dispatch({
          type: GET_PAGE,
          payload: {
            [pageId]: res.data.oResult
          }
        });
      }
    })
    .catch(err => console.log(axiosHandleError(err)));
};
