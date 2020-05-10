import {
  GET_MESSAGE_CHAT,
  PUT_MESSAGE_CHAT,
  GET_MESSAGE_CHAT_LOADMORE,
  RESET_MESSAGE_CHAT,
  WRITING_MESSAGE_CHAT,
  GET_MESSAGE_NEW_COUNT,
  GET_CURRENT_SEND_MESSAGE_SCREEN,
  DELETE_MESSAGE_CHAT,
  EDIT_MESSAGE_CHAT
} from "../constants/actionTypes";
import axios from "axios";
import { Audio } from "expo-av";
import { Platform } from "react-native";
const soundSendMessage = require("../../assets/sendMessage.mp3");
const soundPushMessage = require("../../assets/pushMessage.mp3");
const soundWritingMessage = require("../../assets/writingMessage.mp3");

const PAGESIZE = 40;
const soundObject = new Audio.Sound();

// export const getMessageList = _ => dispatch => {
//   return axios
//     .get("get-author-messages")
//     .then(({ data }) => {
//       console.log(data);
//       // if (data.status === 'success') {
//       //   dispatch({
//       //     type: GET_MESSAGE_LIST,
//       //   })
//       // }
//     })
//     .catch(err => console.log(err));
// };
import * as firebase from "firebase";
const getChatItemId = (id1, id2) => `___${id1}___${id2}___`;
const getArrValue = obj => {
  return Object.keys(obj).reduce((arr, item) => {
    return [...arr, { ...obj[item], ...{ key: item } }];
  }, []);
};
const encodeId = id => `___${id}___`;
const decodeId = id => id.replace(/___/g, "");

const setSendMessageSound = async (soundObject, sound) => {
  try {
    soundObject.setOnPlaybackStatusUpdate(async playbackStatus => {
      if (playbackStatus.didJustFinish) {
        try {
          await soundObject.stopAsync();
        } catch (err) {
          console.log(err);
        }
      }
    });
    await soundObject.loadAsync(sound);
    await soundObject.playAsync();
  } catch (err) {
    setSendMessageSound(new Audio.Sound(), sound);
  }
};

const checkOpenSound = async (db, myID, chatId) => {
  try {
    const soundObject = new Audio.Sound();
    const snapshot = await db
      .ref(`messages/chats/${chatId}/lists`)
      .orderByKey()
      .limitToLast(1)
      .once("value");
    db.ref(`messages/chats/${chatId}/lists`)
      .orderByKey()
      .limitToLast(1)
      .on("child_added", async childSnapshot => {
        try {
          const val = childSnapshot.val();
          const _val = snapshot.val();
          if (_val) {
            const { timestamp } = Object.values(_val)[0];
            if (timestamp !== val.timestamp) {
              if (val.userID !== myID) {
                soundObject.setOnPlaybackStatusUpdate(async playbackStatus => {
                  if (playbackStatus.didJustFinish) {
                    try {
                      await soundObject.stopAsync();
                    } catch (err) {
                      console.log(err);
                    }
                  }
                });
                await soundObject.loadAsync(soundPushMessage);
                await soundObject.playAsync();
              }
            }
          }
        } catch (err) {}
      });
  } catch (err) {
    console.log(err);
  }
};

export const getMessageChat = (myID, userID) => (dispatch, getState) => {
  const { db } = getState();
  if (!db || !myID || !userID) return;
  const id = getChatItemId(myID, userID);
  const idReverse = getChatItemId(userID, myID);
  const dbChat = db
    .ref(`messages/chats/${id}/lists`)
    .orderByKey()
    .limitToLast(PAGESIZE);
  const dbChat2 = db
    .ref(`messages/chats/${idReverse}/lists`)
    .orderByKey()
    .limitToLast(PAGESIZE);
  return new Promise(resolve => {
    // checkOpenSound(db, myID, id);
    // checkOpenSound(db, myID, idReverse);
    dbChat.on("value", async snapshot => {
      const val = snapshot.val();
      if (val === null) {
        dbChat2.on("value", snapshot2 => {
          const val2 = snapshot2.val();
          if (val2 === null) {
            dispatch({
              type: GET_MESSAGE_CHAT,
              payload: {
                firstKey: null,
                chats: [],
                chatId: id
              }
            });
            return false;
          } else {
            dispatch({
              type: GET_MESSAGE_CHAT,
              payload: {
                firstKey: Object.keys(val2)[0],
                chats: getArrValue(val2).reverse(),
                chatId: idReverse
              }
            });
            resolve();
          }
        });
      } else {
        dispatch({
          type: GET_MESSAGE_CHAT,
          payload: {
            firstKey: Object.keys(val)[0],
            chats: getArrValue(val).reverse(),
            chatId: id
          }
        });
        resolve();
      }
    });
  });

  // dbChat.on("child_added", snapshot => {
  //   const val = snapshot.val();
  //   console.log(snapshot);
  //   if (val !== null) {
  //     dispatch({
  //       type: PUT_MESSAGE_CHAT,
  //       payload: val
  //     });
  //   }
  // });
};

