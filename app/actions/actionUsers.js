import {
  SEARCH_USERS,
  SEARCH_USERS_ERROR,
  GET_USER,
  GET_USERS_FROM_FIREBASE,
  GET_USERS_FROM_FIREBASE_LOADING,
  GET_USERS_FROM_FIREBASE_ERROR,
  GET_KEY_FIREBASE,
  GET_KEY_FIREBASE2,
  USER_CONNECTION,
  POST_USER_CONNECTION
} from "../constants/actionTypes";
import axios from "axios";
import _ from "lodash";
import * as firebase from "firebase";
import { axiosHandleError } from "../wiloke-elements";
const getArrValue = obj => {
  return Object.keys(obj).reduce((arr, item) => {
    return [...arr, { ...obj[item], ...{ key: item } }];
  }, []);
};
const encodeId = id => `___${id}___`;
const decodeId = id => id.replace(/___/g, "");

export const searchUsers = username => dispatch => {
  return axios
    .get("search-users", {
      params: {
        s: username
      }
    })
    .then(({ data }) => {
      if (data.status === "success") {
        dispatch({
          type: SEARCH_USERS,
          payload: data.aResults
        });
      } else if (data.status === "error") {
        dispatch({
          type: SEARCH_USERS_ERROR,
          message: data.msg
        });
      }
    })
    .catch(err => console.log(axiosHandleError(err)));
};

export const getUser = userID => dispatch => {
  return axios
    .get(`users/${userID}`)
    .then(({ data }) => {
      if (data.status === "success") {
        dispatch({
          type: GET_USER,
          payload: data.oInfo
        });
      }
    })
    .catch(err => console.log(axiosHandleError(err)));
};

const addToList = (db, id, firebaseID1) => async (
  id2,
  displayName,
  message,
  type,
  firebaseID2
) => {
  const dbInfo = db.ref(`messages/users/${encodeId(id)}`);
  const snapshotOderByUserID = await dbInfo
    .orderByChild("userID")
    .equalTo(id2)
    .once("value");
  const snapshotOderByActive = await dbInfo
    .orderByChild("active")
    .equalTo(true)
    .once("value");
  const valOrderByUserID = snapshotOderByUserID.val();
  const valOrderByActive = snapshotOderByActive.val();
  if (valOrderByUserID) {
    const key = Object.keys(valOrderByUserID)[0];
    db.ref(`messages/users/${encodeId(id)}/${key}/message`).set(message);
    db.ref(`messages/users/${encodeId(id)}/${key}/timestamp`).set(
      firebase.database.ServerValue.TIMESTAMP
    );
    if (firebaseID1) {
      db.ref(`messages/users/${encodeId(id)}/${key}/fUser`).set(firebaseID1);
    }
    if (firebaseID2) {
      db.ref(`messages/users/${encodeId(id)}/${key}/sUser`).set(firebaseID2);
    }
    if (type === "setNew") {
      if (valOrderByActive) {
        db.ref(`messages/users/${encodeId(id)}/${key}/new`).set(
          Object.keys(valOrderByActive)[0] !== key
        );
      } else {
        db.ref(`messages/users/${encodeId(id)}/${key}/new`).set(true);
      }
    }
  } else {
    dbInfo.push({
      userID: id2,
      displayName,
      message,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      new: type === "setNew" ? true : false,
      active: false,
      ...(firebaseID1 ? { fUser: firebaseID1 } : {}),
      ...(firebaseID2 ? { sUser: firebaseID2 } : {})
    });
  }
};

