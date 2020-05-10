import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Text, View, Modal, StyleSheet, Dimensions } from "react-native";
import _ from "lodash";
import he from "he";
import { wait } from "../../functions/wilokeFunc";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const TINTCOLOR_DEFAULT = "rgba(0,0,0,0.8)";

export default class Toast extends PureComponent {
  static propTypes = {
    show: PropTypes.func.isRequired
  };

  static defaultProps = {
    show: _ => {}
  };

  state = {
    isVisible: false,
    text: "...",
    tintColor: TINTCOLOR_DEFAULT
  };

  show = async (text, config) => {
    const defaultConfig = {
      onStartShow: _ => {},
      onEndShow: _ => {},
      delay: 4000,
      tintColor: TINTCOLOR_DEFAULT
    };
    const configure = {
      ...defaultConfig,
      ...(typeof config === "object" ? config : { delay: config })
    };
    const { onStartShow, onEndShow, delay, tintColor } = configure;
    await this.setState({
      text,
      tintColor,
      isVisible: true
    });
    await onStartShow();
    this.timeout = await setTimeout(() => {
      this.setState({ isVisible: false });
    }, delay);
    await wait(delay);
    onEndShow();
  };

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render() {
    const { text, isVisible, tintColor } = this.state;
    return (
      <Modal
        visible={isVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => {}}
      >
        <View style={styles.modal}>
          <View style={styles.textWrap}>
            <View
              style={[styles.textWrapInner, { backgroundColor: tintColor }]}
            >
              <Text style={styles.text}>{he.decode(text)}</Text>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    position: "relative",
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    padding: 10
  },
  textWrap: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    flexDirection: "row",
    marginBottom: 30
  },
  textWrapInner: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 30
  },
  text: {
    fontSize: 14,
    lineHeight: 19,
    color: "#fff",
    textAlign: "center",
    padding: 10,
    paddingHorizontal: 25
  }
});
