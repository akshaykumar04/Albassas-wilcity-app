import { GET_LISTING_STATUS, GET_EVENT_STATUS } from "../constants/actionTypes";
import axios from "axios";
import { axiosHandleError } from "../wiloke-elements";

const getStatus = allText => dispatch => (endpoint, type) => {
  return axios
    .get(endpoint)
    .then(res => {
      const { data } = res;
      data.status === "success" &&
        dispatch({
          type,
          payload: [
            {
              id: "all",
              name: allText,
              selected: true
            },
            ...data.oResults.map(item => ({
              id: item.post_status,
              name: `${item.status} (${item.total})`,
              selected: false
            }))
          ]
        });
    })
    .catch(err => console.log(axiosHandleError(err)));
};

export const getListingStatus = allText => dispatch => {
  return getStatus(allText)(dispatch)("get-listing-status", GET_LISTING_STATUS);
};

export const getEventStatus = allText => dispatch => {
  return getStatus(allText)(dispatch)("get-event-status", GET_EVENT_STATUS);
};
