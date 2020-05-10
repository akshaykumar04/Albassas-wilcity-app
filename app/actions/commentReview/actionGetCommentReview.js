import { GET_COMMENT_IN_REVIEWS } from "../../constants/actionTypes";
import axios from "axios";
import { axiosHandleError } from "../../wiloke-elements";
/**
 * GET COMMENT LISTING REVIEWS
 * @param {number} commentId by listing reviews
 */
export const getCommentInReviews = commentId => async dispatch => {
  try {
    const endpoint = `reviews/${commentId}/discussions`;
    const { data } = await axios.get(endpoint, {
      params: {
        postsPerPage: -1
      }
    });
    dispatch({
      type: GET_COMMENT_IN_REVIEWS,
      payload: data.status === "success" ? data.oResults.aDiscussion : []
    });
    if (data.status === "error") {
      console.log(JSON.stringify(data));
    }
  } catch (err) {
    console.log(axiosHandleError(err));
  }
};
