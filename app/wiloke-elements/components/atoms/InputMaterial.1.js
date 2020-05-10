import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  View,
  TouchableOpacity,
  TextInput,
  Animated,
  StyleSheet,
  ViewPropTypes,
  Platform
} from "react-native";
import * as Consts from "../../../constants/styleConstants";
import { Feather } from "@expo/vector-icons";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

/**
 * Constants
 */
const INPUT_FOCUS_TOP = 29;
const INPUT_BLUR_TOP = 3;
const INPUT_FOCUS_FONTSIZE = 12;
const INPUT_BLUR_FONTSIZE = 14;

/**
 * Create Component
 */
export default class InputMaterial extends PureComponent {
  /**
   * Prop Types
   */
  static propTypes = {
    ...TextInput.propTypes,
    placeholder: PropTypes.string,
    placeholderTextColor: PropTypes.string,
    style: ViewPropTypes.style,
    onFocus: PropTypes.func,
    onEndEditing: PropTypes.func,
    onPressGooglePlacesAutocomplete: PropTypes.func,
    value: PropTypes.string,
    valueGooglePlacesAutocompleteHack: PropTypes.string,
    iconName: PropTypes.string,
    colorPrimary: PropTypes.string
  };

  /**
   * Default Props
   */
  static defaultProps = {
    placeholder: "TextInput",
    placeholderTextColor: Consts.colorDark3,
    onPressGooglePlacesAutocomplete: () => {},
    onFocus: () => {},
    onEndEditing: () => {},
    colorPrimary: Consts.colorPrimary
  };

  /**
   * State
   */
  state = {
    isFocusAnim: new Animated.Value(INPUT_BLUR_TOP),
    isFocusAnimBorder: new Animated.Value(0),
    itemWidth: 0,
    isFocus: false
  };

  /**
   * Focus TextInput
   */
  _handleFocus = event => {
    Animated.timing(this.state.isFocusAnim, {
      toValue: INPUT_FOCUS_TOP,
      duration: 150
    }).start();
    Animated.timing(this.state.isFocusAnimBorder, {
      toValue: this.state.itemWidth
    }).start(() => {
      this.setState({
        isFocus: true
      });
    });
    this.props.onFocus(event);
  };

  /**
   * End Editting TextInput
   */
  _handleBlur = event => {
    Animated.timing(this.state.isFocusAnim, {
      toValue: event.nativeEvent.text === "" ? INPUT_BLUR_TOP : INPUT_FOCUS_TOP,
      duration: 150
    }).start();
    Animated.timing(this.state.isFocusAnimBorder, {
      toValue: 0
    }).start(() => {
      this.setState({
        isFocus: false
      });
    });
    this.props.onEndEditing(event);
  };

  /**
   * Handle Animation Top For Placeholder
   */
  _handleAnimTop = () => {
    return this.state.isFocusAnim.interpolate({
      inputRange: [0, INPUT_FOCUS_TOP - INPUT_BLUR_TOP],
      outputRange: [
        this.props.value === "" || typeof this.props.value === "undefined"
          ? INPUT_BLUR_TOP
          : INPUT_FOCUS_TOP,
        INPUT_FOCUS_TOP
      ],
      extrapolate: "clamp"
    });
  };

  /**
   * Handle Animation Size For Placeholder
   */
  _handleAnimSize = () => {
    return this.state.isFocusAnim.interpolate({
      inputRange: [0, INPUT_FOCUS_TOP - INPUT_BLUR_TOP],
      outputRange: [
        this.props.value === "" || typeof this.props.value === "undefined"
          ? INPUT_BLUR_FONTSIZE
          : INPUT_FOCUS_FONTSIZE,
        INPUT_FOCUS_FONTSIZE
      ],
      extrapolate: "clamp"
    });
  };

  /**
   * Get Width Container
   */
  _handleLayout = event => {
    this.setState({
      itemWidth: event.nativeEvent.layout.width
    });
  };

  /**
   * Render Placeholder
   */
  renderPlaceholder() {
    const { placeholderTextColor, placeholder } = this.props;
    return (
      <Animated.View
        style={[
          styles.placeholder,
          {
            bottom: this._handleAnimTop()
          }
        ]}
      >
        <Animated.Text
          style={{
            color: placeholderTextColor,
            fontSize: this._handleAnimSize()
          }}
        >
          {placeholder}
        </Animated.Text>
      </Animated.View>
    );
  }

  /**
   * Render Border Animation
   */
  renderBorderAnimation() {
    return (
      <Animated.View
        style={[
          styles.borderAnimation,
          {
            width: this.state.isFocusAnimBorder,
            borderBottomColor: this.props.colorPrimary
          }
        ]}
      />
    );
  }

