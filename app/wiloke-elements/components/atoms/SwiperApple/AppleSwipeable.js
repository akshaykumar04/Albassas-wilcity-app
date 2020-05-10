import React, { Component } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";

export default class AppleStyleSwipeableRow extends Component {
  renderLeftActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1]
    });
    return (
      <RectButton style={styles.leftAction} onPress={this.close}>
        <Animated.Text
          style={[
            styles.actionText,
            {
              transform: [{ translateX: trans }]
            }
          ]}
        >
          Delete
        </Animated.Text>
      </RectButton>
    );
  };
  renderRightAction = (text, color, x, progress) => {
    const { onPressRight } = this.props;
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0]
    });
    const pressHandler = () => {
      onPressRight();
      this.close();
    };
    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
        <RectButton
          style={[styles.rightAction, { backgroundColor: color }]}
          onPress={pressHandler}
        >
          <Text style={styles.actionText}>{text}</Text>
        </RectButton>
      </Animated.View>
    );
  };
  renderRightActions = progress => (
    <View style={{ width: 80, flexDirection: "row" }}>
      {this.renderRightAction(
        this.props.translations.delete,
        "#dd2c00",
        80,
        progress
      )}
      {/* {this.renderRightAction("Flag", "#ffab00", 128, progress)}
      {this.renderRightAction("More", "#dd2c00", 64, progress)} */}
    </View>
  );
  updateRef = ref => {
    this._swipeableRow = ref;
  };
  close = () => {
    this._swipeableRow.close();
  };
  render() {
    const { children } = this.props;
    return (
      <Swipeable
        ref={this.updateRef}
        friction={2}
        leftThreshold={30}
        rightThreshold={40}
        // renderLeftActions={this.renderLeftActions}
        renderRightActions={this.renderRightActions}
      >
        {children}
      </Swipeable>
    );
  }
}

const styles = StyleSheet.create({
  leftAction: {
    width: 100,
    backgroundColor: "#497AFC",
    justifyContent: "center"
  },
  actionText: {
    color: "white",
    fontSize: 16,
    backgroundColor: "transparent",
    padding: 10
  },
  rightAction: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  }
});
