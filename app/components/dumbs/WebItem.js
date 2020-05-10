import React from "react";
import PropTypes from "prop-types";
import { TouchableOpacity, ViewPropTypes } from "react-native";
import { IconTextMedium } from "../../wiloke-elements";
import * as Consts from "../../constants/styleConstants";
import * as WebBrowser from "expo-web-browser";

const handlePress = url => () => {
  if (typeof url === "string") {
    WebBrowser.openBrowserAsync(url.includes("http") ? url : `https://${url}`);
  }
};

export const WebItem = props => {
  const { url, navigation, style, iconColor, iconBackgroundColor } = props;
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={handlePress(url)}
      style={style}
    >
      <IconTextMedium
        iconName="globe"
        iconSize={30}
        iconColor={iconColor}
        iconBackgroundColor={iconBackgroundColor}
        text={url}
      />
    </TouchableOpacity>
  );
};
WebItem.propTypes = {
  url: PropTypes.string,
  style: ViewPropTypes.style
};
WebItem.defaultProps = {
  iconColor: "#fff",
  iconBackgroundColor: Consts.colorQuaternary
};
