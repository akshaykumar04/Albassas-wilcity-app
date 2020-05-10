import * as types from "../constants/actionTypes";

export const eventSearchResults = (state = {}, action) => {
  switch (action.type) {
    case types.GET_EVENT_SEARCH_RESULTS:
      return action.payload;

    case types.GET_EVENT_SEARCH_RESULTS_LOADMORE:
      return {
        ...state,
        next: action.payload.next,
        oResults: [...state.oResults, ...action.payload.oResults]
      };

    default:
      return state;
  }
};
