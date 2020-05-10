import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  TextInput,
  StyleSheet,
  Platform,
  ViewPropTypes
} from "react-native";
import * as Consts from "../../../constants/styleConstants";

export default class Input extends Component {
  static propTypes = {
    styleWrapper: ViewPropTypes.style,
    style: TextInput.propTypes.style
  };
  render() {
    return (
      <View style={[styles.container, this.props.styleWrapper]}>
        <TextInput
          underlineColorAndroid="transparent"
          {...this.props}
          style={[styles.input, this.props.style]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: Consts.colorGray1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "ios" ? 4 : 0,
    paddingBottom: Platform.OS === "ios" ? 6 : 0
  },
  input: {
    textAlignVertical: "center",
    paddingHorizontal: 10,
    paddingVertical: 0,
    margin: 0,
    fontSize: 14,
    color: Consts.colorDark2
  }
});
