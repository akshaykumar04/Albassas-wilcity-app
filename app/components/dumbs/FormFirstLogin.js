import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  StatusBar
} from "react-native";
import Constants from "expo-constants";
import { isEqual } from "lodash";

import logo from "../../../assets/logo.png";
import background from "../../../assets/loginCover.png";
import {
  Button,
  H4,
  P,
  KeyboardAnimationRP,
  FontIcon
} from "../../wiloke-elements";
import {
  colorDark2,
  colorDark3,
  colorQuaternary,
  screenHeight
} from "../../constants/styleConstants";

const IOS = Platform.OS === "ios";

class FormFirstLogin extends PureComponent {
  static propTypes = {
    onSkip: PropTypes.func,
    onNavigateRegister: PropTypes.func,
    onNavigateLostPassword: PropTypes.func,
    renderBottom: PropTypes.func,
    onLogin: PropTypes.func.isRequired,
    isLoginLoading: PropTypes.bool,
    colorPrimary: PropTypes.string,
    translations: PropTypes.object,
    title: PropTypes.string,
    text: PropTypes.string,
    skipButtonText: PropTypes.string,
    loginError: PropTypes.string
  };

  static defaultProps = {
    onSkip: () => {},
    onNavigateRegister: () => {},
    onNavigateLostPassword: () => {},
    onLogin: () => {},
    renderBottom: () => {},
    isLoginLoading: false,
    skipButtonText: "Skip"
  };

