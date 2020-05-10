import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  View,
  TouchableOpacity,
  TextInput,
  Animated,
  StyleSheet,
  ViewPropTypes,
  Text,
  Platform
} from "react-native";
import * as Consts from "../../../constants/styleConstants";
import { Feather } from "@expo/vector-icons";
import { RTL } from "../../functions/wilokeFunc";

/**
 * Constants
 */
const INPUT_FOCUS_TOP = 29;
const INPUT_BLUR_TOP = 3;
const INPUT_FOCUS_FONTSIZE = 12;
const INPUT_BLUR_FONTSIZE = 14;

/**
 * Create Component
 */
export default class InputMaterial extends PureComponent {
  /**
   * Prop Types
   */
  static propTypes = {
    ...TextInput.propTypes,
    placeholder: PropTypes.string,
    placeholderTextColor: PropTypes.string,
    style: ViewPropTypes.style,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    value: PropTypes.string,
    iconName: PropTypes.string,
    colorPrimary: PropTypes.string,
    clearTextEnabled: PropTypes.bool,
    required: PropTypes.bool,
    defaultValue: PropTypes.string
  };

  /**
   * Default Props
   */
  static defaultProps = {
    placeholder: "TextInput",
    placeholderTextColor: Consts.colorDark3,
    onFocus: () => {},
    onBlur: () => {},
    colorPrimary: Consts.colorPrimary,
    clearTextEnabled: true
  };

  /**
   * State
   */
  state = {
    isFocusAnim: new Animated.Value(INPUT_BLUR_TOP),
    isFocusAnimBorder: new Animated.Value(0),
    itemWidth: 0,
    isFocus: false
  };

  /**
   * Focus TextInput
   */
  _handleFocus = event => {
    Animated.timing(this.state.isFocusAnim, {
      toValue: INPUT_FOCUS_TOP,
      duration: 150
    }).start();
    Animated.timing(this.state.isFocusAnimBorder, {
      toValue: this.state.itemWidth
    }).start(() => {
      this.setState({
        isFocus: true
      });
    });
    this.props.onFocus(event);
  };

  /**
   * End Editting TextInput
   */
  _handleBlur = event => {
    const { value, defaultValue } = this.props;
    Animated.timing(this.state.isFocusAnim, {
      toValue: !event.nativeEvent.text ? INPUT_BLUR_TOP : INPUT_FOCUS_TOP,
      duration: 150
    }).start();
    Animated.timing(this.state.isFocusAnimBorder, {
      toValue: 0
    }).start(() => {
      this.setState({
        isFocus: false
      });
    });
    this.props.onBlur(event);
  };

  /**
   * Clear text
   */
  _handleClearText = () => {
    Animated.timing(this.state.isFocusAnim, {
      toValue: INPUT_BLUR_TOP,
      duration: 150
    }).start();
    Animated.timing(this.state.isFocusAnimBorder, {
      toValue: 0
    }).start(() => {
      this.setState({
        isFocus: false
      });
    });
    this.props.onClearText();
  };

  /**
   * Handle Animation Top For Placeholder
   */
  _handleAnimTop = () => {
    const { value, defaultValue } = this.props;
    return this.state.isFocusAnim.interpolate({
      inputRange: [0, INPUT_FOCUS_TOP - INPUT_BLUR_TOP],
      outputRange: [
        (!value && !defaultValue) ||
        (typeof value === undefined && typeof defaultValue === undefined)
          ? INPUT_FOCUS_TOP
          : INPUT_BLUR_TOP,
        INPUT_BLUR_TOP
      ],
      extrapolate: "clamp"
    });
  };

  /**
   * Handle Animation Size For Placeholder
   */
  _handleAnimSize = () => {
    const { value, defaultValue } = this.props;
    return this.state.isFocusAnim.interpolate({
      inputRange: [0, INPUT_FOCUS_TOP - INPUT_BLUR_TOP],
      outputRange: [
        (!value && !defaultValue) ||
        (typeof value === undefined && typeof defaultValue === undefined)
          ? INPUT_BLUR_FONTSIZE
          : INPUT_FOCUS_FONTSIZE,
        INPUT_FOCUS_FONTSIZE
      ],
      extrapolate: "clamp"
    });
  };

  /**
   * Get Width Container
   */
  _handleLayout = event => {
    this.setState({
      itemWidth: event.nativeEvent.layout.width
    });
  };

  /**
   * Render Placeholder
   */
  renderPlaceholder() {
    const { placeholderTextColor, placeholder, required } = this.props;
    return (
      <Animated.View
        style={[
          styles.placeholder,
          {
            top: this._handleAnimTop()
          }
        ]}
      >
        <Animated.Text
          style={{
            color: placeholderTextColor,
            fontSize: this._handleAnimSize(),
            textAlign: "left"
          }}
        >
          {placeholder}
          {required && (
            <Text style={{ color: Consts.colorQuaternary }}> *</Text>
          )}
        </Animated.Text>
      </Animated.View>
    );
  }

  /**
   * Render Border Animation
   */
  renderBorderAnimation() {
    return (
      <Animated.View
        style={[
          styles.borderAnimation,
          {
            width: this.state.isFocusAnimBorder,
            borderBottomColor: this.props.colorPrimary
          }
        ]}
      />
    );
  }

  /**
   * Render TextInput
   */
  renderTextInput() {
    const rtl = RTL();
    return (
      <TextInput
        {...this.props}
        style={[styles.input, rtl && { textAlign: "right" }]}
        underlineColorAndroid="transparent"
        selectionColor={this.props.colorPrimary}
        placeholder=""
        autoCorrect={false}
        onFocus={this._handleFocus}
        onBlur={this._handleBlur}
        defaultValue={this.props.defaultValue}
      />
    );
  }

  /**
   * Render Icon Right
   */
  renderRight() {
    const { value, clearTextEnabled, iconName } = this.props;
    return (
      <View style={styles.right}>
        {typeof value !== "undefined" && clearTextEnabled && value.length > 0 && (
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={this._handleClearText}
            style={styles.clear}
          >
            <Feather name={"x"} size={18} color={Consts.colorQuaternary} />
          </TouchableOpacity>
        )}
        {iconName && (
          <View style={{ height: 30, justifyContent: "center" }}>
            <Feather name={iconName} size={18} color={Consts.colorDark3} />
          </View>
        )}
      </View>
    );
  }

  /**
   * Render
   */
  render() {
    return (
      <View
        style={[styles.container, this.props.style]}
        onLayout={this._handleLayout}
      >
        {this.renderPlaceholder()}
        {this.renderBorderAnimation()}
        {this.renderTextInput()}
        {this.renderRight()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 9,
    borderBottomWidth: 2,
    borderBottomColor: Consts.colorDark5,
    marginBottom: 10,
    paddingRight: 20
  },
  input: {
    borderBottomWidth: 0,
    color: Consts.colorDark2,
    paddingTop: 25,
    paddingBottom: Platform.OS === "ios" ? 6 : 0,
    fontSize: INPUT_BLUR_FONTSIZE
  },
  placeholder: {
    position: "absolute",
    left: 0,
    top: INPUT_BLUR_TOP
  },
  borderAnimation: {
    position: "absolute",
    left: 0,
    bottom: -2,
    zIndex: 9,
    width: 0,
    height: 2,
    borderBottomWidth: 2
  },
  right: {
    position: "absolute",
    right: 0,
    bottom: 2,
    flexDirection: "row",
    alignItems: "center"
  },
  clear: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center"
  }
});
