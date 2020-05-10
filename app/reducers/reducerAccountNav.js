import { GET_ACCOUNT_NAV } from "../constants/actionTypes";

export const accountNav = (state = [], action) => {
  switch (action.type) {
    case GET_ACCOUNT_NAV:
      return action.payload.filter(item => !(item.endpoint === "reviews"));
    default:
      return state;
  }
};
