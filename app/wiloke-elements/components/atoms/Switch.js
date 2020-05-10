import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  Keyboard,
  StyleSheet,
  ViewPropTypes,
  Platform
} from "react-native";
import * as Consts from "../../../constants/styleConstants";
import stylesBase from "../../../stylesBase";

const RATIO = 12 / 20;

export default class Switch extends PureComponent {
  static propTypes = {
    size: PropTypes.number,
    circleAnimatedSize: PropTypes.number,
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    reverse: PropTypes.bool,
    circleAnimatedColor: PropTypes.arrayOf(PropTypes.string),
    swipeActiveColor: PropTypes.string,
    swipeColor: PropTypes.string,
    name: PropTypes.string,
    label: PropTypes.string,
    labelStyle: Text.propTypes.style,
    style: ViewPropTypes.style,
    onPress: PropTypes.func,
    colorActive: PropTypes.string
  };

  static defaultProps = {
    size: 22,
    circleAnimatedSize: 50,
    checked: false,
    disabled: false,
    circleAnimatedColor: [Consts.colorDark4, Consts.colorPrimary],
    swipeActiveColor: Consts.colorPrimary,
    colorActive: Consts.colorPrimary,
    swipeColor: "#fff"
  };
  state = {
    isChecked: this.props.checked,
    animatedValue: new Animated.Value(0),
    duration: 0
  };
  componentDidUpdate(prevProps) {
    if (prevProps.checked !== this.props.checked) {
      this.setState({
        isChecked: this.props.checked
      });
    }
  }
  handleChecked = async () => {
    await this.setState({
      duration: 200,
      isChecked: !this.state.isChecked
    });
    typeof this.props.onPress === "function" &&
      this.props.onPress(this.props.name, this.state.isChecked);
    Keyboard.dismiss();
  };
  renderCircleAnimated(opts) {
    const { circleAnimatedSize, size } = this.props;
    return (
      <Animated.View
        style={[
          styles.circleAnimated,
          {
            width: circleAnimatedSize,
            height: circleAnimatedSize,
            borderRadius: circleAnimatedSize / 2,
            top: (size - circleAnimatedSize) / 2,
            left: (size - circleAnimatedSize) / 2
          },
          {
            opacity: opts.opacity(),
            transform: [
              {
                scaleX: opts.scale()
              },
              {
                scaleY: opts.scale()
              }
            ],
            backgroundColor: opts.backgroundColor
          }
        ]}
      />
    );
  }
  renderSwipe() {
    const { animatedValue, isChecked, duration } = this.state;
    const {
      size,
      swipeColor,
      swipeActiveColor,
      circleAnimatedColor
    } = this.props;
    Animated.timing(animatedValue, {
      toValue: isChecked ? 100 : 0,
      duration,
      useNativeDriver: true
    }).start();
    const ANIMATED_CIRCLE_OPACITY = outputRange => {
      return animatedValue.interpolate({
        inputRange: [0, 20, 40, 80],
        outputRange,
        extrapolate: "clamp"
      });
    };
    const ANIMATED_CIRCLE_SCALE = outputRange => {
      return animatedValue.interpolate({
        inputRange: [0, 80],
        outputRange,
        extrapolate: "clamp"
      });
    };
    const ANIMATED_SWIPE = animatedValue.interpolate({
      inputRange: [0, 80],
      outputRange: [0, size * RATIO * 3 - size],
      extrapolate: "clamp"
    });
    return (
      <Animated.View
        style={[
          styles.icon,
          {
            transform: [
              {
                translateX: ANIMATED_SWIPE
              }
            ],
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: Platform.OS === "ios" ? 0 : 1,
            borderColor: Consts.colorGray1,
            shadowColor: Consts.colorDark2,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.4,
            shadowRadius: 2,
            backgroundColor: isChecked ? swipeActiveColor : swipeColor
          }
        ]}
      >
        {Platform.OS === "ios" &&
          this.renderCircleAnimated({
            opacity: () => ANIMATED_CIRCLE_OPACITY([0, 0, 1, 0]),
            scale: () => ANIMATED_CIRCLE_SCALE([0, 1]),
            backgroundColor: isChecked ? circleAnimatedColor[0] : "transparent"
          })}
        {Platform.OS === "ios" &&
          this.renderCircleAnimated({
            opacity: () => ANIMATED_CIRCLE_OPACITY([0, 1, 0, 0]),
            scale: () => ANIMATED_CIRCLE_SCALE([1, 0]),
            backgroundColor: isChecked ? "transparent" : circleAnimatedColor[1]
          })}
      </Animated.View>
    );
  }
  renderContent() {
    const { animatedValue, isChecked } = this.state;
    const { size, circleAnimatedColor } = this.props;
    return (
      <View
        style={[
          styles.inner,
          {
            width: size * RATIO * 3,
            height: size
          }
        ]}
      >
        {this.renderSwipe()}
        <View
          style={{
            width: size * RATIO * 3,
            height: size * RATIO,
            borderRadius: (size * RATIO) / 2,
            backgroundColor: isChecked
              ? this.props.colorActive
              : Consts.colorDark2,
            opacity: 0.5
          }}
        />
      </View>
    );
  }
  renderLabel() {
    const { label, labelStyle } = this.props;
    return (
      <View style={{ width: "60%" }}>
        <Text
          style={[
            {
              color: Consts.colorDark3
            },
            labelStyle
          ]}
        >
          {label}
        </Text>
      </View>
    );
  }
  render() {
    const { size, style, disabled, label, reverse } = this.props;
    return (
      <Fragment>
        {disabled ? (
          <View
            style={[
              {
                width: !label ? size * RATIO * 3 : "auto",
                height: !label ? size : "auto",
                alignItems: "center",
                flexDirection: reverse ? "row-reverse" : "row",
                justifyContent: reverse ? "flex-end" : "space-between",
                opacity: 0.5
              },
              style
            ]}
          >
            {this.renderLabel()}
            <View style={{ width: 5 }} />
            {this.renderContent()}
          </View>
        ) : (
          <TouchableOpacity
            activeOpacity={1}
            onPress={this.handleChecked}
            style={[
              {
                width: !label ? size * RATIO * 3 : "auto",
                height: !label ? size : "auto",
                alignItems: "center",
                flexDirection: reverse ? "row-reverse" : "row",
                justifyContent: reverse ? "flex-end" : "space-between"
              },
              style
            ]}
          >
            {this.renderLabel()}
            <View style={{ width: 5 }} />
            {this.renderContent()}
          </TouchableOpacity>
        )}
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  inner: {
    position: "relative",
    zIndex: 9,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  icon: {
    position: "absolute",
    zIndex: 2,
    top: 0,
    left: 0
  },
  circleAnimated: {
    position: "absolute",
    zIndex: 1
  }
});
