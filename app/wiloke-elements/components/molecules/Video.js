import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  View,
  TouchableOpacity,
  Animated,
  ImageBackground,
  StyleSheet,
  ViewPropTypes,
  Platform
} from "react-native";
import { WebView } from "react-native-webview";
import { Feather } from "@expo/vector-icons";
import stylesBase from "../../../stylesBase";
import * as WebBrowser from "expo-web-browser";
const IOS = Platform.OS === "ios";

export default class Video extends PureComponent {
  static propTypes = {
    ratio: PropTypes.number,
    source: PropTypes.string.isRequired,
    style: ViewPropTypes.style,
    thumbnail: PropTypes.string
  };

  static defaultProps = {
    ratio: (9 / 16) * 100
  };

  state = {
    width: 0,
    opacity: new Animated.Value(1)
  };

  _handlePress = source => () => {
    // if (IOS) {
    //   Animated.timing(this.state.opacity, {
    //     toValue: 0,
    //     duration: 400,
    //     useNativeDriver: true
    //   }).start();
    // } else {
    //   WebBrowser.openBrowserAsync(source);
    // }
    WebBrowser.openBrowserAsync(source);
  };

  _onLayout = event => {
    const { width } = event.nativeEvent.layout;
    this.setState({ width });
  };

  _getSource = () => {
    const { source } = this.props;
    const isYoutube =
      source.search(/(w{3}\.|http(s|):\/\/.*)youtu(\.|)be/g) !== -1;
    const isVimeo = source.search(/.*vimeo\.com\//g) !== -1;
    if (isYoutube) {
      return `https://www.youtube.com/embed/${source.replace(
        /.*youtu(\.|)be.*(\/|watch\?v=|embed\/)/g,
        ""
      )}?rel=0&amp;showinfo=0&amp;modestbranding=1&coltrols=0&shouldPauseOnSuspend=yes`;
    } else if (isVimeo) {
      return `https://player.vimeo.com/video/${source.replace(
        /.*vimeo\.com\/(video\/|)/g,
        ""
      )}`;
    }
  };

  render() {
    const { width, opacity } = this.state;
    const sizePlayButton = width / 4 < 60 ? width / 4 : 60;
    const { source } = this.props;
    return (
      <View
        onLayout={this._onLayout}
        style={[styles.container, this.props.style]}
      >
        <TouchableOpacity
          style={styles.container}
          activeOpacity={1}
          onPress={this._handlePress(source)}
        >
          {/* {IOS ? (
            <WebView
              javaScriptEnabled
              source={{ uri: this._getSource() }}
              scrollEnabled={false}
              style={[{ paddingTop: `${this.props.ratio}%`, width }]}
              useWebKit={true}
            />
          ) : (
            <View style={[{ paddingTop: `${this.props.ratio}%`, width }]} />
          )} */}
          <View style={[{ paddingTop: `${this.props.ratio}%`, width }]} />
          <Animated.View
            style={[styles.placeholder, stylesBase.absFull, { opacity }]}
            pointerEvents="none"
          >
            <ImageBackground
              source={{ uri: this.props.thumbnail }}
              style={styles.imageBg}
            >
              <View
                style={[
                  styles.iconWrap,
                  {
                    width: sizePlayButton,
                    height: sizePlayButton,
                    borderRadius: sizePlayButton / 2,
                    backgroundColor: "rgba(255, 255, 255, 0.25)"
                  }
                ]}
              >
                <Feather name="play" size={sizePlayButton / 2} color="#fff" />
              </View>
              <View style={[styles.overlay, stylesBase.absFull]} />
            </ImageBackground>
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%"
  },
  placeholder: {
    zIndex: 9
  },
  imageBg: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%"
  },
  overlay: {
    zIndex: -1,
    backgroundColor: "#000",
    opacity: 0.5
  },
  iconWrap: {
    position: "relative",
    zIndex: 9,
    justifyContent: "center",
    alignItems: "center"
  }
});
