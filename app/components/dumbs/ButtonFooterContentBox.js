import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { TouchableOpacity, View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Consts from "../../constants/styleConstants";
import { RTL } from "../../wiloke-elements";

export default class ButtonFooterContentBox extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
    text: PropTypes.string
  };

  static defaultProps = {
    onPress: _ => {}
  };

  render() {
    const rtl = RTL();
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center"
        }}
        onPress={this.props.onPress}
      >
        <Text
          style={{ fontSize: 11, fontWeight: "600", color: Consts.colorDark3 }}
        >
          {this.props.text}
        </Text>
        <View style={{ width: 5 }} />
        <Feather
          name={rtl ? "chevron-left" : "chevron-right"}
          size={16}
          color={Consts.colorDark3}
        />
      </TouchableOpacity>
    );
  }
}
