// import {SIGNUP, SIGNUP_LOADING, SIGNUP_ERROR} from "../constants/actionTypes";
// import axios from "axios";

// const initialState = {
//   isLoggedIn: false,
//   token: null,
//   message: ""
// };

// export const signup = (state = initialState, action) => {
//   switch (action.type) {
//     case types.LOGIN:
//       const { token } = action.payload;
//       if (token)
//         axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//       return {
//         isLoggedIn: token ? true : false,
//         token,
//         message: ""
//       };
//     case types.LOGOUT:
//       if (!token) delete axios.defaults.headers.common["Authorization"];
//       return {
//         isLoggedIn: false,
//         token: null,
//         message: action.message
//       };
//     case types.CHECK_TOKEN:
//       if (!action.isLoggedIn)
//         delete axios.defaults.headers.common["Authorization"];
//       return {
//         isLoggedIn: action.isLoggedIn,
//         token: action.isLoggedIn ? state.token : null,
//         message: action.message
//       };
//     default:
//       return state;
//   }
// };

// export const isTokenExpired = (state = false, action) => {
//   switch (action.type) {
//     case types.CHECK_TOKEN:
//       return !action.isLoggedIn;
//     default:
//       return state;
//   }
// };

// export const loginError = (state = null, action) => {
//   switch (action.type) {
//     case types.LOGIN_ERROR:
//       return action.err;
//     case types.LOGIN:
//       return null;
//     default:
//       return state;
//   }
// };

// export const isLoginLoading = (state = false, action) => {
//   switch (action.type) {
//     case types.LOGIN_LOADING:
//       return action.loading;
//     default:
//       return state;
//   }
// };
