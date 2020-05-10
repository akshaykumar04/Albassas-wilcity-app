import {
  GET_MY_EVENTS,
  GET_MY_EVENTS_LOADMORE,
  GET_MY_EVENT_ERROR
} from "../constants/actionTypes";
import axios from "axios";
import { axiosHandleError } from "../wiloke-elements";

const POSTS_PER_PAGE = 12;

export const getMyEvents = ({ postStatus }) => dispatch => {
  return axios
    .get("get-my-events", {
      params: {
        postStatus,
        postsPerPage: POSTS_PER_PAGE
      }
    })
    .then(({ data }) => {
      if (data.status === "success") {
        dispatch({
          type: GET_MY_EVENTS,
          payload: data
        });
      } else if (data.status === "error") {
        dispatch({
          type: GET_MY_EVENT_ERROR,
          messageError: data.msg
        });
      }
    })
    .catch(err => console.log(axiosHandleError(err)));
};

export const getEventsLoadmore = ({ next, postStatus }) => async dispatch => {
  return axios
    .get("get-my-events", {
      params: {
        postStatus,
        page: next,
        postsPerPage: POSTS_PER_PAGE
      }
    })
    .then(({ data }) => {
      data.status === "success" &&
        dispatch({
          type: GET_MY_EVENTS_LOADMORE,
          payload: data
        });
    })
    .catch(err => console.log(axiosHandleError(err)));
};
