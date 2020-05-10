import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Animated, Image, StyleSheet, Dimensions } from "react-native";
import { ParallaxScreen, ImageCover } from "../../wiloke-elements";
import Heading from "./Heading";

const LOGO_SIZE = 80;
const WAVE_SIZE = 168;
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default class ParallaxListingScreen extends Component {
  static propTypes = {
    renderContent: PropTypes.func,
    logo: PropTypes.string,
    title: PropTypes.string,
    tagline: PropTypes.string,
    renderNavigation: PropTypes.func
  };

  static defaultProps = {
    renderContent: () => {},
    renderNavigation: () => {}
  };

  state = {
    scrollY: new Animated.Value(0),
    headerMaxHeight: 0,
    headerMinHeight: 0
  };

  _handleGetScrollYAnimation = (scrollY, headerMeasure) => {
    const { headerMaxHeight, headerMinHeight } = headerMeasure;
    this.setState({ scrollY, headerMaxHeight, headerMinHeight });
  };

  _getHeaderDistance = () => {
    const { headerMaxHeight, headerMinHeight } = this.state;
    return headerMaxHeight - headerMinHeight;
  };

  _getLogoWrapperInnerStyle = () => {
    const { scrollY } = this.state;
    const scale = scrollY.interpolate({
      inputRange: [0, this._getHeaderDistance()],
      outputRange: [1, 0],
      extrapolate: "clamp"
    });
    const opacity = scrollY.interpolate({
      inputRange: [this._getHeaderDistance(), this._getHeaderDistance() + 1],
      outputRange: [1, 0],
      extrapolate: "clamp"
    });
    return {
      transform: [{ scale }],
      opacity
    };
  };

  _getLogoWrapperStyle = () => {
    const { scrollY, headerMinHeight } = this.state;
    const opacity = scrollY.interpolate({
      inputRange: [headerMinHeight, headerMinHeight + 1],
      outputRange: [1, 0],
      extrapolate: "clamp"
    });
    return { opacity: 1 };
  };

  renderAfterImage = () => {
    return (
      <Animated.View
        style={[styles.logoWrapper, this._getLogoWrapperInnerStyle()]}
      >
        <Animated.View style={[styles.logoWrapInner]}>
          <ImageCover
            src={this.props.logo}
            width={LOGO_SIZE}
            borderRadius={LOGO_SIZE / 2}
            styles={styles.logo}
          />
          <Image
            source={require("../../../assets/wave.png")}
            style={styles.wave}
          />
        </Animated.View>
      </Animated.View>
    );
  };

  renderContent = () => {
    const { title, tagline } = this.props;
    return (
      <View style={{ paddingTop: 8 }}>
        <Heading
          title={title}
          text={tagline}
          titleSize={16}
          align="center"
          style={{ paddingHorizontal: 15 }}
        />
        <View style={{ height: 10 }} />
        {this.props.renderContent()}
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <ParallaxScreen
          {...this.props}
          renderAfterImage={this.renderAfterImage}
          renderContent={this.renderContent}
          onGetScrollYAnimation={this._handleGetScrollYAnimation}
          afterImageMarginTop={-40}
        />
        {this.props.renderNavigation()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    height: SCREEN_HEIGHT,
    flex: 1
  },
  logoWrapper: {
    position: "relative",
    alignItems: "center",
    zIndex: 9999
  },
  logoWrapInner: {
    position: "relative",
    width: LOGO_SIZE
  },
  logo: {
    marginTop: 4
  },
  wave: {
    position: "absolute",
    top: 0,
    left: -WAVE_SIZE / 2 + LOGO_SIZE / 2,
    tintColor: "#fff",
    width: WAVE_SIZE,
    height: (WAVE_SIZE * 131) / 317
  }
});
