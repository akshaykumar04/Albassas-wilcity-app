import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, ViewPropTypes } from "react-native";
import * as Consts from "../../constants/styleConstants";
import { RTL } from "../../wiloke-elements";

export default class Rated extends PureComponent {
  static propTypes = {
    rate: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    max: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    text: PropTypes.string,
    rateStyle: Text.propTypes.style,
    maxStyle: Text.propTypes.style,
    style: ViewPropTypes.style
  };
  static defaultProps = {
    max: 10
  };
  _getColor = () => {
    const { rate, max } = this.props;
    if (rate >= 0 && rate < max / 5) {
      return { color: "#e03d3d" };
    } else if (rate >= max / 5 && rate < max / 2.5) {
      return { color: "#e68145" };
    } else if (rate >= max / 2.5 && rate < max / 1.66666667) {
      return { color: "#f4b34d" };
    } else if (rate >= max / 1.66666667 && rate < max / 1.25) {
      return { color: "#8dda62" };
    } else if (rate >= max / 1.25 && rate <= max) {
      return { color: "#3ece7e" };
    }
  };
  render() {
    const { rate, max, text, rateStyle, maxStyle, style } = this.props;
    const rtl = RTL();
    return rate > 0 ? (
      <View style={[styles.container, style]}>
        <Text style={[styles.rate, rateStyle, this._getColor()]}>
          {rate < 10 && rate.toString().length === 1 ? rate + ".0" : rate}
        </Text>
        <View style={styles.right}>
          <Text style={[styles.max, maxStyle]}>
            {rtl ? `${max}/` : `/${max}`}
          </Text>
          {text && <Text style={[styles.text, this._getColor()]}>{text}</Text>}
        </View>
      </View>
    ) : (
      <View />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center"
  },
  rate: {
    fontSize: 34,
    marginRight: 5
  },
  max: {
    fontSize: 11,
    color: Consts.colorDark3
  },
  text: {
    fontSize: 11
  }
});
