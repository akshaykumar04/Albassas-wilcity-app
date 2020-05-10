import axios from "axios";
import { axiosHandleError } from "../../wiloke-elements";
import { DELETE_COMMENT_IN_REVIEWS } from "../../constants/actionTypes";

export const deleteCommentReview = (
  reviewID,
  commentID,
  listingID
) => async dispatch => {
  try {
    const endpoint = `reviews/${reviewID}/discussions/${commentID}`;
    const { data } = await axios.delete(endpoint);
    if (data.status === "success") {
      dispatch({
        type: DELETE_COMMENT_IN_REVIEWS,
        payload: {
          reviewID,
          commentID,
          countDiscussions: data.countDiscussions
        },
        id: listingID
      });
    } else {
      console.log(JSON.stringify(data));
    }
  } catch (err) {
    console.log(axiosHandleError(err));
  }
};
