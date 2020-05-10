import React, { PureComponent } from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import * as Consts from "../../../constants/styleConstants";
import NetInfo from "@react-native-community/netinfo";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

function MiniOfflineSign() {
  return (
    <View style={styles.offlineContainer}>
      <Text style={styles.offlineText}>No Internet Connection</Text>
    </View>
  );
}

export default class OfflineNotice extends PureComponent {
  state = {
    isConnected: true
  };

  componentDidMount() {
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
    });
  }

  componentWillUnmount() {
    // this.unsubscribe();
  }

  handleConnectivityChange = isConnected => {
    if (isConnected) {
      this.setState({ isConnected });
    } else {
      this.setState({ isConnected });
    }
  };

  render() {
    if (!this.state.isConnected) {
      return <MiniOfflineSign />;
    }
    return null;
  }
}

const styles = StyleSheet.create({
  offlineContainer: {
    backgroundColor: Consts.colorQuaternary,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: SCREEN_WIDTH
  },
  offlineText: { color: "#fff", fontSize: 12 }
});
