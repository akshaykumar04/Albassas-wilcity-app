import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import FontIcon from "../molecules/FontIcon";
import * as Consts from "../../../constants/styleConstants";
import he from "he";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default class IconTextMedium extends PureComponent {
  static propTypes = {
    iconSize: PropTypes.number,
    texNumberOfLines: PropTypes.number,
    iconName: PropTypes.string,
    iconColor: PropTypes.string,
    textStyle: Text.propTypes.style,
    text: PropTypes.string,
    iconBackgroundColor: PropTypes.string,
    renderBoxFirstText: PropTypes.func,
    renderBoxLastText: PropTypes.func,
    disabled: PropTypes.bool
  };
  static defaultProps = {
    iconSize: 36,
    iconName: "map",
    iconColor: Consts.colorDark2,
    iconBackgroundColor: Consts.colorGray2,
    disabled: false
  };
  render() {
    const {
      iconSize,
      texNumberOfLines,
      iconName,
      iconColor,
      textStyle,
      text,
      iconBackgroundColor,
      renderBoxFirstText,
      renderBoxLastText
    } = this.props;
    return (
      <View
        style={[
          styles.container,
          { paddingLeft: iconSize, minHeight: iconSize }
        ]}
      >
        <View
          style={[
            styles.iconWrapper,
            {
              width: iconSize,
              height: iconSize,
              borderRadius: iconSize / 2,
              backgroundColor: iconBackgroundColor
            }
          ]}
        >
          <FontIcon
            name={iconName}
            size={iconSize * (18 / 36)}
            color={iconColor}
          />
        </View>
        <View style={styles.textWrapper}>
          {renderBoxFirstText && (
            <View style={styles.firstText}>{renderBoxFirstText()}</View>
          )}
          <Text
            style={[
              {
                fontSize: 12,
                color: Consts.colorDark2,
                marginLeft: 8,
                textDecorationLine: this.props.disabled
                  ? "line-through"
                  : "none"
              },
              textStyle
            ]}
            numberOfLines={texNumberOfLines}
          >
            {he.decode(text)}
          </Text>
        </View>
        {renderBoxLastText && (
          <View style={styles.lastText}>{renderBoxLastText()}</View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    justifyContent: "center",
    width: "100%"
  },
  iconWrapper: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0
  },
  textWrapper: {
    flexDirection: "row"
  },
  firstText: {
    width: 50,
    height: 50,
    borderRadius: Consts.round,
    backgroundColor: Consts.colorGray1,
    marginLeft: 10,
    overflow: "hidden"
  },
  lastText: {
    width: SCREEN_WIDTH / 1.5,
    height: ((SCREEN_WIDTH / 1.5) * 9) / 16,
    borderRadius: Consts.round,
    backgroundColor: Consts.colorGray1,
    marginTop: 10,
    marginLeft: 10,
    overflow: "hidden"
  }
});
