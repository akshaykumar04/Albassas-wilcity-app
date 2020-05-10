import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  Keyboard,
  StyleSheet,
  ViewPropTypes
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Consts from "../../../constants/styleConstants";
import stylesBase from "../../../stylesBase";

export default class CheckBox extends PureComponent {
  state = {
    isChecked: this.props.checked || false,
    animatedValue: new Animated.Value(0)
  };
  handleChecked = async () => {
    const { condition } = this.props;
    if (condition) {
      this.props.onPress(this.props.name, this.state.isChecked);
      return;
    }
    await this.setState({
      isChecked: !this.state.isChecked
    });
    this.props.onPress(this.props.name, this.state.isChecked);

    Keyboard.dismiss();
  };

  UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
    if (this.props.checked !== nextProps.checked) {
      console.log("nextProps", nextProps.checked);
      this.setState({
        isChecked: nextProps.checked
      });
    }
  }

  renderCircleAnimated(opts) {
    const { circleAnimatedSize, size, borderWidth } = this.props;
    return (
      <Animated.View
        style={[
          styles.circleAnimated,
          {
            width: circleAnimatedSize,
            height: circleAnimatedSize,
            borderRadius: circleAnimatedSize / 2,
            top: (size - borderWidth * 2 - circleAnimatedSize) / 2,
            left: (size - borderWidth * 2 - circleAnimatedSize) / 2
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
  renderIcon() {
    const { animatedValue, isChecked } = this.state;
    const {
      size,
      radius,
      borderWidth,
      iconColor,
      iconBackgroundColor
    } = this.props;
    const ANIMATED_ICON = animatedValue.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: "clamp"
    });
    return (
      <Animated.View
        style={[
          styles.icon,
          {
            opacity: ANIMATED_ICON,
            width: size,
            height: size,
            marginLeft: -borderWidth,
            marginTop: -borderWidth,
            borderRadius: radius,
            backgroundColor: iconBackgroundColor
          }
        ]}
      >
        <Feather name="check" size={size - 4} color={iconColor} />
      </Animated.View>
    );
  }
  renderContent() {
    const { animatedValue, isChecked } = this.state;
    const {
      size,
      radius,
      borderWidth,
      borderColor,
      circleAnimatedColor
    } = this.props;
    Animated.timing(animatedValue, {
      toValue: isChecked ? 100 : 0,
      duration: 300,
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
    return (
      <View
        style={[
          styles.inner,
          {
            width: size,
            height: size,
            borderRadius: radius,
            borderWidth: borderWidth,
            borderColor: borderColor
          }
        ]}
      >
        {this.renderIcon()}
        {this.renderCircleAnimated({
          opacity: () => ANIMATED_CIRCLE_OPACITY([0, 0, 1, 0]),
          scale: () => ANIMATED_CIRCLE_SCALE([0, 1]),
          backgroundColor: isChecked ? circleAnimatedColor[0] : "transparent"
        })}
        {this.renderCircleAnimated({
          opacity: () => ANIMATED_CIRCLE_OPACITY([0, 0.4, 0.7, 1]),
          scale: () => ANIMATED_CIRCLE_SCALE([1, 0]),
          backgroundColor: isChecked ? "transparent" : circleAnimatedColor[1]
        })}
      </View>
    );
  }
  renderLabel() {
    const { label, labelStyle } = this.props;
    return (
      <View style={{ width: "80%" }}>
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
                width: !label ? size : "auto",
                height: !label ? size : "auto",
                alignItems: "center",
                flexDirection: reverse ? "row-reverse" : "row",
                justifyContent: reverse ? "flex-end" : "space-between",
                opacity: 0.5
              },
              style
            ]}
          >
            {!!label && this.renderLabel()}
            {!!label && <View style={{ width: 5 }} />}
            {this.renderContent()}
          </View>
        ) : (
          <TouchableOpacity
            activeOpacity={1}
            onPress={this.handleChecked}
            style={[
              {
                width: !label ? size : "auto",
                height: !label ? size : "auto",
                alignItems: "center",
                flexDirection: reverse ? "row-reverse" : "row",
                justifyContent: reverse ? "flex-end" : "space-between"
              },
              style
            ]}
          >
            {!!label && this.renderLabel()}
            {!!label && <View style={{ width: 5 }} />}
            {this.renderContent()}
          </TouchableOpacity>
        )}
      </Fragment>
    );
  }
}

CheckBox.defaultProps = {
  size: 22,
  radius: Consts.round,
  borderWidth: 2,
  borderColor: "#c5cbd8",
  circleAnimatedSize: 50,
  checked: false,
  disabled: false,
  circleAnimatedColor: [Consts.colorDark4, Consts.colorPrimary],
  iconColor: "#fff",
  iconBackgroundColor: Consts.colorPrimary,
  onPress: () => {},
  condition: false
};

CheckBox.propTypes = {
  size: PropTypes.number,
  radius: PropTypes.number,
  borderWidth: PropTypes.number,
  borderColor: PropTypes.string,
  circleAnimatedSize: PropTypes.number,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  circleAnimatedColor: PropTypes.arrayOf(PropTypes.string),
  style: ViewPropTypes.style,
  iconColor: PropTypes.string,
  iconBackgroundColor: PropTypes.string,
  onPress: PropTypes.func,
  name: PropTypes.string,
  label: PropTypes.string,
  labelStyle: Text.propTypes.style,
  reverse: PropTypes.bool,
  condition: PropTypes.bool
};

const styles = StyleSheet.create({
  inner: {
    position: "relative",
    zIndex: 9,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  icon: {
    position: "relative",
    zIndex: 2,
    justifyContent: "center",
    alignItems: "center"
  },
  circleAnimated: {
    position: "absolute",
    zIndex: 1
  }
});
