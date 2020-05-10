import { EDIT_COMMENT_DISCUSSION_EVENT } from "../../constants/actionTypes";
import { axiosHandleError } from "../../wiloke-elements";
import axios from "axios";

export const editCommentInDiscussionEvent = (
  discussionId,
  commentID,
  content
) => async dispatch => {
  try {
    console.log(discussionId, commentID, content);
    const endpoint = `discussions/${discussionId}/comments/${commentID}`;
    const { data } = await axios.put(endpoint, {
      content
    });
    if (data.status === "success") {
      const { ID, postDate } = data;
      dispatch({
        type: EDIT_COMMENT_DISCUSSION_EVENT,
        payload: {
          ID,
          postDate,
          postContent: content
        }
      });
    } else {
      console.log(JSON.stringify(data));
    }
  } catch (err) {
    console.log(axiosHandleError(err));
  }
};
