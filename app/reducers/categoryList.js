import {
  GET_CATEGORY_LIST,
  CHANGE_CATEGORY_LIST,
  RESET_SELECTED_CATEGORY_LIST
} from "../constants/actionTypes";

export const categoryList = (state = {}, action) => {
  switch (action.type) {
    case GET_CATEGORY_LIST:
      return {
        ...state,
        ...action.payload
      };
    case CHANGE_CATEGORY_LIST:
      return {
        ...state,
        ...action.payload
      };
    case RESET_SELECTED_CATEGORY_LIST:
      return state.map((item, index) => {
        return { ...item, selected: index === 0 ? true : false };
      });
    default:
      return state;
  }
};
