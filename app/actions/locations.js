import { GET_LOCATION } from "../constants/actionTypes";

export const getLocations = location => dispatch => {
  dispatch({
    type: GET_LOCATION,
    locations: {
      location
    }
  });
};
