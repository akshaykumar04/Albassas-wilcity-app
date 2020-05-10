import React from "react";
import { StyleSheet, View } from "react-native";
import Constants from "expo-constants";


export default (MyComponent = () => {
  <View>
    <View style={styles.statusBar} />
  </View>;
});

const styles = StyleSheet.create({
  statusBar: {
    backgroundColor: "#fff",
    height: Constants.statusBarHeight
  }
});
