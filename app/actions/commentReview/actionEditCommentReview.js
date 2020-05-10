import axios from "axios";
import { axiosHandleError } from "../../wiloke-elements";
import { EDIT_COMMENT_IN_REVIEWS } from "../../constants/actionTypes";

export const editCommentReview = (
  reviewID,
  commentID,
  content
) => async dispatch => {
  try {
    const endpoint = `reviews/${reviewID}/discussions/${commentID}`;
    const { data } = await axios.put(endpoint, {
      content
    });
    if (data.status === "success") {
      dispatch({
        type: EDIT_COMMENT_IN_REVIEWS,
        payload: { commentID, content }
      });
    } else {
      console.log(JSON.stringify(data));
    }
  } catch (err) {
    console.log(axiosHandleError(err));
  }
};
