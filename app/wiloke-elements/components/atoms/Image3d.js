import React, { PureComponent } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Image,
  Text,
  Animated
} from "react-native";
import ImageProgress from "react-native-image-progress";
import { Accelerometer } from "expo";

const round = n => {
  if (!n) {
    return 0;
  }

  return Math.floor(n * 100) / 100;
};

export default class Image3d extends PureComponent {
  state = {
    y: "",
    // animations: Array(4).fill(new Animated.ValueXY())
    animation0: new Animated.ValueXY(),
    animation1: new Animated.ValueXY(),
    animation2: new Animated.ValueXY(),
    animation3: new Animated.ValueXY()
  };

  componentDidMount() {
    Accelerometer.addListener(({ x, y }) => {
      this.state.animation0.setValue({
        x: round(x) * 100,
        y: round(y + 0.7) * 100
      });
      this.state.animation1.setValue({
        x: round(x) * 80,
        y: round(y + 0.7) * 80
      });
      this.state.animation2.setValue({
        x: round(x) * 60,
        y: round(y + 0.7) * 60
      });
      this.state.animation3.setValue({
        x: round(x) * 40,
        y: round(y + 0.7) * 40
      });
    });
  }

  _getSize = (width, percent) => {
    return typeof width === "number" ? (width * percent) / 100 : `${percent}%`;
  };

  _getStyleImage = index => {
    const { width, height } = this.props;
    switch (index) {
      case 0:
        return {
          width: this._getSize(width, 120),
          height: this._getSize(height, 120),
          top: this._getSize(width, -10),
          left: this._getSize(height, -10),
          transform: [...this.state.animation0.getTranslateTransform()]
        };
      case 1:
        return {
          width: this._getSize(width, 90),
          height: this._getSize(height, 90),
          top: this._getSize(width, 5),
          left: this._getSize(height, 5),
          transform: [...this.state.animation1.getTranslateTransform()]
        };
      case 2:
        return {
          width: this._getSize(width, 80),
          height: this._getSize(height, 80),
          top: this._getSize(width, 10),
          left: this._getSize(height, 10),
          transform: [...this.state.animation2.getTranslateTransform()]
        };
      case 3:
        return {
          width: this._getSize(width, 70),
          height: this._getSize(height, 70),
          top: this._getSize(width, 15),
          left: this._getSize(height, 15),
          transform: [...this.state.animation3.getTranslateTransform()]
        };
      default:
        return {};
    }
  };

  _renderImage = (_, index) => {
    const { source, width, height } = this.props;
    return (
      <Animated.View
        key={index.toString()}
        style={[
          this._getStyleImage(index),
          styles.image,
          styles[`image${index}`],
          {
            zIndex: index
          }
        ]}
      >
        <Image source={source} resizeMode="cover" style={{ width, height }} />
      </Animated.View>
    );
  };

  render() {
    const { width, height } = this.props;
    return (
      <View style={[{ width, height }, styles.container]}>
        {Array(4)
          .fill(null)
          .map(this._renderImage)}
        <Text>{round(this.state.y)}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    position: "relative",
    overflow: "hidden"
  },
  image: {
    position: "absolute",
    borderColor: "red",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center"
  }
});
