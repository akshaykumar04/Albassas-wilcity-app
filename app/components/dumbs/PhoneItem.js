import React from "react";
import PropTypes from "prop-types";
import { TouchableOpacity, ViewPropTypes } from "react-native";
import { Communications, IconTextMedium } from "../../wiloke-elements";
import * as Consts from "../../constants/styleConstants";

export const PhoneItem = props => (
  <TouchableOpacity
    activeOpacity={0.5}
    onPress={() => Communications.phonecall(props.phone, true)}
    style={props.style}
  >
    <IconTextMedium
      iconName="phone"
      iconSize={30}
      iconColor={props.iconColor}
      iconBackgroundColor={props.iconBackgroundColor}
      text={props.phone}
    />
  </TouchableOpacity>
);
PhoneItem.propTypes = {
  phone: PropTypes.string,
  style: ViewPropTypes.style
};
PhoneItem.defaultProps = {
  iconColor: "#fff",
  iconBackgroundColor: Consts.colorTertiary
};
