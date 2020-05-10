import axios from "axios";
import { axiosHandleError } from "../wiloke-elements";
import { SHARE_REVIEW } from "../constants/actionTypes";

export const shareReview = (reviewID, listingID) => async dispatch => {
  try {
    const { data } = await axios.post(`reviews/${reviewID.toString()}/share`);
    if (data.status === "success") {
      const { countShares: countShared } = data;
      dispatch({
        type: SHARE_REVIEW,
        payload: {
          countShared,
          reviewID
        },
        id: listingID
      });
    }
  } catch (err) {
    console.log(axiosHandleError(err));
  }
};