export const getMessageChatLoadmore = (firstKey, chatId) => async (
  dispatch,
  getState
) => {
  const { db } = getState();
  if (!db || !chatId) return;
  const dbChat = db.ref(`messages/chats/${chatId}/lists`).orderByKey();
  const snapshotLimitOne = await dbChat.limitToFirst(1).once("value");
  const arrFirstKey = snapshotLimitOne.val()
    ? Object.keys(snapshotLimitOne.val())
    : [firstKey];
  return new Promise(resolve => {
    if (!arrFirstKey.includes(firstKey)) {
      dbChat
        .endAt(firstKey)
        .limitToLast(PAGESIZE)
        .once("value", snapshot => {
          const val = snapshot.val();
          if (val) {
            dispatch({
              type: GET_MESSAGE_CHAT_LOADMORE,
              payload: {
                firstKey: Object.keys(val)[0],
                chats: getArrValue(val)
                  .reverse()
                  .filter((_, index) => index !== 0),
                chatId
              }
            });
            resolve(true);
          }
        });
    } else {
      resolve(false);
    }
  });
};

export const putMessageChatOff = (
  myID,
  myName,
  chatId,
  message
) => async dispatch => {
  const newItem = {
    userID: myID,
    displayName: myName,
    message,
    timestamp: "timestamp"
  };
  try {
    await setSendMessageSound(new Audio.Sound(), soundSendMessage);
    dispatch({
      type: PUT_MESSAGE_CHAT,
      payload: { chatId, newItem }
    });
  } catch (err) {}
};

export const putMessageChat = (
  myID,
  myName,
  chatId,
  message,
  firebaseID
) => async (__, getState) => {
  try {
    const { db } = getState();
    if (!db || !myID || !chatId) return;
    const timestamp = firebase.database.ServerValue.TIMESTAMP;
    const newItem = {
      userID: myID,
      displayName: myName,
      message,
      timestamp,
      firebaseID
    };
    const snap = await db.ref(`messages/chats/${chatId}/fUser`).once("value");
    await db.ref(`messages/chats/${chatId}/lists`).push(newItem);
    const val = snap.val();
    if (!val) {
      await db.ref(`messages/chats/${chatId}/fUser`).set(firebaseID);
    } else {
      if (val !== firebaseID) {
        await db.ref(`messages/chats/${chatId}/sUser`).set(firebaseID);
      }
    }
  } catch (err) {
    console.log(err);
  }
};

// export const putMessageChatListener = (event, firstKey, chatId) => dispatch => {
//   const dbLists = db.ref(`messages/chats/${chatId}/lists`).limitToLast(1);
//   return new Promise(resolve => {
//     if (event === "on") {
//       dbLists.on("child_added", snapshot => {
//         const val = snapshot.val();
//         const { key } = snapshot;
//         console.log({ ...val, key });
//         if (val) {
//           dispatch({
//             type: PUT_MESSAGE_CHAT_LISTENER,
//             payload: {
//               firstKey,
//               chatId,
//               chat: {
//                 ...val,
//                 key
//               }
//             }
//           });
//           resolve();
//         }
//       });
//     } else if (event === "off") {
//       dbLists.off("child_added");
//     }
//   });
// };

export const resetMessageChat = chatId => (dispatch, getState) => {
  const { db } = getState();
  if (!db || !chatId) return;
  db.ref(`messages/chats/${chatId}/lists`).off("value");
  dispatch({
    type: RESET_MESSAGE_CHAT
  });
};

export const postWritingMessageChat = (myID, chatId, message) => async (
  __,
  getState
) => {
  try {
    const { db } = getState();
    if (!db || !myID || !chatId) return;
    const dbMyWriting = db.ref(`messages/chats/${chatId}/writings/${myID}`);
    await dbMyWriting.set(!!message ? true : false);
  } catch (err) {
    console.log(err);
  }
};

