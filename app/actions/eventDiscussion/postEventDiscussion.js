import { axiosHandleError } from "../../wiloke-elements";
import axios from "axios";
import _ from "lodash";
import {
  POST_EVENT_DISCUSSION,
  ACTION_EVENT_DISCUSSION_MESSAGE
} from "../../constants/actionTypes";

export const postEventDiscussion = (eventID, content) => async (
  dispatch,
  getState
) => {
  try {
    const { shortProfile, eventDiscussionLatest } = getState();
    const { countDiscussions } = eventDiscussionLatest;
    const { avatar, displayName, userID } = shortProfile;
    const enpoint = `events/${eventID}/discussions`;
    const { data } = await axios.post(enpoint, {
      content
    });
    dispatch({
      type: ACTION_EVENT_DISCUSSION_MESSAGE,
      payload: data.msg
    });
    if (data.status === "success") {
      const { postDate, ID } = data;
      dispatch({
        type: POST_EVENT_DISCUSSION,
        payload: {
          ID,
          postDate,
          postContent: content,
          oAuthor: {
            avatar,
            displayName,
            userID
          },
          countDiscussions: 0,
          countLiked: 0,
          countShared: 0
        },
        countDiscussions
      });
    }
  } catch (err) {
    dispatch({
      type: ACTION_EVENT_DISCUSSION_MESSAGE,
      payload: err.message
    });
    console.log(axiosHandleError(err));
  }
};
