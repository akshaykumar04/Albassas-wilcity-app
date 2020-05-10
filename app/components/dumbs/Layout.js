import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  ViewPropTypes,
  StyleSheet,
  Platform
} from "react-native";
import {
  HeaderHasBack,
  Admob,
  OfflineNotice,
  RTL,
  wait
} from "../../wiloke-elements";
import Constants from "expo-constants";

import Header from "./Header";
import HeaderHasFilter from "./HeaderHasFilter";
import * as Consts from "../../constants/styleConstants";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const HEADER_HEIGHT = 52 + Constants.statusBarHeight;
const CONTENT_HEIGHT = SCREEN_HEIGHT - HEADER_HEIGHT - 50;
const CONTENT_MAX_WIDTH = Consts.screenWidth;

export default class Layout extends Component {
  static defaultProps = {
    containerFixed: true
  };
  renderHeader() {
    const { navigation, colorPrimary, headerType } = this.props;
    const rtl = RTL();
    switch (headerType) {
      case "headerHasBack":
        return (
          <HeaderHasBack
            {...this.props}
            headerBackgroundColor={colorPrimary}
            goBackIconName={rtl ? "chevron-right" : "chevron-left"}
          />
        );
      case "headerHasFilter":
        return (
          <HeaderHasFilter {...this.props} backgroundColor={colorPrimary} />
        );
      default:
        return (
          <Header
            navigation={navigation}
            {...this.props}
            backgroundColor={colorPrimary}
          />
        );
    }
  }
  renderContent() {
    return (
      <View
        style={{
          minHeight: this.props.contentHeight
        }}
        // behavior="padding"
        // enabled
      >
        {this.props.renderContent()}
        <View style={{ height: 20 }} />
      </View>
    );
  }

  renderAdmob = ({ oBanner }) => {
    return <View>{oBanner && <Admob {...oBanner} />}</View>;
  };

  render() {
    const {
      containerFixed,
      scrollViewStyle,
      contentHeight,
      adMob
    } = this.props;
    const contentStyle = [
      {
        height: contentHeight,
        backgroundColor: "#fff",
        width: "100%"
      },
      scrollViewStyle
    ];
    return (
      <View
        style={[styles.container, Platform.isPad && { alignItems: "center" }]}
      >
        {this.props.renderHeader
          ? this.props.renderHeader(HEADER_HEIGHT)
          : this.renderHeader()}
        {/* <OfflineNotice /> */}
        <StatusBar barStyle={this.props.statusBarStyle} />
        {adMob && this.renderAdmob(adMob)}
        {this.props.renderBeforeContent()}
        {this.props.keyboardDismiss ? (
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
            style={{ flex: 1 }}
          >
            <View
              style={{ position: "relative", alignItems: "center", flex: 1 }}
            >
              {this.props.scrollViewEnabled ? (
                <ScrollView
                  style={contentStyle}
                  ref={this.props.scrollViewRef}
                  keyboardDismissMode="on-drag"
                  keyboardShouldPersistTaps="never"
                  showsVerticalScrollIndicator={false}
                  {...this.props}
                >
                  <View style={styles.contentOuter}>
                    <View style={containerFixed ? styles.maxWidth : {}}>
                      {this.renderContent()}
                    </View>
                  </View>
                </ScrollView>
              ) : (
                <View style={[contentStyle, styles.contentOuter]}>
                  <View style={styles.maxWidth}>{this.renderContent()}</View>
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        ) : (
          <View style={{ alignItems: "center", flex: 1 }}>
            {this.props.scrollViewEnabled ? (
              <ScrollView
                ref={this.props.scrollViewRef}
                style={contentStyle}
                refreshControl={this.props.refreshControl}
                contentInset={this.props.contentInset}
                contentOffset={this.props.contentOffset}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="handled"
                scrollEnabled={this.props.scrollEnabled}
                showsVerticalScrollIndicator={false}
                {...this.props}
              >
                <View style={styles.contentOuter}>
                  <View style={containerFixed ? styles.maxWidth : {}}>
                    {this.props.renderContent()}
                  </View>
                </View>
                <View style={{ height: 20 }} />
              </ScrollView>
            ) : (
              <View style={[contentStyle, styles.contentOuter]}>
                <View style={styles.maxWidth}>
                  {this.props.renderContent()}
                </View>
              </View>
            )}
          </View>
        )}
        {this.props.renderAfterContent()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentOuter: {
    flex: 1
  },
  maxWidth: {
    flex: 1
  }
});
Layout.propTypes = {
  renderContent: PropTypes.func,
  renderBeforeContent: PropTypes.func,
  renderAfterContent: PropTypes.func,
  headerType: PropTypes.oneOf(["default", "headerHasFilter", "headerHasBack"]),
  contentScrollView: PropTypes.bool,
  scrollViewStyle: ViewPropTypes.style,
  scrollEnabled: PropTypes.bool,
  scrollViewEnabled: PropTypes.bool,
  contentHeight: PropTypes.number,
  statusBarStyle: PropTypes.string,
  scrollViewRef: PropTypes.func
};
Layout.defaultProps = {
  keyboardDismiss: false,
  scrollViewEnabled: true,
  contentHeight: CONTENT_HEIGHT,
  statusBarStyle: "light-content",
  renderContent: () => {},
  renderBeforeContent: () => {},
  renderAfterContent: () => {}
};
