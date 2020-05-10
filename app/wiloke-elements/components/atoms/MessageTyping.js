import React, { PureComponent } from "react";
import { View, StyleSheet, Animated } from "react-native";
import * as Consts from "../../../constants/styleConstants";
import { ImageCache } from "./ImageCache";

export default class MessageTyping extends PureComponent {
  state = {
    animation: new Animated.Value(0)
  };

  _createAnimation = _ => {
    this.state.animation.setValue(0);
    Animated.timing(this.state.animation, {
      toValue: 100,
      duration: 1600,
      useNativeDriver: true
    }).start(_ => this._createAnimation());
  };

  componentDidMount() {
    this._createAnimation();
  }

  _getAnimation = _ => {
    return this.state.animation.interpolate({
      inputRange: [0, 50, 100],
      outputRange: [1, 0.4, 1],
      extrapolate: "clamp"
    });
  };

  render() {
    const { image, style } = this.props;
    const preview = {
      uri: image
    };
    const uri = image;
    return (
      <View style={[style, styles.container]}>
        <View style={styles.imageWrap}>
          <ImageCache
            {...{ preview, uri }}
            tint="light"
            resizeMode="cover"
            style={styles.image}
          />
        </View>
        <View style={styles.iconWrap}>
          <Animated.View
            style={[styles.item, { opacity: this._getAnimation() }]}
          />
          <Animated.View
            style={[styles.item, { opacity: this._getAnimation() }]}
          />
          <Animated.View
            style={[styles.item, { opacity: this._getAnimation() }]}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end"
  },
  imageWrap: {
    overflow: "hidden",
    marginBottom: 4,
    marginRight: 5,
    borderRadius: 12,
    width: 24,
    height: 24
  },
  iconWrap: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: Consts.colorGray2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  item: {
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: Consts.colorDark4,
    marginHorizontal: 2
  },
  image: {
    width: 24,
    height: 24
  }
});
