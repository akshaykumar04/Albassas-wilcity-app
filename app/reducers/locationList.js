import * as types from "../constants/actionTypes";

// const initialState = [
//   { id: "wilokeListingLocation", name: "...", selected: true }
// ];

export const locationList = (state = {}, action) => {
  switch (action.type) {
    case types.GET_LOCATION_LIST:
      return {
        ...state,
        ...action.payload
      };
    case types.CHANGE_LOCATION_LIST:
      return {
        ...state,
        ...action.payload
      };
    case types.RESET_SELECTED_LOCATION_LIST:
      const postType = Object.keys(action.payload)[0];
      return state.map((item, index) => {
        return { ...item, selected: index === 0 ? true : false };
      });
    default:
      return state;
  }
};
