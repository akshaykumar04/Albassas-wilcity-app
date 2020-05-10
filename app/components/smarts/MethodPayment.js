import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from "react-native";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { isEmpty, get } from "lodash";
import {
  getMethodPayment,
  getMethodResult,
  getOrder,
  getTempToken
} from "../../actions";
import {
  Loader,
  RequestTimeoutWrapped,
  RadioButton
} from "../../wiloke-elements";
import * as Consts from "../../constants/styleConstants";

class MethodPayment extends PureComponent {
  static propTypes = {
    onChangePage: PropTypes.func,
    onValueChange: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      loadData: false
    };
  }

  componentDidMount() {
    this._getMethodPayment();
  }

  _getMethodPayment = async () => {
    const { getMethodPayment } = this.props;
    await getMethodPayment();
    const { payment } = this.props;
    if (!isEmpty(payment.method)) {
      this.setState({
        isLoading: false
      });
    }
  };

  _renderRadio = () => {
    const { payment, translations, settings } = this.props;
    const { loadData } = this.state;
    const radios = payment.method.map(item => {
      return {
        id: item.id,
        label: item.title,
        description: item.description,
        value: get(item, "settings.title", "")
      };
    });

    return (
      <View style={{ flex: 1 }}>
        <RadioButton
          radios={radios}
          lable={"Method Payment"}
          name={"methodPayment"}
          onChangeValue={this._handleChangeValue}
        />
        <TouchableOpacity
          onPress={this._handleClick}
          style={[styles.button, { backgroundColor: settings.colorPrimary }]}
        >
          {loadData ? (
            <ActivityIndicator size="small" color="#fff" style={styles.text} />
          ) : (
            <Text style={styles.text}>{translations.proceedToCheckout}</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  _handleClick = async () => {
    const {
      cart,
      getOrder,
      payment,
      order,
      auth,
      navigation,
      translations
    } = this.props;
    const { result } = this.state;
    if (isEmpty(result)) {
      Alert.alert(translations.paymentMethodRequired);
      return;
    }
    this.setState({
      loadData: true
    });
    const data = {
      payment_method: payment.methodResult.payment_method,
      payment_method_title: payment.methodResult.payment_method_title.value,
      set_paid: true,
      billing: payment.billingResult,
      shipping: payment.shippingResult,
      line_items: cart.products.map(item => ({
        product_id: item.id,
        quantity: item.quantity
      }))
    };
    if (order.type === "create") {
      !order.orders
        ? await getOrder(data, auth.token)
        : await getOrder(data, auth.token, order.orders.id);
    } else if (order.type === "details") {
      const { orderID } = navigation.state.params;
      await getOrder(data, auth.token, orderID);
    }
    this._handleNextPage();
  };

  _handleNextPage = async () => {
    const {
      order,
      getTempToken,
      onChangePage,
      auth,
      payment,
      translations
    } = this.props;
    if (!isEmpty(order.orders) && order.statusOrder.status === "success") {
      await getTempToken(
        order.orders.id,
        auth.token,
        payment.methodResult.payment_method
      );
      this.setState({
        loadData: false
      });
      onChangePage(2);
    } else {
      Alert.alert(translations.orderCreateError);
      this.setState({
        loadData: false
      });
    }
  };

  _handleChangeValue = async (name, value) => {
    const { getMethodResult } = this.props;
    await this.setState(prevState => {
      return {
        result: { ...prevState.result, ...value }
      };
    });
    getMethodResult(this.state.result);
  };

  render() {
    const { isLoading } = this.state;
    const { isPaymentTimeout, translations } = this.props;
    return (
      <View style={styles.container}>
        <RequestTimeoutWrapped
          isTimeout={isPaymentTimeout}
          onPress={this._getMethodPayment}
          text={translations.networkError}
          buttonText={translations.retry}
        >
          {isLoading ? <Loader /> : this._renderRadio()}
        </RequestTimeoutWrapped>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
    marginHorizontal: 10,
    marginVertical: 10,
    paddingVertical: 7
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    paddingVertical: 10
  }
});

const mapStateToProps = state => ({
  payment: state.paymentReducer,
  cart: state.cartReducer,
  translations: state.translations,
  isPaymentTimeout: state.isPaymentTimeout,
  order: state.orderReducer,
  auth: state.auth,
  settings: state.settings
});
const mapDispatchToProps = {
  getMethodPayment,
  getMethodResult,
  getOrder,
  getTempToken
};

export default connect(mapStateToProps, mapDispatchToProps)(MethodPayment);
