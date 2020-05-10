import {
  GET_MY_EVENTS,
  GET_MY_EVENTS_LOADMORE,
  GET_MY_EVENT_ERROR
} from "../constants/actionTypes";

export const myEvents = (state = { oResults: [] }, action) => {
  switch (action.type) {
    case GET_MY_EVENTS:
      return action.payload;
    case GET_MY_EVENTS_LOADMORE:
      return {
        ...state,
        next: action.payload.next,
        oResults: [...state.oResults, ...action.payload.oResults]
      };
    case GET_MY_EVENT_ERROR:
      return { oResults: [] };
    default:
      return state;
  }
};

export const myEventError = (state = "", action) => {
  switch (action.type) {
    case GET_MY_EVENT_ERROR:
      return action.messageError;
    default:
      return state;
  }
};
