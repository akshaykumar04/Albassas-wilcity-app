import { FIREBASE } from "../constants/actionTypes";

export const db = (state = null, action) => {
  switch (action.type) {
    case FIREBASE:
      return action.payload;
    default:
      return state;
  }
};
