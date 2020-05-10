import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, ViewPropTypes } from "react-native";

const MAX_COLUMN = 6;
export class Row extends PureComponent {
  render() {
    const { props } = this;
    return (
      <View
        {...props}
        style={[
          {
            flexWrap: "wrap",
            flexDirection: "row",
            alignItems: "flex-start",
            margin: -props.gap / 2,
            ...(!!props.gapVertical
              ? { marginVertical: -props.gapVertical / 2 }
              : {}),
            ...(!!props.gapHorizontal
              ? { marginHorizontal: -props.gapHorizontal / 2 }
              : {})
          },
          props.style
        ]}
      >
        {props.children}
      </View>
    );
  }
}
Row.defaultProps = {
  gap: 10,
  gapVertical: 0,
  gapHorizontal: 0
};
Row.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
    PropTypes.bool,
    PropTypes.array
  ]),
  gap: PropTypes.number,
  style: ViewPropTypes.style
};

export class Col extends PureComponent {
  render() {
    const { props } = this;
    return (
      <View
        {...props}
        style={[
          {
            width: `${100 / props.column}%`,
            padding: props.gap / 2,
            ...(!!props.gapVertical
              ? { paddingVertical: props.gapVertical / 2 }
              : {}),
            ...(!!props.gapHorizontal
              ? { paddingHorizontal: props.gapHorizontal / 2 }
              : {})
          },
          props.style
        ]}
      >
        {props.children}
      </View>
    );
  }
}
Col.defaultProps = {
  column: 1,
  gap: 10,
  gapVertical: 0,
  gapHorizontal: 0
};
Col.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
    PropTypes.bool,
    PropTypes.array
  ]),
  column: PropTypes.number,
  gap: PropTypes.number,
  style: ViewPropTypes.style
};
