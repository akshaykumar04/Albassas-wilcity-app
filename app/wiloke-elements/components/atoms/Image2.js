import React, { PureComponent } from "react";
import {
  View,
  Image as RNImage,
  InteractionManager,
  ImageProps as ImageRNProps,
  StyleSheet,
  Platform
} from "react-native";
import _ from "lodash";
import { Image as ImageCache } from "react-native-expo-image-cache";
import stylesBase from "../../../stylesBase";

const DEFAULT_IMAGE =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA9JREFUeNpifvfuHUCAAQAFpALOO255kgAAAABJRU5ErkJggg==";

const ANDROID = Platform.OS === "android";

export default class Image2 extends PureComponent {
  static defaultProps = {
    preview: DEFAULT_IMAGE,
    uri: DEFAULT_IMAGE,
    percentRatio: "",
    containerStyle: {},
    resizeMode: "cover"
  };

  state = {
    percentRatio: "75%"
  };

  componentDidMount() {
    const { percentRatio } = this.props;
    if (!!percentRatio) {
      this.setState({
        percentRatio
      });
    }
  }

  _handleLoadEnd = () => {
    const { percentRatio, uri } = this.props;
    if (!percentRatio) {
      RNImage.getSize(
        uri,
        this._handleGetImageSizeSuccess,
        this._handleGetImageSizeFailed
      );
    }
  };

  _handleGetImageSizeSuccess = (width, height) => {
    this.setState({
      percentRatio: `${(height / width) * 100}%`
    });
  };

  _handleGetImageSizeFailed = () => {
    console.log("Image getSize failed");
    cancelAnimationFrame(this._req);
  };

  _checkHeight = () => {
    const { containerStyle } = this.props;
    if (!Array.isArray(containerStyle)) {
      return _.get(containerStyle, "height");
    }
    return containerStyle.reduce((acc, cur) => {
      return typeof cur.height === "number" || typeof cur.height === "string"
        ? true
        : acc;
    }, false);
  };

  render() {
    const { preview, uri, containerStyle, ...otherProps } = this.props;
    const { percentRatio } = this.state;
    return (
      <View
        style={[
          styles.container,
          ...(Array.isArray(containerStyle)
            ? containerStyle
            : [containerStyle]),
          { width: otherProps.width, height: otherProps.height }
        ]}
      >
        {!this._checkHeight() && (
          <View style={{ flex: 1, paddingTop: percentRatio }} />
        )}
        {!ANDROID ? (
          <ImageCache
            style={stylesBase.absFull}
            preview={{ uri: preview }}
            uri={uri}
            onLoadEnd={this._handleLoadEnd}
            {...otherProps}
          />
        ) : (
          <RNImage
            source={{ uri }}
            style={[stylesBase.absFull]}
            onLoadEnd={this._handleLoadEnd}
            resizeMode="cover"
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "hidden"
  }
});
