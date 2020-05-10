import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Image } from "react-native";

export default class ImageAutoSize extends PureComponent {
  static propTypes = {
    ...Image.propTypes,
    maxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    containerPadding: PropTypes.number
  };

  static defaultProps = {
    height: 0,
    containerPadding: 0
  };

  constructor(props) {
    super(props);
    const { maxWidth, width, height, containerPadding } = this.props;
    this.state = {
      imageStyle: {
        maxWidth,
        width,
        height: height === 0 ? 100 : (height * maxWidth) / width,
        marginLeft: maxWidth - width < 30 ? -containerPadding : 0
      }
    };
  }

  _handleLoadEnd = () => {
    const { source, maxWidth, containerPadding } = this.props;
    Image.getSize(
      source.uri,
      (_width, _height) => {
        this.setState({
          imageStyle: {
            maxWidth,
            width: maxWidth - _width < 30 ? maxWidth : _width,
            height:
              maxWidth - _width < 30 ? (_height * maxWidth) / _width : _height,
            marginLeft: maxWidth - _width < 30 ? -containerPadding : 0
          }
        });
      },
      () => console.log("Image GetSize Error")
    );
  };

  render() {
    const { imageStyle } = this.state;
    const {
      style,
      maxWidth,
      width,
      height,
      containerPadding,
      ...props
    } = this.props;
    return (
      <Image
        {...props}
        style={[imageStyle, style]}
        onLoadEnd={this._handleLoadEnd}
      />
    );
  }
}
