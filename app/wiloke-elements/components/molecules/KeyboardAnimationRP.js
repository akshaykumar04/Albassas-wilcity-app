import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  View,
  LayoutAnimation,
  UIManager,
  Keyboard,
  Platform
} from "react-native";
import { bottomBarHeight } from "../../functions/bottomBarHeight";
const IOS = Platform.OS === "ios";

class KeyboardAnimationRP extends PureComponent {
  static propTypes = {
    children: PropTypes.func.isRequired
  };

  static defaultProps = {
    children: __ => {}
  };

  constructor() {
    super();
    this.state = {
      isKeyboardOpened: false,
      keyboardHeight: 0
    };

    if (IOS) {
      this.keyboardWillShowListener = Keyboard.addListener(
        "keyboardWillShow",
        this._keyboardShow
      );
      this.keyboardWillHideListener = Keyboard.addListener(
        "keyboardWillHide",
        this._keyboardHide
      );
    } else {
      UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  _keyboardListenerForAndroid = () => {
    if (!IOS) {
      this.keyboardDidShowListener = Keyboard.addListener(
        "keyboardDidShow",
        this._keyboardShow
      );
      this.keyboardDidHideListener = Keyboard.addListener(
        "keyboardDidHide",
        this._keyboardHide
      );
    }
  };

  _configureLayoutAnimation = event => {
    return LayoutAnimation.configureNext({
      duration: IOS ? event.duration : 300,
      create: {
        type: IOS
          ? LayoutAnimation.Types.keyboard
          : LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity
      },
      update: {
        type: IOS
          ? LayoutAnimation.Types.keyboard
          : LayoutAnimation.Types.easeInEaseOut
      }
    });
  };

  _getButtomKeyBoardIphoneX = number => {
    return bottomBarHeight === 0 ? 0 : bottomBarHeight + number;
  };

  _keyboardShow = event => {
    const keyboardHeight =
      (IOS
        ? event.startCoordinates.height
        : event.endCoordinates.height - 100) +
      this._getButtomKeyBoardIphoneX(12);
    this._configureLayoutAnimation(event);
    this.setState({
      keyboardHeight,
      isKeyboardOpened: true
    });
  };

  _keyboardHide = event => {
    const { groupButtonActive } = this.state;
    if (!groupButtonActive) {
      this._configureLayoutAnimation(event);
      this.setState({
        keyboardHeight: 0,
        isKeyboardOpened: false
      });
    }
  };

  _removeKeyboardListener = () => {
    if (IOS) {
      this.keyboardWillShowListener.remove();
      this.keyboardWillHideListener.remove();
    } else {
      this.keyboardDidShowListener.remove();
      this.keyboardDidHideListener.remove();
    }
  };

  componentDidMount() {
    this._keyboardListenerForAndroid();
  }

  componentWillUnmount() {
    this._removeKeyboardListener();
  }

  render() {
    const { children } = this.props;
    const { keyboardHeight, isKeyboardOpened } = this.state;
    return (
      <View {...this.props}>{children(keyboardHeight, isKeyboardOpened)}</View>
    );
  }
}

export default KeyboardAnimationRP;
