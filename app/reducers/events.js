import * as types from "../constants/actionTypes";

export const events = (state = { oResults: [] }, action) => {
  switch (action.type) {
    case types.GET_EVENTS:
      return action.payload;

    case types.GET_EVENTS_LOADMORE:
      return {
        ...state,
        next: action.payload.next,
        oResults: [...state.oResults, ...action.payload.oResults]
      };

    default:
      return state;
  }
};
