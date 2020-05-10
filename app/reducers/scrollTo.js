import { SCROLL_TO } from "../constants/actionTypes";

export const scrollTo = (state = -1, action) => {
  switch (action.type) {
    case SCROLL_TO:
      return action.scrollTo;
    default:
      return state;
  }
};
