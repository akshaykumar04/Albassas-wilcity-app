import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  Modal,
  ScrollView,
  ActionSheetIOS,
  TouchableOpacity,
  TouchableHighlight,
  StatusBar,
  Animated,
  Easing,
  Dimensions,
  Platform,
  StyleSheet,
  ViewPropTypes
} from "react-native";
import Constants from "expo-constants";
import LongPress from "../atoms/LongPress";
import DoublePress from "../atoms/DoublePress";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const IOS = Platform.OS === "ios";
const ANIMATION_MAX = 100;
const ANIMATION_MIN = 0;
const ANIMATION_DURATION = 300;

export default class ActionSheet extends PureComponent {
  static propTypes = {
    options: PropTypes.array,
    onAction: PropTypes.func,
    renderButtonItem: PropTypes.func,
    onPressButtonItem: PropTypes.func,
    title: PropTypes.string,
    message: PropTypes.string,
    destructiveButtonIndex: PropTypes.number,
    cancelButtonIndex: PropTypes.number,
    buttonItemActionType: PropTypes.oneOf([
      "onPress",
      "onLongPress",
      "onDoublePress"
    ]),
    modifier: PropTypes.oneOf(["default", "fractal"]),
    styleContainer: ViewPropTypes.style
  };

  static defaultProps = {
    options: [],
    onAction: () => {},
    renderButtonItem: () => {},
    onPressButtonItem: () => {},
    buttonItemActionType: "onPress",
    modifier: "default"
  };

  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      pan: new Animated.Value(0),
      headerHeight: 81,
      scrollViewInnerHeight: 0
    };

    const { modifier } = this.props;
    if (modifier === "fractal") {
      this.LIST_ITEM_HEIGHT = 46;
      this.LIST_WRAP_PADDING = 0;
      this.SPACING_LIST_ALL_END_BOTTOM = 0;
    } else {
      this.LIST_ITEM_HEIGHT = 57.5;
      this.LIST_WRAP_PADDING = 10;
      this.SPACING_LIST_ALL_END_BOTTOM = 8;
    }
  }

  _handlePressIOS = event => {
    const {
      options,
      title,
      message,
      destructiveButtonIndex,
      cancelButtonIndex,
      onAction,
      onPressButtonItem
    } = this.props;
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options,
        title,
        message,
        destructiveButtonIndex,
        cancelButtonIndex
      },
      buttonIndex => onAction(buttonIndex)
    );
    onPressButtonItem(event);
  };

  _getHeaderHeight = () => {
    const { title, message } = this.props;
    if (title || message) {
      this._header.measureInWindow((x, y, width, height) => {
        this.setState({
          headerHeight: height
        });
      });
    } else {
      this.setState({
        headerHeight: 0
      });
    }
  };

  _getHeightScrollViewInner = event => {
    this.setState({ scrollViewInnerHeight: event.nativeEvent.layout.height });
  };

  _handlePressAndroid = event => {
    const { onPressButtonItem } = this.props;
    this.setState({ isVisible: true });
    setTimeout(this._getHeaderHeight, 50);
    onPressButtonItem(event);
  };

  _handleShowModal = () => {
    const { pan } = this.state;
    Animated.timing(pan, {
      toValue: ANIMATION_MAX,
      duration: ANIMATION_DURATION,
      useNativeDriver: true
    }).start();
  };

  _handleCloseModal = () => {
    const { pan } = this.state;
    Animated.timing(pan, {
      toValue: ANIMATION_MIN,
      duration: ANIMATION_DURATION,
      useNativeDriver: true
    }).start(() => {
      this.setState({ isVisible: false });
    });
  };

  _handleAction = (event, index) => {
    const { cancelButtonIndex, onAction } = this.props;
    onAction(index);
    this._handleCloseModal();
  };

  renderUnderlay() {
    const { pan, isVisible } = this.state;
    const OPACITY = pan.interpolate({
      inputRange: [ANIMATION_MIN, ANIMATION_MAX],
      outputRange: [0, 0.4],
      extrapolate: "clamp"
    });
    return (
      <Animated.View
        style={[
          styles.absFull,
          styles.underlay,
          {
            backgroundColor: isVisible ? "#000" : "transparent",
            opacity: OPACITY
          }
        ]}
      />
    );
  }

  _modifierStyleListItemText = () => {
    const { modifier } = this.props;
    switch (modifier) {
      case "fractal":
        return { fontSize: 14, textAlign: "center" };
      default:
        return { fontSize: 20, textAlign: "center" };
    }
  };

  renderListItem(item, index) {
    const { destructiveButtonIndex, cancelButtonIndex, modifier } = this.props;
    const isItemBottom = index === 0;
    return (
      <TouchableHighlight
        key={index.toString()}
        activeOpacity={1}
        underlayColor="#e9e9ea"
        onPress={event => this._handleAction(event, index)}
        style={[
          styles.listItem,
          {
            height: this.LIST_ITEM_HEIGHT,
            borderRadius: isItemBottom && modifier === "default" ? 12 : 0,
            borderTopWidth:
              (isItemBottom && modifier === "default") || index === 1 ? 0 : 1,
            backgroundColor: isItemBottom
              ? modifier === "default"
                ? "#fff"
                : "rgba(255,255,255,0.96)"
              : null,
            opacity: isItemBottom && modifier === "default" ? 0.96 : 1
          }
        ]}
      >
        <View>
          <Text
            numberOfLines={1}
            style={[
              this._modifierStyleListItemText(),
              {
                fontWeight: cancelButtonIndex === index ? "700" : "400",
                color:
                  destructiveButtonIndex === index
                    ? "#ff3b30"
                    : modifier === "default"
                    ? "#007aff"
                    : "#111"
              }
            ]}
          >
            {item}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }

  renderHeaderList() {
    const { title, message, header } = this.props;
    return (
      (title || message) && (
        <View
          ref={ref => (this._header = ref)}
          style={[
            styles.header,
            {
              paddingBottom: title && message ? 21 : 15
            }
          ]}
        >
          {title && (
            <Text style={[styles.headerText, { fontWeight: "700" }]}>
              {title}
            </Text>
          )}
          {title && message && <View style={{ height: 10 }} />}
          {message && (
            <Text
              style={[
                styles.headerText,
                ,
                { fontWeight: title ? "400" : "700" }
              ]}
            >
              {message}
            </Text>
          )}
        </View>
      )
    );
  }

  renderListAction() {
    const { options, modifier } = this.props;
    const { headerHeight, pan, scrollViewInnerHeight } = this.state;
    const TRANSLATE_Y = pan.interpolate({
      inputRange: [ANIMATION_MIN, ANIMATION_MAX],
      outputRange: [0, -SCREEN_HEIGHT]
    });
    const MAX_HEIGHT =
      SCREEN_HEIGHT -
      this.LIST_ITEM_HEIGHT -
      headerHeight -
      Constants.statusBarHeight -
      this.LIST_WRAP_PADDING * 2 -
      this.SPACING_LIST_ALL_END_BOTTOM;
    return (
      <Animated.View
        style={[
          styles.listWrap,
          {
            padding: this.LIST_WRAP_PADDING,
            paddingTop: Constants.statusBarHeight + this.LIST_WRAP_PADDING,
            transform: [{ translateY: TRANSLATE_Y }]
          }
        ]}
      >
        <View
          style={[
            styles.list,
            {
              marginBottom: this.SPACING_LIST_ALL_END_BOTTOM,
              borderRadius: modifier === "fractal" ? 0 : 12,
              backgroundColor:
                modifier === "fractal" ? "#fff" : "rgba(255,255,255,0.96)"
            }
          ]}
        >
          {this.renderHeaderList()}
          <ScrollView
            scrollEnabled={scrollViewInnerHeight >= MAX_HEIGHT ? true : false}
            style={{
              maxHeight: MAX_HEIGHT
            }}
          >
            <View
              style={styles.scrollViewInner}
              onLayout={this._getHeightScrollViewInner}
            >
              {options.map((item, index) => {
                return index > 0 && this.renderListItem(item, index);
              })}
            </View>
          </ScrollView>
        </View>
        {this.renderListItem(options[0], 0)}
        <TouchableOpacity
          activeOpacity={1}
          onPress={this._handleCloseModal}
          style={styles.absFull}
        />
      </Animated.View>
    );
  }

  renderModal() {
    const { isVisible } = this.state;
    return (
      <Modal
        animationType="none"
        transparent={true}
        visible={isVisible}
        style={styles.modal}
        onShow={this._handleShowModal}
        onRequestClose={this._handleCloseModal}
        hardwareAccelerated={true}
      >
        {this.renderListAction()}
        {this.renderUnderlay()}
      </Modal>
    );
  }

  renderButtonItemWithLongPress() {
    const { modifier, renderButtonItem } = this.props;
    return (
      <LongPress
        onLongPress={
          IOS && modifier === "default"
            ? this._handlePressIOS
            : this._handlePressAndroid
        }
      >
        {renderButtonItem()}
      </LongPress>
    );
  }

  renderButtonItemWithOnPress() {
    const { modifier, renderButtonItem } = this.props;
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={
          IOS && modifier === "default"
            ? this._handlePressIOS
            : this._handlePressAndroid
        }
      >
        {renderButtonItem()}
      </TouchableOpacity>
    );
  }

  renderButtonItemWithDoublePress() {
    const { modifier, renderButtonItem } = this.props;
    return (
      <DoublePress
        activeOpacity={1}
        onDoublePress={
          IOS && modifier === "default"
            ? this._handlePressIOS
            : this._handlePressAndroid
        }
      >
        {renderButtonItem()}
      </DoublePress>
    );
  }

  renderButtonItemWrap() {
    const { buttonItemActionType } = this.props;
    if (buttonItemActionType === "onPress") {
      return this.renderButtonItemWithOnPress();
    } else if (buttonItemActionType === "onLongPress") {
      return this.renderButtonItemWithLongPress();
    } else if (buttonItemActionType === "onDoublePress") {
      return this.renderButtonItemWithDoublePress();
    }
  }

  render() {
    const { styleContainer } = this.props;
    return (
      <View style={styleContainer}>
        {this.renderButtonItemWrap()}
        {this.renderModal()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    position: "relative",
    zIndex: 9
  },
  listWrap: {
    position: "relative",
    zIndex: 9,
    top: SCREEN_HEIGHT,
    height: SCREEN_HEIGHT,
    flex: 1,
    justifyContent: "flex-end"
  },
  list: {
    overflow: "hidden",
    position: "relative",
    zIndex: 2
  },
  absFull: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1
  },
  underlay: {
    zIndex: -1,
    opacity: 0
  },
  scrollViewInner: {
    flexDirection: "column",
    overflow: "hidden"
  },
  header: {
    paddingTop: 15,
    paddingHorizontal: 15,
    borderBottomColor: "#e0e0e4",
    borderBottomWidth: 1
  },
  headerText: {
    fontSize: 13,
    color: "#8f8f8f",
    textAlign: "center"
  },
  listItem: {
    justifyContent: "center",
    borderTopColor: "#e0e0e4",
    paddingHorizontal: 15,
    position: "relative",
    zIndex: 2
  }
});
