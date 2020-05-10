import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, Text } from "react-native";
import * as Consts from "../../../constants/styleConstants";

const styleGeneral = {
  color: Consts.colorDark1,
  marginBottom: 8,
  fontWeight: "600"
};
const propTypesGeneral = {
  ...Text.propTypes
};
export const H1 = props => (
  <Text {...props} style={[styleGeneral, { fontSize: 40 }, props.style]}>
    {props.children}
  </Text>
);
H1.propTypes = propTypesGeneral;

export const H2 = props => (
  <Text {...props} style={[styleGeneral, { fontSize: 30 }, props.style]}>
    {props.children}
  </Text>
);
H2.propTypes = propTypesGeneral;

export const H3 = props => (
  <Text {...props} style={[styleGeneral, { fontSize: 26 }, props.style]}>
    {props.children}
  </Text>
);
H3.propTypes = propTypesGeneral;

export const H4 = props => (
  <Text {...props} style={[styleGeneral, { fontSize: 22 }, props.style]}>
    {props.children}
  </Text>
);
H4.propTypes = propTypesGeneral;
export const H5 = props => (
  <Text {...props} style={[styleGeneral, { fontSize: 18 }, props.style]}>
    {props.children}
  </Text>
);
H5.propTypes = propTypesGeneral;
export const H6 = props => (
  <Text {...props} style={[styleGeneral, { fontSize: 14 }, props.style]}>
    {props.children}
  </Text>
);
H6.propTypes = propTypesGeneral;

export const P = props => (
  <Text
    {...props}
    style={[
      styleGeneral,
      {
        fontSize: 13,
        fontWeight: "400",
        lineHeight: 19,
        color: Consts.colorDark2
      },
      props.style
    ]}
  >
    {props.children}
  </Text>
);
P.propTypes = propTypesGeneral;
