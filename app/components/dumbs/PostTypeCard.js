import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import he from "he";
import { FontIcon } from "../../wiloke-elements";

export default class PostTypeCard extends PureComponent {
  static propTypes = {
    iconName: PropTypes.string,
    backgroundColor: PropTypes.string,
    label: PropTypes.string.isRequired,
    onPress: PropTypes.func,
    image: PropTypes.string
  };

  static defaultProps = {
    iconName: "",
    backgroundColor: "",
    image: "",
    onPress: () => {}
  };

  render() {
    const { iconName, backgroundColor, label, onPress } = this.props;
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.container, { backgroundColor }]}
        onPress={onPress}
      >
        <View style={styles.iconWrapper}>
          {!!iconName && <FontIcon name={iconName} size={30} color="#fff" />}
        </View>
        <View style={styles.labelWrapper}>
          <Text style={styles.label}>{he.decode(label)}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    padding: 15,
    overflow: "hidden",
    borderRadius: 3
  },
  iconWrapper: {
    height: 33
  },
  labelWrapper: {
    marginTop: 10
  },
  label: {
    color: "#fff",
    fontWeight: "500"
  }
});
