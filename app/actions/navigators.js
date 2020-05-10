import * as types from "../constants/actionTypes";
import { AsyncStorage } from "react-native";
import axios from "axios";
import { axiosHandleError } from "../wiloke-elements";

export const getTabNavigator = _ => dispatch => {
  return axios
    .get("navigators/tabNavigator")
    .then(res => {
      const payload = res.data.oResults.filter(
        item => item.status === "enable"
      );
      dispatch({
        type: types.GET_TAB_NAVIGATOR,
        payload
      });
    })
    .catch(err => console.log(axiosHandleError(err)));
};

export const getStackNavigator = _ => dispatch => {
  dispatch({
    type: types.MENU_REQUEST_TIMEOUT,
    isTimeout: false
  });
  return axios
    .get("navigators/stackNavigator")
    .then(res => {
      const payload = res.data.oResults.filter(
        item => item.status === "enable"
      );
      dispatch({
        type: types.GET_STACK_NAVIGATOR,
        payload
      });
      dispatch({
        type: types.MENU_REQUEST_TIMEOUT,
        isTimeout: false
      });
    })
    .catch(err => {
      dispatch({
        type: types.MENU_REQUEST_TIMEOUT,
        isTimeout: true
      });
      console.log(axiosHandleError(err));
    });
};
