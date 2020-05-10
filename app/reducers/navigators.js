import * as types from "../constants/actionTypes";

const reducers = type => (state = [], action) => {
  switch (action.type) {
    case type:
      return action.payload;
    default:
      return state;
  }
};
export const tabNavigator = reducers(types.GET_TAB_NAVIGATOR);
export const stackNavigator = reducers(types.GET_STACK_NAVIGATOR);
