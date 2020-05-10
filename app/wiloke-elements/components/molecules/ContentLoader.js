import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Text, Animated, StyleSheet } from "react-native";
import * as Consts from "../../../constants/styleConstants";

export default class ContentLoader extends Component {
  static propTypes = {
    headerAvatar: PropTypes.bool,
    content: PropTypes.bool,
    contentSquare: PropTypes.bool,
    contentSquareWidth: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    contentSquareLength: PropTypes.number,
    featureRatioWithPadding: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    contentHeight: PropTypes.number,
    avatarSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    avatarSquare: PropTypes.bool
  };

  static defaultProps = {
    headerAvatar: false,
    content: false,
    header: false,
    contentSquare: false,
    contentSquareWidth: "33.33%",
    contentSquareLength: 3,
    featureRatioWithPadding: 0,
    contentHeight: 145,
    avatarSize: 40,
    avatarSquare: false
  };

  state = {
    animation: new Animated.Value(0)
  };

  _createAnimation = () => {
    this.state.animation.setValue(0);
    Animated.timing(this.state.animation, {
      toValue: 100,
      duration: 1600,
      useNativeDriver: true
    }).start(() => this._createAnimation());
  };

  componentDidMount() {
    this._createAnimation();
  }

  _getAnimation = () => {
    return this.state.animation.interpolate({
      inputRange: [0, 50, 100],
      outputRange: [1, 0.4, 1],
      extrapolate: "clamp"
    });
  };

  renderHeaderAvatar = () => (
    <View style={styles.header}>
      <View
        style={[
          styles.gray,
          {
            width: this.props.avatarSize,
            height: this.props.avatarSize,
            borderRadius: this.props.avatarSquare
              ? 0
              : this.props.avatarSize / 2
          }
        ]}
      />
      <View style={{ width: 10 }} />
      <View style={{ width: "100%" }}>
        <View style={[styles.gray, styles.wide]} />
        <View style={{ height: 8 }} />
        <View style={[styles.gray, styles.wide, { width: "25%" }]} />
      </View>
    </View>
  );

  renderHeader = () => (
    <View style={[styles.header, { paddingVertical: 20 }]}>
      <View style={[styles.gray, styles.wide, { width: "25%" }]} />
    </View>
  );

  renderFeature = paddingTop => (
    <View>
      <View style={[styles.gray, { width: "100%", paddingTop }]} />
    </View>
  );

  renderContentSquare = () => (
    <View style={styles.content}>
      <View
        style={{
          flexDirection: "row",
          margin: -5
        }}
      >
        {Array(this.props.contentSquareLength)
          .fill(null)
          .map((_, index) => (
            <View
              key={index.toString()}
              style={{
                width: this.props.contentSquareWidth
              }}
            >
              <View style={{ padding: 5 }}>
                <View style={[styles.gray, styles.square]} />
              </View>
            </View>
          ))}
      </View>
    </View>
  );

  renderContent = () => (
    <View style={[styles.content, { height: this.props.contentHeight }]}>
      <View style={[styles.gray, styles.wide, { width: "60%" }]} />
      <View style={{ height: 12 }} />
      <View style={[styles.gray, styles.wide, { width: "40%" }]} />
      <View style={{ height: 12 }} />
      <View style={[styles.gray, styles.wide, { width: "20%" }]} />
    </View>
  );

  render() {
    const {
      header,
      headerAvatar,
      content,
      contentSquare,
      featureRatioWithPadding
    } = this.props;
    return (
      <Animated.View
        style={[styles.container, { opacity: this._getAnimation() }]}
      >
        {this.renderFeature(featureRatioWithPadding)}
        {headerAvatar && this.renderHeaderAvatar()}
        {header && this.renderHeader()}
        {content && this.renderContent()}
        {contentSquare && this.renderContentSquare()}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: Consts.colorGray1
  },
  gray: {
    backgroundColor: Consts.colorGray1
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Consts.colorGray1
  },
  content: {
    paddingVertical: 20,
    paddingHorizontal: 10
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  wide: {
    width: "50%",
    height: 7
  },
  square: {
    paddingTop: "100%"
  }
});
