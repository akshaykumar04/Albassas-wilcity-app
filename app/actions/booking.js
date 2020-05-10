import axios from "axios";
import {
  GET_LIST_BOOKING,
  GET_BOOKING_DETAILS,
  GET_MORE_BOOKING
} from "../constants/actionTypes";
export const getListBooking = (token, page = 1) => async dispatch => {
  const endpoint = "/wc/bookings";
  try {
    const { data } = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (page < 2) {
      dispatch({
        type: GET_LIST_BOOKING,
        payload: data.status === "success" ? data.data.aBookings : [],
        total: data.status === "success" ? Math.ceil(data.data.total / 10) : 1,
        error: data.status === "error" ? data : {}
      });
    } else {
      dispatch({
        type: GET_MORE_BOOKING,
        payload: data.status === "success" ? data.data.aBookings : []
      });
    }
  } catch {
    console.log("booking", err);
  }
};
export const getBookingDetails = (token, bookingID) => async dispatch => {
  const endpoint = `/wc/bookings/${bookingID}`;
  try {
    const { data } = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch({
      type: GET_BOOKING_DETAILS,
      payload: data
    });
  } catch (err) {
    console.log(err);
  }
};
