import React, { PureComponent } from "react";
import { Text, View, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { FontIcon, Image2 } from "../../../wiloke-elements";

export default class AvatarRound extends PureComponent {
  static propTypes = {
    image: PropTypes.string,
    nameIcon: PropTypes.string,
    containerStyle: PropTypes.object
  };
  render() {
    const { containerStyle, nameIcon, iconProps, width, radius } = this.props;
    return (
      <View style={[styles.container, containerStyle]}>
        {!nameIcon ? (
          <Image2
            uri={logo}
            percentRatio="100%"
            width={width}
            borderRadius={radius}
          />
        ) : (
          <View style={styles.wrap}>
            <FontIcon name={nameIcon} {...iconProps} />
          </View>
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {},
  wrap: {}
});
