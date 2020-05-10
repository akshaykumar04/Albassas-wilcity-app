import { GET_REPORT_FORM, GET_REPORT_MESSAGE } from "../constants/actionTypes";

export const reportForm = (state = [], action) => {
  switch (action.type) {
    case GET_REPORT_FORM:
      return action.payload;
    default:
      return state;
  }
};

export const reportMessage = (state = "", action) => {
  switch (action.type) {
    case GET_REPORT_MESSAGE:
      return action.message;
    default:
      return false;
  }
};
