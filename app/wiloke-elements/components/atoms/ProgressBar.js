import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, Animated, StyleSheet } from "react-native";
import * as Consts from "../../../constants/styleConstants";

const TRACK_COLOR_DEFAULT = Consts.colorPrimary;
const PROGRESS_COLOR_DEFAULT = Consts.colorGray1;

export default class ProgressBar extends PureComponent {
  static propTypes = {
    tintColorTrack: PropTypes.string,
    tintColorProgress: PropTypes.string,
    duration: PropTypes.number,
    value: PropTypes.number,
    maxValue: PropTypes.number,
    onLayout: PropTypes.func
  };

  static defaultProps = {
    tintColorTrack: TRACK_COLOR_DEFAULT,
    tintColorProgress: PROGRESS_COLOR_DEFAULT,
    onLayout: () => {},
    value: 50,
    maxValue: 100,
    duration: 1000
  };

  state = {
    width: 0,
    animation: new Animated.Value(0)
  };

  _handleLayout = event => {
    const { width } = event.nativeEvent.layout;
    this.setState({ width });
    this.props.onLayout(event);
  };

  _handleAnimation = () => {
    const { value, maxValue, duration } = this.props;
    const { animation } = this.state;
    this._container.measure((x, y, width) => {
      Animated.timing(animation, {
        toValue: (value * width) / maxValue,
        duration,
        userNativeDriver: true
      }).start();
    });
  };

  componentDidMount() {
    setTimeout(this._handleAnimation, 1000);
  }

  render() {
    const { tintColorTrack, tintColorProgress } = this.props;
    const { animation } = this.state;
    return (
      <View
        ref={ref => (this._container = ref)}
        style={[
          styles.container,
          { backgroundColor: tintColorProgress, height: 5 }
        ]}
      >
        <Animated.View
          style={[
            styles.bar,
            {
              backgroundColor: tintColorTrack,
              transform: [{ translateX: animation }]
            }
          ]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "hidden"
  },
  bar: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: "-100%"
  }
});
