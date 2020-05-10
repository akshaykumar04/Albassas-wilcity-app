import { NEAR_BY_FOCUS } from "../constants/actionTypes";

export const getNearByFocus = _ => dispatch => {
  dispatch({
    type: NEAR_BY_FOCUS
  });
};
