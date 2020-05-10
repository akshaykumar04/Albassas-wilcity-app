import axios from "axios";
import { axiosHandleError } from "../../wiloke-elements";
import { LIKE_EVENT_DISCUSSION } from "../../constants/actionTypes";

export const likeEventDiscussion = discussionID => async dispatch => {
  try {
    const endpoint = `discussions/${discussionID}/like`;
    const { data } = await axios.post(endpoint);
    if (data.status === "success") {
      const { countLiked, isLiked } = data;
      dispatch({
        type: LIKE_EVENT_DISCUSSION,
        payload: {
          countLiked,
          isLiked,
          discussionID
        }
      });
    }
  } catch (err) {
    console.log(axiosHandleError(err));
  }
};
