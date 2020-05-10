import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  TextInput,
  InputAccessoryView,
  ScrollView,
  Keyboard,
  UIManager,
  Platform
} from "react-native";

const IOS = Platform.OS === "ios";

export default class AccessoryView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="always"
          renderToHardwareTextureAndroid={true}
          style={{
            flex: 1
          }}
        >
          <TextInput
            style={{
              padding: 10,
              paddingTop: 50
            }}
            autoCorrect={false}
            placeholder="type"
            inputAccessoryViewID={"regular"}
          />
        </ScrollView>
        <InputAccessoryView nativeID={"regular"} style={{ width: "100%" }}>
          <View
            style={{
              height: 200,
              backgroundColor: "#fff",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <TextInput
              style={{
                width: "100%"
              }}
              autoCorrect={false}
              autoFocus={true}
              multiline={true}
              placeholder="type"
            />
          </View>
        </InputAccessoryView>
      </View>
    );
  }
}
