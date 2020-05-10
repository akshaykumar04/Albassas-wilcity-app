import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, Text, ViewPropTypes } from "react-native";
import * as Consts from "../../constants/styleConstants";

export default class RatedSmall extends PureComponent {
  static propTypes = {
    rate: PropTypes.number,
    max: PropTypes.number,
    text: PropTypes.string,
    style: ViewPropTypes.style,
    horizontal: PropTypes.bool
  };
  static defaultProps = {
    max: 10
  };
  setColor = () => {
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
    const { rate, max, text, horizontal } = this.props;
    return rate > 0 ? (
      <View
        style={[
          this.props.style,
          horizontal
            ? {
                flexDirection: "row",
                justifyContent: "space-between"
              }
            : {}
        ]}
      >
        <View>
          {text && (
            <Text style={{ color: Consts.colorDark2, fontSize: 12 }}>
              {text}
            </Text>
          )}
        </View>
        <View style={{ height: 3 }} />
        <Text style={this.setColor()}>
          {rate < 10 && rate.toString().length === 1 ? rate + ".0" : rate}
        </Text>
      </View>
    ) : (
      <View />
    );
  }
}
