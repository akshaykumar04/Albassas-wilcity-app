import React, { PureComponent } from "react";
import {
  Text,
  View,
  Alert,
  Platform,
  ToastAndroid,
  TouchableOpacity,
  StyleSheet,
  RefreshControl
} from "react-native";
import { connect } from "react-redux";
import { Layout, AnimatedView } from "../dumbs";
import * as Consts from "../../constants/styleConstants";
import {
  LoadingFull,
  MessageError,
  HtmlViewer,
  Button
} from "../../wiloke-elements";
import ContentBoxOrder from "../dumbs/ContentBoxOrder/ContentBoxOrder";
import { getOrderDetails, cancelOrder, checkTypeOrder } from "../../actions";

const IOS = Platform.OS === "ios";
class OrderDetailsScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      error: false
    };
  }

  componentDidMount() {
    this._getDetailsOrder();
  }

  _getDetailsOrder = async () => {
    const { getOrderDetails, auth, navigation } = this.props;
    const { orderID } = navigation.state.params;
    await getOrderDetails(auth.token, orderID);
    const { order } = this.props;
    const { orderDetails } = order;
    if (orderDetails.status === "success") {
      this.setState({
        isLoading: false,
        error: false
      });
    } else {
      this.setState({
        isLoading: false,
        error: true
      });
    }
  };

  _handleBookingItem = item => () => {
    const { navigation } = this.props;
    navigation.navigate("BookingDetailScreen", {
      bookingID: item.id
    });
  };

  _handleRePayment = () => {
    const { navigation, checkTypeOrder, order } = this.props;
    const { statusOrder } = navigation.state.params;
    const { oOrder } = order.orderDetails;
    checkTypeOrder("details", statusOrder);
    navigation.navigate("PaymentScreen", { orderID: oOrder.id });
  };

  _handleCancelOrder = async () => {
    const { cancelOrder, auth, navigation } = this.props;
    const { orderID } = navigation.state.params;
    await this.setState({
      isLoading: true
    });
    await cancelOrder(auth.token, orderID);
    const { order } = this.props;
    if (!!order.cancelOrder && order.cancelOrder.status === "success") {
      await this.setState({
        isLoading: false
      });
      await ((IOS && Alert.alert("Order Cancelled")) ||
        ToastAndroid.show("Order cancelled", ToastAndroid.LONG));

      this.props.navigation.goBack();
    } else {
      await this.setState({
        isLoading: false
      });
      Alert.alert("Order cancel error");
    }
  };

  _getTextColor = () => {
    const { navigation, settings } = this.props;
    const { statusOrder } = navigation.state.params;
    let colorText = "#9D9D9D";
    switch (statusOrder) {
      case "on-hold":
        colorText = "#32C267";
        break;
      case "pending":
        colorText = "#F1CA0A";
        break;
      case "completed":
        colorText = settings.colorPrimary;
        break;
      default:
        break;
    }
    return colorText;
  };

  _renderBox1 = () => {
    const { order, navigation, settings, translations } = this.props;
    const { oOrder } = order.orderDetails;
    const { statusOrder } = navigation.state.params;
    return (
      <View>
        <View style={styles.border}>
          <View style={styles.row}>
            <Text style={styles.text}>{translations.date}</Text>
            <Text style={styles.text}>{oOrder.createdAt}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.text}>{translations.status}</Text>
            <Text style={[styles.text, { color: this._getTextColor() }]}>
              {statusOrder}
            </Text>
          </View>
          {oOrder.oActions.pay && (
            <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
              <Button
                block={true}
                animation={true}
                backgroundColor="primary"
                colorPrimary={settings.colorPrimary}
                onPress={this._handleRePayment}
                radius="round"
                size="md"
              >
                {translations.rePayment}
              </Button>
            </View>
          )}
        </View>
        <View style={styles.total}>
          <View style={styles.row}>
            <Text style={styles.text}>{translations.subTotal}</Text>
            <HtmlViewer
              html={oOrder.subTotal}
              containerStyle={{ padding: 0 }}
              htmlWrapCssString={`color: ${settings.colorPrimary}`}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.text}>{translations.total}</Text>
            <HtmlViewer
              html={oOrder.total}
              containerStyle={{ padding: 0 }}
              htmlWrapCssString={`color: ${settings.colorPrimary}`}
            />
          </View>
        </View>
      </View>
    );
  };

  _renderBox2 = panel => () => {
    const { order, navigation } = this.props;
    const { oOrder } = order.orderDetails;
    const info =
      panel === "billing" ? oOrder.aBillingInfo : oOrder.aShippingInfo;
    return (
      <View style={styles.border}>
        <Text style={styles.text}>{info[0]}</Text>
      </View>
    );
  };

  _renderBox3 = () => {
    const { order, navigation, settings, translations } = this.props;
    const { oOrder } = order.orderDetails;
    return (
      <View style={styles.border}>
        <Text style={styles.text}>{oOrder.paymentMethod}</Text>
        {oOrder.oActions.cancel && (
          <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
            <Button
              block={true}
              animation={true}
              backgroundColor="primary"
              colorPrimary={settings.colorPrimary}
              onPress={this._handleCancelOrder}
              isLoading={this.state.isLoading}
              radius="round"
              size="md"
            >
              {translations.cancelOrder}
            </Button>
          </View>
        )}
      </View>
    );
  };

  _renderBooking = () => {
    const { order, navigation } = this.props;
    const { oOrder } = order.orderDetails;
    return oOrder.aBookings.map(this._renderBookingItem);
  };

  _renderBookingItem = (item, index) => {
    const { translations } = this.props;
    return (
      <View
        key={item.id.toString()}
        style={{ borderBottomColor: Consts.colorGray1, borderBottomWidth: 1 }}
      >
        <TouchableOpacity
          style={styles.btnBook}
          onPress={this._handleBookingItem(item)}
        >
          <Text style={styles.text}>#{item.id}</Text>
          <View style={styles.row}>
            <Text style={styles.text}>{translations.startDate}</Text>
            <Text style={styles.text}>{item.startDate}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.text}>{translations.endDate}</Text>
            <Text style={styles.text}>{item.endDate}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.text}>{translations.status}</Text>
            <Text style={styles.text}>{item.status}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.text}>
              {item.oSpecification.oResource.label}
            </Text>
            <Text style={styles.text}>
              {item.oSpecification.oResource.name}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  _renderDetails = () => {
    const { order, navigation } = this.props;
    const { oOrder } = order.orderDetails;
    return (
      <View>
        <ContentBoxOrder
          renderContent={this._renderBox1}
          title={`ID: ${oOrder.id}`}
        />
        <ContentBoxOrder
          title="Billing Info"
          renderContent={this._renderBox2("billing")}
        />
        <ContentBoxOrder
          title="Shipping Info"
          renderContent={this._renderBox2("shipping")}
        />
        <ContentBoxOrder
          title="Payment Method"
          renderContent={this._renderBox3}
        />
        {oOrder.aBookings && (
          <ContentBoxOrder
            title="Booking"
            renderContent={this._renderBooking}
          />
        )}
      </View>
    );
  };

  renderContent = () => {
    const { error, isLoading } = this.state;
    const { order } = this.props;
    const { orderDetails } = order;
    return (
      <AnimatedView style={{ width: Consts.screenWidth }}>
        {!error && !isLoading && this._renderDetails()}
        <LoadingFull visible={isLoading} />
        {error && !isLoading && <MessageError msg={orderDetails.msg} />}
      </AnimatedView>
    );
  };

  render() {
    const { navigation, auth, translations, settings } = this.props;
    const { isLoggedIn } = auth;
    return (
      <Layout
        navigation={navigation}
        headerType="headerHasBack"
        title="Orders Details"
        goBack={() => navigation.goBack()}
        renderContent={this.renderContent}
        colorPrimary={settings.colorPrimary}
        isLoggedIn={isLoggedIn}
        scrollEnabled={true}
        // refreshControl={
        //   <RefreshControl
        //     refreshing={this.refreshing}
        //     onRefresh={this._handleRefresh}
        //     tintColor={settings.colorPrimary}
        //     progressBackgroundColor={colorGray1}
        //   />
        // }
      />
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5
  },
  text: {
    fontSize: 16,
    color: "#9D9D9D",
    paddingVertical: 5
  },
  txtButton: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: Consts.colorGray1,
    paddingHorizontal: 15,
    borderTopColor: Consts.colorGray1,
    borderTopWidth: 1,
    paddingVertical: 5
  },
  total: {
    justifyContent: "center",
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: Consts.colorGray1,
    paddingVertical: 10
  },
  btnBook: {
    paddingHorizontal: 15,
    paddingVertical: 10
  }
});

const mapStateToProps = state => ({
  translations: state.translations,
  auth: state.auth,
  settings: state.settings,
  order: state.orderReducer
});
const mapDispatchToProps = {
  getOrderDetails,
  cancelOrder,
  checkTypeOrder
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderDetailsScreen);
