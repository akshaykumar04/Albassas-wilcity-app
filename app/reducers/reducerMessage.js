import {
  GET_MESSAGE_CHAT,
  PUT_MESSAGE_CHAT,
  PUT_MESSAGE_CHAT_LISTENER,
  GET_MESSAGE_CHAT_LOADMORE,
  RESET_MESSAGE_CHAT,
  WRITING_MESSAGE_CHAT,
  GET_MESSAGE_NEW_COUNT,
  GET_CURRENT_SEND_MESSAGE_SCREEN,
  DELETE_MESSAGE_CHAT,
  EDIT_MESSAGE_CHAT
} from "../constants/actionTypes";
import { ctlGet } from "./reducerController";

const initialState = {
  firstKey: "",
  chatId: "",
  chats: []
};

export const messageChat = (state = initialState, action) => {
  switch (action.type) {
    case GET_MESSAGE_CHAT:
      return action.payload;
    case PUT_MESSAGE_CHAT:
      return {
        firstKey: "loading",
        chatId: action.payload.chatId,
        chats: [action.payload.newItem, ...state.chats]
      };
    // case PUT_MESSAGE_CHAT_LISTENER:
    //   return {
    //     firstKey: action.payload.firstKey,
    //     chatId: action.payload.chatId,
    //     chats: [
    //       action.payload.chat,
    //       ...state.chats.filter(item => item.timestamp !== "timestamp")
    //     ]
    //   };
    case GET_MESSAGE_CHAT_LOADMORE:
      const { firstKey, chatId, chats } = action.payload;
      return {
        firstKey,
        chatId,
        chats: [...state.chats, ...chats]
      };
    case DELETE_MESSAGE_CHAT:
      return {
        ...state,
        chats: state.chats.filter(item => item.key !== action.key)
      };
    case EDIT_MESSAGE_CHAT:
      return {
        ...state,
        chats: state.chats.map(item => {
          return {
            ...item,
            message:
              item.key === action.payload.key
                ? action.payload.message
                : item.message
          };
        })
      };
    case RESET_MESSAGE_CHAT:
      return initialState;
    default:
      return state;
  }
};

export const isWritingMessageChat = (state = {}, action) => {
  return ctlGet(state, action)(WRITING_MESSAGE_CHAT);
};

export const messageNewCount = (state = 0, action) => {
  return ctlGet(state, action)(GET_MESSAGE_NEW_COUNT);
};

export const isCurrentSendMessageScreen = (state = false, action) => {
  switch (action.type) {
    case GET_CURRENT_SEND_MESSAGE_SCREEN:
      return action.payload;
    default:
      return state;
  }
};
