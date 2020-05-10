import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { TouchableOpacity, Platform } from "react-native";

const IOS = Platform.OS === "ios";

export default class LongPress extends PureComponent {
  static propTypes = {
    onLongPress: PropTypes.func.isRequired,
    children: PropTypes.element,
    delayIOS: PropTypes.number
  };

  static defaultProps = {
    delayIOS: 15
  };

  constructor(props) {
    super(props);

    this.state = {
      number: 0,
      setEvent: null
    };
  }

  _handleLongPress = event => {
    const { number, setEvent } = this.state;
    const { onLongPress, delayIOS } = this.props;
    if (event) {
      this.setState({ setEvent: event });
    }
    if (IOS) {
      if (number < delayIOS) {
        this.setState({ number: number + 1 });
        this._timer = setTimeout(this._handleLongPress, 5);
      } else {
        onLongPress(setEvent);
        clearTimeout(this._timer);
        this.setState({ number: 0 });
      }
    } else {
      onLongPress(setEvent);
    }
  };

  _handlePressOut = event => {
    clearTimeout(this._timer);
    this.setState({ number: 0 });
  };

  render() {
    return (
      <TouchableOpacity
        {...this.props}
        activeOpacity={1}
        onLongPress={this._handleLongPress}
        onPressOut={this._handlePressOut}
      >
        {this.props.children}
      </TouchableOpacity>
    );
  }
}
