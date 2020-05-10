import { axiosHandleError } from "../../wiloke-elements";
import axios from "axios";
import _ from "lodash";
import { DELETE_EVENT_DISCUSSION } from "../../constants/actionTypes";

export const deleteEventDiscussion = (eventID, discussionID) => async (
  dispatch,
  getState
) => {
  try {
    const { eventDiscussionLatest } = getState();
    const { countDiscussions } = eventDiscussionLatest;
    const enpoint = `events/${eventID}/discussions/${discussionID}`;
    const { data } = await axios.delete(enpoint);
    if (data.status === "success") {
      dispatch({
        type: DELETE_EVENT_DISCUSSION,
        payload: {
          discussionID,
          countDiscussions
        }
      });
    }
  } catch (err) {
    console.log(axiosHandleError(err));
  }
};
