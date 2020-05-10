import * as types from "../constants/actionTypes";
import axios from "axios";
import _ from "lodash";
import { axiosHandleError } from "../wiloke-elements";

const POSTS_PER_PAGE = 12;

export const getListings = (
  categoryId,
  locationId,
  postType,
  nearBy
) => dispatch => {
  dispatch({
    type: types.LOADING,
    loading: true
  });
  dispatch({
    type: types.LISTING_REQUEST_TIMEOUT,
    isTimeout: false
  });
  const params = _.pickBy(
    {
      page: 1,
      postsPerPage: POSTS_PER_PAGE,
      postType: postType === "all" ? "" : postType,
      listing_cat: categoryId !== "wilokeListingCategory" ? categoryId : null,
      listing_location:
        _.isEmpty(nearBy) && locationId !== "wilokeListingLocation"
          ? locationId
          : null,
      ...nearBy
    },
    _.identity
  );
  return axios
    .get(`list/listings`, {
      params
    })
    .then(res => {
      dispatch({
        type: types.GET_LISTINGS,
        payload:
          postType !== null
            ? {
                [postType]: res.data
              }
            : {}
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
        type: types.LISTING_REQUEST_TIMEOUT,
        isTimeout: false
      });
    })
    .catch(err => {
      dispatch({
        type: types.LOADING,
        loading: false
      });
      dispatch({
        type: types.LISTING_REQUEST_TIMEOUT,
        isTimeout: true
      });
      console.log(axiosHandleError(err));
    });
};

export const getListingsLoadmore = (
  next,
  categoryId,
  locationId,
  postType,
  nearBy
) => dispatch => {
  const params = _.pickBy(
    {
      page: next,
      postsPerPage: POSTS_PER_PAGE,
      postType: postType === "all" ? "" : postType,
      listing_cat: categoryId !== "wilokeListingCategory" ? categoryId : null,
      listing_location:
        _.isEmpty(nearBy) && locationId !== "wilokeListingLocation"
          ? locationId
          : null,
      ...nearBy
    },
    _.identity
  );
  return axios
    .get(`list/listings`, {
      params
    })
    .then(res => {
      dispatch({
        type: types.GET_LISTINGS_LOADMORE,
        payload:
          postType !== null
            ? {
                [postType]: res.data
              }
            : {}
      });
    })
    .catch(err => console.log(axiosHandleError(err)));
};
