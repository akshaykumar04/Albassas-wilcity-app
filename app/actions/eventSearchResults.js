import * as types from "../constants/actionTypes";
import axios from "axios";
import _ from "lodash";
import { axiosHandleError } from "../wiloke-elements";

const POSTS_PER_PAGE = 12;

const getResultsRemoveDateEmpty = results =>
  Object.keys(results).reduce((obj, key) => {
    return {
      ...obj,
      ...(key === "date_range" && results[key].from === ""
        ? {}
        : { [key]: results[key] })
    };
  }, {});

export const getEventSearchResults = results => dispatch => {
  dispatch({
    type: types.LOADING,
    loading: true
  });
  dispatch({
    type: types.EVENT_SEARCH_REQUEST_TIMEOUT,
    isTimeout: false
  });
  const params = _.pickBy(
    {
      page: 1,
      postsPerPage: POSTS_PER_PAGE,
      ...getResultsRemoveDateEmpty(results)
    },
    _.identity
  );
  return axios
    .get(`events`, {
      params
    })
    .then(res => {
      dispatch({
        type: types.GET_EVENT_SEARCH_RESULTS,
        payload: res.data
      });
      dispatch({
        type: types.LOADING,
        loading:
          (res.data.oResults && res.data.oResults.length > 0) ||
          res.data.status === "error"
            ? false
            : true
      });
      dispatch({
        type: types.EVENT_SEARCH_REQUEST_TIMEOUT,
        isTimeout: false
      });
    })
    .catch(err => {
      dispatch({
        type: types.EVENT_SEARCH_REQUEST_TIMEOUT,
        isTimeout: true
      });
      console.log(axiosHandleError(err));
    });
};

export const getEventSearchResultsLoadmore = (next, results) => dispatch => {
  return axios
    .get(`events`, {
      params: {
        page: next,
        postsPerPage: POSTS_PER_PAGE,
        ...results
      }
    })
    .then(res => {
      dispatch({
        type: types.GET_EVENT_SEARCH_RESULTS_LOADMORE,
        payload: res.data
      });
    })
    .catch(err => console.log(axiosHandleError(err)));
};
