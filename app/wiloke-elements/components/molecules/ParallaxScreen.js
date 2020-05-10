import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  ViewPropTypes
} from "react-native";
import Constants from "expo-constants";
import { ImageCache } from "../atoms/ImageCache";

/**
 * Constants
 */
const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const STATUS_BAR_HEIGHT = Constants.statusBarHeight;
const SCROLL_EVENT_THROTTLE = 16;
const HEADER_MIN_HEIGHT = 52 + STATUS_BAR_HEIGHT;

/**
 * Component
 */
export default class ParallaxScreen extends Component {
  /**
   * propTypes
   */
  static propTypes = {
    renderContent: PropTypes.func.isRequired,
    renderHeaderLeft: PropTypes.func,
    renderHeaderCenter: PropTypes.func,
    renderHeaderRight: PropTypes.func,
    renderAfterImage: PropTypes.func,
    renderInsideImage: PropTypes.func,
    onGetScrollYAnimation: PropTypes.func,
    onScrollEndDrag: PropTypes.func,
    headerImageSource: PropTypes.string,
    overlayColor: PropTypes.string,
    overlayRange: PropTypes.arrayOf(PropTypes.number),
    containerStyle: ViewPropTypes.style,
    afterImageMarginTop: PropTypes.number,
    scrollViewRef: PropTypes.func,
    headerMaxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    backgroundHeader: PropTypes.string,
    bounces: PropTypes.bool
  };

  /**
   * defaultProps
   */
  static defaultProps = {
    renderContent: () => {},
    renderHeaderLeft: () => {},
    renderHeaderCenter: () => {},
    renderHeaderRight: () => {},
    renderInsideImage: () => {},
    onGetScrollYAnimation: () => {},
    scrollViewRef: () => {},
    onScrollEndDrag: () => {},
    overlayRange: [0.3, 0.8],
    overlayColor: "#000",
    afterImageMarginTop: 0,
    headerMaxHeight: SCREEN_HEIGHT / 2.5,
    bounces: true
  };

  /**
   * State
   */
  state = {
    scrollY: new Animated.Value(0),
    afterImageHeight: 80
  };

  componentDidMount() {
    this.props.onGetScrollYAnimation(this.state.scrollY, {
      headerMaxHeight: this.props.headerMaxHeight,
      headerMinHeight: HEADER_MIN_HEIGHT
    });
  }

  /**
   * get header distance
   */
  _getHeaderDistance = () => {
    const { headerMaxHeight } = this.props;
    return headerMaxHeight - HEADER_MIN_HEIGHT;
  };

  /**
   * style and animation for imageWrapper
   */
  _getImageWrapperStyles = () => {
    const { scrollY } = this.state;
    const translateY = scrollY.interpolate({
      inputRange: [0, this._getHeaderDistance()],
      outputRange: [0, -this._getHeaderDistance()],
      extrapolate: "clamp"
    });
    return {
      transform: [{ translateY }]
    };
  };

  /**
   * style and animation for overlay
   */
  _getOverlayStyles = reverse => {
    const { scrollY } = this.state;
    const { overlayRange, overlayColor } = this.props;
    const opacity = scrollY.interpolate({
      inputRange: [0, this._getHeaderDistance()],
      outputRange: reverse ? [0.3, 0] : overlayRange,
      extrapolate: "clamp"
    });
    return {
      opacity,
      backgroundColor: reverse ? "#000" : overlayColor
    };
  };

  _handleLayoutAfterImage = event => {
    this.setState({
      afterImageHeight: event.nativeEvent.layout.height
    });
  };

  /**
   * Render After Image
   */
  renderAfterImage() {
    const { renderAfterImage } = this.props;
    return (
      renderAfterImage && (
        <View
          style={{
            position: "relative",
            zIndex: 20,
            marginTop: this.props.afterImageMarginTop
          }}
          onLayout={this._handleLayoutAfterImage}
          renderToHardwareTextureAndroid={true}
          pointerEvents="none"
        >
          {renderAfterImage()}
        </View>
      )
    );
  }

  /**
   * style and animation for image
   */
  _getImageStyles = () => {
    const { scrollY } = this.state;
    const { headerMaxHeight } = this.props;
    const translateY = scrollY.interpolate({
      inputRange: [0, this._getHeaderDistance()],
      outputRange: [0, this._getHeaderDistance() / 2],
      extrapolate: "clamp"
    });
    const opacity = scrollY.interpolate({
      inputRange: [0, this._getHeaderDistance()],
      outputRange: [1, 0],
      extrapolate: "clamp"
    });
    const scale = scrollY.interpolate({
      inputRange: [-300, 0],
      outputRange: [1.5, 1],
      extrapolate: "clamp"
    });
    return {
      width: "100%",
      height: headerMaxHeight,
      transform: [{ translateY }, { scale }],
      opacity
    };
  };

