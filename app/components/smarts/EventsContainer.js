import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableHighlight,
  Animated,
  Easing
} from "react-native";
import _ from "lodash";
import he from "he";
import { connect } from "react-redux";
import { getEvents, getEventsLoadmore } from "../../actions";
import { EventItem, MapSlider, IconMapMarker } from "../dumbs";
import {
  MessageError,
  RequestTimeoutWrapped,
  ViewWithLoading,
  ContentLoader,
  Row,
  Col,
  bottomBarHeight,
  Loader,
  FontIcon,
  wait
} from "../../wiloke-elements";
import {
  screenWidth,
  screenHeight,
  colorGray1
} from "../../constants/styleConstants";
import { getDistance } from "../../utils/getDistance";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const END_REACHED_THRESHOLD = Platform.OS === "ios" ? 0.8 : 1;
const RADIUS = 10;

/**
 * getCoordinateFromListItem
 * @param {array} listItem đầu vào là array có chứa Coordinate sai cú pháp và thêm vào obj coordinate mới cho đúng
 */
const getCoordinateFromListItem = listItem => {
  return listItem.map(item => ({
    ...item,
    coordinate: {
      latitude: Number(item.oAddress.lat),
      longitude: Number(item.oAddress.lng)
    }
  }));
};

class EventsContainer extends Component {
  static defaultProps = {
    horizontal: false
  };

  static propTypes = {
    horizontal: PropTypes.bool
  };

  state = {
    startLoadmore: false,
    postType: null,
    isMapVisible: false,
    isMapVisibleAnimated: new Animated.Value(0),
    itemCurrentSlideID: null
  };

  _getId = postType => {
    const { categoryList, locationList } = this.props;
    const getId = arr => arr.filter(item => item.selected)[0].id;
    const categoryId =
      typeof categoryList[postType] !== "undefined" &&
      categoryList[postType].length > 0 &&
      getId(categoryList[postType]) !== "wilokeListingCategory"
        ? getId(categoryList[postType])
        : null;
    const locationId =
      typeof locationList[postType] !== "undefined" &&
      locationList[postType].length > 0 &&
      getId(locationList[postType]) !== "wilokeListingLocation"
        ? getId(locationList[postType])
        : null;
    return { categoryId, locationId };
  };

  _getEvents = async () => {
    try {
      const {
        locations,
        getEvents,
        navigation,
        nearByFocus,
        settings
      } = this.props;
      const { coords } = locations.location;
      const nearby = {
        lat: coords.latitude,
        lng: coords.longitude,
        unit: settings.unit,
        radius: RADIUS
      };
      const { state } = navigation;
      const nextRoute = navigation.dangerouslyGetParent().state;
      const postType = state.params ? state.params.key : nextRoute.key;
      const { categoryId, locationId } = this._getId(postType);
      await this.setState({ postType });
      await getEvents(
        categoryId,
        locationId,
        postType,
        nearByFocus ? nearby : {}
      );
      await wait(1000);
      this.setState({ startLoadmore: true });
    } catch (err) {
      console.log(err);
    }
  };

  _getEventSuccess = events => {
    return !_.isEmpty(events) && events.status === "success";
  };

  componentDidMount() {
    this._getEvents();
  }

  _handleEndReached = next => () => {
    const { locations, getEventsLoadmore, nearByFocus, settings } = this.props;
    const { coords } = locations.location;
    const nearby = {
      lat: coords.latitude,
      lng: coords.longitude,
      unit: settings.unit,
      radius: RADIUS
    };
    const { postType } = this.state;
    const { startLoadmore } = this.state;
    const { categoryId, locationId } = this._getId(postType);
    startLoadmore &&
      next !== false &&
      getEventsLoadmore(
        next,
        categoryId,
        locationId,
        postType,
        nearByFocus ? nearby : {}
      );
  };

