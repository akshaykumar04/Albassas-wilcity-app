import React, { PureComponent } from "react";
import { Text, View, StyleSheet, Animated } from "react-native";
import _ from "lodash";
import PropTypes from "prop-types";
import Star from "./Star";

const fractionsType = (props, propName, componentName) => {
  if (props[propName]) {
    const value = props[propName];
    if (typeof value === "number") {
      return value >= 0 && value <= 20
        ? null
        : new Error(
            `\`${propName}\` in \`${componentName}\` must be between 0 and 20`
          );
    }

    return new Error(
      `\`${propName}\` in \`${componentName}\` must be a number`
    );
  }
};

export default class AirbnbStar extends PureComponent {
  static propTypes = {
    startingValue: PropTypes.number,
    ratingCount: PropTypes.number,
    onFinishRating: PropTypes.func,
    showRating: PropTypes.bool
  };

  static defaultProps = {
    startingValue: 3,
    ratingCount: 5,
    onFinishRating: () => {},
    showRating: true
  };

  state = {
    position: 5
  };

  componentDidMount() {
    const { startingValue } = this.props;
    this.setState({
      position: startingValue
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.startingValue !== this.props.startingValue) {
      this.setState({ position: nextProps.startingValue });
    }
  }

  _renderStar = arr => {
    return _.map(arr, (star, index) => star);
  };

  starSelectedInPosition = position => {
    const { onFinishRating } = this.props;
    onFinishRating(position);
    this.setState({ position });
  };

  render() {
    const { position } = this.state;
    const { count, showRating } = this.props;
    const rating_arr = [];
    _.times(count, index => {
      rating_arr.push(
        <Star
          key={index}
          position={index + 1}
          starSelectedInPosition={this.starSelectedInPosition}
          fill={position >= index + 1}
          {...this.props}
        />
      );
    });
    return (
      <View style={styles.ratingContainer}>
        <View style={styles.starContainer}>{this._renderStar(rating_arr)}</View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  ratingContainer: {
    backgroundColor: "transparent",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  starContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  }
});
