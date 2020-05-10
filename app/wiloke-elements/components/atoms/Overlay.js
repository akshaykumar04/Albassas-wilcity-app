import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  ImageBackground,
  Dimensions,
  Animated,
  StyleSheet
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Consts from "../../../constants/styleConstants";
import stylesBase from "../../../stylesBase";

export default class Overlay extends PureComponent {
  static propTypes = {
    backgroundColor: PropTypes.string,
    opacity: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    zIndex: PropTypes.number,
    linearGradient: PropTypes.object,
    modifier: PropTypes.oneOf(["dark", "light"]),
    animated: PropTypes.bool
  };
  static defaultProps = {
    modifier: "dark",
    opacity: 0.6,
    animated: false
  };
  render() {
    return (
      <Fragment>
        {this.props.animated ? (
          <Animated.View
            style={[
              stylesBase.absFull,
              {
                backgroundColor: this.props.backgroundColor
                  ? this.props.backgroundColor
                  : this.props.modifier === "dark"
                  ? Consts.colorDark1
                  : "#fff",
                opacity: this.props.opacity,
                zIndex: this.props.zIndex
              }
            ]}
          />
        ) : (
          <Fragment>
            {typeof this.props.linearGradient === "object" ? (
              <LinearGradient
                colors={this.props.linearGradient}
                start={{ x: 0.0, y: 1.0 }}
                end={{ x: 1.0, y: 1.0 }}
                style={[
                  stylesBase.absFull,
                  {
                    opacity: this.props.opacity,
                    zIndex: this.props.zIndex
                  }
                ]}
              />
            ) : (
              <View
                style={[
                  stylesBase.absFull,
                  {
                    backgroundColor: this.props.backgroundColor
                      ? this.props.backgroundColor
                      : this.props.modifier === "dark"
                      ? Consts.colorDark1
                      : "#fff",
                    opacity: this.props.opacity,
                    zIndex: this.props.zIndex
                  }
                ]}
              />
            )}
          </Fragment>
        )}
      </Fragment>
    );
  }
}