  renderItem = style => ({ item }) => {
    const { navigation, settings, locations, translations } = this.props;
    const { unit } = settings;
    const { latitude, longitude } = locations.location.coords;
    const address = item.oAddress || { lat: "", lng: "" };
    const { lat, lng } = address;
    const distance = getDistance(latitude, longitude, lat, lng, unit);
    return (
      <Col column={2} gap={10} style={style}>
        <EventItem
          image={item.oFeaturedImg.medium}
          name={he.decode(item.postTitle)}
          date={
            item.oCalendar
              ? `${item.oCalendar.oStarts.date} - ${item.oCalendar.oStarts.hour}`
              : null
          }
          address={he.decode(item.oAddress.address)}
          hosted={`${translations.hostedBy} ${item.oAuthor.displayName}`}
          interested={`${item.oFavorite.totalFavorites} ${item.oFavorite.text}`}
          style={{
            width: "100%"
          }}
          onPress={() =>
            navigation.navigate("EventDetailScreen", {
              id: item.ID,
              name: he.decode(item.postTitle),
              image:
                SCREEN_WIDTH > 420
                  ? item.oFeaturedImg.large
                  : item.oFeaturedImg.medium,
              address: he.decode(item.oAddress.address),
              hosted: `${translations.hostedBy} ${item.oAuthor.displayName}`,
              interested: `${item.oFavorite.totalFavorites} ${item.oFavorite.text}`
            })
          }
          mapDistance={distance}
        />
      </Col>
    );
  };

  _getWithLoadingProps = loading => ({
    isLoading: loading,
    contentLoader: "content",
    contentHeight: 90,
    contentLoaderItemLength: 6,
    featureRatioWithPadding: "56.25%",
    column: 2,
    gap: 10,
    containerPadding: 10
  });

  renderContentSuccess(events) {
    const { startLoadmore } = this.state;
    return (
      <FlatList
        data={events.oResults}
        renderItem={this.renderItem()}
        keyExtractor={(item, index) => item.ID.toString() + index.toString()}
        numColumns={2}
        horizontal={false}
        showsHorizontalScrollIndicator={false}
        onEndReachedThreshold={END_REACHED_THRESHOLD}
        onEndReached={this._handleEndReached(events.next)}
        ListFooterComponent={() =>
          startLoadmore && events.next !== false ? (
            <View style={{ padding: 5, width: screenWidth - 10 }}>
              <Row gap={10}>
                {Array(2)
                  .fill(null)
                  .map((_, index) => (
                    <Col key={index.toString()} column={2} gap={10}>
                      <ContentLoader
                        featureRatioWithPadding="56.25%"
                        contentHeight={90}
                        content={true}
                      />
                    </Col>
                  ))}
              </Row>
            </View>
          ) : (
            <View style={{ paddingBottom: 20 + bottomBarHeight }} />
          )
        }
        style={{ padding: 5 }}
        columnWrapperStyle={{
          width: screenWidth - 10,
          marginLeft: (SCREEN_WIDTH - screenWidth) / 2
        }}
      />
    );
  }

  renderContentError(events) {
    return events && <MessageError message={events.msg} />;
  }

  _handleGetCurrentItem = item => {
    this.setState({
      itemCurrentSlideID: item.ID
    });
  };

  _handleToggleMapView = () => {
    const { isMapVisibleAnimated, isMapVisible } = this.state;
    Animated.timing(isMapVisibleAnimated, {
      toValue: !isMapVisible ? 100 : 0,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.ease
    }).start(async () => {
      await wait(!isMapVisible ? 300 : 0);
      await this.setState({
        isMapVisible: !isMapVisible
      });
    });
  };

  _renderMapMarker = ({ item }) => {
    const { itemCurrentSlideID } = this.state;
    const { settings } = this.props;
    return (
      <IconMapMarker
        isFocus={itemCurrentSlideID === item.ID}
        imageUri={item.oFeaturedImg.thumbnail}
        backgroundTintColor={settings.colorPrimary}
      />
    );
  };

  _getTranslateStyle = () => {
    const { isMapVisibleAnimated } = this.state;
    return isMapVisibleAnimated.interpolate({
      inputRange: [0, 100],
      outputRange: [screenHeight, 0],
      extrapolate: "clamp"
    });
  };

