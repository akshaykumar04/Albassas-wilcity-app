import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  Animated,
  ToastAndroid,
  FlatList,
  Platform,
  ActivityIndicator
} from "react-native";
import Constants from "expo-constants";
import { isEmpty, indexOf, isEqual, debounce, omit, get } from "lodash";
import Modalize from "react-native-modalize";
import {
  Loader,
  RequestTimeoutWrapped,
  HtmlViewer,
  FontIcon,
  ImageCover,
  Toast,
  Button,
  bottomBarHeight,
  Row,
  Col,
  removeInlineStyle
} from "../../wiloke-elements";
import {
  Variantions,
  GradeView,
  ButtonFooterContentBox,
  CommentRatingItem
} from "../dumbs";
import { GalleryBox, Rating, ContentBox } from "../../wiloke-elements";
import * as Consts from "../../constants/styleConstants";
import ParalaxProductScreen from "./ParalaxProductScreen";
import NavigationSuspense from "../smarts/NavigationSuspense";

Platform.OS === "android" && StatusBar.setBarStyle("light-content");
export default class ProductDetailScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      quanity: 1,
      animation: new Animated.Value(0),
      loading: false,
      attributes: {},
      favorite: false,
      isLoading: true
    };
  }

  componentDidMount() {
    this._getProductDetails();
    this._startAnimation();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(prevProps.auth, this.props.auth)) {
      console.log("update");
      this._getProductDetails();
    }
  }
  componentWillUnmount() {
    const { resetAttribute } = this.props;
    console.log("unmount");
    resetAttribute();
  }

  _startAnimation = () => {
    const { animation } = this.state;
    Animated.timing(animation, {
      toValue: 100,
      duration: 250,
      useNativeDriver: true
    }).start();
  };

  _getOpacity = () => {
    return this.state.animation.interpolate({
      inputRange: [0, 50, 100],
      outputRange: [0, 0.4, 1],
      extrapolate: "clamp"
    });
  };

  _handleInbox = async () => {
    const {
      navigation,
      getKeyFirebase,
      shortProfile,
      messageChatActive,
      myProduct,
      auth
    } = this.props;
    const { productID } = navigation.state.params;
    const { isLoggedIn } = auth;
    if (!isLoggedIn) {
      this._handleLoginScreen();
      return;
    }
    const productDetails = product[productID].details;
    const { ID: userID, displayName } = productDetails.oAuthor;
    const myID = shortProfile.userID;
    if (myID.toString() !== userID.toString()) {
      await getKeyFirebase(myID, userID);
      const { keyFirebase } = this.props;
      !!keyFirebase && messageChatActive(myID, keyFirebase, true);
      navigation.navigate("SendMessageScreen", {
        userID: Number(userID),
        displayName,
        key: keyFirebase
      });
    }
  };

  _handleWishlist = async () => {
    const { auth, myProduct, navigation } = this.props;
    const { productID } = navigation.state.params;
    const productDetails = myProduct[productID].details;
    const { favorite } = this.state;
    const { isLoggedIn, token } = auth;
    if (!isLoggedIn) {
      this._handleLoginScreen();
      return;
    }
    if (!favorite) {
      await this.setState({
        favorite: true
      });
      this._addFavorites(token, productDetails.id);
      return;
    }
    await this.setState({
      favorite: false
    });
    const { listProductFavorites } = this.props;
    this._deleteFavorites(
      token,
      productDetails.id,
      productDetails.oWishlist.wishlistToken,
      productDetails.oWishlist.wishlistID
    );
  };

  _deleteFavorites = async (token, id, wishlistToken, wishlistID) => {
    const { deleteProductFavorites } = this.props;
    await deleteProductFavorites(token, id, wishlistToken, wishlistID);
    const { listProductFavorites } = this.props;

    this._toast.show(listProductFavorites.statusDel.msg, {
      delay: 3500
    });
  };

  _addFavorites = async (token, id) => {
    const { addProductFavorites, addWishListToken } = this.props;
    await addProductFavorites(token, id);
    const { listProductFavorites } = this.props;
    addWishListToken(listProductFavorites.statusAdd.oInfo, id);
    this._toast.show(listProductFavorites.statusAdd.msg, {
      delay: 3500
    });
  };

  // _deleteFavorites = async(token, id) => {

  // }

  _handleValiations = async () => {
    const { auth, myProduct, navigation } = this.props;
    const { productID } = navigation.state.params;
    const { isLoggedIn } = auth;
    if (!isLoggedIn) {
      this._handleLoginScreen();
      return;
    }
    if (isEmpty(myProduct[productID].details.variations)) {
      await this._addToCartSimple(auth.token, {
        id: productID
      });
      // this.props.navigation.navigate("CartScreen");
      return;
    }
    this.modal._openModal();
  };

  _addToCartSimple = async (token, params) => {
    const { myProduct, addToCart, translations } = this.props;
    const productDetails = myProduct[params.id].details;
    await this.setState({
      loading: true
    });
    await addToCart(token, params);
    const { myCart, getProductsCart } = this.props;
    await this.setState({
      loading: false
    });
    this._toast.show(myCart.statusAddToCart.msg, {
      delay: 3500
    });
    await getProductsCart(token);
  };

  _handleAddToCart = async result => {
    const {
      addToCart,
      myProduct,
      getProductsCart,
      auth,
      navigation
    } = this.props;
    const { productID } = navigation.state.params;
    const productDetails = myProduct[productID].details;
    const params = !isEmpty(result) && {
      id: productID,
      quantity: 1,
      variationID: result.id,
      attributes: omit(result, ["id", "price", "image"])
    };
    this.setState({
      loading: true
    });
    this._addTocart(auth.token, params);
  };

  _addTocart = debounce(async (token, params) => {
    await this.props.addToCart(token, params);
    const { myCart, getProductsCart } = this.props;
    this.setState(
      {
        loading: false
      },
      () => this.modal._closeModal()
    );
    this._toast.show(myCart.statusAddToCart.msg, {
      delay: 3500
    });
    await getProductsCart(token);
  }, 100);

  _handleLoginScreen = () => {
    const { translations, navigation } = this.props;
    Alert.alert(translations.login, translations.requiredLogin, [
      {
        text: translations.cancel,
        style: "cancel"
      },
      {
        text: translations.continue,
        onPress: () => navigation.navigate("LoginScreen")
      }
    ]);
  };

  _handleCart = async () => {
    const { auth } = this.props;
    const { isLoggedIn } = auth;
    if (!isLoggedIn) {
      this._handleLoginScreen();
      return;
    }
    this.props.navigation.navigate("CartScreen");
  };

  _handleGoBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  _getProductDetails = async () => {
    const { getProductDetails, getVariations, auth } = this.props;
    const productID = this.props.navigation.getParam("productID", 1234);
    await getProductDetails(productID);
    const { myProduct } = this.props;
    !isEmpty(myProduct[productID].details.variations) &&
      (await getVariations(productID, myProduct[productID].details.variations));
    this.setState({
      favorite: myProduct[productID].details.oWishlist.isAdded,
      isLoading: false
    });
  };

  _renderRight = () => {
    const { myCart, auth } = this.props;
    return (
      <TouchableOpacity
        style={[styles.icon]}
        onPress={this._handleCart}
        ref={c => (this._cart = c)}
      >
        <FontIcon
          name="shopping-cart"
          size={25}
          color="#fff"
          style={{ paddingRight: 5 }}
        />
        {auth.isLoggedIn && (
          <GradeView
            gradeText={myCart.totalItems}
            containerStyle={styles.totalItems}
            textStyle={{ color: "#333", fontWeight: "200", fontSize: 11 }}
            RATED_SIZE={20}
          />
        )}
      </TouchableOpacity>
    );
  };

  _renderContent = opacity => {
    const { myProduct, settings, translations, navigation } = this.props;
    const { productID } = navigation.state.params;
    const { attributes, favorite } = this.state;
    const productDetails = myProduct[productID].details;
    return (
      <NavigationSuspense>
        <View style={styles.content}>
          <View
            style={{
              backgroundColor: "#fff"
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <Text style={styles.name}>{productDetails.name}</Text>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={{ paddingHorizontal: 5 }}
                  onPress={this._handleWishlist}
                >
                  <FontIcon
                    name="heart"
                    size={20}
                    color={favorite ? settings.colorPrimary : "#333"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ paddingHorizontal: 10 }}
                  onPress={this._handleInbox}
                >
                  <FontIcon name="message-square" size={20} color={"#333"} />
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              {this._renderCategories(productDetails)}
              <View
                style={{
                  flexDirection: "row"
                }}
              >
                {!!productDetails.salePrice && (
                  <HtmlViewer
                    html={productDetails.salePriceHtml}
                    containerStyle={{
                      paddingHorizontal: 10,
                      paddingRight: 5
                    }}
                    htmlWrapCssString={`color: ${settings.colorPrimary}`}
                  />
                )}
                <HtmlViewer
                  html={productDetails.price_html}
                  containerStyle={{ paddingHorizontal: 10 }}
                  htmlWrapCssString={
                    !!productDetails.salePrice
                      ? `text-decoration-line: line-through; color:#e5e5e5;`
                      : `color: ${settings.colorPrimary}`
                  }
                />
              </View>
            </View>
            <Rating
              startingValue={Number(productDetails.average_rating)}
              fractions={2}
              ratingCount={5}
              showRating={false}
              readonly={true}
              imageSize={15}
              style={{ padding: 10 }}
            />
          </View>
          {!isEmpty(productDetails.variations) && (
            <View style={styles.btnSelect}>
              <TouchableOpacity
                style={{
                  paddingVertical: 7,
                  flexDirection: "row"
                }}
                onPress={this._handleValiations}
              >
                <Text style={[{ color: "#333", padding: 10 }]}>
                  {translations.selectVariations}
                </Text>
              </TouchableOpacity>
              {this._renderGallery()}
            </View>
          )}
          <ContentBox
            headerTitle={translations.description}
            colorPrimary={settings.colorPrimary}
            headerIcon="file-text"
            style={styles.box}
          >
            <HtmlViewer
              html={removeInlineStyle(productDetails.description)}
              htmlWrapCssString={`textAlign:left;`}
            />
          </ContentBox>
          {!!Number(productDetails.average_rating) && (
            <ContentBox
              headerTitle={`${translations.oChart.oLabels.ratings}`}
              colorPrimary={settings.colorPrimary}
              headerIcon="star"
              renderRight={this._renderStar}
              style={styles.box}
              renderFooter={this._renderButtonViewAll}
            >
              {this._renderRatingComment()}
            </ContentBox>
          )}
          <Animated.View style={{ marginTop: 5, opacity }}>
            {this._renderButtonCart()}
          </Animated.View>
        </View>
      </NavigationSuspense>
    );
  };

  _getUrl = i => i.url;

  _renderGallery = () => {
    const { attributes } = this.state;
    const { myProduct, navigation } = this.props;
    const { productID } = navigation.state.params;
    const oVariations = get(
      myProduct,
      `${productID}.variationsAPI.oVariations`,
      {}
    );
    if (isEmpty(oVariations)) return null;
    const gallery = Object.values(oVariations).map(item => {
      return { id: item.id, image: item.oFeaturedImg.medium };
    });
    const imageSelected = get(myProduct, `results.id`);
    return (
      <Row gap={10} style={{ marginHorizontal: 10 }}>
        {gallery.map(item => (
          <Col key={item.id} gap={10} column={4}>
            <TouchableOpacity
              style={{ width: 80, position: "relative" }}
              onPress={this._handleValiations}
            >
              <ImageCover src={item.image} width="100%" />
            </TouchableOpacity>
            {imageSelected === item.id && (
              <View style={styles.overlay}>
                <FontIcon name="check" color="#fff" size={12} />
              </View>
            )}
          </Col>
        ))}
      </Row>
    );
  };

  _renderButtonViewAll = () => {
    const { translations, myProduct, navigation } = this.props;
    const { productID } = navigation.state.params;
    const productDetails = myProduct[productID].details;
    return (
      !isEmpty(productDetails.aRatingItems) && (
        <ButtonFooterContentBox
          text={translations.viewAll.toUpperCase()}
          onPress={() =>
            this.props.navigation.navigate("CommentRatingScreen", {
              id: productID
            })
          }
        />
      )
    );
  };

  _renderStar = () => {
    const { myProduct, navigation } = this.props;
    const { productID } = navigation.state.params;
    const productDetails = myProduct[productID].details;
    return (
      <Rating
        startingValue={Number(productDetails.average_rating)}
        fractions={2}
        ratingCount={5}
        showRating={false}
        readonly={true}
        imageSize={14}
      />
    );
  };

  _renderButtonCart = () => {
    const { loading } = this.state;
    const { translations, settings } = this.props;
    return (
      <Button
        {...this.props}
        backgroundColor="primary"
        colorPrimary={settings.colorPrimary}
        size="md"
        textStyle={{ fontSize: 17 }}
        onPress={this._handleValiations}
        block={true}
        isLoading={loading}
        style={{ paddingBottom: bottomBarHeight + 10 }}
      >
        {translations.addToCart}
      </Button>
    );
  };

  _renderCategories = productDetails => {
    const categories = productDetails.categories.map(item => item.name);
    return (
      <Text style={styles.categories}>
        {categories.length > 1 ? categories.join("-") : categories.join("")}
      </Text>
    );
  };

  _renderRatingComment = () => {
    const { myProduct, navigation } = this.props;
    const { productID } = navigation.state.params;
    const productDetails = myProduct[productID].details;
    return (
      <FlatList
        data={productDetails.aRatingItems}
        renderItem={this._renderRatingItem}
        keyExtractor={this._keyExtractor}
        ItemSeparatorComponent={() => (
          <View
            style={{
              width: "100%",
              height: 1,
              backgroundColor: Consts.colorGray1
            }}
          />
        )}
        ListEmptyComponent={<Text>Empty</Text>}
      />
    );
  };

  _renderRatingItem = ({ item, index }) => {
    return (
      <View style={{ padding: 5 }}>
        <CommentRatingItem
          rating={item.rating}
          author={item.author}
          authorAvatar={item.authorAvatar}
          date={item.date}
          content={item.content}
        />
      </View>
    );
  };

  _keyExtractor = (item, index) => item.ID.toString();

  render() {
    const {
      isProductDetailsTimeout,
      translations,
      myProduct,
      selectedAttribute,
      settings,
      navigation
    } = this.props;
    const { isLoading, favorite } = this.state;
    const { params } = navigation.state;
    const isVariations = get(
      myProduct[params.productID],
      `details.variations`,
      []
    );
    return (
      <View style={{ flex: 1 }}>
        <ParalaxProductScreen
          renderContent={this._renderContent}
          renderHeaderRight={this._renderRight}
          headerImageSource={params.oFeaturedImg}
          productName={params.name}
          overlayRange={[0, 1]}
          overlayColor={settings.colorPrimary}
          renderButtonCart={this._renderButtonCart}
          onBack={this._handleGoBack}
          isLoading={isEmpty(myProduct[params.productID])}
          isProductDetailsTimeout={isProductDetailsTimeout}
          translations={translations}
          settings={settings}
        />
        {!isEmpty(isVariations) && !isLoading && (
          <Variantions
            product={myProduct}
            productID={params.productID}
            ref={ref => (this.modal = ref)}
            onCart={this._handleAddToCart}
            loading={this.state.loading}
            onSelected={selectedAttribute}
            translations={translations}
            colorPrimary={settings.colorPrimary}
          />
        )}
        <Toast ref={ref => (this._toast = ref)} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  view: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
    backgroundColor: "#fff"
  },
  content: {
    backgroundColor: Consts.colorGray1
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 10,
    color: Consts.colorDark,
    width: 250,
    textAlign: "left"
  },
  rateText: {
    paddingHorizontal: 5,
    color: Consts.colorDark,
    paddingVertical: 10,
    fontSize: 20
  },
  totalItems: {
    backgroundColor: "#fff",
    position: "absolute",
    top: -10,
    right: 0
  },
  textBtn: {
    padding: 5,
    color: "#fff",
    fontWeight: "bold"
  },
  icon: {
    position: "relative",
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  box: {
    marginVertical: 5,
    width: "100%"
  },
  categories: {
    paddingHorizontal: 10,
    color: Consts.colorDark
  },
  overlay: {
    position: "absolute",
    top: 5 / 2,
    right: 5 / 2,
    backgroundColor: Consts.colorPrimary,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3
  },
  btnSelect: {
    backgroundColor: "#fff",
    marginVertical: 5,
    marginTop: 10,
    paddingBottom: 10
  }
});
