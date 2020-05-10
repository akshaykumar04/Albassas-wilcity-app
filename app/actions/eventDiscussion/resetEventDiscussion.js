import {
  RESET_EVENT_DISCUSSION,
  RESET_CMT_EVENT_DISCUSSION
} from "../../constants/actionTypes";

export const resetEventDiscussion = () => dispatch => {
  dispatch({
    type: RESET_EVENT_DISCUSSION
  });
};
export const resetCmtEventDiscussion = () => dispatch => {
  dispatch({
    type: RESET_CMT_EVENT_DISCUSSION
  });
};
