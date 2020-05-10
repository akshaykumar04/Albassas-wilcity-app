import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  View,
  PanResponder,
  Animated,
  Easing,
  Text,
  StyleSheet,
  ViewPropTypes,
  ActivityIndicator
} from "react-native";
import * as Consts from "../../../constants/styleConstants";
// import * as Progress from "react-native-progress";

const ANIMATION_MAX = 100;
const ANIMATION_DURATION = 1000;
const TIME_TAB_DOUBLE = 300;

const COLOR_PRIMARY = Consts.colorPrimary;
const COLOR_SECONDARY = Consts.colorSecondary;
const COLOR_TERTIARY = Consts.colorTertiary;
const COLOR_QUATERNARY = Consts.colorQuaternary;
const COLOR_DARK = Consts.colorDark;
const COLOR_GRAY2 = Consts.colorGray2;
const COLOR_DARK1 = Consts.colorDark1;
const COLOR_DARK3 = Consts.colorDark3;
const ROUND = Consts.round;

export default class Button extends PureComponent {
  static propTypes = {
    block: PropTypes.bool,
    animation: PropTypes.bool,
    isLoading: PropTypes.bool,
    backgroundColor: PropTypes.oneOf([
      "primary",
      "secondary",
      "tertiary",
      "quaternary",
      "dark",
      "gray",
      "light"
    ]),
    color: PropTypes.oneOf(["dark", "dark3", "primary", "light"]),
    size: PropTypes.oneOf(["lg", "md", "sm", "xs"]),
    radius: PropTypes.oneOf(["round", "pill"]),
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string,
      PropTypes.bool
    ]),
    title: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string,
      PropTypes.bool
    ]),
    onPress: PropTypes.func,
    onPressIn: PropTypes.func,
    onPressOut: PropTypes.func,
    onDoublePress: PropTypes.func,
    style: ViewPropTypes.style,
    textStyle: Text.propTypes.style,
    colorPrimary: PropTypes.string,
    loadingColor: PropTypes.string,
    renderBeforeText: PropTypes.func
  };

  static defaultProps = {
    block: false,
    animation: true,
    isLoading: false,
    title: "Button",
    colorPrimary: COLOR_PRIMARY,
    loadingColor: "#fff",
    onPress: () => {},
    onPressIn: () => {},
    onPressOut: () => {},
    onDoublePress: () => {},
    renderBeforeText: () => {}
  };

  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
      prevTimestamp: 0,
      animation: new Animated.Value(0),
      position: new Animated.ValueXY(),
      isLoading: false
    };

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (event, gestureState) => true,
      onStartShouldSetPanResponderCapture: (event, gestureState) => true,
      onMoveShouldSetPanResponder: (event, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (event, gestureState) => true,
      onPanResponderGrant: this._handlePanResponderGrant,
      onPanResponderRelease: this._handlePanResponderRelease,
      onPanResponderTerminationRequest: (evt, gestureState) => false,
      onShouldBlockNativeResponder: (evt, gestureState) => true
    });
  }

  componentDidMount() {
    const { isLoading } = this.props;
    this.setState({ isLoading });
  }

  componentDidUpdate(prevProps) {
    const { isLoading } = this.props;
    if (isLoading !== prevProps.isLoading) {
      this.setState({ isLoading });
    }
  }

  _boundingCheck = (lx, ly, w, h) => {
    return lx > 0 && lx < w && ly > 0 && ly < h;
  };

  _handlePanResponderGrant = (event, gestureState) => {
    const { locationX, locationY } = event.nativeEvent;
    const { position, animation, width, height } = this.state;
    const { onPressIn } = this.props;
    position.setValue({
      x: locationX,
      y: locationY
    });
    Animated.timing(animation, {
      toValue: ANIMATION_MAX,
      duration: ANIMATION_DURATION,
      easing: Easing.inOut(Easing.ease),
      userNativeDriver: true
    }).start(() => {
      animation.setValue(0);
    });

    // onPressIn
    onPressIn(event);
  };

  _handlePanResponderRelease = (event, gestureState) => {
    const { onPress, onDoublePress, onPressOut } = this.props;
    const { width, height, prevTimestamp } = this.state;
    const { locationX, locationY, timestamp } = event.nativeEvent;

    if (this._boundingCheck(locationX, locationY, width, height)) {
      this.setState({ prevTimestamp: timestamp });
      if (timestamp - prevTimestamp <= TIME_TAB_DOUBLE) {
        onDoublePress(event);
      } else {
        onPress(event);
      }
      // onPressOut
      onPressOut(event);
    }
  };

  _setBackgroundColor = modifier => {
    switch (modifier) {
      case "primary":
        return { backgroundColor: this.props.colorPrimary };
      case "secondary":
        return { backgroundColor: COLOR_SECONDARY };
      case "tertiary":
        return { backgroundColor: COLOR_TERTIARY };
      case "quaternary":
        return { backgroundColor: COLOR_QUATERNARY };
      case "dark":
        return { backgroundColor: COLOR_DARK };
      case "gray":
        return { backgroundColor: COLOR_GRAY2 };
      case "light":
        return { backgroundColor: "#fff" };
      default:
        return {};
    }
  };

  _setColor = modifier => {
    switch (modifier) {
      case "dark":
        return { color: COLOR_DARK };
      case "dark3":
        return { color: COLOR_DARK3 };
      case "primary":
        return { color: this.props.colorPrimary };
      case "light":
        return { color: "#fff" };
      default:
        return {};
    }
  };

  _setPaddingSize = modifier => {
    switch (modifier) {
      case "lg":
        return styles.lg;
      case "md":
        return styles.md;
      case "sm":
        return styles.sm;
      case "xs":
        return styles.xs;
      default:
        return {};
    }
  };

  _setFontSize = modifier => {
    switch (modifier) {
      case "lg":
        return { fontSize: 14 };
      case "md":
        return { fontSize: 14 };
      case "sm":
        return { fontSize: 13 };
      case "xs":
        return { fontSize: 12 };
      default:
        return {};
    }
  };

  _radius = modifier => {
    switch (modifier) {
      case "round":
        return { borderRadius: ROUND };
      case "pill":
        return { borderRadius: 50 };
      default:
        return {};
    }
  };

  _getSizeButton = event => {
    const { width, height } = event.nativeEvent.layout;
    this.setState({ width, height });
  };

  renderAnimated() {
    const { width, height, position, animation } = this.state;
    const SCALE = animation.interpolate({
      inputRange: [0, ANIMATION_MAX],
      outputRange: [0.3, 1],
      extrapolate: "clamp"
    });
    const OPACITY = animation.interpolate({
      inputRange: [0, ANIMATION_MAX / 3, ANIMATION_MAX],
      outputRange: [0, 0.4, 0],
      extrapolate: "clamp"
    });
    return (
      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          width: width * 2,
          height: width * 2,
          top: -width,
          left: -width,
          borderRadius: width,
          backgroundColor: "#fff",
          opacity: OPACITY,
          transform: [
            ...position.getTranslateTransform(),
            {
              scale: SCALE
            }
          ]
        }}
      />
    );
  }

  renderText() {
    const { children, title, color, size, textStyle } = this.props;
    return (
      <Text
        style={[
          styles.text,
          this._setColor(color),
          this._setFontSize(size),
          textStyle
        ]}
      >
        {!!children ? children : title}
      </Text>
    );
  }

  render() {
    const {
      block,
      backgroundColor,
      radius,
      size,
      style,
      animation,
      loadingColor,
      renderBeforeText
    } = this.props;
    const { width, height, isLoading } = this.state;
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.row,
            this._setBackgroundColor(backgroundColor),
            this._setPaddingSize(size),
            this._radius(radius),
            {
              width: block ? "100%" : "auto"
            },
            style,
            {
              position: "relative",
              overflow: "hidden"
            }
          ]}
          onLayout={this._getSizeButton}
          {...this._panResponder.panHandlers}
        >
          {isLoading ? (
            <View style={styles.progress}>
              <ActivityIndicator size={18} />
              {/* <Progress.CircleSnail
                size={18}
                duration={800}
                spinDuration={2000}
                thickness={2}
                color={loadingColor}
              /> */}
            </View>
          ) : (
            <View style={styles.inner}>
              {renderBeforeText()}
              {this.renderText()}
            </View>
          )}
          {animation && this.renderAnimated()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexWrap: "wrap",
    alignItems: "flex-start",
    flexDirection: "row"
  },
  row: {
    flexDirection: "column",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 0,
    minWidth: 130
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center"
  },
  lg: {
    paddingVertical: 15,
    paddingHorizontal: 20
  },
  md: {
    paddingVertical: 11,
    paddingHorizontal: 20
  },
  sm: {
    paddingVertical: 9,
    paddingHorizontal: 18,
    minWidth: 100
  },
  xs: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    minWidth: 80
  },
  progress: {
    alignItems: "center",
    justifyContent: "center"
  }
});
