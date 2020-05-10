import React, { PureComponent } from "react";
import { View, Text, ViewPropTypes, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { colorDark } from "../../../constants/styleConstants";

export default class Label extends PureComponent {
  static propTypes = {
    containerStyle: ViewPropTypes.style,
    fontSize: PropTypes.number,
    color: PropTypes.string,
    textNumberOfLines: PropTypes.number
  };

  static defaultProps = {
    containerStyle: {},
    color: colorDark,
    textNumberOfLines: 0
  };

  _renderLabel = () => {
    const {
      children,
      textStyle,
      fontSize,
      color,
      textNumberOfLines
    } = this.props;
    return (
      <Text
        style={[styles.labelText, textStyle, { fontSize, color }]}
        {...(!!textNumberOfLines ? { numberOfLines: textNumberOfLines } : {})}
      >
        {children}
      </Text>
    );
  };

  render() {
    const { containerStyle } = this.props;
    return <View style={containerStyle}>{this._renderLabel()}</View>;
  }
}
const styles = StyleSheet.create({
  labelText: {
    fontWeight: "bold"
  }
});
