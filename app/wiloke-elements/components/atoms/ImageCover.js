import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import { View, Animated, StyleSheet, Image, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Consts from "../../../constants/styleConstants";
import { ImageCache } from "./ImageCache";
const ANDROID = Platform.OS === "android";

export default class ImageCover extends PureComponent {
  static propTypes = {
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    borderRadius: PropTypes.number,
    blurRadius: PropTypes.number,
    overlay: PropTypes.number,
    animated: PropTypes.bool,
    src: PropTypes.string,
    useImageDefault: PropTypes.bool,
    resizeMode: PropTypes.string
  };
  static defaultProps = {
    width: "100%",
    animated: false,
    resizeMode: "cover",
    src: "https://via.placeholder.com/1"
  };

  renderOverlay = () => (
    <Fragment>
      {typeof this.props.linearGradient === "object" ? (
        <LinearGradient
          colors={this.props.linearGradient}
          start={{ x: 0.0, y: 1.0 }}
          end={{ x: 1.0, y: 1.0 }}
          style={[
            stylesheet.gradient,
            {
              opacity: this.props.overlay
            }
          ]}
        />
      ) : (
        <View
          style={[stylesheet.overlayDefault, { opacity: this.props.overlay }]}
        />
      )}
    </Fragment>
  );

  _getPadding = modifier => {
    switch (modifier) {
      case "16by9":
        return { paddingTop: "56.25%" };
      case "4by3":
        return { paddingTop: "75%" };
      default:
        return { paddingTop: "100%" };
    }
  };

  renderContent = () => {
    const {
      src,
      blurRadius,
      overlay,
      modifier,
      height,
      useImageDefault,
      resizeMode
    } = this.props;
    const preview = {
      uri: src
    };
    const uri = src;
    return (
      <Fragment>
        {useImageDefault || ANDROID ? (
          <Image
            source={{ uri }}
            resizeMode={resizeMode}
            style={stylesheet.image}
            blurRadius={blurRadius}
          />
        ) : (
          <ImageCache
            {...{ preview, uri }}
            tint="light"
            resizeMode={resizeMode}
            style={stylesheet.image}
            blurRadius={blurRadius}
          />
        )}
        <View style={height ? { height } : this._getPadding(modifier)} />
        {typeof overlay === "number" && this.renderOverlay()}
      </Fragment>
    );
  };

  render() {
    const { width, styles } = this.props;
    const styleView = [
      { width },
      styles,
      stylesheet.stylesView,
      {
        borderRadius: this.props.borderRadius
      }
    ];
    return (
      <Fragment>
        {this.props.animated ? (
          <Animated.View style={styleView}>
            {this.renderContent()}
          </Animated.View>
        ) : (
          <View style={styleView}>{this.renderContent()}</View>
        )}
      </Fragment>
    );
  }
}

const stylesheet = StyleSheet.create({
  image: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  stylesView: {
    position: "relative",
    zIndex: 1,
    overflow: "hidden"
  },
  gradient: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1
  },
  overlayDefault: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1,
    backgroundColor: Consts.colorDark
  }
});
