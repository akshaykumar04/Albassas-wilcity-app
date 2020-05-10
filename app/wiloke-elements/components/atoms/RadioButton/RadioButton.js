import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity
} from "react-native";
import PropTypes from "prop-types";
import { Feather } from "@expo/vector-icons";
import { colorPrimary } from "../../../../constants/styleConstants";

export default class RadioButton extends PureComponent {
  static propTypes = {
    onChangeValue: PropTypes.func.isRequired,
    name: PropTypes.string,
    label: PropTypes.string,
    radios: PropTypes.array,
    size: PropTypes.number
  };

  static defaultProps = {
    size: 20,
    name: "radio",
    label: "Radio",
    onChangeValue: () => {}
  };
  constructor(props) {
    super(props);
    this.state = {
      checked: ""
    };
  }

  _handleChecked = (item, name) => async () => {
    const { onChangeValue } = this.props;
    await this.setState({
      checked: item.value
    });
    const value = {
      payment_method: item.id,
      payment_method_title: item.value,
      set_paid: true
    };
    onChangeValue(name, value);
  };

  _renderListRadio = () => {
    const { radios } = this.props;
    const { checked } = this.state;
    return (
      <FlatList
        data={radios}
        renderItem={this._renderItem}
        keyExtractor={this._keyExtractor}
        extraData={checked}
      />
    );
  };

  _keyExtractor = (item, index) => item.id;

  _checkMethodPayment = value => {
    const { checked } = this.state;
    return checked === value;
  };

  _renderItem = ({ item, index }) => {
    const { name, size } = this.props;
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={this._handleChecked(item, name)}
      >
        <View style={[styles.button, { width: size, height: size }]}>
          {this._checkMethodPayment(item.value) && (
            <Feather name="check" size={size - 4} color={colorPrimary} />
          )}
        </View>
        <Text style={styles.text}>{item.label}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    const { checked } = this.state;
    return (
      <View style={{ flex: 1, marginTop: 20 }}>{this._renderListRadio()}</View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 10
  },
  text: {
    fontSize: 14,
    color: "#333",
    paddingHorizontal: 5
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#333"
  }
});
