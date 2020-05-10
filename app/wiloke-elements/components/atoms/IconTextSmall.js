import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Text, View, ViewPropTypes } from "react-native";
import stylesBase from "../../../stylesBase";
import * as Consts from "../../../constants/styleConstants";
import FontIcon from "../molecules/FontIcon";

export default class IconTextSmall extends PureComponent {
  static propTypes = {
    iconSize: PropTypes.number,
    textSize: PropTypes.number,
    numberOfLines: PropTypes.number,
    iconName: PropTypes.string,
    iconColor: PropTypes.string,
    textColor: PropTypes.string,
    text: PropTypes.string,
    textStyle: Text.propTypes.style,
    style: ViewPropTypes.style
  };
  static defaultProps = {
    iconSize: 12,
    textSize: 10,
    iconName: "map",
    iconColor: Consts.colorPrimary,
    textColor: Consts.colorDark4
  };
  render() {
    return (
      <View
        style={[
          {
            flexDirection: "row",
            alignItems: "center"
          },
          this.props.style
        ]}
      >
        <FontIcon
          name={this.props.iconName}
          size={this.props.iconSize}
          color={this.props.iconColor}
        />
        <Text
          numberOfLines={this.props.numberOfLines}
          style={[
            {
              fontSize: this.props.textSize,
              color: this.props.textColor,
              marginLeft: 3
            },
            this.props.textStyle
          ]}
        >
          {this.props.text}
        </Text>
      </View>
    );
  }
}
