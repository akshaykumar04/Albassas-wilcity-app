import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  ViewPropTypes,
  ScrollView,
  Platform,
  Dimensions
} from "react-native";
import { WebView } from "react-native-webview";
import _ from "lodash";

const screenHeight = Dimensions.get("window").height;
const IOS = Platform.OS === "ios";
export default class WilWebView extends Component {
  static propTypes = {
    containerStyle: ViewPropTypes.style,
    listSelectorRemoved: PropTypes.array,
    scrollViewEnabled: PropTypes.bool,
    injectCss: PropTypes.string,
    onLoadEnd: PropTypes.func
  };

  static defaultProps = {
    listSelectorRemoved: [],
    injectCss: "",
    scrollViewEnabled: false,
    onLoadEnd: () => {}
  };

  state = {
    webViewHeights: [],
    webViewHeight: 100,
    scrollEnabled: true
  };

  _setWebViewHeight = event => {
    const { onLoadEnd } = this.props;
    (async _event => {
      const { nativeEvent } = _event;
      await this.setState(prevState => {
        return {
          webViewHeights: [
            ...prevState.webViewHeights,
            parseInt(nativeEvent.jsEvaluationValue)
          ],
          scrollEnabled: false
        };
      });
      const { webViewHeights } = this.state;
      const webViewHeight = webViewHeights[webViewHeights.length - 1] / 2;
      console.log(webViewHeight);
      this.setState({ webViewHeight });
    })(event);
    onLoadEnd(event);
  };

  _getCss = injectCss => {
    return `<style type='text/css'>${injectCss
      .replace(/\n/g, "")
      .replace(/\s+/g, " ")}</style>`;
  };

  _getJsListSelectorRemoved = listSelectorRemoved => {
    const jsArr = listSelectorRemoved.map(item => {
      return `document.querySelector("${item}").remove();`;
    });
    return !_.isEmpty(listSelectorRemoved) ? jsArr.join("\n") : "";
  };

  _setJavascript = __ => {
    const { listSelectorRemoved, injectCss } = this.props;
    const jsString = this._getJsListSelectorRemoved(listSelectorRemoved);
    if (!injectCss) {
      const cssString = this._getCss(injectCss);
      this._webView.injectJavaScript(`
        ${jsString}
        const cssString = "${cssString}";
        document.head.insertAdjacentHTML(
          "beforeend",
          cssString
        );
    `);
    }
  };

  render() {
    const { isReady, webViewHeight, scrollEnabled } = this.state;
    const { containerStyle, scrollViewEnabled } = this.props;
    const Container = scrollViewEnabled ? ScrollView : View;
    return (
      <Container style={containerStyle}>
        <WebView
          {...this.props}
          ref={ref => (this._webView = ref)}
          originWhitelist={["*"]}
          scrollEnabled={scrollEnabled}
          injectedJavaScript={`
            document.body.scrollHeight;
          `}
          style={{
            height: screenHeight
          }}
          onLoad={this._setJavascript}
          onLoadEnd={this._setWebViewHeight}
          onError={err => console.log(err)}
          useWebKit={true}
        />
      </Container>
    );
  }
}
