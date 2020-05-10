import * as types from "../constants/actionTypes";

export const articles = (state = { oResults: [] }, action) => {
  switch (action.type) {
    case types.GET_ARTICLES:
      return action.payload;

    case types.GET_ARTICLES_LOADMORE:
      return {
        ...state,
        next: action.payload.next,
        oResults: [...state.oResults, ...action.payload.oResults]
      };

    default:
      return state;
  }
};
