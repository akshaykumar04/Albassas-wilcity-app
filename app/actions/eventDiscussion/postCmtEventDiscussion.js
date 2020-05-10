import { POST_COMMENT_DISCUSSION_EVENT } from "../../constants/actionTypes";
import { axiosHandleError } from "../../wiloke-elements";
import axios from "axios";

export const postCommentInDiscussionEvent = (discussionID, content) => async (
  dispatch,
  getState
) => {
  try {
    console.log(discussionID, content);
    const { shortProfile } = getState();
    const { avatar, displayName, userID } = shortProfile;
    const endpoint = `discussions/${discussionID}/comments`;
    const { data } = await axios.post(endpoint, {
      content
    });
    if (data.status === "success") {
      const { ID, postDate } = data;
      dispatch({
        type: POST_COMMENT_DISCUSSION_EVENT,
        payload: {
          ID,
          discussionID,
          postDate,
          postContent: content,
          oAuthor: {
            userID,
            avatar,
            displayName
          }
        }
      });
    } else {
      console.log(JSON.stringify(data));
    }
  } catch (err) {
    console.log(axiosHandleError(err));
  }
};
