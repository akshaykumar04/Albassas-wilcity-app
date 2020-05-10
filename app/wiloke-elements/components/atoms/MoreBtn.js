import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Consts from "../../../constants/styleConstants";
import stylesBase from "../../../stylesBase";

export default class MoreBtn extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
    colorPrimary: PropTypes.string
  };
  static defaultProps = {
    onPress: () => {},
    colorPrimary: Consts.colorPrimary
  };
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity activeOpacity={0.8} onPress={this.props.onPress}>
          <View style={styles.inner}>
            <Text style={[stylesBase.h6, stylesBase.colorPrimary, styles.text]}>
              {this.props.text}
            </Text>
            <Feather
              style={styles.icon}
              name="arrow-right"
              size={16}
              color={this.props.colorPrimary}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 5
  },
  inner: {
    flexDirection: "row",
    alignItems: "center"
  },
  icon: {
    marginLeft: 5
  }
});
