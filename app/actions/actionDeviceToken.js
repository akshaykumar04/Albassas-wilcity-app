import { GET_DEVICE_TOKEN } from "../constants/actionTypes";

export const getDeviceToken = token => dispatch => {
  return new Promise(resolve => {
    dispatch({
      type: GET_DEVICE_TOKEN,
      payload: token
    });
    resolve();
  });
};
