import { GET_HOME_SCREEN } from "../constants/actionTypes";

export const homeScreen = (state = [], action) => {
  switch (action.type) {
    case GET_HOME_SCREEN:
      return action.payload;
    default:
      return state;
  }
};
