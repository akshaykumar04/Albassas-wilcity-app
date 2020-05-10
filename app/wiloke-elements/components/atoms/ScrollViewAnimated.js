import React, { Component } from "react";
import PropTypes from "prop-types";
import { Animated, ScrollView } from "react-native";

export default class ScrollViewAnimated extends Component {
  static propTypes = {
    ...ScrollView.propTypes,
    onScroll: PropTypes.func,
    onScrollAnimation: PropTypes.func
  };
  static defaultProps = {
    onScroll: () => {},
    onScrollAnimation: () => {}
  };
  render() {
    const {
      children,
      onScroll,
      onScrollAnimation,
      ...myScrollViewProps
    } = this.props;
    return (
      <Animated.ScrollView {...myScrollViewProps}>
        {children}
      </Animated.ScrollView>
    );
  }
}
