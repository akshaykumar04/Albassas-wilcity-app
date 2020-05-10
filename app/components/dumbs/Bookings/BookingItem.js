import React, { PureComponent } from "react";
import { Text, View, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import * as Consts from "../../../constants/styleConstants";

export default class BookingItem extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    id: PropTypes.number,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    status: PropTypes.string,
    specification: PropTypes.array
  };

  _renderHeader = () => {
    const { id } = this.props;
    return (
      <View style={styles.header}>
        <Text style={styles.id}># {id}</Text>
      </View>
    );
  };

  _renderContent = () => {
    const {
      startDate,
      endDate,
      status,
      title,
      colorPrimary,
      translations
    } = this.props;
    return (
      <View style={styles.content}>
        <View style={styles.view}>
          <Text style={styles.text}>{translations.title}</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.view}>
          <Text style={styles.text}>{translations.startDate}</Text>
          <Text style={styles.text}>{startDate}</Text>
        </View>
        <View style={styles.view}>
          <Text style={styles.text}>{translations.endDate}</Text>
          <Text style={styles.text}>{endDate}</Text>
        </View>
        <View style={styles.view}>
          <Text style={styles.text}>{translations.status}</Text>
          <Text style={[styles.text, { color: colorPrimary }]}>{status}</Text>
        </View>
        {/* {this._renderSpecification()} */}
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        {this._renderHeader()}
        {this._renderContent()}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff"
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#F6F6F6",
    borderWidth: 1,
    borderColor: "#F6F6F6"
  },
  id: {
    fontSize: 16,
    color: "#222",
    textTransform: "uppercase"
  },
  view: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5
  },
  content: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1.5,
    borderTopWidth: 1.5,
    borderColor: Consts.colorGray1
  },
  text: {
    fontSize: 14,
    color: "#9D9D9D"
  },
  title: {
    fontSize: 14,
    color: "#333",
    fontWeight: "bold"
  }
});
