import React, { Component } from "react";
import {
  View,
  RefreshControl,
  FlatList,
  AppState,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import {
  ViewWithLoading,
  RequestTimeoutWrapped,
  Admob,
  adMobModal,
  Row,
  Col,
  Masonry,
  Loader,
  RTL,
  wait,
  // MyAdvertise
} from "../../wiloke-elements";
import {
  Heading,
  Hero,
  Layout,
  ListingLayoutHorizontal,
  ListingLayoutPopular,
  ListingLayoutCat,
  ListingCat,
  EventItem,
  PostTypeCard,
  CommentItem,
  ProductItem,
  ProductsWC,
  ListingCarousel,
  ProductCarousel,
} from "../dumbs";
import he from "he";
import { connect } from "react-redux";
import {
  getHomeScreen,
  getTabNavigator,
  getShortProfile,
  readNewMessageChat,
  getKeyFirebase,
} from "../../actions";
import _ from "lodash";
import * as Consts from "../../constants/styleConstants";
import { Notifications } from "expo";
import { getDistance } from "../../utils/getDistance";
import Banner from "../dumbs/Banner/Banner";
import NavigationSuspense from "../smarts/NavigationSuspense";
import {
  AdMobInterstitial,
  AdMobRewarded,
  setTestDeviceIDAsync,
} from "expo-ads-admob";
const ITEM_HEIGHT = 500;

const SCREEN_WIDTH = Consts.screenWidth;

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.refreshing = false;
    this.state = {
      appState: AppState.currentState,
      notification: null,
      animationType: "none",
    };
  }

  _getHomeAPIRequestTimeout = () => {
    this.props.getHomeScreen();
    this.props.getTabNavigator();
  };

  async componentDidMount() {
    const { auth, settings } = this.props;
    if (auth.isLoggedIn) {
      // await this.props.getShortProfile()
      AppState.addEventListener("change", this._handleAppStateChange);
    }
    Notifications.addListener(this._handleNotification);
    const { homeScreen } = this.props;
    if (!_.isEmpty(homeScreen)) {
      const adMob = homeScreen.filter(
        (item) => item.TYPE === "GOOGLE_ADMOB" && !!item.oResults.oFullWidth
      )[0].oResults.oFullWidth;
      AdMobInterstitial.setAdUnitID(adMob.adUnitID);
      setTestDeviceIDAsync("EMULATOR");
      await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });

      // const { adUnitID, variant, timeout } = adMob;
      // await wait(timeout);
    }
  }

  componentWillUnmount() {
    const { auth } = this.props;
    if (auth.isLoggedIn) {
      AppState.addEventListener("change", this._handleAppStateChange);
    }
  }

  _handleAppStateChange = async (nextAppState) => {
    const {
      shortProfile,
      getKeyFirebase,
      navigation,
      readNewMessageChat,
    } = this.props;
    const { notification } = this.state;
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active" &&
      notification
    ) {
      console.log("App has come to the foreground!");
      const myID = shortProfile.userID;
      const { screen, userID } = notification.data;
      if (screen === "SendMessageScreen") {
        await Promise.all([
          getKeyFirebase(myID, userID, "forPushNotification"),
          getKeyFirebase(myID, userID),
        ]);
        const { keyFirebase2, keyFirebase } = this.props;
        readNewMessageChat(userID, keyFirebase);
        const data = {
          ...notification.data,
          key: keyFirebase2,
        };
        navigation.navigate(screen, data);
      } else {
        navigation.navigate(screen, notification.data);
      }
    }
    this.setState({ appState: nextAppState });
  };

  _handleNotification = async (notification) => {
    this.setState({ notification });
  };

  _handleModalShow = () => {
    this.setState({
      animationType: "slide",
    });
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (!_.isEqual(nextProps.homeScreen, this.props.homeScreen)) {
      return true;
    }
    if (!_.isEqual(nextProps.translations, this.props.translations)) {
      return true;
    }
    if (!_.isEqual(nextProps.settings, this.props.settings)) {
      return true;
    }
    if (!_.isEqual(nextProps.tabNavigator, this.props.tabNavigator)) {
      return true;
    }
    if (!_.isEqual(nextProps.auth, this.props.auth)) {
      return true;
    }
    if (!_.isEqual(nextProps.shortProfile, this.props.shortProfile)) {
      return true;
    }
    if (!_.isEqual(nextProps.keyFirebase2, this.props.keyFirebase2)) {
      return true;
    }
    if (!_.isEqual(nextState.appState, this.state.appState)) {
      return true;
    }
    if (!_.isEqual(nextState.notification, this.state.notification)) {
      return true;
    }
    if (!_.isEqual(nextState.animationType, this.state.animationType)) {
      return true;
    }
    if (!_.isEqual(nextProps.locations, this.props.locations)) {
      return true;
    }
    return false;
  }

  _handleRefresh = async () => {
    try {
      this.refreshing = true;
      this.forceUpdate();
      await Promise.all([
        this.props.getHomeScreen(),
        this.props.getTabNavigator(),
      ]);
      this.refreshing = false;
      this.forceUpdate();
    } catch (err) {
      console.log(err);
    }
  };

  renderHero = (data, index) => (
    <Hero
      src={data.image_bg}
      title={data.heading}
      text={data.description}
      titleColor={data.heading_color}
      textColor={data.description_color}
      overlayColor={data.overlay_color}
    />
  );

  renderHeading = (data, index) => {
    const { bg_color } = data;
    const backgroundColor = !!bg_color ? bg_color : Consts.colorGray2;
    return (
      <View style={[styles.heading, { backgroundColor }]}>
        <Heading
          title={data.heading}
          text={data.description}
          mb={2}
          {...(!!data.heading_color ? { titleColor: data.heading_color } : {})}
          {...(!!data.description_color
            ? { textColor: data.description_color }
            : {})}
        />
      </View>
    );
  };

  renderListing = (data, listingSettings, index) => {
    const { navigation, settings, locations, translations } = this.props;
    const { latitude, longitude } = locations.location.coords;
    const style = listingSettings.style || "simple_slider";
    const { bg_color } = listingSettings;
    const backgroundColor = !!bg_color ? bg_color : Consts.colorGray2;
    return (
      <View style={[styles.listing, { backgroundColor }]}>
        {style === "modern_slider" ? (
          <ListingLayoutPopular
            data={data}
            admob={settings.oAdMob}
            navigation={navigation}
            colorPrimary={settings.colorPrimary}
            myCoords={{ latitude, longitude }}
            unit={settings.unit}
          />
        ) : (
          <ListingLayoutHorizontal
            layout={style === "grid" ? "vertical" : "horizontal"}
            data={data}
            navigation={navigation}
            colorPrimary={settings.colorPrimary}
            myCoords={{ latitude, longitude }}
            unit={settings.unit}
            translations={translations}
            admob={settings.oAdMob}
          />
        )}
      </View>
    );
  };

  renderItemCategories = (catSettings) => ({ item }) => {
    const { navigation } = this.props;
    const { taxonomy, style } = catSettings;
    return (
      <View style={{ margin: 5 }}>
        <ListingCat
          linearGradient={item.oGradient}
          image={item.oTerm.featuredImg}
          name={he.decode(item.oTerm.name)}
          onPress={() =>
            navigation.navigate("ListingCategories", {
              categoryId: item.oTerm.term_id,
              name: he.decode(item.oTerm.name),
              taxonomy,
              endpointAPI: item.restAPI,
            })
          }
          itemWidth={
            style === "grid" ? SCREEN_WIDTH / 2 - 15 : SCREEN_WIDTH / 2.5
          }
        />
      </View>
    );
  };

  renderCategories = (data, catSettings, index) => {
    const { navigation } = this.props;
    const { taxonomy, style } = catSettings;
    const { bg_color } = catSettings;
    const backgroundColor = !!bg_color ? bg_color : Consts.colorGray2;
    return (
      <View style={[styles.categories, { backgroundColor }]}>
        <ListingLayoutCat
          layout={style === "grid" ? "vertical" : "horizontal"}
          data={data}
          renderItem={this.renderItemCategories(catSettings)}
        />
      </View>
    );
  };

  renderItemEvent = (style) => ({ item }) => {
    const { translations, navigation, locations, settings } = this.props;
    const { unit, oAdMob } = settings;
    const { latitude, longitude } = locations.location.coords;
    const address = item.oAddress || { lat: "", lng: "" };
    const { lat, lng } = address;
    const distance = getDistance(latitude, longitude, lat, lng, unit);
    return (
      <View
        style={[
          styles.itemEvents,
          {
            width:
              style === "grid" ? SCREEN_WIDTH / 2 - 5 : SCREEN_WIDTH / 1.8 + 10,
          },
        ]}
      >
        <EventItem
          image={item.oFeaturedImg.medium}
          name={he.decode(item.postTitle)}
          date={
            item.oCalendar
              ? `${item.oCalendar.oStarts.date} - ${item.oCalendar.oStarts.hour}`
              : null
          }
          address={item.oAddress && he.decode(item.oAddress.address)}
          hosted={`${translations.hostedBy} ${item.oAuthor.displayName}`}
          interested={`${item.oFavorite.totalFavorites} ${item.oFavorite.text}`}
          style={{
            width: "100%",
          }}
          onPress={() => {
            const isAdmob = _.get(oAdMob, "oFullWidth", false);
            !!isAdmob && adMobModal({ variant: oAdMob.oFullWidth.variant });
            navigation.navigate("EventDetailScreen", {
              id: item.ID,
              name: he.decode(item.postTitle),
              image:
                SCREEN_WIDTH > 420
                  ? item.oFeaturedImg.large
                  : item.oFeaturedImg.medium,
              address: item.oAddress && he.decode(item.oAddress.address),
              hosted: `${translations.hostedBy} ${item.oAuthor.displayName}`,
              interested: `${item.oFavorite.totalFavorites} ${item.oFavorite.text}`,
            });
          }}
          mapDistance={distance}
        />
      </View>
    );
  };

  renderEvent = (data, eventSettings, index) => {
    const style = eventSettings.style || "simple_slider";
    const { bg_color } = eventSettings;
    const backgroundColor = !!bg_color ? bg_color : Consts.colorGray2;
    return (
      <View style={[styles.events, { backgroundColor }]}>
        <FlatList
          data={data}
          renderItem={this.renderItemEvent(style)}
          keyExtractor={(item) => item.ID.toString()}
          numColumns={style === "grid" ? 2 : 1}
          horizontal={style === "grid" ? false : true}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  };

  renderAdmob = ({ oBanner }, index) => {
    return (
      <View>
        {oBanner && (
          <Admob adUnitID={oBanner.adUnitID} bannerSize={oBanner.bannerSize} />
        )}
      </View>
    );
  };

  _handlePostTypeItem = (postType) => () => {
    const { navigation, listings, settings } = this.props;
    const { oAdMob } = settings;
    const screen =
      postType === "event" ? "EventScreenStack" : "ListingScreenStack";
    const isAdmob = _.get(oAdMob, "oFullWidth", false);

    !!isAdmob && adMobModal({ variant: oAdMob.oFullWidth.variant });
    navigation.navigate(screen, {
      key: postType,
      isLoading: _.isEmpty(listings[postType]) ? true : false,
    });
  };

  renderPostTypeItem = (items_per_row) => ({
    label,
    iconName,
    postType,
    backgroundColor,
  }) => {
    return (
      <Col key={postType} column={items_per_row} gapHorizontal={10}>
        <PostTypeCard
          iconName={iconName}
          label={label}
          backgroundColor={backgroundColor}
          onPress={this._handlePostTypeItem(postType)}
        />
      </Col>
    );
  };

  renderPostTypeList = (result, { items_per_row, bg_color }, index) => {
    return (
      <View
        style={{
          padding: 10,
          backgroundColor: !!bg_color ? bg_color : Consts.colorGray2,
        }}
        key={index.toString()}
      >
        <Row gapHorizontal={10}>
          {!_.isEmpty(result) &&
            result.map(this.renderPostTypeItem(items_per_row))}
        </Row>
      </View>
    );
  };

  _handleReviewItemNavigate = (reviewItem) => () => {
    const { navigation } = this.props;
    navigation.navigate("CommentListingScreen", {
      id: reviewItem.ID,
      key: "reviews",
      item: reviewItem,
      autoFocus: true,
      mode: reviewItem.oReviews.mode,
    });
  };

  _handleReviewItemNavigateListing = (listingItem) => () => {
    const { navigation } = this.props;
    navigation.navigate("ListingDetailScreen", {
      id: listingItem.id,
      name: he.decode(listingItem.title),
      tagline: !!listingItem.tagline ? he.decode(listingItem.tagline) : null,
      link: listingItem.link,
      author: listingItem.author,
      image:
        SCREEN_WIDTH > 420 ? listingItem.image.large : listingItem.image.medium,
      logo:
        listingItem.logo !== ""
          ? listingItem.logo
          : listingItem.image.thumbnail,
    });
  };

  renderReviewItem = (len, style) => ({ item, index }) => {
    const { translations, settings } = this.props;
    const { oReview: reviewItem, oParent: listingItem } = item;
    return (
      <CommentItem
        galleryThumbnailMax={style === "slider" || SCREEN_WIDTH > 420 ? 3 : 2}
        avatar={reviewItem.oUserInfo.avatar}
        grade={reviewItem.oReviews.average}
        title={reviewItem.postTitle}
        content={reviewItem.postContent}
        userName={reviewItem.oUserInfo.displayName}
        gallery={!!reviewItem.oGallery ? reviewItem.oGallery : {}}
        postDate={reviewItem.postDate}
        post={`${translations.wroteReviewsFor} ${he.decode(listingItem.title)}`}
        containerStyle={
          style === "slider"
            ? {
                marginLeft: index === 0 ? 10 : 5,
                marginRight: index === len - 1 ? 10 : 5,
                width: Consts.screenWidth - 50,
              }
            : {}
        }
        toListingDetailReview={this._handleReviewItemNavigate(reviewItem)}
        toListingDetail={this._handleReviewItemNavigateListing(listingItem)}
        colorPrimary={settings.colorPrimary}
      />
    );
  };

  renderReviews = (result, setting, index) => {
    const resultLength = !!result.aResults ? result.aResults.length : 0;
    return (
      <View
        key={index.toString()}
        style={[
          styles.reviews,
          {
            paddingHorizontal: setting.style === "grid" ? 10 : 0,
            backgroundColor: !!setting.bg_color
              ? setting.bg_color
              : Consts.colorGray2,
          },
        ]}
      >
        {setting.style === "grid" ? (
          <Masonry
            column={2}
            gapVertical={10}
            gapHorizontal={10}
            data={result.aResults}
            renderItem={this.renderReviewItem(0, "grid")}
          />
        ) : (
          <FlatList
            horizontal
            data={result.aResults}
            renderItem={this.renderReviewItem(resultLength, "slider")}
            showsHorizontalScrollIndicator={false}
          />
        )}
      </View>
    );
  };

  renderProductWC = (result, setting, index) => {
    const { navigation, settings } = this.props;
    const backgroundColor = !!setting.bg_color
      ? setting.bg_color
      : Consts.colorGray2;
    const { oAdMob } = settings;
    return (
      <View style={{ backgroundColor, paddingTop: 10 }}>
        <ProductsWC
          data={result}
          columns={setting.items_per_row}
          type={setting.style}
          title={setting.TYPE}
          navigation={navigation}
          customStyle={{ backgroundColor: setting.bg_color }}
          colorPrimary={settings.colorPrimary}
          admob={oAdMob}
        />
      </View>
    );
  };

  renderBanner = (results, index) => {
    const { navigation } = this.props;
    return (
      <View
        style={{
          backgroundColor: results.bg_color,
        }}
      >
        <Banner
          navigation={navigation}
          data={results.banners}
          timeInterval={results.slider_interval}
          type={results.TYPE}
        />
      </View>
    );
  };

  renderProductBlock = (results, setting, index) => {
    const { navigation, settings } = this.props;
    return (
      <View style={{ backgroundColor: setting.bg_color, paddingLeft: 5 }}>
        <ProductCarousel
          data={results}
          navigation={navigation}
          setting={setting}
          colorPrimary={settings.colorPrimary}
          admob={settings.oAdMob}
        />
      </View>
    );
  };

  renderListingBlock = (results, setting, viewMore, index) => {
    const { navigation, settings } = this.props;
    return (
      <View style={{ backgroundColor: setting.bg_color }}>
        <ListingCarousel
          data={results}
          navigation={navigation}
          setting={setting}
          viewMore={viewMore}
          colorPrimary={settings.colorPrimary}
          admob={settings.oAdMob}
        />
      </View>
    );
  };

  _checkRenderContent = (section, index) => {
    switch (section.TYPE) {
      case "HERO":
        return this.renderHero(section, index);
      case "HEADING":
        return this.renderHeading(section, index);
      case "LISTINGS":
        return this.renderListing(section.oResults, section.oSettings, index);
      case "MODERN_TERM_BOXES":
        return this.renderCategories(
          section.oResults,
          section.oSettings,
          index
        );
      case "EVENTS":
        return this.renderEvent(section.oResults, section.oSettings, index);
      case "GOOGLE_ADMOB":
        return this.renderAdmob(section.oResults, index);
      case "DIRECTORY_TYPE_BOXES":
        return this.renderPostTypeList(
          section.oResults,
          section.oSettings,
          index
        );
      case "REVIEWS":
        return this.renderReviews(section.oResults, section.oSettings, index);

      case "WOOCOMMERCE_PRODUCTS":
        return this.renderProductWC(section.oResults, section.oSettings, index);
      case "WOOCOMMERCE_BOOKINGS":
        return this.renderProductWC(section.oResults, section.oSettings, index);
      case "EXTERNAL_BANNERS":
        return this.renderBanner(section, index);
      case "LISTING_BANNERS":
        return this.renderBanner(section, index);
      case "WOOCOMMERCE_PRODUCT_BLOCKS":
        return this.renderProductBlock(
          section.oResults,
          section.oSettings,
          index
        );
      case "WOOCOMMERCE_BOOKING_BLOCKS":
        return this.renderProductBlock(
          section.oResults,
          section.oSettings,
          index
        );
      case "LISTING_BLOCKS":
        return this.renderListingBlock(
          section.oResults,
          section.oSettings,
          section.oViewMore,
          index
        );
      default:
        return false;
    }
  };

  _renderHomeItem = ({ item, index }) => {
    return (
      <NavigationSuspense fallback={<Loader size="small" height={150} />}>
        {this._checkRenderContent(item, index)}
      </NavigationSuspense>
    );
  };

  _keyExtractor = (item, index) => {
    return "homeScreen" + index.toString();
  };

  renderContent = () => {
    const {
      homeScreen,
      translations,
      isHomeRequestTimeout,
      settings,
    } = this.props;
    return (
      <RequestTimeoutWrapped
        isTimeout={isHomeRequestTimeout && _.isEmpty(homeScreen)}
        onPress={this._getHomeAPIRequestTimeout}
        fullScreen={true}
        text={translations.networkError}
        buttonText={translations.retry}
      >
        {/* <MyAdvertise
          imageUri="https://landing.wilcity.com/intro/31.jpg"
          redirectUri="https://wilcity.com/"
          variant="interstitial"
          showButtonCloseTimer={6}
        /> */}
        {/* <MyAdvertise
          imageUri="https://landing.wilcity.com/intro/22_01.gif"
          redirectUri="https://wilcity.com/"
        />
        <View style={{ height: 20 }} />
        <MyAdvertise
          imageUri="https://via.placeholder.com/320x50"
          redirectUri="https://wilcity.com/"
        />
        <View style={{ height: 20 }} />
        <MyAdvertise
          imageUri="https://landing.wilcity.com/intro/22_04.gif"
          redirectUri="https://wilcity.com/"
          background="dark"
        /> */}
        <ViewWithLoading isLoading={homeScreen}>
          <View style={styles.contentInner}>
            {/* {homeScreen.map((section, index) => {
              if (section) {
                return (
                  <NavigationSuspense
                    key={index.toString()}
                    fallback={<Loader size="large" />}
                  >
                    {this._checkRenderContent(section, index)}
                  </NavigationSuspense>
                );
              }
            })} */}
            <FlatList
              data={homeScreen}
              renderItem={this._renderHomeItem}
              keyExtractor={this._keyExtractor}
              showsVerticalScrollIndicator={false}
              onRefresh={this._handleRefresh}
              refreshing={this.refreshing}
              removeClippedSubviews={false}
              initialNumToRender={homeScreen.length - 1}
            />
          </View>
        </ViewWithLoading>
      </RequestTimeoutWrapped>
    );
  };
  render() {
    const { navigation, settings, translations, auth } = this.props;
    const { isLoggedIn } = auth;
    return (
      <Layout
        navigation={navigation}
        colorPrimary={settings.colorPrimary}
        renderContent={this.renderContent}
        textSearch={translations.search}
        isLoggedIn={isLoggedIn}
        // refreshControl={
        //   <RefreshControl
        //     refreshing={this.refreshing}
        //     onRefresh={this._handleRefresh}
        //     tintColor={settings.colorPrimary}
        //     progressBackgroundColor={Consts.colorGray1}
        //   />
        // }
        scrollViewEnabled={false}
      />
    );
  }
}

