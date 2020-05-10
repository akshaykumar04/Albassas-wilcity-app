import React, { PureComponent } from "react";
import {
  Text,
  View,
  StyleSheet,
  Alert,
  Modal,
  TouchableOpacity,
  Platform,
  SafeAreaView
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import Constants from "expo-constants";
import { WebView } from "react-native-webview";
import { connect } from "react-redux";
import { isEqual } from "lodash";
import * as Consts from "../../constants/styleConstants";
import { getProductsCart, verifyPayment, resetOrder } from "../../actions";
import {
  Toast,
  HtmlViewer,
  Loader,
  FontIcon,
  RequestTimeoutWrapped
} from "../../wiloke-elements";

const IOS = Platform.OS === "ios";
const PADDING_TOP = IOS ? 24 : 0;
class OrderPayment extends PureComponent {
  state = {
    isLoading: true,
    msg: "",
    isVisible: false
  };

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(prevProps.order.urlCheckout, this.props.order.urlCheckout)) {
      this.setState({
        isVisible: true
      });
      return;
    }
    // if(!isEqual(prevProps.order.status, this.props.order.status)){

    // }
  }

  // _openWebBrowsers = async () => {
  //   const { auth, verifyPayment, order } = this.props;
  //   await this.setState({
  //     isLoading: true
  //   });
  //   await verifyPayment(order.orders.id, auth.token);
  //   this._verifyPayment();
  // };

  _handleCloseModal = async () => {
    const { auth, verifyPayment, order } = this.props;
    await verifyPayment(order.orders.id, auth.token);
    this._verifyPayment();
  };

  _verifyPayment = async () => {
    const {
      order,
      getProductsCart,
      onChangePage,
      auth,
      resetOrder
    } = this.props;
    if (order.status === "on-hold") {
      resetOrder();
    }
    await this.setState({
      msg: order.msg,
      isLoading: false,
      isVisible: false
    });
    await getProductsCart(auth.token);
    onChangePage(3);
    // this.props.navigation.goBack();
  };

  _handleReCheckout = () => {
    const { order, onChangePage } = this.props;
    onChangePage(0);
  };

  _renderContent = () => {
    const { order, settings, translations } = this.props;
    return (
      <View style={styles.content}>
        <HtmlViewer
          html={this.state.msg}
          htmlWrapCssString={` text-align: center;
            font-size: 20px;
            color: ${Consts.colorDark3}`}
        />
        {order.status === "pending" && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: settings.colorPrimary }]}
            onPress={this._handleReCheckout}
          >
            <Text style={styles.text}>{translations.payNow}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  _renderHeaderModal = () => {
    const { settings } = this.props;
    return (
      <SafeAreaView
        style={[styles.header, { backgroundColor: settings.colorPrimary }]}
      >
        <TouchableOpacity style={styles.icon} onPress={this._handleCloseModal}>
          <FontIcon name="x" color="#fff" size={25} />
        </TouchableOpacity>
      </SafeAreaView>
    );
  };

  _renderErrorWebView = () => {
    return <Text>Error</Text>;
  };

  _renderProgress = e => {
    return <Loader size="large" />;
  };

  render() {
    const { isLoading, msg, isVisible } = this.state;
    const { order, isPaymentTimeOut, translations } = this.props;
    return (
      <View style={styles.container}>
        <RequestTimeoutWrapped
          isTimeout={isPaymentTimeOut}
          text={translations.networkError}
          buttonText={translations.retry}
        >
          {isLoading ? <Loader /> : this._renderContent()}
          <Modal
            visible={
              isVisible &&
              (order.statusPayment === "pending" || !order.statusPayment)
            }
            onRequestClose={() => console.log("close")}
            transparent={false}
            animationType="fade"
          >
            <View style={styles.modalContent}>
              {this._renderHeaderModal()}
              <WebView
                source={{ uri: this.props.order.urlCheckout }}
                onError={this._renderErrorWebView}
                onLoadProgress={this._renderProgress}
                useWebKit={true}
              />
            </View>
          </Modal>
        </RequestTimeoutWrapped>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    height: 52 + Constants.statusBarHeight,
    paddingTop: Constants.statusBarHeight
  },
  icon: {
    paddingHorizontal: 13
  },
  modalContent: {
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
  order: state.orderReducer,
  auth: state.auth,
  isPaymentTimeOut: state.isPaymentTimeOut,
  translations: state.translations,
  settings: state.settings
});
const mapDispatchToProps = {
  getProductsCart,
  verifyPayment,
  resetOrder
};
export default connect(mapStateToProps, mapDispatchToProps)(OrderPayment);