  /**
   * Render TextInput
   */
  renderTextInput() {
    const { googlePlacesAutocomplete } = this.props;
    return googlePlacesAutocomplete ? (
      <GooglePlacesAutocomplete
        placeholder=""
        minLength={2} // minimum length of text to search
        autoFocus={false}
        fetchDetails={true}
        onPress={this.props.onPressGooglePlacesAutocomplete}
        getDefaultValue={() => {
          return ""; // text input default value
        }}
        query={{
          // available options: https://developers.google.com/places/web-service/autocomplete
          key: "AIzaSyB2s7viIU_L9PyYV0oCUYf0gkV2cCfWwUk",
          language: "vi", // language of the results
          types: "geocode" // default: 'geocode'
        }}
        styles={{
          ...stylesGooglePlacesAutocomplete,
          ...{
            listView: {
              ...(Platform === "ios"
                ? stylesGooglePlacesAutocomplete.listView
                : {}),
              display: this.state.isFocus ? "flex" : "none"
            }
          }
        }}
        currentLocation={false}
        nearbyPlacesAPI="GooglePlacesSearch"
        GoogleReverseGeocodingQuery={
          {
            // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
          }
        }
        GooglePlacesSearchQuery={{
          // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
          rankby: "distance",
          types: "food"
        }}
        filterReverseGeocodingByTypes={[
          "locality",
          "administrative_area_level_3"
        ]}
        predefinedPlacesAlwaysVisible={true}
        textInputProps={{
          ...this.props,
          underlineColorAndroid: "transparent",
          placeholder: "",
          autoCorrect: false,
          onFocus: this._handleFocus,
          onBlur: this._handleBlur,
          clearButtonMode: "never",
          style: {
            borderBottomWidth: 0,
            color: Consts.colorDark2,
            padding: 0,
            margin: 0,
            height: "auto",
            width: "100%",
            paddingTop: 25,
            paddingBottom: 6,
            fontSize: INPUT_BLUR_FONTSIZE,
            backgroundColor: "transparent"
          }
        }}
      />
    ) : (
      <TextInput
        {...this.props}
        style={styles.input}
        underlineColorAndroid="transparent"
        selectionColor={this.props.colorPrimary}
        placeholder=""
        autoCorrect={false}
        onFocus={this._handleFocus}
        onBlur={this._handleBlur}
      />
    );
  }

  /**
   * Render Icon Right
   */
  renderRight() {
    const {
      value,
      valueGooglePlacesAutocompleteHack,
      onClearText,
      iconName
    } = this.props;
    return (
      <View style={styles.right}>
        {((value && value.length > 0) ||
          (valueGooglePlacesAutocompleteHack &&
            valueGooglePlacesAutocompleteHack.length > 0)) && (
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={onClearText}
            style={styles.clear}
          >
            <Feather name={"x"} size={18} color={Consts.colorQuaternary} />
          </TouchableOpacity>
        )}
        {iconName && (
          <View style={{ height: 30, justifyContent: "center" }}>
            <Feather name={iconName} size={18} color={Consts.colorDark3} />
          </View>
        )}
      </View>
    );
  }

  /**
   * Render
   */
  render() {
    const { googlePlacesAutocomplete } = this.props;
    return (
      <View
        style={[
          styles.container,
          this.props.style,
          { zIndex: googlePlacesAutocomplete ? 99 : 9 }
        ]}
        onLayout={this._handleLayout}
      >
        {this.renderPlaceholder()}
        {this.renderBorderAnimation()}
        {this.renderTextInput()}
        {this.renderRight()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 9,
    borderBottomWidth: 2,
    borderBottomColor: Consts.colorDark5,
    marginBottom: 10,
    paddingRight: 20
  },
  input: {
    borderBottomWidth: 0,
    color: Consts.colorDark2,
    paddingTop: 25,
    paddingBottom: 6,
    fontSize: INPUT_BLUR_FONTSIZE
  },
  placeholder: {
    position: "absolute",
    left: 0,
    bottom: INPUT_BLUR_TOP
  },
  borderAnimation: {
    position: "absolute",
    left: 0,
    bottom: -2,
    zIndex: 9,
    width: 0,
    height: 2,
    borderBottomWidth: 2
  },
  right: {
    position: "absolute",
    right: 0,
    bottom: 2,
    flexDirection: "row",
    alignItems: "center"
  },
  clear: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center"
  }
});

const stylesGooglePlacesAutocomplete = {
  container: {
    padding: 0,
    height: "auto"
  },
  poweredContainer: {
    display: "none"
  },
  row: {
    padding: 0,
    paddingTop: 12,
    paddingBottom: 6,
    margin: 0
  },
  listView: {
    position: "absolute",
    marginTop: 2,
    top: "100%",
    left: 0,
    right: -20,
    zIndex: 9999,
    padding: 0,
    backgroundColor: "#fff"
  },
  textInputContainer: {
    backgroundColor: "transparent",
    borderTopWidth: 0,
    borderBottomWidth: 0,
    padding: 0,
    height: "auto"
  },
  description: {
    fontWeight: "500",
    fontSize: 14
  },
  predefinedPlacesDescription: {
    color: "#1faadb"
  }
};
