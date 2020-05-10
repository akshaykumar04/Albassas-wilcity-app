import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, ViewPropTypes } from "react-native";
import FontIcon from "../molecules/FontIcon";
import { P } from "./Typography";
import * as Consts from "../../../constants/styleConstants";

export class AlertError extends PureComponent {
  static propTypes = {
    style: ViewPropTypes.style,
    text: PropTypes.string
  };
  render() {
    const { style, text } = this.props;
    return (
      <View style={[{ flexDirection: "row" }, style]}>
        <View style={{ marginRight: 10 }}>
          <FontIcon
            name="alert-triangle"
            size={16}
            color={Consts.colorQuaternary}
          />
        </View>
        <P style={{ color: Consts.colorQuaternary }}>{text}</P>
      </View>
    );
  }
}
