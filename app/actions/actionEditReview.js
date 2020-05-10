import axios from "axios";
import { mapObjectToFormData, axiosHandleError } from "../wiloke-elements";
import { PUT_REVIEW, POST_REVIEW_ERROR } from "../constants/actionTypes";

export const editReview = (listingID, reviewID, results) => async dispatch => {
  try {
    const formData = mapObjectToFormData(results);
    const { data } = await axios.post(
      `posts/${listingID}/reviews/${reviewID}`,
      formData,
      {
        headers: {
          "content-type": "multipart/form-data"
        }
      }
    );
    const { oItem, oGeneral, msg } = data;
    if (data.status === "success") {
      dispatch({
        type: PUT_REVIEW,
        payload: { oItem, oGeneral },
        id: listingID
      });
      dispatch({
        type: POST_REVIEW_ERROR,
        payload: msg
      });
    } else {
      const err = { message: msg };
      throw err;
    }
  } catch (err) {
    dispatch({
      type: POST_REVIEW_ERROR,
      payload: err.message
    });
    console.log(axiosHandleError(err));
  }
};
