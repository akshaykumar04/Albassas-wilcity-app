import React, { PureComponent, Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
  Animated,
  Modal,
  ToastAndroid,
  Platform
} from "react-native";
import {
  Loader,
  FontIcon,
  RequestTimeoutWrapped,
  Toast,
  ImageCover,
  HtmlViewer,
  bottomBarHeight,
  Button,
  RTL
} from "../../wiloke-elements";
import Constants from "expo-constants";
import { CartItem, GradeView } from "../dumbs";
import { isEmpty, isEqual, debounce } from "lodash";
import * as Consts from "../../constants/styleConstants";

const ANDROID = Platform.OS === "android";
const isIpad = Platform.isPad;
export default class CartScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      quantity: 1,
      animation: new Animated.Value(0),
      refresh: false
    };
  }

  componentDidMount() {
    this._getProductCart();
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if (
  //     !isEqual(prevProps.myCart.products, this.props.myCart.products) &&
  //     this.props.myCart.total === prevProps.myCart.total
  //   ) {
  //     this._getProductCart();
  //   }
  // }

  _getProductCart = async () => {
    const { getProductsCart, auth } = this.props;
    await getProductsCart(auth.token);
    this.setState({
      isLoading: false
    });
    this._startAnimation();
  };

  _startAnimation = () => {
    const { animation } = this.state;
    Animated.timing(animation, {
      duration: 150,
      toValue: 100,
      useNativeDriver: true
    }).start();
  };

  _handleGoBack = () => {
    this.props.navigation.navigate("HomeScreen");
  };

  _handleRefresh = async () => {
    await this.setState({
      refresh: true
    });
    await this._getProductCart();
    this.setState({
      refresh: false
    });
  };

  _handleRemove = item => async () => {
    const { getListingProducts, isDeleteItemCart } = this.props;
    await this.setState({
      isLoading: true
    });
    const { removeCart, auth } = this.props;
    await removeCart(auth.token, item.cartKey);
    const { myCart } = this.props;
    await this.setState({
      isLoading: false
    });
    this._toast.show(myCart.msg, {
      delay: 2500
    });
    this._getProductCart();
    const actions = item.listingIDs.map(id => {
      return getListingProducts(id, "my_products");
    });
    await Promise.all(actions);
  };

  _handleIncrease = item => async () => {
    const { changeQuantity } = this.props;
    await changeQuantity({ ...item, quantity: 1 });
    const params = {
      id: item.id,
      quantity: item.quantity + 1,
      variationID: item.variationID || "",
      attributes: item.attributes || ""
    };
    this._addCartDebounce(params);
  };

  _addCartDebounce = debounce(async params => {
    const { addToCart, auth } = this.props;
    await this.setState({
      isLoading: true
    });
    await addToCart(auth.token, params);
    const { myCart } = this.props;
    if (myCart.statusAddToCart.status === "error") {
      ANDROID
        ? ToastAndroid.show(
            myCart.statusAddToCart.msg,
            ToastAndroid.SHORT,
            ToastAndroid.CENTER
          )
        : Alert.alert(myCart.statusAddToCart.msg);
    }
    this._delayReload();
  }, 500);

  _delayReload = debounce(() => {
    this._getProductCart();
  }, 500);

  _handleDecrease = item => async () => {
    const { changeQuantity } = this.props;
    if (item.quantity <= 1) return;
    await changeQuantity({ ...item, quantity: -1 });
    const params = {
      id: item.id,
      quantity: item.quantity - 1,
      variationID: item.variationID || "",
      attributes: item.attributes || ""
    };
    this._deductToCartDebounce(params);
  };

  _deductToCartDebounce = debounce(async params => {
    const { deductToCart, auth } = this.props;
    await this.setState({
      isLoading: true
    });
    await deductToCart(auth.token, params);
    const { myCart } = this.props;
    if (myCart.statusDeductCart.status === "error") {
      ANDROID
        ? ToastAndroid.show(
            myCart.statusDeductCart.msg,
            ToastAndroid.SHORT,
            ToastAndroid.CENTER
          )
        : Alert.alert(myCart.statusDeductCart.msg);
    }
    this._delayReload();
  }, 500);

  _handleChangeText = item => async text => {
    const { changeQuantity2 } = this.props;
    await this.setState({
      quantity: Number(text)
    });
    await changeQuantity2({ ...item, quantity: Number(text) });
  };

  _handleChangeTextQuantity = item => async () => {
    const params = {
      id: item.id,
      quantity: Number(this.state.quantity),
      variationID: item.variationID || "",
      attributes: item.attributes || []
    };
    this._addCartDebounce(params);
  };

  _handlePayment = () => {
    const { checkTypeOrder, resetOrder } = this.props;
    checkTypeOrder("create");
    resetOrder();
    this.props.navigation.navigate("PaymentScreen");
  };

  _handleRemoveAll = async () => {
    const { myCart, translations } = this.props;
    Alert.alert(
      "Alert",
      "Do you want delete all item from your cart",
      [
        {
          text: translations.cancel,
          style: "cancel"
        },
        {
          text: translations.ok,
          onPress: this._deleteListItem(myCart.products)
        }
      ],
      { cancelable: false }
    );
  };

  _deleteListItem = products => async () => {
    await this.setState({
      isLoading: true
    });
    const { removeAllCart } = this.props;
    const keys = products.map(i => i.cartKey);
    await removeAllCart(keys);
    const { myCart } = this.props;
    await this.setState({
      isLoading: false
    });
    this._toast.show(myCart.msg, {
      delay: 2500
    });
    this._getProductCart();
  };

  _keyExtractor = (item, index) => item.cartKey.toString();

  _renderEmpty = () => {
    const { translations, settings } = this.props;
    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <ImageCover
          src="https://www.seekpng.com/png/detail/117-1170538_404-your-cart-is-empty.png"
          modifier="4by3"
        />
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: settings.colorPrimary }]}
          onPress={this._handleGoBack}
        >
          <Text style={styles.payText}>{translations.comeBackToShop}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  _renderHeader = () => {
    const { myCart, translations, settings } = this.props;
    const rtl = RTL();
    return (
      <View style={[styles.header, { backgroundColor: settings.colorPrimary }]}>
        <TouchableOpacity style={styles.icon} onPress={this._handleGoBack}>
          <FontIcon
            name={!rtl ? "fa-angle-left" : "chevron-right"}
            size={30}
            color="#fff"
          />
        </TouchableOpacity>
        <View style={styles.center}>
          <Text style={styles.title}>{translations.myCart}</Text>
          <GradeView
            gradeText={myCart.totalItems}
            containerStyle={styles.totalItem}
            textStyle={{ color: "#333", fontWeight: "200" }}
            RATED_SIZE={25}
          />
        </View>
        <TouchableOpacity style={styles.icon} onPress={this._handleRemoveAll}>
          <FontIcon name="trash" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  };

  _renderItem = ({ item, index }) => {
    const price = !!item.salePrice ? item.salePriceHTML : item.priceHTML;
    return (
      <Animated.View style={{ opacity: this._getOpacity() }}>
        <CartItem
          name={item.name}
          price={price}
          translations={this.props.translations}
          srcProduct={item.oFeaturedImg.medium || ""}
          onRemove={this._handleRemove(item)}
          quantity={Number(item.quantity)}
          increase={this._handleIncrease(item)}
          decrease={this._handleDecrease(item)}
          onChangeText={this._handleChangeText(item)}
          onChangeValueQuantity={this._handleChangeTextQuantity(item)}
        />
      </Animated.View>
    );
  };

  _renderFooter = () => {
    const { myCart, settings, translations } = this.props;
    return (
      <View style={styles.footer}>
        <View style={styles.total}>
          <Text>{translations.total} </Text>
          <Text />
          <HtmlViewer
            html={myCart.cart.totalPriceHTML}
            containerStyle={{ padding: 0 }}
          />
        </View>
        <View
          style={{
            paddingHorizontal: 15,
            paddingVertical: 15 + bottomBarHeight
          }}
        >
          <Button
            block={true}
            animation={true}
            backgroundColor="primary"
            colorPrimary={settings.colorPrimary}
            onPress={this._handlePayment}
            radius="round"
            size="md"
          >
            {translations.payNow}
          </Button>
        </View>
      </View>
    );
  };

  _getOpacity = () => {
    const { animation } = this.state;
    return animation.interpolate({
      inputRange: [0, 50, 100],
      outputRange: [0, 0.5, 1],
      extrapolate: "clamp"
    });
  };

  render() {
    const { isLoading } = this.state;
    const { myCart, translations, isProductDetailsTimeout } = this.props;
    return (
      <View style={[styles.container]}>
        {this._renderHeader()}
        <FlatList
          data={myCart.products}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          ListEmptyComponent={this._renderEmpty}
          ItemSeparatorComponent={() => (
            <View
              style={{
                width: "100%",
                height: 1,
                backgroundColor: Consts.colorGray1
              }}
            />
          )}
          style={[styles.list]}
          refreshing={this.state.refresh}
          onRefresh={this._handleRefresh}
        />
        {!!myCart.total && this._renderFooter()}
        <Modal
          visible={isLoading}
          transparent={true}
          onRequestClose={() => console.log("close")}
          animationType="fade"
        >
          <View
            style={{
              backgroundColor: "transparent",
              flex: 1,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Loader />
          </View>
        </Modal>
        <Toast ref={ref => (this._toast = ref)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    position: "relative"
  },
  list: {
    flex: 1,
    marginVertical: 5
  },
  header: {
    paddingTop: Constants.statusBarHeight,
    height: 52 + Constants.statusBarHeight,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textTransform: "uppercase",
    paddingHorizontal: 5
  },
  center: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  totalItem: {
    backgroundColor: "#fff"
  },

  footer: {
    backgroundColor: "#fff",
    alignItems: "center",
    elevation: 5,
    zIndex: 1
  },
  total: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    width: "100%"
  },
  payment: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
    width: "50%",
    marginVertical: bottomBarHeight + 15
  },
  payText: {
    fontWeight: "bold",
    color: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 15
  },
  icon: {
    paddingHorizontal: 10
  },
  btn: {
    justifyContent: "center",
    alignItems: "center",
    width: 250,
    height: 40,
    borderRadius: 3,
    marginTop: 20
  }
});
