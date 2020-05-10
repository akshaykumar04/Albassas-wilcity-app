import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Text,
  View,
  Dimensions,
  LayoutAnimation,
  UIManager,
  ViewPropTypes,
  Keyboard,
  ScrollView,
  Platform,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  FlatList
} from "react-native";
import { bottomBarHeight } from "../../functions/bottomBarHeight";
import InputHasButton from "../atoms/InputHasButton";
import { emoij } from "../../functions/emoij";
import * as Consts from "../../../constants/styleConstants";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import * as IntentLauncher from "expo-intent-launcher";

import { Entypo } from "@expo/vector-icons";

/**
 * Constants
 */
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const IOS = Platform.OS === "ios";

/**
 * Create Component InputAccessoryLayoutFullScreen
 */
export default class InputAccessoryLayoutFullScreen extends Component {
  /**
   * Prop Types
   */
  static propTypes = {
    renderHeader: PropTypes.func,
    renderContent: PropTypes.func.isRequired,
    textInputProps: PropTypes.shape({
      ...InputHasButton.propTypes
    }),
    textInputEnabled: PropTypes.bool,
    style: ViewPropTypes.style,
    keyboardDismissMode: PropTypes.oneOf(["none", "on-drag"]),
    contentScrollViewEnabled: PropTypes.bool,
    statusBarStyle: PropTypes.string,
    onDragMapEnd: PropTypes.func,
    onEmoijSeleted: PropTypes.func,
    onOpenMapView: PropTypes.func,
    translations: PropTypes.object,
    groupButtonItemColorActive: PropTypes.string,
    groupActionEnabled: PropTypes.bool,
    isSubmit: PropTypes.bool
  };

  /**
   * Default Props
   */
  static defaultProps = {
    renderHeader: __ => {},
    onDragMapEnd: __ => {},
    onEmoijSeleted: __ => {},
    onOpenMapView: __ => {},
    contentScrollViewEnabled: true,
    statusBarStyle: "dark-content",
    textInputEnabled: true,
    groupActionEnabled: false,
    isSubmit: false
  };

  /**
   * Constructor
   */
  constructor(props) {
    super(props);
    this.state = {
      isKeyboardOpened: false,
      keyboardHeight: 0,
      keyboardHeightPermanent: 0,
      headerHeight: 0,
      inputHeight: 0,
      contentHeight: 1,
      layoutHeight: 0,
      targetContentOffsetY: 0,
      groupButtonActive: false,
      groupButtonCurrentIndex: null,
      coordinate: {
        latitude: 41.032234,
        longitude: 29.031939
      }
    };

    if (IOS) {
      this.keyboardWillShowListener = Keyboard.addListener(
        "keyboardWillShow",
        this._keyboardShow
      );
      this.keyboardWillHideListener = Keyboard.addListener(
        "keyboardWillHide",
        this._keyboardHide
      );
    } else {
      UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  /**
   * Keyboard Listener For Android
   */
  componentDidMount() {
    if (!IOS) {
      this.keyboardDidShowListener = Keyboard.addListener(
        "keyboardDidShow",
        this._keyboardShow
      );
      this.keyboardDidHideListener = Keyboard.addListener(
        "keyboardDidHide",
        this._keyboardHide
      );
    }
  }

  /**
   * Configure for LayoutAnimation
   * @param {*event KeyBoard} event
   */
  _configureLayoutAnimation = event => {
    return LayoutAnimation.configureNext({
      duration: IOS ? event.duration : 300,
      create: {
        type: IOS
          ? LayoutAnimation.Types.keyboard
          : LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity
      },
      update: {
        type: IOS
          ? LayoutAnimation.Types.keyboard
          : LayoutAnimation.Types.easeInEaseOut
      }
    });
  };

  _getButtomKeyBoardIphoneX = number => {
    return bottomBarHeight === 0 ? 0 : bottomBarHeight + number;
  };

  /**
   * Event Keyboard Show
   * @param {*event KeyBoard} event
   */
  _keyboardShow = event => {
    const { contentHeight, layoutHeight, targetContentOffsetY } = this.state;
    const isBottom =
      Math.floor(contentHeight - layoutHeight) ===
      Math.floor(targetContentOffsetY);
    const keyboardHeight =
      (IOS ? event.startCoordinates.height : event.endCoordinates.height) +
      this._getButtomKeyBoardIphoneX(35);
    this._configureLayoutAnimation(event);
    this.setState(
      {
        keyboardHeight,
        keyboardHeightPermanent: keyboardHeight,
        isKeyboardOpened: true
      },
      () => {
        isBottom &&
          setTimeout(() => this._scrollView.scrollToEnd({ animated: true }), 0);
      }
    );
  };

  /**
   * Event Keyboard Hide
   * @param {*event KeyBoard} event
   */
  _keyboardHide = event => {
    const { keyboardHeight, groupButtonActive } = this.state;
    if (!groupButtonActive) {
      this._configureLayoutAnimation(event);
      this.setState({
        keyboardHeight: this._getButtomKeyBoardIphoneX(0),
        isKeyboardOpened: false
      });
    }
  };

  /**
   * Get header height
   * @param {*event Header component} event
   */
  _getHeaderHeight = event => {
    this.setState({ headerHeight: event.nativeEvent.layout.height });
  };

  /**
   * Get input wrapper height
   * @param {*event Input wrapper} event
   */
  _getInputHeight = event => {
    this.setState({ inputHeight: event.nativeEvent.layout.height });
  };

  /**
   * Get contentHeight, layoutHeight, targetContentOffsetY
   * @param {*event ScrollView Component} event
   */
  _handleScrollEndDrag = event => {
    const { nativeEvent } = event;
    this.setState({
      contentHeight: nativeEvent.contentSize.height,
      layoutHeight: nativeEvent.layoutMeasurement.height,
      targetContentOffsetY: IOS
        ? nativeEvent.targetContentOffset.y
        : nativeEvent.contentOffset.y
    });
  };

  /**
   * Remove KeyBoard Listener
   */
  componentWillUnmount() {
    if (IOS) {
      this.keyboardWillShowListener.remove();
      this.keyboardWillHideListener.remove();
    } else {
      this.keyboardDidShowListener.remove();
      this.keyboardDidHideListener.remove();
    }
  }

  /**
   * Update Scroll (ScrollView Component)
   * @param {*Previous props} prevProps
   * @param {*Previous state} prevState
   * @param {*} snapshot
   */
  componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      contentHeight,
      layoutHeight,
      targetContentOffsetY,
      inputHeight
    } = this.state;
    const isBottom =
      Math.floor(contentHeight - layoutHeight) ===
      Math.floor(targetContentOffsetY);
    const isIncrementInputHeight = prevState.inputHeight < inputHeight;
    if (isBottom && isIncrementInputHeight) {
      setTimeout(() => this._scrollView.scrollToEnd({ animated: false }), 0);
    }
  }

