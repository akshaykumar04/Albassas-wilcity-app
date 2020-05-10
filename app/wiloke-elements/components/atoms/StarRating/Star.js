import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Image
} from "react-native";
import PropTypes from "prop-types";

const STAR_IMAGE = require("./images/airbnb-star.png");
const STAR_SELECTED_IMAGE = require("./images/airbnb-star-selected.png");
const STAR_SIZE = 40;

export default class Star extends PureComponent {
  static propTypes = {
    size: PropTypes.number,
    selectedColor: PropTypes.string,
    isDisabled: PropTypes.bool,
    position: PropTypes.number,
    starSelectedInPosition: PropTypes.func
  };

  static defaultProps = {
    size: STAR_SIZE,
    selectedColor: "#f1c40f"
  };

  state = {
    selected: false,
    springValue: new Animated.Value(1)
  };

  _onSpring = () => {
    const { springValue } = this.state;
    const { position, starSelectedInPosition } = this.props;
    springValue.setValue(1.2);
    Animated.spring(springValue, {
      toValue: 1,
      friction: 2,
      tension: 1,
      useNativeDriver: true
    }).start();
    this.setState({ selected: !this.state.selected });
    starSelectedInPosition(position);
  };

  render() {
    const { fill, size, selectedColor, isDisabled } = this.props;
    const { springValue } = this.state;
    const starSource =
      fill && selectedColor === null ? STAR_SELECTED_IMAGE : STAR_IMAGE;
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={this._onSpring}
        disabled={isDisabled}
      >
        <Animated.Image
          source={starSource}
          style={[
            styles.starStyle,
            {
              tintColor: fill && selectedColor ? selectedColor : undefined,
              width: size,
              height: size,
              transform: [{ scale: springValue }]
            }
          ]}
        />
      </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
  starStyle: {
    margin: 3
  }
});
