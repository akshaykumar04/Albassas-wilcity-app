import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Text,
  View,
  ActivityIndicator,
  Modal,
  StyleSheet,
  Dimensions
} from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const LoadingFull = ({ ...props }) => {
  return (
    <Modal
      {...props}
      animationType="fade"
      transparent={true}
      onRequestClose={() => {}}
    >
      <View style={styles.modal}>
        <View style={styles.icon}>
          <ActivityIndicator size="small" color="#fff" />
        </View>
        <View style={styles.underlay} />
      </View>
    </Modal>
  );
};

// LoadingFull.propTypes = {
//   ...Object.keys(Modal.propTypes).reduce((acc, cur) => {
//     return {
//       ...acc,
//       ...(cur !== "onRequestClose" ? { [cur]: Modal.propTypes[cur] } : {})
//     };
//   }, {})
// };

const styles = StyleSheet.create({
  modal: {
    position: "relative",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT
  },
  icon: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    borderRadius: 10
  },
  underlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(255,255,255,0.7)",
    zIndex: -1
  }
});

export default LoadingFull;
