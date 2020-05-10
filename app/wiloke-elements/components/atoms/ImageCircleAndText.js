import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, ViewPropTypes } from "react-native";
import * as Consts from "../../../constants/styleConstants";
import { ImageCache } from "./ImageCache";

const IMAGE_HORIZONTAL_SIZE = 50;
const IMAGE_VERTICAL_SIZE = 60;

export default class ImageCircleAndText extends Component {
  static propTypes = {
    image: PropTypes.string,
    title: PropTypes.string,
    text: PropTypes.string,
    time: PropTypes.string,
    horizontal: PropTypes.bool,
    imageSize: PropTypes.number,
    style: ViewPropTypes.style,
    messageNumberOfLines: PropTypes.number,
    titleNumberOfLines: PropTypes.number,
    titleMaxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    styleImage: ViewPropTypes.style,
    modifier: PropTypes.oneOf(["style1", "style2"]),
    dotEnabled: PropTypes.bool,
    dotTintColor: PropTypes.string,
    dotPosition: PropTypes.bool
  };
  static defaultProps = {
    horizontal: false,
    imageSize: 40,
    modifier: "style1",
    dotEnabled: false,
    dotPosition: false
  };

  shouldComponentUpdate = nextProps => {
    if (nextProps.dotEnabled === this.props.dotEnabled) {
      return true;
    }
    return false;
  };

  _renderDot = () => {
    const { dotTintColor } = this.props;
    return (
      <View
        style={[
          styles.dot,
          {
            backgroundColor: dotTintColor
          }
        ]}
      />
    );
  };
  render() {
    const {
      image,
      title,
      text,
      message,
      time,
      modifier,
      horizontal,
      imageSize,
      style,
      styleImage,
      messageNumberOfLines,
      titleNumberOfLines,
      titleMaxWidth,
      dotEnabled,
      dotPosition
    } = this.props;
    const _imageSize = imageSize
      ? {
          width: imageSize,
          height: imageSize,
          borderRadius: imageSize / 2,
          overflow: "hidden"
        }
      : {};
    const preview = {
      uri: image
    };
    const uri = image;
    return (
      <View
        style={[
          {
            position: "relative"
          },
          horizontal ? styles.containerHorizontal : styles.containerVertical,
          style
        ]}
      >
        <View
          style={[
            horizontal ? styles.imageHorizontal : styles.imageVertical,
            _imageSize,
            {
              position: "relative",
              zIndex: 9,
              backgroundColor: Consts.colorGray1
            }
          ]}
        >
          {!!uri && (
            <ImageCache
              {...{ preview, uri }}
              tint="light"
              source={{ uri: image }}
              resizeMode="cover"
              style={[_imageSize, styleImage]}
            />
          )}
        </View>
        <View
          style={{
            flexDirection: "column",
            alignItems: horizontal ? "flex-start" : "center",
            paddingRight: horizontal ? imageSize : 0
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                maxWidth: titleMaxWidth
              }}
            >
              <Text
                style={[
                  styles.title,
                  {
                    fontSize: message ? 12 : 13
                  }
                ]}
                numberOfLines={titleNumberOfLines}
              >
                {title}
              </Text>
            </View>
            {dotEnabled && dotPosition && <View style={{ width: 2 }} />}
            {dotEnabled && dotPosition && this._renderDot()}
          </View>
          {!!message && (
            <View>
              <Text style={styles.message} numberOfLines={messageNumberOfLines}>
                {message}
              </Text>
            </View>
          )}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {dotEnabled && !dotPosition && this._renderDot()}
            {!!text && (
              <Text
                style={[
                  styles.text,
                  {
                    fontSize: message ? 10 : 12
                  }
                ]}
              >
                {text}
              </Text>
            )}
          </View>
        </View>

        {!!time && (
          <View
            style={
              modifier === "style1"
                ? {
                    position: "absolute",
                    top: 2,
                    right: 0,
                    zIndex: 9
                  }
                : {}
            }
          >
            <Text
              style={[
                styles.text,
                {
                  fontSize: 12
                }
              ]}
            >
              {time}
            </Text>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerHorizontal: {
    flexDirection: "row",
    alignItems: "center"
  },
  containerVertical: {
    flexDirection: "column",
    alignItems: "center"
  },
  title: {
    fontWeight: "700",
    color: Consts.colorDark1,
    marginBottom: 2
  },
  text: {
    color: Consts.colorDark3
  },
  imageHorizontal: {
    width: IMAGE_HORIZONTAL_SIZE,
    height: IMAGE_HORIZONTAL_SIZE,
    borderRadius: IMAGE_HORIZONTAL_SIZE / 2,
    marginRight: 8
  },
  imageVertical: {
    width: IMAGE_VERTICAL_SIZE,
    height: IMAGE_VERTICAL_SIZE,
    borderRadius: IMAGE_VERTICAL_SIZE / 2,
    marginBottom: 5
  },
  message: {
    fontSize: 13,
    color: Consts.colorDark2,
    lineHeight: 19
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4
  },
  dotHorizontal: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 9999
  }
});