  // get location
  _getLocationAsync = async index => {
    try {
      const { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({
          enableHighAccuracy: true
        });
        const { latitude, longitude } = location.coords;
        await this.setState({
          coordinate: { longitude, latitude }
        });
        this.setState({
          groupButtonCurrentIndex: index
        });
        this.props.onOpenMapView({ latitude, longitude });
      } else {
        throw new Error("Location permission not granted");
      }
    } catch (err) {
      const { translations } = this.props;
      this.setState({
        isMapView: true
      });
      Platform === "android"
        ? IntentLauncher.startActivityAsync(
            IntentLauncher.ACTION_LOCATION_SOURCE_SETTINGS
          )
        : Alert.alert(
            he.decode(translations.askForAllowAccessingLocationTitle),
            he.decode(translations.askForAllowAccessingLocationDesc),
            [
              {
                text: "Cancel",
                style: "cancel"
              },
              {
                text: "OK",
                onPress: () => Linking.openURL("app-settings:")
              }
            ],
            { cancelable: false }
          );
    }
  };

  /**
   * Render Header
   */
  renderHeader() {
    return (
      <View
        style={styles.header}
        renderToHardwareTextureAndroid={true}
        onLayout={this._getHeaderHeight}
      >
        {this.props.renderHeader()}
      </View>
    );
  }

  /**
   * Render Content
   */
  renderContent() {
    const { keyboardHeight, inputHeight, headerHeight } = this.state;
    const {
      keyboardDismissMode,
      renderContent,
      contentScrollViewEnabled
    } = this.props;
    return (
      <View style={styles.content}>
        {contentScrollViewEnabled ? (
          <ScrollView
            ref={ref => (this._scrollView = ref)}
            keyboardDismissMode={keyboardDismissMode}
            keyboardShouldPersistTaps="always"
            onScrollEndDrag={this._handleScrollEndDrag}
            renderToHardwareTextureAndroid={true}
            scrollEnabled={true}
            style={[
              styles.content,
              {
                height:
                  SCREEN_HEIGHT - inputHeight - headerHeight - keyboardHeight
              }
            ]}
          >
            {renderContent()}
          </ScrollView>
        ) : (
          <View
            style={[
              styles.content,
              {
                height:
                  SCREEN_HEIGHT - inputHeight - headerHeight - keyboardHeight
              }
            ]}
          >
            {renderContent()}
          </View>
        )}
      </View>
    );
  }