export const addUsersToFirebase = (
  userID,
  displayName,
  myID,
  myDisplayName,
  message,
  firebaseID
) => async (dispatch, getState) => {
  try {
    const { db } = getState();
    if (!db || !myID || !userID || !firebaseID) return;
    await Promise.all([
      addToList(db, myID, firebaseID)(userID, displayName, message),
      addToList(db, userID)(myID, myDisplayName, message, "setNew", firebaseID)
    ]);
    const snapConnections = await db
      .ref(`connections/${encodeId(userID)}`)
      .once("value");
    if (snapConnections.val()) {
      dispatch({
        type: POST_USER_CONNECTION,
        payload: { [userID]: true }
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export const getUsersFromFirebase = myID => (dispatch, getState) => {
  dispatch({
    type: GET_USERS_FROM_FIREBASE_LOADING,
    payload: true
  });
  const { db } = getState();
  if (!db || !myID) return;
  const dbUsers = db.ref(`messages/users/${encodeId(myID)}`);
  return new Promise(resolve => {
    dbUsers.off("value");
    dbUsers.on("value", snapshot => {
      const val = snapshot.val();
      if (val) {
        const query = _.uniq(
          getArrValue(val).map(item => Number(item.userID))
        ).join(",");
        axios
          .get("list-users", {
            params: {
              s: query
            }
          })
          .then(({ data }) => {
            if (data.status === "success") {
              const { aResult } = data;
              const payload = getArrValue(val)
                .map(item => {
                  if (
                    aResult
                      .map(_item => Number(_item.userID))
                      .includes(Number(item.userID))
                  ) {
                    const compareItemID = aResult.filter(
                      _item => Number(_item.userID) === Number(item.userID)
                    )[0];
                    const { displayName, avatar } = compareItemID;
                    return {
                      ...item,
                      displayName,
                      avatar
                    };
                  }
                })
                .filter(item => item)
                .sort((x, y) => y.timestamp - x.timestamp);
              dispatch({
                type: GET_USERS_FROM_FIREBASE,
                payload
              });
              dispatch({
                type: GET_USERS_FROM_FIREBASE_LOADING,
                payload: false
              });
              resolve(val);
            }
          })
          .catch(err => console.log(axiosHandleError(err)));
      } else {
        dispatch({
          type: GET_USERS_FROM_FIREBASE_ERROR
        });
        dispatch({
          type: GET_USERS_FROM_FIREBASE_LOADING,
          payload: false
        });
      }
    });
  });

  // dbUsers
  //   .orderByChild("new")
  //   .equalTo(false)
  //   .once("value", snapshot => {
  //     const val = snapshot.val();
  //     if (val) {
  //       dbUsers
  //         .orderByChild("new")
  //         .equalTo(true)
  //         .once("value", snapshotNew => {
  //           const valNew = snapshotNew.val();
  //           const valAll = { ...val, ...(valNew !== null ? valNew : {}) };
  //           axios
  //             .get("list-users", {
  //               params: {
  //                 s: getArrValue(valAll)
  //                   .map(item => item.userID)
  //                   .join(",")
  //               }
  //             })
  //             .then(({ data }) => {
  //               if (data.status === "success") {
  //                 dispatch({
  //                   type: GET_USERS_FROM_FIREBASE,
  //                   payload: getArrValue(valAll)
  //                     .map((item, index) => ({
  //                       ...item,
  //                       avatar: data.aResult[index].avatar,
  //                       key: Object.keys(valAll)[index]
  //                     }))
  //                     .reverse()
  //                 });
  //                 dispatch({
  //                   type: GET_USERS_FROM_FIREBASE_LOADING,
  //                   payload: false
  //                 });
  //               }
  //             })
  //             .catch(err => console.log(err));
  //         });
  //     } else {
  //       dispatch({
  //         type: GET_USERS_FROM_FIREBASE_ERROR
  //       });
  //       dispatch({
  //         type: GET_USERS_FROM_FIREBASE_LOADING,
  //         payload: false
  //       });
  //     }
  //   });
};

export const getKeyFirebase = (myID, userID, type) => async (
  dispatch,
  getState
) => {
  try {
    const { db } = getState();
    if (!db || !myID || !userID) return;
    const snapshot = await db
      .ref(`messages/users/${encodeId(myID)}`)
      .orderByChild("userID")
      .equalTo(userID)
      .once("value");
    const val = snapshot.val();
    if (val) {
      dispatch({
        type:
          type === "forPushNotification" ? GET_KEY_FIREBASE2 : GET_KEY_FIREBASE,
        payload: Object.keys(val)[0]
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export const setUserConnection = (myID, connection) => async (
  dispatch,
  getState
) => {
  // Tạm thời bỏ đi
  return;
  const { db } = getState();
  if (!db || !myID) return;
  await db
    .ref(`connections/${encodeId(myID)}`)
    .set(connection ? connection : null);
  const usersSnap = await db
    .ref(`messages/users/${encodeId(myID)}`)
    .once("value");
  const usersVal = usersSnap.val();
  const friends = usersVal
    ? Object.values(usersVal).map(item => item.userID.toString())
    : [];
  return new Promise(resolve => {
    db.ref("connections").on("value", snapshot => {
      const val = {};
      snapshot.forEach(child => {
        const childVal = child.val();
        const childKey = decodeId(child.key);
        if (childVal && friends.includes(childKey)) {
          val[childKey] = childVal;
        }
      });
      dispatch({
        type: USER_CONNECTION,
        payload: val
      });
      resolve(val);
    });
  });
};

export const getUserConnection = userID => (__, getState) => {
  const { db } = getState();
  if (!db || !userID) return;
  db.ref(`connections/${encodeId(userID)}`).on("value", snapshot => {
    const val = snapshot.val();
    if (val) {
      console.log(val);
    }
  });
};

export const deleteUserListMessageChat = (myID, key) => async (
  __,
  getState
) => {
  const { db } = getState();
  if (!db || !myID) return;
  await db.ref(`messages/users/${encodeId(myID)}/${key}`).set(null);
};