export const checkDispatchWritingMessageChat = (
  event,
  chatId,
  userID
) => async (dispatch, getState) => {
  const { db } = getState();
  if (!db || !chatId || !userID) return;
  const dbUserWriting = db.ref(`messages/chats/${chatId}/writings/${userID}`);
  try {
    soundObject.setOnPlaybackStatusUpdate(async playbackStatus => {
      if (playbackStatus.didJustFinish) {
        try {
          await soundObject.stopAsync();
        } catch (err) {
          console.log(err);
        }
      }
    });
    await soundObject.loadAsync(soundWritingMessage);
  } catch (err) {
    console.log(err);
  }
  if (event === "on") {
    dbUserWriting.on("value", async snapshot => {
      const val = snapshot.val();
      try {
        if (val) {
          await soundObject.playAsync();
        }
      } catch (err) {
        console.log(err);
      }
      dispatch({
        type: WRITING_MESSAGE_CHAT,
        payload: {
          [chatId]: val ? true : false
        }
      });
    });
  } else if (event === "off") {
    dbUserWriting.off("value");
  }
  // if (event === "off") {
  //   console.log('off')
  //   dbUserWriting.off("value", test);
  // }
};

export const readNewMessageChat = (id, key) => async (__, getState) => {
  const { db } = getState();
  if (!db || !id || !key) return;
  await db.ref(`messages/users/${encodeId(id)}/${key}/new`).set(false);
};

export const messageChatActive = (id, key, val) => async (__, getState) => {
  const { db } = getState();
  if (!db || !id || !key) return;
  await db.ref(`messages/users/${encodeId(id)}/${key}/active`).set(val);
};

export const getMessageChatNewCount = id => async (dispatch, getState) => {
  const { db } = getState();
  if (!db || !id) return;
  return new Promise(resolve => {
    db.ref(`messages/users/${encodeId(id)}`)
      .orderByChild("new")
      .equalTo(true)
      .on("value", snapshot => {
        const val = snapshot.val();
        const count = val ? Object.keys(val).length : 0;
        dispatch({
          type: GET_MESSAGE_NEW_COUNT,
          payload: count
        });
        resolve(val);
      });
  });
};

export const resetMessageActive = (id, key, isActive) => (__, getState) => {
  const { db } = getState();
  if (!db || !id || !key) return;
  db.ref(`messages/users/${encodeId(id)}/${key}/active`).set(isActive);
};
export const resetMessageActiveAll = id => (__, getState) => {
  const { db } = getState();
  if (!db || !id) return;
  db.ref(`messages/users/${encodeId(id)}`)
    .orderByChild("active")
    .equalTo(true)
    .on("value", snapshot => {
      const val = snapshot.val();
      if (val) {
        const valArr = getArrValue(val);
        valArr.forEach(item => {
          db.ref(`messages/users/${encodeId(id)}/${item.key}/active`).set(
            false
          );
        });
      }
    });
};

export const removeItemInUsersError = id => (__, getState) => {
  const { db } = getState();
  if (!db || !id) return;
  return new Promise(resolve => {
    db.ref(`messages/users/${encodeId(id)}`).on("value", snapshot => {
      const val = snapshot.val();
      if (val) {
        const valArr = getArrValue(val);
        valArr.forEach(item => {
          if (!item.userID) {
            db.ref(`messages/users/${encodeId(id)}/${item.key}`).set(null);
          }
        });
      }
      resolve();
    });
  });
};

export const deleteChatItem = (chatId, key) => async (dispatch, getState) => {
  try {
    const { db } = getState();
    if (!db || !chatId || !key) return;
    dispatch({
      type: DELETE_MESSAGE_CHAT,
      key
    });
    await db.ref(`messages/chats/${chatId}/lists/${key}`).set(null);
  } catch (err) {
    console.log(err);
  }
};

export const editChatItem = (myID, chatId, key, message) => async (
  dispatch,
  getState
) => {
  try {
    const { db } = getState();
    if (!db || !myID || !chatId || !key) return;
    dispatch({
      type: EDIT_MESSAGE_CHAT,
      payload: {
        key,
        message
      }
    });
    await Promise.all([
      db.ref(`messages/chats/${chatId}/lists/${key}/message`).set(message),
      db
        .ref(`messages/chats/${chatId}/lists/${key}/timestamp`)
        .set(firebase.database.ServerValue.TIMESTAMP),
      db.ref(`messages/chats/${chatId}/writings/${myID}`).set(false)
    ]);
  } catch (err) {
    console.log(err);
  }
};

export const getCurrentSendMessageScreen = val => async dispatch => {
  try {
    await dispatch({
      type: GET_CURRENT_SEND_MESSAGE_SCREEN,
      payload: val
    });
  } catch (err) {
    console.log(err);
  }
};
