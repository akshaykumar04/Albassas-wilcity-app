import * as types from "../constants/actionTypes";

export const eventDetail = (state = {}, action) => {
  switch (action.type) {
    case types.GET_EVENT_DETAIL:
      return action.payload;

    default:
      return state;
  }
};
