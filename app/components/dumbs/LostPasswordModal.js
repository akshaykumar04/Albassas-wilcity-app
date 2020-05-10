import React, { PureComponent } from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  Platform
} from "react-native";
import Constants from "expo-constants";
import { WebView } from "react-native-webview";
import { FontIcon, Loader } from "../../wiloke-elements";
import WilWebView from "./WilWebView";
import { colorQuaternary, screenHeight } from "../../constants/styleConstants";

const IOS = Platform.OS === "ios";

export default class LostPasswordModal extends PureComponent {
  state = {
    isLoading: true
  };

  _handleLoadStart = () => {
    this.setState({
      isLoading: true
    });
  };

  _handleLoadEnd = () => {
    this.setState({
      isLoading: false
    });
  };

  render() {
    const { source, onRequestClose, ...props } = this.props;
    const { isLoading } = this.state;
    return (
      <Modal
        {...props}
        onRequestClose={onRequestClose}
        animationType="slide"
        transparent={false}
      >
        <View style={styles.viewContainer}>
          {isLoading && <Loader />}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onRequestClose}
            style={styles.icon}
          >
            <FontIcon name="x-circle" size={30} color={colorQuaternary} />
          </TouchableOpacity>
          {/* <WilWebView
            scrollViewEnabled
            source={source}
            containerStyle={[
              { flex: 1, width: "100%" },
              isLoading
                ? {
                    position: "absolute",
                    opacity: 0
                  }
                : {}
            ]}
            onLoadEnd={this._handleLoadEnd}
            onLoadStart={this._handleLoadStart}
          /> */}
          <WebView
            source={source}
            originWhitelist={["*"]}
            style={[
              { flex: 1, width: "100%" },
              isLoading
                ? {
                    position: "absolute",
                    opacity: 0
                  }
                : {}
            ]}
            onLoadEnd={this._handleLoadEnd}
            onLoadStart={this._handleLoadStart}
            showsVerticalScrollIndicator={false}
            useWebKit={true}
          />
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    width: "100%",
    position: "relative",
    minHeight: screenHeight,
    paddingTop: Constants.statusBarHeight
  },
  icon: {
    position: "absolute",
    zIndex: 9,
    top: Constants.statusBarHeight + (IOS ? 10 : 5),
    right: 10
  }
});
