import { GET_REVIEW_FIELDS } from "../constants/actionTypes";
import axios from "axios";
import { axiosHandleError } from "../wiloke-elements";

export const getReviewFields = id => async dispatch => {
  try {
    const res = await axios.get(`review-fields/${id}`);
    const { data } = res;
    if (data.status === "success") {
      dispatch({
        type: GET_REVIEW_FIELDS,
        payload: data.oFields
      });
    }
  } catch (err) {
    console.log(axiosHandleError(err));
  }
};
