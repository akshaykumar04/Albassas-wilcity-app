import React, { PureComponent } from "react";
import {
  View,
  Text,
  Dimensions,
  Animated,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import Constants from "expo-constants";
import PropTypes from "prop-types";
import { colorPrimary } from "../../../../constants/styleConstants";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const SQUARE_SIZE = 30;
const SPRING_CONFIG = { tension: 2, friction: 50 };

export default class AnimatedRunning extends PureComponent {
  static propTypes = {
    springCongif: PropTypes.object,
    size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    startX: PropTypes.number,
    startY: PropTypes.number,
    toX: PropTypes.number,
    toY: PropTypes.number,
    containerStyles: PropTypes.object,
    renderContent: PropTypes.func
  };

  static defaultProps = {
    springCongif: SPRING_CONFIG,
    size: SQUARE_SIZE,
    startX: 100,
    startY: 100
  };

  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      moving: new Animated.ValueXY({ x: props.startX, y: props.startY }),
      animation: new Animated.Value(0)
    };
  }

  _startMovingIt = () => {
    const { moving, animation } = this.state;
    const { toX, toY, startX, startY } = this.props;
    Animated.sequence([
      Animated.parallel([
        Animated.spring(moving, {
          ...SPRING_CONFIG,
          toValue: { x: screenWidth - 50, y: Constants.statusBarHeight }
        }),
        Animated.timing(animation, {
          toValue: 100,
          duration: 350
        })
      ]),
      Animated.spring(moving, {
        ...SPRING_CONFIG,
        toValue: { x: 100, y: 100 }
      })
    ]).start(() => animation.setValue(0));
  };

  _getStyle = () => {
    const { moving, animation } = this.state;
    const opacity = animation.interpolate({
      inputRange: [0, 20, 40, 60, 80, 100],
      outputRange: [1, 0.8, 0.6, 0.4, 0.2, 0]
    });
    return {
      transform: moving.getTranslateTransform(),
      opacity
    };
  };

  _getOpacity = () => {
    return;
  };

  render() {
    const { containerStyles } = this.props;
    return this.props.renderContent(this._getStyle(), this._startMovingIt);
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  square: {
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
    backgroundColor: colorPrimary
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 40,
    backgroundColor: "#333"
  }
});
