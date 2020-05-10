import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, Animated } from "react-native";
import { wait } from "../../functions/wilokeFunc";
import RnDatePicker from "react-native-datepicker";
import * as Consts from "../../../constants/styleConstants";
import { Feather } from "@expo/vector-icons";

/**
 * Constants
 */
const DATEPICKER_FOCUS_TOP = 22;
const DATEPICKER_BLUR_TOP = 0;
const DATEPICKER_FOCUS_FONTSIZE = 12;
const DATEPICKER_BLUR_FONTSIZE = 14;

export default class DatePicker extends Component {
  static propTypes = {
    ...RnDatePicker.propTypes,
    required: PropTypes.bool,
    placeholder: PropTypes.string,
    iconName: PropTypes.string,
    placeholderTextColor: PropTypes.string
  };

  static defaultProps = {
    onCloseModal: _ => {},
    onOpenModal: _ => {},
    onDateChange: _ => {},
    placeholderTextColor: Consts.colorDark3,
    duration: 300,
    iconName: "calendar"
  };

  state = {
    isFocusAnim: new Animated.Value(DATEPICKER_BLUR_TOP),
    date: ""
  };

  /**
   * Open Datepicker
   */
  _handleDatePickerOpen = _ => {
    const { duration } = this.props;
    Animated.timing(this.state.isFocusAnim, {
      toValue: DATEPICKER_FOCUS_TOP,
      duration
    }).start();
    this.props.onOpenModal();
  };

  _handleDatePickerChange = date => {
    this.setState({ date });
    this.props.onDateChange(date);
  };

  /**
   * Close Datepicker
   */
  _handleDatePickerClose = async _ => {
    const { duration } = this.props;
    await wait(duration);
    const { date } = this.state;
    Animated.timing(this.state.isFocusAnim, {
      toValue: !!date ? DATEPICKER_FOCUS_TOP : DATEPICKER_BLUR_TOP,
      duration
    }).start();
    this.props.onCloseModal();
  };

  /**
   * Handle Animation Top For Placeholder
   */
  _handleAnimTop = () => {
    return this.state.isFocusAnim.interpolate({
      inputRange: [0, DATEPICKER_FOCUS_TOP - DATEPICKER_BLUR_TOP],
      outputRange: [
        this.props.value === "" || typeof this.props.value === "undefined"
          ? DATEPICKER_FOCUS_TOP
          : DATEPICKER_BLUR_TOP,
        DATEPICKER_BLUR_TOP
      ],
      extrapolate: "clamp"
    });
  };

  /**
   * Handle Animation Size For Placeholder
   */
  _handleAnimSize = () => {
    return this.state.isFocusAnim.interpolate({
      inputRange: [0, DATEPICKER_FOCUS_TOP - DATEPICKER_BLUR_TOP],
      outputRange: [
        this.props.value === "" || typeof this.props.value === "undefined"
          ? DATEPICKER_BLUR_FONTSIZE
          : DATEPICKER_FOCUS_FONTSIZE,
        DATEPICKER_FOCUS_FONTSIZE
      ],
      extrapolate: "clamp"
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
            fontSize: this._handleAnimSize()
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
   * Render Icon Right
   */
  renderRight() {
    const { iconName } = this.props;
    return (
      <View style={styles.right}>
        {iconName && (
          <View style={{ height: 30, justifyContent: "center" }}>
            <Feather name={iconName} size={18} color={Consts.colorDark3} />
          </View>
        )}
      </View>
    );
  }

  render() {
    const { style } = this.props;
    return (
      <View style={styles.container}>
        {this.renderPlaceholder()}
        {this.renderRight()}
        <RnDatePicker
          {...this.props}
          style={[styles.datepicker, style]}
          placeholder=" "
          showIcon={false}
          customStyles={{
            dateInput: styles.dateInput,
            dateText: styles.dateText
          }}
          onCloseModal={this._handleDatePickerClose}
          onOpenModal={this._handleDatePickerOpen}
          onDateChange={this._handleDatePickerChange}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    borderBottomWidth: 2,
    borderColor: Consts.colorGray1,
    paddingTop: 2,
    marginVertical: 7
  },

  placeholder: {
    position: "absolute",
    left: 0,
    top: DATEPICKER_BLUR_TOP,
    marginTop: -3
  },

  right: {
    position: "absolute",
    right: 0,
    bottom: 2,
    flexDirection: "row",
    alignItems: "center"
  },

  datepicker: {
    width: "100%",
    padding: 0,
    margin: 0
  },

  dateInput: {
    borderWidth: 0,
    padding: 0,
    margin: 0,
    alignItems: "flex-start",
    justifyContent: "flex-end",
    paddingBottom: 4
  },

  dateText: {
    color: Consts.colorDark2,
    fontSize: DATEPICKER_BLUR_FONTSIZE
  }
});
