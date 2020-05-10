import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, ViewPropTypes } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Consts from "../../../constants/styleConstants";

export default class MessageError extends PureComponent {
  static propTypes = {
    message: PropTypes.string,
    style: ViewPropTypes.style
  };
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <Feather name="alert-circle" size={60} color={Consts.colorDark4} />
        <Text style={styles.message}>{this.props.message}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center"
  },
  message: {
    fontSize: 14,
    textAlign: "center",
    color: Consts.colorDark3,
    marginTop: 8
  }
});
