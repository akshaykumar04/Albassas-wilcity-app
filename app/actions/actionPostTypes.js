import { GET_POST_TYPES } from "../constants/actionTypes";
import axios from "axios";
import { axiosHandleError } from "../wiloke-elements";

export const getPostTypes = allText => dispatch => {
  return axios
    .get("get-listing-types")
    .then(res => {
      const { data } = res;
      data.status === "success" &&
        dispatch({
          type: GET_POST_TYPES,
          payload: [
            {
              id: "all",
              name: allText,
              selected: true
            },
            ...data.oResults.map(item => ({
              id: item.key,
              name: `${item.name} (${item.total})`,
              selected: false
            }))
          ]
        });
    })
    .catch(err => console.log(axiosHandleError(err)));
};
