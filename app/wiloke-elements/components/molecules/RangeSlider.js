import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  PanResponder,
  Animated,
  Easing,
  StyleSheet,
  ViewPropTypes
} from "react-native";
import * as Consts from "../../../constants/styleConstants";
import { RTL } from "../../functions/wilokeFunc";

const THUMB_TINTCOLOR_DEFAULT = Consts.colorPrimary;
const FILL_LOWER_TINTCOLOR_DEFAULT = Consts.colorPrimary;
const TRACK_TINTCOLOR_DEFAULT = Consts.colorDark5;
const LABEL_TINTCOLOR_DEFAULT = Consts.colorDark3;
const RESULT_TINTCOLOR_DEFAULT = Consts.colorDark2;

export default class RangeSlider extends Component {
  static propTypes = {
    minValue: PropTypes.number,
    maxValue: PropTypes.number,
    defaultValue: PropTypes.number,
    thumbSize: PropTypes.number,
    onChangeValue: PropTypes.func,
    onBeginChangeValue: PropTypes.func,
    onEndChangeValue: PropTypes.func,
    disabled: PropTypes.bool,
    showLabel: PropTypes.bool,
    showResult: PropTypes.bool,
    label: PropTypes.string,
    trackTintColor: PropTypes.string,
    thumbTintColor: PropTypes.string,
    fillLowerTintColor: PropTypes.string,
    fillLowerStyle: ViewPropTypes.style,
    trackStyle: ViewPropTypes.style,
    sliderStyle: ViewPropTypes.style
  };
  static defaultProps = {
    minValue: 0,
    maxValue: 500,
    defaultValue: 0,
    thumbSize: 24,
    onChangeValue: () => {},
    onBeginChangeValue: () => {},
    onEndChangeValue: () => {},
    disabled: false,
    showLabel: true,
    showResult: true,
    label: "Slider",
    thumbTintColor: THUMB_TINTCOLOR_DEFAULT,
    trackTintColor: TRACK_TINTCOLOR_DEFAULT,
    fillLowerTintColor: FILL_LOWER_TINTCOLOR_DEFAULT
  };
  constructor(props) {
    super(props);
    this.state = {
      position: new Animated.ValueXY(),
      maxWidth: 1,
      minWidth: 0,
      value: 0,
      trackHeight: 0,
      isLoading: true
    };

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (event, gestureState) => true,
      onStartShouldSetPanResponderCapture: (event, gestureState) => true,
      onMoveShouldSetPanResponder: (event, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (event, gestureState) => true,
      onPanResponderGrant: this._onPanResponderGrant,
      onPanResponderMove: this._onPanResponderMove,
      onPanResponderRelease: this._onPanResponderRelease,
      onPanResponderTerminationRequest: (evt, gestureState) => false,
      onShouldBlockNativeResponder: (evt, gestureState) => true
    });
  }

  _startUpdate = () => {
    const { position, minWidth } = this.state;
    const { defaultValue, maxValue, minValue, thumbSize } = this.props;
    this._track.measureInWindow((fx, fy, width, height) => {
      const maxWidth = width > thumbSize ? width - thumbSize : width;
      const x =
        minWidth +
        ((defaultValue - minValue) * maxWidth) / (maxValue - minValue);
      this.setState(
        {
          value: defaultValue,
          maxWidth,
          trackHeight: height
        },
        () => {
          position.setValue({
            x,
            y: 0
          });
        }
      );
    });
  };

  componentDidMount() {
    setTimeout(() => {
      this._startUpdate();
      this.setState({
        isLoading: false
      });
    }, 1000);
  }

  _onPanResponderGrant = (event, gestureState) => {
    const { position, value } = this.state;
    const { onBeginChangeValue } = this.props;
    const { _value } = position.x;
    position.setOffset({
      x: _value,
      y: 0
    });
    position.setValue({
      x: 0,
      y: 0
    });
    console.log({ position });

    // Called when the user drag the thumb
    onBeginChangeValue(event, value, gestureState);
  };

  _onPanResponderMove = (event, gestureState) => {
    const { position, maxWidth, minWidth } = this.state;
    const { minValue, maxValue, disabled, onChangeValue } = this.props;
    const { dx, dy: y } = gestureState;
    const rtl = RTL();

    const x = rtl ? -dx : dx;

    if (!disabled) {
      position.setValue({ x, y: 0 });

      const { _offset, _value } = position.x;
      const currentX = _offset + _value;

      let value = Math.floor((currentX * (maxValue - minValue)) / maxWidth);
      if (value < minWidth) {
        value = minWidth;
      } else if (value > maxValue - minValue) {
        value = maxValue - minValue;
      }
      this.setState({
        value: value + minValue
      });

      // Called when the user drag the thumb
      onChangeValue(value + minValue);
    }
  };

  _onPanResponderRelease = (event, gestureState) => {
    const { position, maxWidth, minWidth, value } = this.state;
    const { onEndChangeValue, minValue } = this.props;
    position.flattenOffset();
    const { _value } = position.x;
    let x = _value;
    if (_value < minWidth) {
      x = minWidth;
    } else if (_value > maxWidth) {
      x = maxWidth;
    }
    position.setValue({
      x,
      y: 0
    });

    // Called when the user stops dragging
    onEndChangeValue(event, value, gestureState);
  };

  _ANIMATED_TRANSLATE_X = () => {
    const { maxWidth, position } = this.state;
    if (maxWidth !== 0)
      return position.x.interpolate({
        inputRange: [0, maxWidth],
        outputRange: [0, RTL() ? -maxWidth : maxWidth],
        extrapolate: "clamp"
      });
    else return 10;
  };

  renderLabel() {
    const { label, labelTextStyle, labelStyle } = this.props;
    return (
      <View
        style={[
          {
            marginBottom: 4
          },
          labelStyle
        ]}
      >
        <Text
          style={[
            {
              fontSize: 13,
              color: LABEL_TINTCOLOR_DEFAULT
            },
            labelTextStyle
          ]}
        >
          {label}
        </Text>
      </View>
    );
  }

  renderResult() {
    const { value } = this.state;
    const { thumbSize, resultTextStyle, resultStyle } = this.props;
    return (
      <View
        style={[
          resultStyle,
          {
            paddingBottom: thumbSize / 2 + 5
          }
        ]}
      >
        <Text
          style={[
            {
              color: RESULT_TINTCOLOR_DEFAULT,
              fontSize: 14
            },
            resultTextStyle
          ]}
        >
          {value}
        </Text>
      </View>
    );
  }

  renderHeader() {
    const { value } = this.state;
    const { showLabel, showResult, customHeader } = this.props;
    if (customHeader) return customHeader(value);
    return (
      <View>
        <View>
          {showLabel && this.renderLabel()}
          {showResult && this.renderResult()}
        </View>
      </View>
    );
  }

  renderThumb() {
    const { trackHeight, isLoading } = this.state;
    const { thumbSize, thumbTintColor } = this.props;
    return (
      <Animated.View
        {...this._panResponder.panHandlers}
        style={[
          {
            position: "absolute",
            top: -(thumbSize - trackHeight) / 2,
            left: 0,
            zIndex: 5,
            width: thumbSize,
            height: thumbSize,
            borderRadius: thumbSize / 2,
            opacity: isLoading ? 0 : 1,
            transform: [
              {
                translateX: this._ANIMATED_TRANSLATE_X()
              }
            ]
          }
        ]}
      >
        <View
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            borderRadius: thumbSize / 2,
            backgroundColor: thumbTintColor,
            opacity: 0.5
          }}
        />
        <View
          style={{
            position: "absolute",
            width: "50%",
            height: "50%",
            top: "25%",
            left: "25%",
            borderRadius: thumbSize / 4,
            backgroundColor: thumbTintColor
          }}
        />
      </Animated.View>
    );
  }

  renderFillLower() {
    const { fillLowerStyle, thumbSize, fillLowerTintColor } = this.props;
    return (
      <View style={styles.fillLowerWrapper}>
        <Animated.View
          style={[
            styles.fillLower,
            fillLowerStyle,
            {
              marginLeft: thumbSize / 2,
              backgroundColor: fillLowerTintColor,
              transform: [{ translateX: this._ANIMATED_TRANSLATE_X() }]
            }
          ]}
        />
      </View>
    );
  }

  renderTrack() {
    const { trackStyle, trackTintColor, disabled, thumbSize } = this.props;
    const { isLoading } = this.state;
    return (
      <View
        style={{
          position: "relative"
        }}
      >
        {this.renderThumb()}
        <View
          ref={ref => (this._track = ref)}
          style={[
            styles.track,
            trackStyle,
            {
              backgroundColor: trackTintColor,
              marginBottom: thumbSize / 2,
              opacity: disabled ? 0.6 : 1,
              zIndex: 4
            }
          ]}
        >
          {!isLoading && this.renderFillLower()}
        </View>
      </View>
    );
  }

  render() {
    const { sliderStyle } = this.props;
    return (
      <View style={[styles.slider, sliderStyle]}>
        {this.renderHeader()}
        {this.renderTrack()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  slider: {
    marginBottom: 15
  },
  track: {
    position: "relative",
    height: 2
  },
  fillLowerWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    overflow: "hidden",
    zIndex: -1
  },
  fillLower: {
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%"
  }
});
