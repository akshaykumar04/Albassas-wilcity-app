import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  TextInput,
  StatusBar,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Constants from "expo-constants";

import * as Consts from "../../constants/styleConstants";
import stylesBase from "../../stylesBase";

const { width, height } = Dimensions.get("window");

const HEADER_HEIGHT = 52 + Constants.statusBarHeight;
const FORM_HEIGHT = 32;

export default class HeaderHasFilter extends Component {
  static propTypes = {
    renderRight: PropTypes.func,
    renderLeft: PropTypes.func,
    renderCenter: PropTypes.func,
    backgroundColor: PropTypes.string
  };

  static defaultProps = {
    renderRight: () => <Feather name="mail" size={20} color="#fff" />,
    renderLeft: () => <Feather name="settings" size={20} color="#fff" />,
    renderCenter: () => {},
    backgroundColor: Consts.colorPrimary
  };

  render() {
    const { navigation } = this.props;
    return (
      <View style={{ width: "100%" }}>
        <StatusBar barStyle="light-content" />
        <View
          style={[
            styles.container,
            {
              backgroundColor: this.props.backgroundColor
            }
          ]}
        >
          <View style={styles.headerIcon}>{this.props.renderLeft()}</View>

          {this.props.renderCenter()}

          <View style={styles.headerIcon}>{this.props.renderRight()}</View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    height: HEADER_HEIGHT,
    paddingTop: Constants.statusBarHeight
  }
});
