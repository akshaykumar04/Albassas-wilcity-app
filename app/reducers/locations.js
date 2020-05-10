import { GET_LOCATION } from "../constants/actionTypes";

const initialState = {
  location: {
    coords: {
      longitude: "",
      latitude: ""
    }
  }
};

export const locations = (state = initialState, action) => {
  switch (action.type) {
    case GET_LOCATION:
      return action.locations;
    default:
      return state;
  }
};
