import { NEAR_BY_FOCUS } from "../constants/actionTypes";

export const nearByFocus = (state = false, action) => {
  switch (action.type) {
    case NEAR_BY_FOCUS:
      return !state;
    default:
      return state;
  }
};
