import {
  GET_NOTIFICATION_SETTING,
  SET_NOTIFICATION_SETTING,
  GET_NOTIFICATION_ADMIN_SETTING
} from "../constants/actionTypes";
import axios from "axios";
import _ from "lodash";
import { axiosHandleError } from "../wiloke-elements";
const encodeId = id => `___${id}___`;
const decodeId = id => id.replace(/___/g, "");

export const getNotificationAdminSettings = () => dispatch => {
  return axios
    .get("notification-settings")
    .then(({ data }) => {
      if (data.status === "success") {
        const settings = data.aSettings.reduce((obj, item, index) => {
          return {
            ...obj,
            [item.key]: {
              ...item,
              id: index
            }
          };
        }, {});
        dispatch({
          type: GET_NOTIFICATION_ADMIN_SETTING,
          payload: settings
        });
      }
    })
    .catch(err => console.log(axiosHandleError(err)));
};

export const getNotificationSettings = myID => async (dispatch, getState) => {
  try {
    const { db } = getState();
    if (!db) return;
    const snapshot = await db
      .ref(`deviceTokens/${encodeId(myID)}/pushNotificationSettings`)
      .once("value");
    console.log(snapshot.val());
    const settings = snapshot.val();
    if (settings) {
      dispatch({
        type: GET_NOTIFICATION_SETTING,
        payload: settings
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export const setNotificationSettings = (
  myID,
  notificationSettings,
  type
) => async (dispatch, getState) => {
  const { db } = getState();
  if (!db) return;
  const dbNotificationSettings = db.ref(
    `deviceTokens/${encodeId(myID)}/pushNotificationSettings`
  );
  if (type === "start") {
    const flatten = Object.keys(notificationSettings).reduce(
      (obj, item) => ({
        ...obj,
        [item]: true
      }),
      {}
    );
    const snap = await dbNotificationSettings.once("value");
    const val = snap.val();
    const payload = val
      ? _.pick({ ...flatten, ...val }, Object.keys(flatten))
      : flatten;
    try {
      await db
        .ref(`deviceTokens/${encodeId(myID)}/pushNotificationSettings`)
        .set(payload);
      dispatch({
        type: SET_NOTIFICATION_SETTING,
        payload
      });
    } catch (err) {
      console.log(err);
    }
  } else {
    await db
      .ref(`deviceTokens/${encodeId(myID)}/pushNotificationSettings`)
      .set(notificationSettings);
    dispatch({
      type: SET_NOTIFICATION_SETTING,
      payload: notificationSettings
    });
  }
};