  state = {
    result: {
      username: "",
      password: ""
    },
    isLoginLoading: false
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!isEqual(nextProps.isLoginLoading, prevState.isLoginLoading)) {
      return {
        isLoginLoading: nextProps.isLoginLoading
      };
    }
    return null;
  }

  _handleChangeUserName = username => {
    const { result } = this.state;
    this.setState({
      result: {
        ...result,
        username
      }
    });
  };

  _handleChangePassword = password => {
    const { result } = this.state;
    this.setState({
      result: {
        ...result,
        password
      }
    });
  };

  _handleLogin = () => {
    const { onLogin } = this.props;
    const { result } = this.state;
    onLogin(result);
  };

  _handleNext = () => {
    this._nextTextInput.focus();
  };

  _renderContent = keyboardHeight => {
    const {
      colorPrimary,
      translations,
      onSkip,
      title,
      text,
      onNavigateRegister,
      loginError,
      loginFbError,
      onNavigateLostPassword
    } = this.props;
    const { result, isLoginLoading } = this.state;
    const { username, password } = result;
    return (
      <View
        style={[
          styles.box,
          {
            bottom: keyboardHeight
          }
        ]}
      >
        <View style={styles.logo}>
          <Image source={logo} resizeMode="contain" style={styles.img} />
        </View>
        {!!title && <H4 style={styles.title}>{title}</H4>}
        {!!text && <P style={styles.text}>{text}</P>}
        <View style={{ height: IOS ? 50 : 30 }} />
        {(!!loginError || !!loginFbError) && (
          <View>
            <P style={styles.textError}>{loginError}</P>
          </View>
        )}

        <View style={styles.inputWrapper}>
          <View style={styles.icon}>
            <FontIcon name="user" size={18} color="#fff" />
          </View>
          <TextInput
            placeholder={translations.username}
            style={styles.input}
            placeholderTextColor="#fff"
            underlineColorAndroid="transparent"
            autoCorrect={false}
            selectionColor="#fff"
            textContentType="username"
            value={username}
            returnKeyType="next"
            onChangeText={this._handleChangeUserName}
            onSubmitEditing={this._handleNext}
          />
        </View>
        <View style={styles.inputWrapper}>
          <View style={styles.icon}>
            <FontIcon name="key" size={18} color="#fff" />
          </View>
          <TextInput
            secureTextEntry
            ref={c => {
              this._nextTextInput = c;
            }}
            placeholder={translations.password}
            style={styles.input}
            placeholderTextColor="#fff"
            underlineColorAndroid="transparent"
            autoCorrect={false}
            selectionColor="#fff"
            returnKeyType="go"
            textContentType="password"
            value={password}
            onChangeText={this._handleChangePassword}
            onSubmitEditing={this._handleLogin}
          />
        </View>
        <Button
          backgroundColor="light"
          color="dark"
          colorPrimary={colorPrimary}
          size="lg"
          radius="pill"
          block={true}
          loadingColor={colorPrimary}
          isLoading={isLoginLoading}
          onPress={this._handleLogin}
        >
          {translations.login}
        </Button>

        <Button
          backgroundColor="secondary"
          color="light"
          colorPrimary={colorPrimary}
          size="sm"
          radius="round"
          onPress={onNavigateRegister}
          renderBeforeText={() => (
            <View style={{ marginRight: 5 }}>
              <FontIcon name="user-plus" size={16} color="#fff" />
            </View>
          )}
          style={{ marginTop: 20 }}
        >
          {translations.register}
        </Button>
        <TouchableOpacity
          style={styles.lostPassword}
          onPress={onNavigateLostPassword}
        >
          <FontIcon name="help-circle" size={16} color="#fff" />
          <View style={{ marginLeft: 8 }}>
            <P style={styles.lostPasswordText}>{translations.lostPassword}</P>
          </View>
        </TouchableOpacity>
        {this.props.renderBottom()}
      </View>
    );
  };

  render() {
    const { onSkip, skipButtonText } = this.props;
    return (
      <View style={[styles.container]}>
        <StatusBar barStyle="light-content" />
        <View style={styles.background}>
          <Image source={background} resizeMode="cover" style={styles.img} />
        </View>
        <TouchableOpacity style={styles.skip} onPress={onSkip}>
          <P style={styles.skipText}>{skipButtonText}</P>
          <View style={{ width: 4 }} />
          <FontIcon name="chevron-right" size={16} color={colorDark3} />
        </TouchableOpacity>

        <KeyboardAnimationRP style={{ flex: 1 }}>
          {this._renderContent}
        </KeyboardAnimationRP>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    height: screenHeight,
    flex: 1,
    overflow: "hidden",
    backgroundColor: "#fff",
    paddingTop: IOS ? Constants.statusBarHeight : 0
  },
  background: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  img: {
    width: "100%",
    height: "100%"
  },
  title: {
    color: "#fff",
    marginTop: 10,
    textAlign: "center"
  },
  text: {
    color: "#fff",
    fontSize: 15,
    lineHeight: 24,
    textAlign: "center"
  },
  box: {
    flex: 1,
    height: screenHeight,
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    position: "relative"
  },
  logo: {
    width: 150,
    height: 100,
    overflow: "hidden",
    margin: 10
  },
  inputWrapper: {
    position: "relative",
    width: "100%"
  },
  icon: {
    position: "absolute",
    top: 0,
    left: 15,
    height: 45,
    alignItems: "center",
    justifyContent: "center"
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    color: "#fff",
    paddingLeft: 45,
    paddingRight: 15,
    height: 48,
    borderRadius: 30,
    width: "100%",
    marginBottom: 15,
    fontSize: 14
  },
  skip: {
    position: "absolute",
    zIndex: 9,
    top: Constants.statusBarHeight + (IOS ? 15 : 10),
    right: 15,
    backgroundColor: "#fff",
    paddingVertical: 2,
    paddingLeft: 10,
    paddingRight: 8,
    borderRadius: 3,
    flexDirection: "row",
    alignItems: "center"
  },
  skipText: {
    color: colorDark3,
    marginBottom: 0
  },
  lostPassword: {
    marginTop: 15,
    padding: 10,
    flexDirection: "row",
    alignItems: "center"
  },
  lostPasswordText: {
    color: "#fff",
    marginBottom: 0
  },
  textError: {
    color: colorQuaternary,
    textAlign: "center",
    fontSize: 14
  }
});

export default FormFirstLogin;
