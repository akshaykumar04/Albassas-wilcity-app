import React, { PureComponent } from "react";
import { Text, View, StyleSheet, ActivityIndicator, Alert } from "react-native";
import PropTypes from "prop-types";
import * as AppleAuthentication from "expo-apple-authentication";
import { Button } from "../../../wiloke-elements";
import { FontAwesome5 } from "@expo/vector-icons";
import { colorLight } from "../../../constants/styleConstants";

export default class AppleButton extends PureComponent {
  static propTypes = {
    containerStyle: PropTypes.object,
    onAction: PropTypes.func,
    onError: PropTypes.func,
  };

  _handleLoginApple = async () => {
    const { onAction, onError } = this.props;
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      onAction && onAction(credential);
      // signed in
    } catch (e) {
      if (e.code === "ERR_CANCELED") {
        // handle that the user canceled the sign-in flow
      } else {
        onError(e.code);
      }
    }
  };

  _renderAppleIcon = () => {
    return (
      <FontAwesome5
        name="apple"
        size={26}
        color="#fff"
        style={{ marginRight: 10 }}
      />
    );
  };

  render() {
    const { containerStyle, isLoading } = this.props;
    return (
      <View>
        <Button
          {...this.props}
          backgroundColor="primary"
          colorPrimary="#050708"
          size="md"
          block={true}
          isLoading={isLoading}
          textStyle={{ fontSize: 17, color: colorLight }}
          onPress={this._handleLoginApple}
          renderBeforeText={this._renderAppleIcon}
        >
          Login with Apple
        </Button>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },
  colorLight: {
    color: colorLight,
  },
});
