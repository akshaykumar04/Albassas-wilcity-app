import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewPropTypes
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Consts from "../../constants/styleConstants";
import stylesBase from "../../stylesBase";

export default class TextBoxColor extends Component {
  render() {
    return (
      <View
        style={[this.props.style, { backgroundColor: this.props.colorPrimary }]}
      >
        <TouchableOpacity activeOpacity={0.5} onPress={this.props.onPress}>
          <View style={styles.inner}>
            <Feather
              name={this.props.iconName}
              size={this.props.iconSize}
              color={this.props.color}
              style={styles.icon}
            />
            <Text
              style={[stylesBase.h6, { fontSize: 10, color: this.props.color }]}
            >
              {this.props.text.toUpperCase()}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

TextBoxColor.defaultProps = {
  iconSize: 26,
  color: "#fff",
  colorPrimary: Consts.colorPrimary
};

TextBoxColor.propTypes = {
  iconSize: PropTypes.number,
  color: PropTypes.string,
  iconName: PropTypes.string,
  colorPrimary: PropTypes.string,
  text: PropTypes.string,
  onPress: PropTypes.func,
  style: ViewPropTypes.style
};

const styles = StyleSheet.create({
  inner: {
    paddingHorizontal: 10,
    paddingVertical: 30,
    justifyContent: "center",
    alignItems: "center"
  },
  icon: {
    marginBottom: 10
  }
});
