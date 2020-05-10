import { DELETE_COMMENT_DISCUSSION_EVENT } from "../../constants/actionTypes";
import { axiosHandleError } from "../../wiloke-elements";
import axios from "axios";

export const deleteCommentInDiscussionEvent = (
  discussionID,
  commentID
) => async dispatch => {
  try {
    const endpoint = `discussions/${discussionID}/comments/${commentID}`;
    const { data } = await axios.delete(endpoint);
    if (data.status === "success") {
      dispatch({
        type: DELETE_COMMENT_DISCUSSION_EVENT,
        payload: {
          discussionID,
          commentID
        }
      });
    } else {
      console.log(JSON.stringify(data));
    }
  } catch (err) {
    console.log(axiosHandleError(err));
  }
};
