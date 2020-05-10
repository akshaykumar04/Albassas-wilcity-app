import React, { PureComponent } from "react";
import { Text, View, Animated, StyleSheet } from "react-native";

export default class AnimatedView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      animation: new Animated.Value(0)
    };
  }

  componentDidMount() {
    this._startAnimation();
  }

  _startAnimation = () => {
    const { animation } = this.state;
    Animated.timing(animation, {
      duration: 500,
      useNativeDriver: true,
      toValue: 100
    }).start();
  };

  _getStylesView = () => {
    const { animation } = this.state;
    const opacity = animation.interpolate({
      inputRange: [0, 50, 100],
      outputRange: [0, 0.4, 1],
      extrapolate: "clamp"
    });
    return {
      opacity
    };
  };

  render() {
    const { children, viewProps, containerStyle } = this.props;
    return (
      <Animated.View
        style={[this._getStylesView(), styles.container]}
        {...this.props}
      >
        {children}
      </Animated.View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
