import { GET_COMMENT_DISCUSSION_EVENT } from "../../constants/actionTypes";
import { axiosHandleError } from "../../wiloke-elements";
import axios from "axios";

export const getCommentInDiscussionEvent = discussionId => async dispatch => {
  try {
    const endpoint = `events/${discussionId}/discussions`;
    const { data } = await axios.get(endpoint, {
      params: {
        postsPerPage: -1
      }
    });
    if (data.status === "success") {
      dispatch({
        type: GET_COMMENT_DISCUSSION_EVENT,
        payload: data
      });
    } else {
      console.log(JSON.stringify(data));
    }
  } catch (err) {
    console.log(axiosHandleError(err));
  }
};