  /**
   * Render Image
   */
  renderImage() {
    const { headerImageSource, renderInsideImage } = this.props;
    const { isDrag } = this.state;
    const preview = {
      uri: headerImageSource
    };
    const uri = headerImageSource;
    return (
      <Animated.View
        style={[styles.imageWrapper, this._getImageWrapperStyles()]}
        pointerEvents={isDrag ? "none" : "box-none"}
      >
        <View
          style={{
            position: "relative",
            overflow: "hidden",
            backgroundColor: "#fff"
          }}
        >
          <Animated.View
            pointerEvents="none"
            style={[styles.overlay, this._getOverlayStyles(false)]}
          />
          <Animated.View
            pointerEvents="none"
            style={[
              styles.overlay,
              { zIndex: 9 },
              this._getOverlayStyles(true)
            ]}
          />
          <Animated.View pointerEvents="none" style={this._getImageStyles()}>
            <ImageCache
              {...{ preview, uri }}
              tint="light"
              resizeMode="cover"
              style={{ width: "100%", height: "100%" }}
            />
          </Animated.View>

          <View style={styles.insideImage}>{renderInsideImage()}</View>
        </View>
        {this.renderAfterImage()}
      </Animated.View>
    );
  }

  /**
   * style and animation for headerCenter
   */
  _getHeaderCenterStyles = () => {
    const { scrollY } = this.state;
    const translateY = scrollY.interpolate({
      inputRange: [
        this._getHeaderDistance() - 10,
        this._getHeaderDistance() + 50
      ],
      outputRange: [HEADER_MIN_HEIGHT, 0],
      extrapolate: "clamp"
    });
    const opacity = scrollY.interpolate({
      inputRange: [
        this._getHeaderDistance() - 10,
        this._getHeaderDistance() + 50
      ],
      outputRange: [0, 1],
      extrapolate: "clamp"
    });
    return {
      transform: [{ translateY }],
      opacity
    };
  };

  /**
   * Render Header
   */
  renderHeader() {
    const {
      renderHeaderLeft,
      renderHeaderCenter,
      renderHeaderRight
    } = this.props;
    return (
      <Fragment>
        {this.renderImage()}
        <View style={[styles.header]}>
          <View style={styles.headerLeft}>{renderHeaderLeft()}</View>
          <Animated.View
            style={[styles.headerCenter, this._getHeaderCenterStyles()]}
          >
            {renderHeaderCenter()}
          </Animated.View>
          <View style={styles.headerRight}>{renderHeaderRight()}</View>
        </View>
      </Fragment>
    );
  }

  /**
   * Render Content
   */
  renderContent() {
    const { scrollY, afterImageHeight } = this.state;
    const {
      renderAfterImage,
      headerMaxHeight,
      afterImageMarginTop,
      bounces
    } = this.props;
    const translate = scrollY.interpolate({
      inputRange: [0, this._getHeaderDistance()],
      outputRange: [0, -afterImageHeight / 2],
      extrapolate: "clamp"
    });
    return (
      <Animated.ScrollView
        ref={this.props.scrollViewRef}
        scrollEventThrottle={SCROLL_EVENT_THROTTLE}
        showsVerticalScrollIndicator={false}
        bounces={bounces}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
        onScrollEndDrag={this.props.onScrollEndDrag}
        onMomentumScrollEnd={this.props.onMomentumScrollEnd}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: { y: scrollY }
              }
            }
          ],
          { useNativeDriver: true }
        )}
        style={{
          transform: [
            {
              translateY: renderAfterImage
                ? afterImageMarginTop === 0
                  ? afterImageHeight / 2
                  : translate
                : 0
            }
          ]
        }}
      >
        <Animated.View
          style={{
            paddingTop:
              headerMaxHeight + (renderAfterImage ? afterImageHeight / 2 : 0)
          }}
        />
        {this.props.renderContent()}
      </Animated.ScrollView>
    );
  }

  /**
   * Render Component
   */
  render() {
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        {this.renderHeader()}
        {this.renderContent()}
      </View>
    );
  }
}

/**
 * Style for component
 */
const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 9,
    backgroundColor: "#fff",
    minHeight: SCREEN_HEIGHT
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    paddingTop: STATUS_BAR_HEIGHT,
    height: HEADER_MIN_HEIGHT,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  headerCenter: {
    maxWidth: 200
  },
  imageWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9,
    overflow: "hidden"
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10
  },
  insideImage: {
    position: "absolute",
    left: 0,
    bottom: 0,
    zIndex: 11,
    paddingTop: 100
  }
});
