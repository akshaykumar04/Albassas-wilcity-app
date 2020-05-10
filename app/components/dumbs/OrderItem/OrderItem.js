import React, { PureComponent } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import { FontIcon, HtmlViewer } from "../../../wiloke-elements";
import * as Consts from "../../../constants/styleConstants";

export default class OrderItem extends PureComponent {
  static propTypes = {
    id: PropTypes.number,
    timing: PropTypes.string,
    status: PropTypes.string,
    price: PropTypes.string,
    colorPrimary: PropTypes.string
  };

  _getTextColor = () => {
    const { status, colorPrimary } = this.props;
    let colorText = colorPrimary;
    switch (status) {
      case "on-hold":
        colorText = "#32C267";
        break;
      case "pending":
        colorText = "#F1CA0A";
        break;
      case "completed":
        colorText = "#32C267";
      default:
        break;
    }
    return colorText;
  };

  _getIcon = () => {
    const { status, colorPrimary } = this.props;
    const icon = {
      name: "check",
      color: colorPrimary,
      size: 20
    };
    switch (status) {
      case "pending":
        icon.name = "rotate-cw";
        icon.color = "#F1CA0A";
        break;
      case "on-hold":
        icon.name = "check";
        icon.color = "#32C267";
        break;
      case "cancelled":
        icon.name = "x";
        icon.color = "red";
        break;
    }
    return icon;
  };

  _renderRight = () => {
    return (
      <View style={{ padding: 5 }}>
        <FontIcon {...this._getIcon()} />
      </View>
    );
  };

  _renderHeader = () => {
    const { id, translations } = this.props;
    return (
      <View style={styles.header}>
        <Text style={styles.id}>
          {translations.id}: {id}
        </Text>
        {this._renderRight()}
      </View>
    );
  };

  _renderContent = () => {
    const { timing, status, price, colorPrimary, translations } = this.props;
    return (
      <View style={styles.content}>
        <View style={styles.view}>
          <Text style={styles.text}>{translations.date}</Text>
          <Text style={styles.text}>{timing}</Text>
        </View>
        <View style={styles.view}>
          <Text style={styles.text}>{translations.item}</Text>
          <HtmlViewer
            html={price}
            containerStyle={{ padding: 0 }}
            htmlWrapCssString={`color: ${colorPrimary}`}
          />
        </View>
        <View style={styles.view}>
          <Text style={styles.text}>{translations.status}</Text>
          <Text style={[styles.text, { color: this._getTextColor() }]}>
            {status}
          </Text>
        </View>
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
  }
});
