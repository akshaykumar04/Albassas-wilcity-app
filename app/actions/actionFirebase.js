import { FIREBASE } from "../constants/actionTypes";
import * as firebase from "firebase";
import axios from "axios";
import { axiosHandleError } from "../wiloke-elements";

export const firebaseInitApp = payload => dispatch => {
  dispatch({
    type: FIREBASE,
    payload
  });
};
