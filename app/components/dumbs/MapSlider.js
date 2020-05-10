import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ViewPropTypes,
  Platform
} from "react-native";
import Carousel from "react-native-snap-carousel";
import MapView from "react-native-maps";
import _ from "lodash";
import { bottomBarHeight } from "../../wiloke-elements";
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const ASPECT_RATIO = SCREEN_WIDTH / SCREEN_HEIGHT;
const ITEM_WIDTH = SCREEN_WIDTH >= 440 ? 340 : SCREEN_WIDTH - 100;
const ANDROID = Platform.OS === "android";

/**
 * Hàm tính toán để lấy giá trị LatitudeDelta
 * @param {number} mapZoom Set mapZoom từ 1 đến 40 tương ứng với latitudeDelta chạy từ 0.001 đến 10
 */
const getLatitudeDelta = mapZoom => {
  const mapZoomMin = 1;
  const mapZoomMax = 40;
  const latDeltaMin = 0.001;
  const latDeltaMax = 20;
  // (40 - 1) * (20 - 0.001) / (40 - 1) + 0.001
  return {
    default: __ => {
      return (
        ((mapZoomMax - mapZoom) * (latDeltaMax - latDeltaMin)) /
          (mapZoomMax - mapZoomMin) +
        latDeltaMin
      );
    },
    reverse: __ => {
      return (
        ((mapZoom - mapZoomMin) * (latDeltaMax - latDeltaMin)) /
          (mapZoomMax - mapZoomMin) +
        latDeltaMin
      );
    }
  };
};

export default class MapSlider extends Component {
  static propTypes = {
    renderItem: PropTypes.func,
    onEndReached: PropTypes.func,
    renderMapMarker: PropTypes.func,
    getCurrentItem: PropTypes.func,
    mapMarkerKeyExtractor: PropTypes.func,
    data: PropTypes.array,
    containerStyle: ViewPropTypes.style,
    mapZoom: PropTypes.number
  };

  static defaultProps = {
    renderItem: __ => {},
    onEndReached: __ => {},
    renderMapMarker: __ => {},
    getCurrentItem: __ => {},
    mapMarkerKeyExtractor: (__, index) => index.toString(),
    mapZoom: 39.9
  };

  state = {
    currentIndex: null,
    isMapReady: false,
    isRefreshMapMarker: false
  };

  componentDidMount() {
    this._fixAndroid = setTimeout(
      () => {
        const { data, getCurrentItem, mapZoom } = this.props;
        const currentIndex = this._carousel && this._carousel.currentIndex;
        const firstItem = data[currentIndex];
        const { latitude, longitude } = firstItem.coordinate;
        this.latitudeDelta = getLatitudeDelta(mapZoom).default();
        this.longitudeDelta = this.latitudeDelta * ASPECT_RATIO;
        const { latitudeDelta, longitudeDelta } = this;
        this._mapView.animateToRegion(
          {
            latitude,
            longitude,
            latitudeDelta,
            longitudeDelta
          },
          300
        );
        this._setCurrentIndexTimeout = setTimeout(
          () => {
            this.setState({
              currentIndex,
              isRefreshMapMarker: true
            });
          },
          ANDROID ? 1000 : 0
        );
        getCurrentItem(firstItem);
      },
      ANDROID ? 1000 : 0
    );
  }

  componentWillUnmount() {
    clearTimeout(this._fixAndroid);
    clearTimeout(this._setLatLngDeltaFixAndroid);
    clearTimeout(this._setCurrentIndexTimeout);
  }

  _handleMapMarkerPress = (__, index) => __ => {
    this._carousel.snapToItem(index, true);
  };

  _handleMapLayout = __ => {
    // Fix for android (Error using newLatLngBounds)
    this.setState({
      isMapReady: true
    });
  };

  _renderMapMarker = (item, index) => {
    const { mapMarkerKeyExtractor } = this.props;
    const { latitude, longitude } = item.coordinate;
    const { currentIndex, isRefreshMapMarker } = this.state;
    return (
      <MapView.Marker
        key={mapMarkerKeyExtractor(item, index)}
        coordinate={{
          latitude,
          longitude
        }}
        onPress={this._handleMapMarkerPress(item, index)}
        zIndex={currentIndex === index ? 10 : 5}
        opacity={isRefreshMapMarker ? 1 : 0.99}
      >
        {this.props.renderMapMarker({ item, index })}
      </MapView.Marker>
    );
  };

  _handleSnapToItem = async index => {
    const { data, onEndReached, getCurrentItem } = this.props;
    const { latitudeDelta, longitudeDelta } = this;
    const item = data[index];
    const { currentIndex: prevCurrentIndex } = this.state;
    await this.setState({
      currentIndex: index
    });
    const { currentIndex } = this.state;
    const { latitude, longitude } = item.coordinate;
    this._mapView.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta,
        longitudeDelta
      },
      300
    );
    // Slide đến phần tử thứ 3 gần cuối thì sẽ chạy onEndReached
    if (data.length - 3 === index) {
      onEndReached();
    }
    // Check trường hợp không phải là next mà làm gì đó
    // chuyển xuống phần tử cuối thì cũng sẽ chạy onEndReached
    if (prevCurrentIndex + 1 < currentIndex && data.length - 1 === index) {
      onEndReached();
    }
    getCurrentItem(item);
  };

  _renderCarouselItem = ({ item, index }) => {
    const { renderItem } = this.props;
    return (
      <View style={styles.itemCarouselWrap}>{renderItem({ item, index })}</View>
    );
  };

  _renderCarousel = __ => {
    const { data } = this.props;
    return (
      <View style={styles.carouselWrap}>
        <Carousel
          ref={ref => (this._carousel = ref)}
          data={data}
          renderItem={this._renderCarouselItem}
          sliderWidth={SCREEN_WIDTH}
          itemWidth={ITEM_WIDTH}
          inactiveSlideScale={1}
          inactiveSlideOpacity={1}
          containerCustomStyle={{}}
          onSnapToItem={this._handleSnapToItem}
        />
      </View>
    );
  };

  _setLatLngDelta = region => {
    this._setLatLngDeltaFixAndroid = setTimeout(
      () => {
        this.latitudeDelta = region.latitudeDelta;
        this.longitudeDelta = region.longitudeDelta;
      },
      ANDROID ? 100 : 0
    );
  };

  _renderMap = __ => {
    const { data } = this.props;
    const { isMapReady } = this.state;
    return (
      <MapView
        ref={ref => (this._mapView = ref)}
        onRegionChangeComplete={this._setLatLngDelta}
        onLayout={this._handleMapLayout}
        tracksViewChanges={false}
        style={styles.map}
      >
        {isMapReady && data.map(this._renderMapMarker)}
      </MapView>
    );
  };

  render() {
    const { containerStyle } = this.props;
    return (
      <View style={[styles.container, containerStyle]}>
        {this._renderMap()}
        {this._renderCarousel()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    overflow: "hidden"
  },
  carouselWrap: {
    position: "absolute",
    bottom: bottomBarHeight,
    left: 0,
    right: 0,
    zIndex: 9
  },
  map: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    marginTop: -(SCREEN_HEIGHT / 3)
  },
  itemCarouselWrap: {
    paddingHorizontal: 10,
    paddingVertical: 10
  }
});
