import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet } from "react-native";
import * as Consts from "../../constants/styleConstants";
import stylesBase from "../../stylesBase";
import _ from "lodash";
import { RTL } from "../../wiloke-elements";

export default class Heading extends PureComponent {
  render() {
    const rtl = RTL();

    const titleStyles = {
      fontSize: this.props.titleSize,
      fontWeight: "bold",
      color: this.props.titleColor,
      textAlign: rtl ? "left" : "auto"
    };
    const textStyles = {
      fontSize: this.props.textSize,
      color: this.props.textColor,
      textAlign: rtl ? "left" : "auto"
    };
    return (
      <View
        style={[
          styles.container,
          {
            marginBottom: this.props.mb,
            alignItems: this.props.align
          },
          this.props.style
        ]}
      >
        <Text
          style={[stylesBase.h6, titleStyles]}
          numberOfLines={this.props.titleNumberOfLines}
        >
          {this.props.title}
        </Text>
        {!_.isEmpty(this.props.text) && (
          <Text
            style={[stylesBase.text, textStyles]}
            numberOfLines={this.props.textNumberOfLines}
          >
            {this.props.text}
          </Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    padding: 0
  }
});

Heading.propTypes = {
  titleSize: PropTypes.number,
  textSize: PropTypes.number,
  mb: PropTypes.number,
  textNumberOfLines: PropTypes.number,
  titleNumberOfLines: PropTypes.number,
  titleColor: PropTypes.string,
  textColor: PropTypes.string,
  align: PropTypes.string,
  title: PropTypes.string,
  text: PropTypes.string
};

Heading.defaultProps = {
  titleSize: 24,
  titleColor: Consts.colorDark1,
  textSize: 12,
  textColor: Consts.colorDark3
};
