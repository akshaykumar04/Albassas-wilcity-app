import { GET_PAGE } from "../constants/actionTypes";

export const page = (state = {}, action) => {
  switch (action.type) {
    case GET_PAGE:
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
};
