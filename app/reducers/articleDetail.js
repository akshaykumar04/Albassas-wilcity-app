import * as types from "../constants/actionTypes";

export const articleDetail = (state = {}, action) => {
  switch (action.type) {
    case types.GET_ARTICLE_DETAIL:
      return action.payload;

    default:
      return state;
  }
};
