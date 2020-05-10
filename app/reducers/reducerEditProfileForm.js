import { GET_PROFILE_FORM } from "../constants/actionTypes";

export const editProfileForm = (state = [], action) => {
  switch (action.type) {
    case GET_PROFILE_FORM:
      return action.payload;
    default:
      return state;
  }
};
