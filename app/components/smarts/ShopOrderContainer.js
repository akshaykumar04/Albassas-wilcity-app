import { connect } from "react-redux";
import ShopOrderScreen from "../screens/ShopOrderScreen";
import { getListOrder } from "../../actions";

const mapStateToProps = state => ({
  auth: state.auth,
  myOrder: state.orderReducer,
  translations: state.translations,
  settings: state.settings,
  myCart: state.cartReducer
});
const mapDispatchToProps = {
  getListOrder
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShopOrderScreen);
