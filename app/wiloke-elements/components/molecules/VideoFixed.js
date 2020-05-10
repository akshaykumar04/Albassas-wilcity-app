import React, { Component } from "react";
import {
  View,
  Text,
  Modal,
  Animated,
  PanResponder,
  Dimensions,
  StyleSheet
} from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const DURATION = 300;
const SWIPE_THRESHOLD = 120;
const VIDEO_MAX_WIDTH = SCREEN_WIDTH;
const VIDEO_MIN_WIDTH = SCREEN_WIDTH / 2;
const VIDEO_MAX_HEIGHT = VIDEO_MAX_WIDTH * 56.25 / 100;
const VIDEO_MIN_HEIGHT = VIDEO_MAX_HEIGHT / 2;

export default class VideoFixed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: true,
      position: new Animated.ValueXY()
    };

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: this._onPanResponderGrant,
      onPanResponderMove: this._onPanResponderMove,
      onPanResponderTerminationRequest: (evt, gestureState) => false,
      onPanResponderRelease: this._onPanResponderRelease
    });
  }

  _onPanResponderGrant = (event, gestureState) => {
    const { position } = this.state;
    position.setOffset({
      x: 0,
      y: position.y._value
    });
    position.setValue({
      x: 0,
      y: 0
    });
  };
  _onPanResponderMove = (event, gestureState) => {
    const { position } = this.state;
    const { dx: x, dy: y } = gestureState;
    position.setValue({
      x: 0,
      y
    });
  };
  _onPanResponderRelease = (event, gestureState) => {
    const { position } = this.state;
    const { dx: x, dy: y } = gestureState;
    position.flattenOffset();
    if (y < SWIPE_THRESHOLD) {
      this._resetPosition();
    } else if (y < -SWIPE_THRESHOLD) {
      this._resetPosition();
    } else {
      this._newPosition();
    }
  };

  _resetPosition = () => {
    const { position } = this.state;
    Animated.timing(position, {
      toValue: {
        x: 0,
        y: 0
      },
      duration: DURATION,
      userNativeDriver: true
    }).start(() => {
      position.setValue({
        x: 0,
        y: 0
      });
    });
  };

  _newPosition = () => {
    const { position } = this.state;
    Animated.timing(position, {
      toValue: {
        x: 0,
        y: SCREEN_HEIGHT
      },
      duration: DURATION,
      userNativeDriver: true
    }).start(() => {
      position.setValue({
        x: 0,
        y: SCREEN_HEIGHT
      });
    });
  };

  render() {
    const { modalVisible, position } = this.state;
    const MAX = SCREEN_HEIGHT - VIDEO_MAX_HEIGHT / 2;
    const WIDTH = position.y.interpolate({
      inputRange: [0, MAX],
      outputRange: [VIDEO_MAX_WIDTH, VIDEO_MIN_WIDTH],
      extrapolate: "clamp"
    });
    const HEIGHT = position.y.interpolate({
      inputRange: [0, MAX],
      outputRange: [VIDEO_MAX_HEIGHT, VIDEO_MAX_HEIGHT / 2],
      extrapolate: "clamp"
    });
    const OPACITY = position.y.interpolate({
      inputRange: [0, MAX - 300],
      outputRange: [1, 0],
      extrapolate: "clamp"
    });
    const WRAP_HEIGHT = position.y.interpolate({
      inputRange: [0, MAX],
      outputRange: [SCREEN_HEIGHT - 50, SCREEN_HEIGHT - MAX],
      extrapolate: "clamp"
    });
    return (
      <Animated.View
        style={[
          {
            position: "absolute",
            right: 0,
            bottom: 50,
            width: WIDTH,
            height: WRAP_HEIGHT
          },
          this.props.style
        ]}
      >
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            zIndex: 9,
            backgroundColor: "red",
            width: WIDTH,
            height: HEIGHT
          }}
          {...this._panResponder.panHandlers}
        />
        <Animated.View
          style={{
            backgroundColor: "#fff",
            opacity: OPACITY,
            paddingTop: HEIGHT,
            flex: 1
          }}
        >
          <Text>CONTENT...</Text>
        </Animated.View>
      </Animated.View>
    );
  }
}
