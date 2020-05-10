import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  View,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ViewPropTypes,
  Text,
  Image
} from "react-native";
import ImageCover from "../atoms/ImageCover";
import Constants from "expo-constants";
import * as WebBrowser from "expo-web-browser";
import { wait } from "../../functions/wilokeFunc";
import FontIcon from "./FontIcon";
import ImageAutoSize from "../atoms/ImageAutoSize";
import { screenWidth } from "../../../constants/styleConstants";

export default class MyAdvertise extends PureComponent {
  static propTypes = {
    imageUri: PropTypes.string,
    redirectUri: PropTypes.string,
    variant: PropTypes.oneOf(["banner", "interstitial"]),
    style: ViewPropTypes.style,
    background: PropTypes.oneOf(["light", "dark"]),
    showButtonCloseTimer: PropTypes.number
  };

  static defaultProps = {
    variant: "banner",
    background: "light",
    showButtonCloseTimer: 5
  };

  state = {
    isModalVisible: false,
    countDown: this.props.showButtonCloseTimer
  };

  async componentDidMount() {
    await wait(1500);
    await this.setState({
      isModalVisible: true
    });
    await wait(100);
    this._interval = setInterval(_ => {
      this.setState(prevState => ({
        countDown: prevState.countDown === 0 ? 0 : prevState.countDown - 1
      }));
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this._interval);
  }

  _handleRedirect = variant => _ => {
    const { redirectUri } = this.props;
    redirectUri && WebBrowser.openBrowserAsync(redirectUri);
    variant === "interstitial" &&
      this.setState({
        isModalVisible: false
      });
  };

  _handleBannerError = err => {
    console.log(err);
  };

  _handleCloseModal = _ => {
    const { countDown } = this.state;
    !countDown &&
      this.setState({
        isModalVisible: false
      });
  };

  render() {
    const { imageUri, variant, style, background } = this.props;
    const { isModalVisible, countDown } = this.state;
    if (variant === "banner") {
      return (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={this._handleRedirect()}
          style={[
            styles.container,
            style,
            {
              backgroundColor: background === "dark" ? "#000" : "#fff"
            }
          ]}
        >
          <ImageAutoSize source={{ uri: imageUri }} maxWidth={screenWidth} />
        </TouchableOpacity>
      );
    }
    return (
      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={this._handleCloseModal}
      >
        <View style={styles.modalContent}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={this._handleCloseModal}
            style={[
              styles.icon,
              {
                backgroundColor: !!countDown ? "rgba(255,255,255,0.2)" : "#fff"
              }
            ]}
          >
            {!!countDown ? (
              <Text style={styles.countDown}>{countDown}</Text>
            ) : (
              <FontIcon name="x" color="#000" size={20} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={this._handleRedirect("interstitial")}
            style={styles.modalContentInner}
          >
            <ImageCover
              useImageDefault
              src={imageUri}
              resizeMode="contain"
              width="100%"
              height="100%"
            />
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#000"
  },
  image: {
    borderWidth: 1
  },
  modalContent: {
    position: "relative",
    alignItems: "center",
    flex: 1
  },
  modalContentInner: {
    justifyContent: "center",
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#000"
  },
  icon: {
    justifyContent: "center",
    alignItems: "center",
    width: 30,
    height: 30,
    position: "absolute",
    top: Constants.statusBarHeight + 10,
    right: 10,
    zIndex: 9,
    backgroundColor: "#fff",
    borderRadius: 15
  },
  countDown: {
    color: "#fff",
    fontSize: 18
  }
});
