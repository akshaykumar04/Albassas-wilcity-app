// @flow
import React, { PureComponent } from "react";
import { View, Text, StyleSheet, ViewPropTypes, TextProps } from "react-native";
import * as Const from "../../../constants/styleConstants";
import PropTypes from "prop-types";

export default class GradeView extends PureComponent {
  static propTypes = {
    gradeText: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    containerStyle: ViewPropTypes.style,
    RATED_SIZE: PropTypes.number,
    colorPrimary: PropTypes.string
  };
  static defaultProps = {
    containerStyle: {},
    RATED_SIZE: 30,
    colorPrimary: "#fff"
  };

  _renderGrade = () => {
    const { gradeText, textStyle } = this.props;
    return <Text style={[styles.text, textStyle]}>{gradeText}</Text>;
  };

  render() {
    const { containerStyle, RATED_SIZE, colorPrimary } = this.props;
    return (
      <View
        style={[
          styles.container,
          containerStyle,
          {
            width: RATED_SIZE,
            height: RATED_SIZE,
            backgroundColor: colorPrimary
          }
        ]}
      >
        {this._renderGrade()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100
  },
  text: {
    fontSize: 14,
    color: Const.colorLight,
    fontWeight: "bold"
  }
});
