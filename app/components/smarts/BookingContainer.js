import { connect } from "react-redux";
import { getListBooking } from "../../actions";
import BookingScreen from "../screens/BookingScreen";
const mapStateToProps = state => ({
  translations: state.translations,
  auth: state.auth,
  settings: state.settings,
  booking: state.bookingReducer
});
const mapDispatchToProps = {
  getListBooking
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BookingScreen);