  _getDataForMap = () => {
    const { events } = this.props;
    const results = events.oResults.filter(item => !!item.oAddress.address);
    return !_.isEmpty(results) ? getCoordinateFromListItem(results) : [];
  };

  _renderMapView = () => {
    const { events, loading, settings } = this.props;
    const { isMapVisible } = this.state;
    return (
      <Animated.View
        style={[
          styles.mapSliderWrap,
          {
            transform: [{ translateY: this._getTranslateStyle() }]
          }
        ]}
      >
        {!loading && isMapVisible ? (
          <MapSlider
            data={this._getDataForMap()}
            renderItem={this.renderItem({
              width: "100%",
              paddingHorizontal: 0
            })}
            onEndReached={this._handleEndReached(events.next)}
            mapMarkerKeyExtractor={item => item.ID.toString()}
            renderMapMarker={this._renderMapMarker}
            getCurrentItem={this._handleGetCurrentItem}
            mapZoom={settings.defaultMapZoom}
          />
        ) : (
          <Loader size="small" />
        )}
      </Animated.View>
    );
  };

  _renderButtonMapViewToggle = () => {
    const { settings } = this.props;
    const { isMapVisible } = this.state;
    return (
      <TouchableHighlight
        activeOpacity={0.9}
        underlayColor="#fff"
        onPress={this._handleToggleMapView}
        style={styles.openMapView}
      >
        {!isMapVisible ? (
          <IconMapMarker
            backgroundTintColor={settings.colorPrimary}
            imageContainerStyle={styles.iconOpenMapView}
          />
        ) : (
          <FontIcon
            name="fa fa-th-large"
            size={24}
            color={settings.colorPrimary}
          />
        )}
      </TouchableHighlight>
    );
  };

  _renderGrid = condition => {
    const { events, isEventRequestTimeout, loading, translations } = this.props;
    return (
      <View style={{ flex: 1, width: loading ? screenWidth : SCREEN_WIDTH }}>
        <ViewWithLoading {...this._getWithLoadingProps(loading)}>
          <RequestTimeoutWrapped
            isTimeout={isEventRequestTimeout && _.isEmpty(events.oResults)}
            onPress={this._getEvents}
            fullScreen={true}
            style={styles.requestTimeout}
            text={translations.networkError}
            buttonText={translations.retry}
          >
            {condition
              ? this.renderContentSuccess(events)
              : this.renderContentError(events)}
          </RequestTimeoutWrapped>
        </ViewWithLoading>
      </View>
    );
  };

  render() {
    const { events } = this.props;
    const { isMapVisible } = this.state;
    const condition = this._getEventSuccess(events);
    return (
      <View style={styles.container}>
        {this._renderMapView()}
        {!isMapVisible && this._renderGrid(condition)}
        {condition &&
          !_.isEmpty(this._getDataForMap()) &&
          this._renderButtonMapViewToggle()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    width: SCREEN_WIDTH,
    alignItems: "center"
  },
  openMapView: {
    position: "absolute",
    right: 8,
    bottom: 13 + bottomBarHeight,
    zIndex: 9,
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3
  },
  requestTimeout: {
    flex: 1,
    flexDirection: "row"
  },
  mapSliderWrap: {
    backgroundColor: colorGray1,
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 9,
    width: "100%",
    height: "100%"
  },
  iconOpenMapView: {
    width: 12,
    height: 12,
    top: 12,
    left: 12
  }
});

const mapStateToProps = state => ({
  events: state.events,
  loading: state.loading,
  locationList: state.locationList,
  categoryList: state.categoryList,
  translations: state.translations,
  isEventRequestTimeout: state.isEventRequestTimeout,
  nearByFocus: state.nearByFocus,
  locations: state.locations,
  settings: state.settings
});

const mapDispatchToProps = {
  getEvents,
  getEventsLoadmore
};

export default connect(mapStateToProps, mapDispatchToProps)(EventsContainer);
