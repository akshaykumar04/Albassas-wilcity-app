import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Input } from "../../wiloke-elements";
import { Feather } from "@expo/vector-icons";
import * as Consts from "../../constants/styleConstants";

/**
 * Constants
 */
const ICON_SIZE = 34;
const { width: SCREEN_WIDTH } = Dimensions.get("window");

/**
 * Start PureComponent
 */
export default class InputHasButton extends PureComponent {
  /**
   * PropTypes
   */
  static propTypes = {
    iconName: PropTypes.string,
    colorPrimary: PropTypes.string,
    onChangeText: PropTypes.func,
    onPressText: PropTypes.func
  };

  /**
   * Default Props
   */
  static defaultProps = {
    iconName: "arrow-up",
    colorPrimary: Consts.colorPrimary,
    onChangeText: _ => {},
    onPressText: _ => {}
  };

  state = {
    text: ""
  };

  _handleChangeText = text => {
    this.setState({ text });
    this.props.onChangeText(text);
  };

  _handlePress = event => {
    const { text } = this.state;
    this.props.onPressText(text, event);
    this.setState({ text: "" });
  };

  /**
   * Render
   */
  render() {
    return (
      <View style={styles.container}>
        <Input
          {...this.props}
          placeholderTextColor={Consts.colorDark4}
          styleWrapper={styles.input}
          value={this.state.text}
          onChangeText={this._handleChangeText}
        />
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={this._handlePress}
          style={[
            styles.iconWrap,
            {
              backgroundColor: this.props.colorPrimary
            }
          ]}
        >
          <Feather name={this.props.iconName} size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: Consts.colorGray1,
    backgroundColor: Consts.colorGray3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  input: {
    borderRadius: 26,
    width: SCREEN_WIDTH - 60
  },
  iconWrap: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    justifyContent: "center",
    alignItems: "center"
  }
});
