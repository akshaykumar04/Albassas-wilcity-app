import React, { Component } from "react";
import {
  Platform,
  Image,
  Dimensions,
  Linking,
  Alert,
  AppState
} from "react-native";
import { connect } from "react-redux";
import { Notifications, Updates } from "expo";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import * as IntentLauncher from "expo-intent-launcher";
import he from "he";
import _ from "lodash";
import axios from "axios";
import { createAppContainer, createSwitchNavigator } from "react-navigation";

import { createBottomTabNavigator } from "react-navigation-tabs";
import { createStackNavigator } from "react-navigation-stack";

import getSlideFromRightTransition from "react-navigation-slide-from-right-transition";
import ListingDetailScreen from "../components/screens/ListingDetailScreen";
import CommentListingScreen from "../components/screens/CommentListingScreen";
import EventDetailScreen from "../components/screens/EventDetailScreen";
import EventDiscussionAllScreen from "../components/screens/EventDiscussionAllScreen";
import EventCommentDiscussionScreen from "../components/screens/EventCommentDiscussionScreen";
import WebViewScreen from "../components/screens/WebViewScreen";
import ArticleDetailScreen from "../components/screens/ArticleDetailScreen";
import SearchScreen from "../components/screens/SearchScreen";
import ListingSearchResultScreen from "../components/screens/ListingSearchResultScreen";
import EventSearchResultScreen from "../components/screens/EventSearchResultScreen";
import MessageScreen from "../components/screens/MessageScreen";
import SendMessageScreen from "../components/screens/SendMessageScreen";
import NotificationsScreen from "../components/screens/NotificationsScreen";
import AddMessageScreen from "../components/screens/AddMessageScreen";
import ReviewFormScreen from "../components/screens/ReviewFormScreen";
import FirstLoginScreen from "../components/screens/FirstLoginScreen";

import {
  getHomeScreen,
  getTabNavigator,
  getTranslations,
  getLocations,
  getSettings,
  checkToken,
  getCountNotificationsRealTimeFaker,
  getShortProfile,
  getMessageChatNewCount,
  setUserConnection,
  getDeviceToken,
  setDeviceTokenToFirebase,
  resetMessageActiveAll,
  removeItemInUsersError,
  setNotificationSettings,
  getNotificationAdminSettings,
  firebaseInitApp,
  getProductsCart
} from "../actions";

import rootTabNavOpts from "./rootTabNavOpts";
import homeStack from "./homeStack";
import listingStack from "./listingStack";
import eventStack from "./eventStack";
import accountStack from "./accountStack";
import menuStack from "./menuStack";
import blogStack from "./articleStack";
import pageStack from "./pageStack";

import { FontIcon } from "../wiloke-elements";
import configureApp from "../../configureApp.json";
import LoginScreen from "../components/screens/LoginScreen";
import CartContainer from "../components/smarts/CartContainer";
import PaymentScreen from "../components/screens/PaymentScreen";
import ProductDetailContainer from "../components/smarts/ProductDetailContainer";
import CommentRatingScreen from "../components/screens/CommentRatingScreen";
import ProductWishListScreen from "../components/screens/ProductWishListScreen";
import ShopOrderContainer from "../components/smarts/ShopOrderContainer";
import OrderDetailsScreen from "../components/screens/OrderDetailsScreen";
import BookingContainer from "../components/smarts/BookingContainer";
import BookingDetailScreen from "../components/screens/BookingDetailScreen";
import DokanScreen from "../components/screens/DokanScreen";
import DokanStaticScreen from "../components/screens/DokanStaticScreen";
import DokanProductScreen from "../components/screens/DokanProductScreen";
import DokanOrderScreen from "../components/screens/DokanOrderScreen";
import DokanWithDrawnScreen from "../components/screens/DokanWithDrawnScreen";
import DokanRequestScreen from "../components/screens/DokanRequestScreen";
import MakeRequestScreen from "../components/screens/MakeRequestScreen";
const { width: SCREEN_WIDTH } = Dimensions.get("window");
import * as firebase from "firebase";

