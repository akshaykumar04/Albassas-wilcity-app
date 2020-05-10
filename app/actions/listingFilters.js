import {
  GET_LISTING_FILTERS,
  PUT_NEW_TAG_LISTING_FILTERS
} from "../constants/actionTypes";
import axios from "axios";
import { axiosHandleError } from "../wiloke-elements";

export const getListingFilters = (objPostType, postType) => dispatch => {
  return axios
    .get("search-fields/listing", {
      params: {
        postType
      }
    })
    .then(res => {
      if (res.status === 200) {
        const { oResults } = res.data;
        dispatch({
          type: GET_LISTING_FILTERS,
          payload: [
            oResults.filter(item => item.key === "postType").length > 0
              ? {}
              : objPostType,
            ...oResults.map(item => ({
              ...item,
              ...(item.key === "listing_tag"
                ? { startOptions: item.options }
                : {})
            }))
          ]
        });
      }
    })
    .catch(err => console.log(axiosHandleError(err)));
};

export const putNewTagListingFilters = catId => async dispatch => {
  try {
    const res = await axios.get(`get-tags/${catId}`);
    const { data } = res;
    if (data.status === "success") {
    }
    dispatch({
      type: PUT_NEW_TAG_LISTING_FILTERS,
      payload: data.status === "success" && data.aOptions
    });
  } catch (err) {
    console.log(axiosHandleError(err));
  }
};
