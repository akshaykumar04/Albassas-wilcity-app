import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { TouchableOpacity } from "react-native";

const TIME_TAB_DOUBLE = 300;

export default class DoublePress extends PureComponent {
  static propTypes = {
    onDoublePress: PropTypes.func.isRequired,
    onPressOut: PropTypes.func,
    onLayout: PropTypes.func,
    children: PropTypes.element
  };

  static defaultProps = {
    onDoublePress: () => {},
    onPressOut: () => {},
    onLayout: () => {}
  };

  constructor(props) {
    super(props);

    this.state = {
      width: 0,
      height: 0,
      prevTimestamp: 0
    };
  }

  _getSize = event => {
    const { width, height } = event.nativeEvent.layout;
    this.setState({ width, height });
    this.props.onLayout(event);
  };

  _boundingCheck = (lx, ly, w, h) => {
    return lx > 0 && lx < w && ly > 0 && ly < h;
  };

  _handlePressOut = event => {
    const { width, height, prevTimestamp } = this.state;
    const { locationX, locationY, timestamp } = event.nativeEvent;
    if (this._boundingCheck(locationX, locationY, width, height)) {
      this.setState({ prevTimestamp: timestamp });
      if (timestamp - prevTimestamp <= TIME_TAB_DOUBLE) {
        this.props.onDoublePress(event);
        this.props.onPressOut(event);
      }
    }
  };

  render() {
    return (
      <TouchableOpacity
        {...this.props}
        activeOpacity={1}
        onPressOut={this._handlePressOut}
        onLayout={this._getSize}
      >
        {this.props.children}
      </TouchableOpacity>
    );
  }
}
