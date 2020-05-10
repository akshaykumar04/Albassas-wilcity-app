import { GET_SETTINGS } from "../constants/actionTypes";
import configureApp from "../../configureApp.json";
const initialState = {
  colorPrimary: configureApp.colorPrimary,
  oSingleListing: {
    contentPosition: "above_sidebar"
  }
};
export const settings = (state = initialState, action) => {
  switch (action.type) {
    case GET_SETTINGS:
      return {
        ...action.payload,
        colorPrimary: !action.payload.colorPrimary
          ? colorPrimary
          : action.payload.colorPrimary
      };
    default:
      return state;
  }
};
