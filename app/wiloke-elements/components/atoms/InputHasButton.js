import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  ViewPropTypes
} from "react-native";
import Input from "./Input";
import FontIcon from "../molecules/FontIcon";
import * as Consts from "../../../constants/styleConstants";
import _ from "lodash";

/**
 * Constants
 */
const ICON_SIZE = 32;
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IOS = Platform.OS === "ios";
const ICON_BUTTON_SIZE = 26;

/**
 * Start PureComponent
 */
export default class InputHasButton extends PureComponent {
  /**
   * PropTypes
   */
  static propTypes = {
    iconName: PropTypes.string,
    colorPrimary: PropTypes.string,
    onChangeText: PropTypes.func,
    onPressText: PropTypes.func,
    containerStyle: ViewPropTypes.style,
    groupButtonData: PropTypes.array,
    renderGroupButtonItem: PropTypes.func,
    keyExtractor: PropTypes.func
  };

  /**
   * Default Props
   */
  static defaultProps = {
    iconName: "arrow-up",
    colorPrimary: Consts.colorPrimary,
    onChangeText: _ => {},
    onPressText: _ => {},
    renderGroupButtonItem: _ => {},
    keyExtractor: (item, index) => index.toString()
  };

  state = {
    text: ""
  };

  _handleChangeText = text => {
    this.setState({ text });
    this.props.onChangeText(text);
  };

  _handlePress = event => {
    const { text } = this.state;
    this.props.onPressText(text, event);
    this.setState({ text: "" });
  };

  _renderGroupButton = () => {
    const { groupButtonData, renderGroupButtonItem, keyExtractor } = this.props;
    return (
      !_.isEqual(groupButtonData) && (
        <View style={styles.groupButton}>
          {groupButtonData.map((item, index) => {
            return (
              <View
                key={keyExtractor(item, index)}
                style={styles.groupButtonItem}
              >
                {renderGroupButtonItem({ item, index })}
              </View>
            );
          })}
        </View>
      )
    );
  };

  /**
   * Render
   */
  render() {
    const { containerStyle, groupButtonData } = this.props;
    return (
      <View style={[styles.container, containerStyle]}>
        <View style={styles.inputContainer}>
          <Input
            {...this.props}
            placeholderTextColor={Consts.colorDark4}
            styleWrapper={[
              styles.inputWrapper,
              {
                width: "100%",
                paddingRight:
                  (ICON_BUTTON_SIZE + 2) * groupButtonData.length + 20
              }
            ]}
            style={styles.input}
            onChangeText={this._handleChangeText}
          />
          {this._renderGroupButton()}
        </View>
        <TouchableOpacity
          activeOpacity={0.4}
          onPress={this._handlePress}
          style={[
            styles.iconWrap,
            {
              backgroundColor: this.props.colorPrimary
            }
          ]}
        >
          <FontIcon name={this.props.iconName} size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: Consts.colorGray1,
    backgroundColor: Consts.colorGray3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  inputContainer: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    width: SCREEN_WIDTH - 55,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Consts.colorGray1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "ios" ? 0 : 2,
    paddingBottom: 2,
    overflow: "hidden"
  },
  groupButton: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom: 3,
    right: 5,
    zIndex: 9
  },
  groupButtonItem: {
    width: ICON_BUTTON_SIZE,
    height: ICON_BUTTON_SIZE,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 2
  },
  inputWrapper: {
    height: "100%",
    borderWidth: 0,
    padding: 0
  },
  iconWrap: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    justifyContent: "center",
    alignItems: "center"
  }
});
