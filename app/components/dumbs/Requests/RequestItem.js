import React, { PureComponent } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import { HtmlViewer, Button } from "../../../wiloke-elements";
import { colorDark } from "../../../constants/styleConstants";

export default class RequestItem extends PureComponent {
  static propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    status: PropTypes.string,
    date: PropTypes.string,
    amount: PropTypes.string
  };
  render() {
    const {
      id,
      status,
      date,
      amount,
      method,
      colorPrimary,
      translations
    } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.id}>{date}</Text>
        <View style={styles.row}>
          <View>
            <Text style={styles.text}>
              {translations.id}: {id}
            </Text>
            <Text style={styles.text}>
              {translations.status}: {status}
            </Text>
          </View>
          <HtmlViewer
            html={amount}
            containerStyle={{ padding: 0 }}
            htmlWrapCssString={`color: ${colorPrimary}: fontSize: 12px;`}
          />
        </View>
        {status === "Pending" && (
          <TouchableOpacity onPress={this.props.onPress}>
            <Text>Cancel Request</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 5
  },
  text: {
    fontSize: 12,
    color: "#9D9D9D"
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
    paddingTop: 10
  },
  id: {
    fontWeight: "bold",
    fontSize: 14,
    color: colorDark
  },
  center: {
    justifyContent: "center",
    alignItems: "center"
  }
});
