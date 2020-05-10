import { axiosHandleError } from "../../wiloke-elements";
import axios from "axios";
import _ from "lodash";
import { EDIT_EVENT_DISCUSSION } from "../../constants/actionTypes";

export const editEventDiscussion = (
  eventID,
  discussionID,
  content
) => async dispatch => {
  try {
    const enpoint = `events/${eventID}/discussions/${discussionID}`;
    const { data } = await axios.put(enpoint, {
      content
    });
    if (data.status === "success") {
      const { postDate } = data;
      dispatch({
        type: EDIT_EVENT_DISCUSSION,
        payload: {
          discussionID,
          postDate,
          postContent: content
        }
      });
    }
  } catch (err) {
    console.log(axiosHandleError(err));
  }
};
