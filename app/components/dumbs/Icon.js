import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, ViewPropTypes } from "react-native";
import { FontIcon } from "../../wiloke-elements";
import * as Consts from "../../constants/styleConstants";

class Icon extends PureComponent {
  render() {
    const {
      size,
      borderRadius,
      name,
      fontSize,
      color,
      backgroundColor,
      style
    } = this.props;
    return (
      <View
        style={[
          {
            justifyContent: "center",
            alignItems: "center",
            width: size,
            height: size,
            borderRadius,
            backgroundColor
          },
          style
        ]}
      >
        <FontIcon name={name} size={fontSize} color={color} />
      </View>
    );
  }
}
Icon.propTypes = {
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  borderRadius: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  name: PropTypes.string.isRequired,
  fontSize: PropTypes.number,
  color: PropTypes.string,
  backgroundColor: PropTypes.string,
  style: ViewPropTypes.style
};
Icon.defaultProps = {
  size: 36,
  borderRadius: 2,
  fontSize: 14,
  color: Consts.colorDark2,
  backgroundColor: Consts.colorGray1
};

export default Icon;
