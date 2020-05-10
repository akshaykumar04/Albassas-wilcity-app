import axios from "axios";
import { axiosHandleError } from "../wiloke-elements";
import { DELETE_REVIEW } from "../constants/actionTypes";

export const deleteReview = (
  listingID,
  reviewID,
  totalReviews
) => async dispatch => {
  const _listingID = listingID.toString();
  const _reviewID = reviewID.toString();
  try {
    const { data } = await axios.delete(
      `posts/${_listingID}/reviews/${_reviewID}`
    );
    const { oGeneral, reviewID } = data;
    if (data.status === "success") {
      dispatch({
        type: DELETE_REVIEW,
        payload: { oGeneral, reviewID, totalReviews },
        id: listingID
      });
    }
  } catch (err) {
    console.log(axiosHandleError(err));
  }
};
