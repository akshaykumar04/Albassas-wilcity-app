import * as types from "../constants/actionTypes";
import axios from "axios";
import _ from "lodash";
import { axiosHandleError } from "../wiloke-elements";

const POSTS_PER_PAGE = 12;

export const getListingSearchResults = results => dispatch => {
  dispatch({
    type: types.LOADING,
    loading: true
  });
  dispatch({
    type: types.LISTING_SEARCH_REQUEST_TIMEOUT,
    isTimeout: false
  });
  const params = _.pickBy(
    {
      page: 1,
      postsPerPage: POSTS_PER_PAGE,
      ...results
    },
    _.identity
  );
  return axios
    .get(`list/listings`, {
      params
    })
    .then(res => {
      dispatch({
        type: types.GET_LISTING_SEARCH_RESULTS,
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
        type: types.LISTING_SEARCH_REQUEST_TIMEOUT,
        isTimeout: false
      });
    })
    .catch(err => {
      dispatch({
        type: types.LISTING_SEARCH_REQUEST_TIMEOUT,
        isTimeout: true
      });
      console.log(axiosHandleError(err));
    });
};

export const getListingSearchResultsLoadmore = (next, results) => dispatch => {
  return axios
    .get(`list/listings`, {
      params: {
        page: next,
        postsPerPage: POSTS_PER_PAGE,
        ...results
      }
    })
    .then(res => {
      dispatch({
        type: types.GET_LISTING_SEARCH_RESULTS_LOADMORE,
        payload: res.data
      });
    })
    .catch(err => console.log(axiosHandleError(err)));
};
