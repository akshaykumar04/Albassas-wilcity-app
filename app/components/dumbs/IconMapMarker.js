import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  View,
  StyleSheet,
  Animated,
  Image,
  ViewPropTypes,
  Platform
} from "react-native";
import { WebView } from "react-native-webview";
import { ImageCover } from "../../wiloke-elements";
import Svg, { Path } from "react-native-svg";
const ANDROID = Platform.OS === "android";

export default class IconMapMarker extends PureComponent {
  static propTypes = {
    imageContainerStyle: ViewPropTypes.style,
    containerStyle: ViewPropTypes.style,
    imageUri: PropTypes.string,
    backgroundTintColor: PropTypes.string,
    isFocus: PropTypes.bool
  };

  state = {
    animation: new Animated.Value(0)
  };

  render() {
    const {
      containerStyle,
      backgroundTintColor,
      imageUri,
      isFocus,
      imageContainerStyle
    } = this.props;
    const { animation } = this.state;
    Animated.spring(animation, {
      toValue: 100,
      duration: 300,
      delay: 200,
      useNativeDriver: true
    }).start();
    const SCALE = this.state.animation.interpolate({
      inputRange: [0, 100],
      outputRange: isFocus ? [0.6, 1] : [1, 0.6],
      extrapolate: "clamp"
    });
    return (
      <Animated.View
        style={[
          styles.container,
          containerStyle,
          !ANDROID
            ? {
                transform: [{ scale: SCALE }]
              }
            : {}
        ]}
      >
        <View style={[styles.image, imageContainerStyle]}>
          {imageUri && <ImageCover src={imageUri} width="100%" height="100%" />}
        </View>
        <Svg width="36" height={`${36 / 0.731707317}`} viewBox="0 0 50.6 69.1">
          <Path
            fill={backgroundTintColor}
            d="M50.6 25.3C50.6 11.3 39.3 0 25.3 0S0 11.3 0 25.3C0 32 2.6 38.1 6.9 42.6c1.3 1.5 2.8 3 4.6 4.7 10.7 10.2 12.7 18.6 13.1 21.1.1.4.4.7.8.7s.7-.3.8-.7c.4-2.5 2.4-10.8 13.1-21 1.9-1.8 3.4-3.4 4.8-4.9 4-4.6 6.5-10.6 6.5-17.2z"
          />
        </Svg>
        <View style={styles.shadow} />
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 9,
    paddingBottom: 6,
    overflow: "hidden",
    transform: [
      {
        scale: 0.8
      }
    ]
  },
  image: {
    width: 32,
    height: 32,
    borderRadius: 50,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "#fff",
    position: "absolute",
    top: 2,
    left: 2,
    zIndex: 9
  },
  marker: {
    width: 36,
    height: 36 / 0.731707317
  },
  shadow: {
    position: "absolute",
    left: 5,
    bottom: -6,
    width: 26,
    height: 26,
    borderRadius: 50,
    backgroundColor: "#000",
    opacity: 0.3,
    zIndex: -1,
    transform: [
      {
        scaleY: 0.3
      }
    ]
  }
});