const styles = StyleSheet.create({
  contentInner: {
    width: SCREEN_WIDTH,
  },
  heading: {
    paddingTop: 20,
    paddingHorizontal: 10,
    paddingBottom: 5,
    alignItems: "flex-start",
    direction: "inherit",
  },
  listing: {
    paddingBottom: 20,
  },
  categories: {
    paddingTop: 5,
    paddingBottom: 20,
  },
  itemEvents: {
    paddingHorizontal: 5,
    marginBottom: 10,
  },
  events: {
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 5,
  },
  reviews: {
    paddingTop: 10,
    paddingBottom: 20,
  },
});

const mapStateToProps = (state) => ({
  homeScreen: state.homeScreen,
  translations: state.translations,
  isHomeRequestTimeout: state.isHomeRequestTimeout,
  settings: state.settings,
  tabNavigator: state.tabNavigator,
  auth: state.auth,
  keyFirebase2: state.keyFirebase2,
  keyFirebase: state.keyFirebase,
  shortProfile: state.shortProfile,
  deviceToken: state.deviceToken,
  notificationAdminSettings: state.notificationAdminSettings,
  loginError: state.loginError,
  listings: state.listings,
  locations: state.locations,
});

const mapDispatchToProps = {
  getHomeScreen,
  getTabNavigator,
  getShortProfile,
  readNewMessageChat,
  getKeyFirebase,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
