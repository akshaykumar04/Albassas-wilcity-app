import * as types from "../constants/actionTypes";

export const getScrollTo = scrollTo => dispatch => {
  dispatch({
    type: types.SCROLL_TO,
    scrollTo
  });
};
