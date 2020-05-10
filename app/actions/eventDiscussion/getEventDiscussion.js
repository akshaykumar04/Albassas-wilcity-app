import axios from "axios";
import { axiosHandleError } from "../../wiloke-elements";
import {
  GET_EVENT_DISCUSSION_LATEST,
  GET_EVENT_DISCUSSION,
  GET_EVENT_DISCUSSION_LOADMORE
} from "../../constants/actionTypes";

const POSTS_PER_PAGE = 10;
const LATEST = 3;

export const getEventDiscussion = (eventID, type) => async dispatch => {
  try {
    const params = {
      page: 1,
      postsPerPage: type === "latest" ? LATEST : POSTS_PER_PAGE
    };
    const { data } = await axios.get(`events/${eventID}/discussions`, {
      params
    });
    if (data.status === "success") {
      if (type === "latest") {
        dispatch({
          type: GET_EVENT_DISCUSSION_LATEST,
          payload: data
        });
      } else {
        dispatch({
          type: GET_EVENT_DISCUSSION,
          payload: data
        });
      }
    }
  } catch (err) {
    console.log(axiosHandleError(err));
  }
};

export const getEventDiscussionLoadmore = (eventID, next) => async dispatch => {
  console.log(eventID, next);
  try {
    const { data } = await axios.get(`events/${eventID}/discussions`, {
      params: {
        page: next,
        postsPerPage: POSTS_PER_PAGE
      }
    });
    if (data.status === "success") {
      dispatch({
        type: GET_EVENT_DISCUSSION_LOADMORE,
        payload: data
      });
    }
  } catch (err) {
    console.log(axiosHandleError(err));
  }
};