const navigationOptions = {
  gesturesEnabled: true
  // gestureResponseDistance: {
  //   horizontal: SCREEN_WIDTH
  // }
};

class RootStack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: null,
      errorMessage: null,
      notification: {}
    };

    const { auth } = this.props;
    const { token } = auth;
    if (token)
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  _getLocationAsync = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.LOCATION);
      console.log(status);
      // if (status !== "granted") {
      //   await this.setState({
      //     errorMessage: "Permission to access location was denied"
      //   });
      // }
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({
          enableHighAccuracy: true
        });
        this.props.getLocations(location);
      } else {
        throw new Error("Location permission not granted");
      }

      // const location = await Location.getCurrentPositionAsync({});
    } catch (err) {
      const { translations } = await this.props;
      Platform === "android"
        ? IntentLauncher.startActivityAsync(
            IntentLauncher.ACTION_LOCATION_SOURCE_SETTINGS
          )
        : Alert.alert(
            he.decode(translations.askForAllowAccessingLocationTitle),
            he.decode(translations.askForAllowAccessingLocationDesc),
            [
              {
                text: translations.cancel,
                style: "cancel"
              },
              {
                text: translations.ok,
                onPress: () => Linking.openURL("app-settings:")
              }
            ],
            { cancelable: false }
          );
    }
  };

  _checkToken = __ => {
    const { checkToken, shortProfile, setUserConnection } = this.props;
    const myID = shortProfile.userID;
    if (this.props.auth.isLoggedIn) {
      checkToken(myID);
    }
    this._checkTokenFaker = setInterval(__ => {
      if (this.props.auth.isLoggedIn) {
        checkToken(myID);
      } else {
        setUserConnection(myID, false);
      }
    }, 60000);
  };

  _getCountNotifications = __ => {
    const { getCountNotificationsRealTimeFaker } = this.props;
    if (this.props.auth.isLoggedIn) {
      getCountNotificationsRealTimeFaker();
    }
    this._getCountNotificationFaker = setInterval(_ => {
      if (this.props.auth.isLoggedIn) {
        getCountNotificationsRealTimeFaker();
      }
    }, 20000);
  };

  _handleAppStateChange = myID => nextAppState => {
    this.props.setUserConnection(myID, nextAppState === "active");
  };

  registerForPushNotificationsAsync = async (isLoggedIn, myID, firebaseID) => {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== "granted") {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== "granted") {
      Alert.alert("Please enable service notification");
      return;
    }

    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();
    this.props.getDeviceToken(token);
    // // POST the token to your backend server from where you can retrieve it to send push
    if (isLoggedIn && myID) {
      this.props.setDeviceTokenToFirebase(myID, firebaseID, token);
    }
  };

  _appUpdate = async __ => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        // ... notify user of update ...
        Updates.reloadFromCache();
      }
    } catch (err) {
      // handle or log error
      console.log(err);
    }
  };

  async componentDidMount() {
    const {
      getSettings,
      getTranslations,
      getHomeScreen,
      getTabNavigator,
      auth,
      getMessageChatNewCount,
      firebaseInitApp
    } = this.props;
    await Promise.all([
      getTranslations(),
      getSettings(),
      getHomeScreen(),
      getTabNavigator()
    ]);
    const { settings } = this.props;
    const { oFirebase } = settings;
    if (!!oFirebase) {
      await firebase.initializeApp(oFirebase);
      await firebaseInitApp(firebase.database());
    }
    auth.isLoggedIn && (await this.props.getShortProfile());
    auth.isLoggedIn && (await this.props.getProductsCart(auth.token));
    this._checkToken();
    this._getCountNotifications();
    const { shortProfile } = this.props;
    const { firebaseID, userID: myID } = shortProfile;
    this.registerForPushNotificationsAsync(auth.isLoggedIn, myID, firebaseID);
    if (auth.isLoggedIn && myID) {
      getMessageChatNewCount(myID);
      this.props.setUserConnection(myID, true);
      AppState.addEventListener("change", this._handleAppStateChange(myID));
      this.props.resetMessageActiveAll(myID);
      this.props.removeItemInUsersError(myID);
      await this.props.getNotificationAdminSettings();
      const { notificationAdminSettings } = this.props;
      await this.props.setNotificationSettings(
        myID,
        notificationAdminSettings,
        "start"
      );
    }

    // if (!__DEV__) this._appUpdate();

    // Notifications.setBadgeNumberAsync(0);
    // if (Platform.OS === "android" && !Constants.isDevice) {
    //   this.setState({
    //     errorMessage:
    //       "Oops, this will not work on Sketch in an Android emulator. Try it on your device!"
    //   });
    // } else {
    //   this._getLocationAsync();
    // }
  }

  componentWillUnmount() {
    clearInterval(this._checkTokenFaker);
    clearInterval(this._getCountNotificationFaker);
    const { shortProfile, auth } = this.props;
    const myID = shortProfile.userID;
    if (auth.isLoggedIn && myID) {
      AppState.addEventListener("change", this._handleAppStateChange(myID));
    }
  }

  shouldComponentUpdate(nextProps) {
    if (!_.isEqual(nextProps.homeScreen, this.props.homeScreen)) {
      return true;
    }

    // WTF:
    // JSON.stringify(nextProps.translations) !== JSON.stringify(this.props.translations)  ->  false
    // !_.isEqual(nextProps.translations, this.props.translations)                         ->  true
    if (
      JSON.stringify(nextProps.translations) !==
      JSON.stringify(this.props.translations)
    ) {
      return true;
    }
    if (!_.isEqual(nextProps.settings, this.props.settings)) {
      return true;
    }
    if (!_.isEqual(nextProps.tabNavigator, this.props.tabNavigator)) {
      return true;
    }
    return false;
  }

  _checkScreen = screen => {
    switch (screen) {
      case "listingStack":
        return listingStack;
      case "eventStack":
        return eventStack;
      case "blogStack":
        return blogStack;
      case "accountStack":
        return accountStack;
      case "pageStack":
        return pageStack;
      case "menuStack":
        return menuStack;
      default:
        return homeStack;
    }
  };

  renderTabItem = ({ tabBarLabel, iconType, iconName }) => () => {
    const { tabNavigator } = this.props;
    // const tabBarListing = tabNavigator
    //   .filter(item => item.screen === "listingStack")
    //   .map(item => item.key);
    return {
      tabBarLabel,
      tabBarIcon: ({ tintColor }) => {
        switch (iconType) {
          case "image":
            return (
              !!iconName && (
                <Image
                  source={iconName}
                  style={{ width: 20, height: 20, tintColor }}
                />
              )
            );
          default:
            return (
              !!iconName && (
                <FontIcon name={iconName} size={22} color={tintColor} />
              )
            );
        }
      }
    };
  };

  render() {
    const { tabNavigator, settings, auth } = this.props;
    const { isLoggedIn } = auth;
    const { enable: isFirstLogin } = configureApp.loginScreenStartApp;
    const RootStack = createStackNavigator(
      {
        ...(!isLoggedIn && isFirstLogin
          ? {
              FirstLoginScreen: {
                screen: FirstLoginScreen,
                navigationOptions
              }
            }
          : {}),
        RootTab: {
          screen: createBottomTabNavigator(
            tabNavigator.length > 0
              ? tabNavigator.reduce((acc, cur) => {
                  return {
                    ...acc,
                    [cur.key]: {
                      screen: this._checkScreen(cur.screen),
                      navigationOptions: this.renderTabItem({
                        tabBarLabel: cur.name,
                        iconType: "font",
                        iconName: cur.iconName
                      })
                    }
                  };
                }, {})
              : {
                  home: {
                    screen: homeStack,
                    navigationOptions: this.renderTabItem({
                      tabBarLabel: " "
                    })
                  }
                },
            rootTabNavOpts(settings.colorPrimary)
          )
        },
        MessageScreen: {
          screen: MessageScreen,
          navigationOptions
        },
        SendMessageScreen: {
          screen: SendMessageScreen,
          navigationOptions
        },
        NotificationsScreen: {
          screen: NotificationsScreen,
          navigationOptions
        },
        SearchScreen: {
          screen: SearchScreen,
          navigationOptions
        },
        ListingSearchResultScreen: {
          screen: ListingSearchResultScreen,
          navigationOptions
        },
        EventSearchResultScreen: {
          screen: EventSearchResultScreen,
          navigationOptions
        },
        ListingDetailScreen: {
          screen: ListingDetailScreen,
          navigationOptions
        },
        CommentListingScreen: {
          screen: CommentListingScreen,
          navigationOptions
        },
        ReviewFormScreen: {
          screen: ReviewFormScreen,
          navigationOptions
        },
        EventDetailScreen: {
          screen: EventDetailScreen,
          navigationOptions
        },
        WebViewScreen: {
          screen: WebViewScreen,
          navigationOptions
        },
        EventDiscussionAllScreen: {
          screen: EventDiscussionAllScreen,
          navigationOptions
        },
        EventCommentDiscussionScreen: {
          screen: EventCommentDiscussionScreen,
          navigationOptions
        },
        ArticleDetailScreen: {
          screen: ArticleDetailScreen,
          navigationOptions
        },
        AddMessageScreen: {
          screen: AddMessageScreen,
          navigationOptions
        },
        ProductDetailScreen: {
          screen: ProductDetailContainer
        },
        LoginScreen: {
          screen: LoginScreen
        },
        CartScreen: {
          screen: CartContainer
        },
        PaymentScreen: {
          screen: PaymentScreen
        },
        CommentRatingScreen: {
          screen: CommentRatingScreen
        },
        ProductWishListScreen: {
          screen: ProductWishListScreen
        },
        ShopOrderScreen: {
          screen: ShopOrderContainer
        },
        OrderDetailsScreen: {
          screen: OrderDetailsScreen
        },
        BookingScreen: {
          screen: BookingContainer
        },
        BookingDetailScreen: {
          screen: BookingDetailScreen
        },
        DokanScreen: {
          screen: DokanScreen
        },
        DokanProductScreen: {
          screen: DokanProductScreen
        },
        DokanOrderScreen: {
          screen: DokanOrderScreen
        },
        DokanStaticScreen: {
          screen: DokanStaticScreen
        },
        DokanWithDrawnScreen: {
          screen: DokanWithDrawnScreen
        },
        DokanRequestScreen: {
          screen: DokanRequestScreen
        },
        MakeRequestScreen: {
          screen: MakeRequestScreen
        }
      },
      {
        transitionConfig: getSlideFromRightTransition,
        headerMode: "none"
      }
    );
    const CreateRootStack = createAppContainer(RootStack);
    return <CreateRootStack {...this.props} />;
  }
}
const mapStateToProps = state => ({
  tabNavigator: state.tabNavigator,
  translations: state.translations,
  settings: state.settings,
  auth: state.auth,
  isTokenExpired: state.isTokenExpired,
  shortProfile: state.shortProfile,
  notificationAdminSettings: state.notificationAdminSettings
});
const mapDispatchToProps = {
  getTabNavigator,
  getTranslations,
  getLocations,
  getSettings,
  getHomeScreen,
  checkToken,
  getCountNotificationsRealTimeFaker,
  getShortProfile,
  getMessageChatNewCount,
  setUserConnection,
  getDeviceToken,
  setDeviceTokenToFirebase,
  resetMessageActiveAll,
  removeItemInUsersError,
  setNotificationSettings,
  getNotificationAdminSettings,
  firebaseInitApp,
  getProductsCart
};

export default connect(mapStateToProps, mapDispatchToProps)(RootStack);