  _handleButtonItem = index => async () => {
    const { keyboardHeightPermanent } = this.state;
    Keyboard.dismiss();
    this.setState({
      groupButtonActive: true,
      keyboardHeight: keyboardHeightPermanent
    });
    if (index === 0) {
      await this._getLocationAsync(index);
    } else if (index === 1) {
      this.setState({
        groupButtonCurrentIndex: index
      });
    }
  };

  _renderGroupButtonItem = ({ item, index }) => {
    const { groupButtonCurrentIndex } = this.state;
    const { groupButtonItemColorActive, groupActionEnabled } = this.props;
    if (!groupActionEnabled) return;
    return (
      <TouchableOpacity onPress={this._handleButtonItem(index)}>
        <Entypo
          name={item}
          size={18}
          color={
            groupButtonCurrentIndex === index
              ? groupButtonItemColorActive
              : Consts.colorDark3
          }
        />
      </TouchableOpacity>
    );
  };

  /**
   * Render Input Accessory
   */
  renderInputAccessory() {
    const { keyboardHeight } = this.state;
    const { textInputProps } = this.props;
    return (
      <View
        style={[
          styles.input,
          {
            bottom: keyboardHeight
          }
        ]}
        renderToHardwareTextureAndroid={true}
        onLayout={this._getInputHeight}
      >
        <InputHasButton
          {...textInputProps}
          groupButtonData={["location", "emoji-happy"]}
          onFocus={() => {
            this.setState({
              groupButtonActive: false,
              groupButtonCurrentIndex: null
            });
          }}
          renderGroupButtonItem={this._renderGroupButtonItem}
        />
      </View>
    );
  }

  _handleMapDragEnd = event => {
    const { coordinate } = event.nativeEvent;
    this.setState({ coordinate });
    this.props.onDragMapEnd(coordinate);
  };

  _handleEmoijPress = item => () => {
    this.props.onEmoijSeleted(item);
  };

  _renderEmoijItem = ({ item, index }) => {
    return (
      <View style={styles.emoijWrap}>
        <View style={{ paddingTop: "100%" }} />
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={this._handleEmoijPress(item)}
          style={styles.emoij}
        >
          <Text style={{ fontSize: 50 }}>{item}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  _checkRenderGroupContent = () => {
    const { coordinate, groupButtonCurrentIndex, keyboardHeight } = this.state;
    const { longitude, latitude } = coordinate;
    switch (groupButtonCurrentIndex) {
      case 0:
        return (
          <MapView
            style={{
              width: "100%",
              height: "100%"
            }}
            initialRegion={{
              latitude,
              longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            }}
          >
            <MapView.Marker
              draggable
              onDragEnd={this._handleMapDragEnd}
              coordinate={{
                latitude,
                longitude
              }}
            />
          </MapView>
        );
      case 1:
        return (
          <View
            style={{
              width: "100%",
              height: "100%"
            }}
          >
            <FlatList
              data={emoij}
              keyExtractor={(item, index) => index.toString()}
              renderItem={this._renderEmoijItem}
              numColumns={6}
            />
            <View />
          </View>
        );
      default:
        return (
          keyboardHeight !== bottomBarHeight && (
            <ActivityIndicator size="small" color={Consts.colorDark3} />
          )
        );
    }
  };

  renderGroupContent = () => {
    const { keyboardHeight } = this.state;
    return (
      <View
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: "100%",
          height: keyboardHeight,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        {this._checkRenderGroupContent()}
      </View>
    );
  };

  /**
   * Render Component
   */
  render() {
    const { textInputEnabled, groupActionEnabled, isSubmit } = this.props;
    isSubmit &&
      setTimeout(() => this._scrollView.scrollToEnd({ animated: false }), 0);
    return (
      <View style={[styles.container, this.props.style]}>
        <StatusBar barStyle={this.props.statusBarStyle} />
        {this.renderHeader()}
        {this.renderContent()}
        {textInputEnabled && this.renderInputAccessory()}
        {groupActionEnabled && this.renderGroupContent()}
      </View>
    );
  }
}

/**
 * Style for component
 */
const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 99999,
    height: SCREEN_HEIGHT,
    backgroundColor: Consts.colorGray3
  },
  header: {
    position: "relative",
    zIndex: 9
  },
  content: {
    position: "relative"
  },
  input: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 9
  },
  emoijWrap: {
    position: "relative",
    width: `${100 / 6}%`,
    justifyContent: "center",
    alignItems: "center"
  },
  emoij: {
    position: "absolute",
    margin: "auto",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    justifyContent: "center",
    alignItems: "center"
  }
});
