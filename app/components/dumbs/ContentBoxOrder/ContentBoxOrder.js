import React, { PureComponent } from "react";
import { Text, View, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { colorDark } from "../../../constants/styleConstants";

export default class ContentBoxOrder extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    renderContent: PropTypes.func
  };

  _renderTitle = () => {
    const { title } = this.props;
    return (
      <View style={styles.view}>
        <Text style={styles.title}>{title}</Text>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        {this._renderTitle()}
        {this.props.renderContent()}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff"
  },
  view: {
    backgroundColor: "#F6F6F6",
    paddingVertical: 10,
    paddingHorizontal: 15
  },
  title: {
    fontSize: 16,
    color: colorDark,
    textTransform: "uppercase",
    paddingVertical: 5
  }
});
