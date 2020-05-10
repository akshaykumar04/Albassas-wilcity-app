import React, { PureComponent } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import { FontIcon } from "../../../wiloke-elements";
import { colorLight } from "../../../constants/styleConstants";

export default class ButtonSocial extends PureComponent {
  static propTypes = {
    nameIcon: PropTypes.string,
    onPress: PropTypes.func,
    customStyle: PropTypes.object,
    backgroundColor: PropTypes.string,
    borderRadius: PropTypes.number,
    size: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  };
  static defaultProps = {
    size: 40,
    borderRadius: 100
  };
  render() {
    const {
      nameIcon,
      onPress,
      customStyle,
      backgroundColor,
      borderRadius,
      size
    } = this.props;
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor, borderRadius, width: size, height: size }
          ]}
          activeOpacity={0.5}
          onPress={onPress}
        >
          <FontIcon name={nameIcon} color={colorLight} size={15} />
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 5,
    marginBottom: 0,
    marginTop: 10
  },
  button: {
    justifyContent: "center",
    alignItems: "center"
  }
});
