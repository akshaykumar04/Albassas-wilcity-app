import React, { PureComponent } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity
} from "react-native";
import { withNavigationFocus } from "react-navigation";
import _ from "lodash";
import { connect } from "react-redux";
import {
  getListingProducts,
  addToCart,
  removeCart,
  getProductsCart,
  isDeleteItemCart
} from "../../actions";
import {
  ViewWithLoading,
  ContentBox,
  Toast,
  Button,
  FontIcon,
  CheckBox,
  LoadingFull
} from "../../wiloke-elements";
import { ProductsWC, ListingProductItemClassic } from "../dumbs";
import * as Consts from "../../constants/styleConstants";

class ListingProductContainer2 extends PureComponent {
  state = {
    isLoading: true,
    updated: false
  };

  componentDidMount() {
    this._getListingProducts();
  }

  // async componentDidUpdate(prevProps, prevState) {
  //   if (
  //     !_.isEqual(prevProps.isFocused, this.props.isFocused) &&
  //     this.props.myCart.isDeleteItem
  //   ) {
  //     await this.setState({
  //       isLoading: true,
  //       updated: true
  //     });
  //     this._getListingProducts();
  //   }
  // }

  _getListingProducts = async () => {
    const { getListingProducts, params, type } = this.props;
    const { id, item } = params;
    await getListingProducts(id, type);
    this.setState({
      isLoading: false
    });
  };

  _goToCart = () => {
    const { navigation, isDeleteItemCart } = this.props;
    navigation.navigate("CartScreen");
    isDeleteItemCart(false);
  };

  _goToCheckOut = () => {
    const { navigation, isDeleteItemCart, params, myCart } = this.props;
    if (myCart.products.length === 0) {
      this._showMessage(
        "Your cart is empty! Please add product to proceed checkout"
      );
      return;
    }
    navigation.navigate("PaymentScreen", { listingID: params.id });
    isDeleteItemCart(false);
  };

  _removeCart = async item => {
    const { removeCart, getProductsCart, auth, myCart } = this.props;
    await this.setState({
      [`enabled_${item.id}`]: true,
      updated: true
    });
    await removeCart(auth.token, item.cartKey);
    await this._getListingProducts();
    await getProductsCart(auth.token);
    this.setState({
      [`enabled_${item.id}`]: false
    });
  };

  _addToCart = async item => {
    const { addToCart, getProductsCart, auth } = this.props;
    const params = {
      id: item.id,
      quantity: 1
    };
    await this.setState({
      [`enabled_${item.id}`]: true,
      updated: true
    });
    await addToCart(auth.token, params);
    await this._getListingProducts();
    const { myCart } = this.props;
    this._showMessage(myCart.statusAddToCart.msg);
    await getProductsCart(auth.token);
    this.setState({
      [`enabled_${item.id}`]: false
    });
  };

  _handleCheckItem = item => async _ => {
    const { auth } = this.props;
    const { isLoggedIn } = auth;
    if (!isLoggedIn) {
      this._handleLoginScreen();
      return;
    }
    if (!item.isAddedToCart) {
      this._addToCart(item);
      return;
    }
    this._removeCart(item);
  };

  _handleProduct = item => async _ => {
    const { navigation, isDeleteItemCart } = this.props;
    if (item.type === "booking") {
      WebBrowser.openBrowserAsync(item.link);
      return;
    }
    navigation.navigate("ProductDetailScreen", { productID: item.id });
    isDeleteItemCart(false);
  };

  _handleLoginScreen = () => {
    const { translations, navigation } = this.props;
    Alert.alert(translations.login, translations.requiredLogin, [
      {
        text: translations.cancel,
        style: "cancel"
      },
      {
        text: translations.continue,
        onPress: () => navigation.navigate("AccountScreen")
      }
    ]);
  };

  _showMessage = msg => {
    this._toast.show(msg, {
      delay: 2000
    });
  };

  _renderItem = ({ item, index }) => {
    const { settings, auth, category } = this.props;
    return (
      <TouchableOpacity
        style={{
          paddingVertical: 5,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center"
        }}
        disabled={this.state[`enabled_${item.id}`]}
        onPress={this._handleCheckItem(item)}
      >
        <ListingProductItemClassic
          productName={item.name}
          author={item.oAuthor.displayName}
          category={item.oCategories[0]}
          salePrice={item.salePrice}
          salePriceHtml={item.salePriceHtml}
          priceHtml={item.regularPriceHtml}
          onPress={this._handleProduct(item)}
          src={item.oFeaturedImg.thumbnail}
          colorPrimary={settings.colorPrimary}
          // checkbox={category === "my_products2"}
          // isLoggedIn={auth.isLoggedIn}
          // checked={item.isAddedToCart}
        />
        {this._renderCheckBox(item)}
      </TouchableOpacity>
    );
  };

  _renderCheckBox = item => {
    const { auth } = this.props;
    return (
      <View>
        <CheckBox
          checked={auth.isLoggedIn && item.isAddedToCart}
          size={22}
          borderWidth={1}
          radius={100}
          name="checkbox"
          // condition={!isLoggedIn}
          // onPress={this._handlePressCheck}
          circleAnimatedSize={0}
          disabled={true}
        />
      </View>
    );
  };

  _keyExtractor = (item, index) => item.id.toString();

  _renderFooter = () => {
    const { translations, settings } = this.props;
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Button
          size="md"
          title={translations.myCart}
          onPress={this._goToCart}
          backgroundColor="gray"
          textStyle={{ color: "#fff", paddingLeft: 4 }}
          radius="round"
          style={{ marginHorizontal: 7 }}
          renderBeforeText={() => (
            <FontIcon name="shopping-cart" size={20} color="#fff" />
          )}
        />
        <Button
          size="md"
          title={translations.proceedToCheckout}
          onPress={this._goToCheckOut}
          backgroundColor="primary"
          colorPrimary={settings.colorPrimary}
          textStyle={{ color: "#fff", paddingLeft: 4 }}
          radius="round"
          renderBeforeText={() => (
            <FontIcon name="credit-card" size={20} color="#fff" />
          )}
        />
      </View>
    );
  };

  _renderContent = (id, item, isLoading, listingProducts) => {
    const { translations, settings, navigation } = this.props;
    const { isCartLoading } = this.state;
    return (
      <View>
        <ContentBox
          headerTitle={item.name}
          headerIcon={item.icon}
          style={{
            marginBottom: 10,
            width: "100%"
          }}
          colorPrimary={settings.colorPrimary}
          renderFooter={this._renderFooter}
        >
          <FlatList
            data={listingProducts}
            renderItem={this._renderItem}
            keyExtractor={this._keyExtractor}
            extraData={this.state.updated}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  width: "100%",
                  height: 1,
                  backgroundColor: Consts.colorGray1
                }}
              />
            )}
          />
          <Toast ref={ref => (this._toast = ref)} />
        </ContentBox>
      </View>
    );
  };

  render() {
    const { params, listingProducts } = this.props;
    const { id, item } = params;
    const { isLoading } = this.state;
    return this._renderContent(id, item, isLoading, listingProducts);
  }
}

const mapStateToProps = state => ({
  translations: state.translations,
  settings: state.settings,
  listingProducts: state.listingProducts,
  auth: state.auth,
  myCart: state.cartReducer
});
const mapDispatchToProps = {
  getListingProducts,
  addToCart,
  removeCart,
  getProductsCart,
  isDeleteItemCart
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(ListingProductContainer2));
