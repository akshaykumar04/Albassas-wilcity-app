import React, { PureComponent } from "react";
import { View, Text } from "react-native";
import PropTypes from "prop-types";
import he from "he";
export default class TextDecode extends PureComponent {
  static propTypes = {
    text: PropTypes.string
  };

  render() {
    const { text, style } = this.props;
    return (
      <Text style={style} {...this.props}>
        {he.decode(text)}
      </Text>
    );
  }
}
