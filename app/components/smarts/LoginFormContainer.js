import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Animated,
  Keyboard,
  Dimensions,
  Platform,
  Alert,
} from "react-native";
import PropTypes from "prop-types";
import { Button, P, ViewWithLoading } from "../../wiloke-elements";
import { connect } from "react-redux";
import {
  login,
  loginFb,
  getAccountNav,
  getMyProfile,
  register,
  getSignUpForm,
  getShortProfile,
  setUserConnection,
  getMessageChatNewCount,
  setDeviceTokenToFirebase,
  getNotificationAdminSettings,
  setNotificationSettings,
  loginApple,
} from "../../actions";
import * as Consts from "../../constants/styleConstants";
import { Form, FBButton, LostPasswordModal } from "../dumbs";
import _ from "lodash";
import AppleButton from "../dumbs/AppleButton/AppleButton";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const majorVersionIOS = parseInt(Platform.Version, 10);

class LoginFormContainer extends Component {
  static propTypes = {
    // onPressRegister: PropTypes.func
    onLogin: PropTypes.func,
  };
  static defaultProps = {
    // onPressRegister: () => {}
  };
  state = {
    formTypeFocus: "login",
    animation: new Animated.Value(0),
    isLoading: true,
    isLoadingFbLogin: false,
    fbLoginErrorMessage: "",
    isModalVisible: false,
    isLoadingApple: false,
  };

  async componentDidMount() {
    const { navigation } = this.props;
    const activeType = navigation.state.params
      ? navigation.state.params.activeType
      : "login";
    await this.setState({
      formTypeFocus: activeType,
      animation: new Animated.Value(
        activeType === "register"
          ? 10 - (SCREEN_WIDTH > 600 ? 600 : SCREEN_WIDTH)
          : 0
      ),
    });
    await this.props.getSignUpForm();
    this.setState({
      isLoading: false,
    });
  }

  _handleNotificationSettings = async (myID) => {
    await this.props.getNotificationAdminSettings();
    const { notificationAdminSettings } = this.props;
    await this.props.setNotificationSettings(
      myID,
      notificationAdminSettings,
      "start"
    );
  };

  _handleLoginDefault = (results, status) => async (_) => {
    const { login, onLogin } = this.props;
    await login(results);
    this._getInfo();
    onLogin && onLogin();
  };

  _handleLoginFb = async (data, token) => {
    const { loginFb, onLogin, translations } = this.props;
    this.setState({ isLoadingFbLogin: true });
    await loginFb(data.id, token);
    const { auth } = this.props;
    if (!auth.token) {
      Alert.alert(translations.fbEmailError);
    }
    this.setState({ isLoadingFbLogin: false });
    this._getInfo();
    onLogin && onLogin();
  };

  _handleLoginApple = async (credential) => {
    const { loginApple } = this.props;
    const { authorizationCode, email, identityToken } = credential;
    await this.setState({ isLoadingApple: true });
    await loginApple(authorizationCode, identityToken, email);
    const { auth } = this.props;
    if (!auth.token) {
      Alert.alert(auth.message);
    }
    await this.setState({ isLoadingApple: false });
    this._getInfo();
    onLogin && onLogin();
  };

  _handleLoginFbError = (errorType) => {
    const { translations } = this.props;
    this.setState({
      fbLoginErrorMessage: translations[errorType],
    });
  };

  _getInfo = async () => {
    const {
      getAccountNav,
      getMyProfile,
      getShortProfile,
      setUserConnection,
      getMessageChatNewCount,
      deviceToken,
      setDeviceTokenToFirebase,
    } = this.props;
    getAccountNav();
    getMyProfile();
    await getShortProfile();
    const { shortProfile, auth } = this.props;
    const myID = shortProfile.userID;
    const { firebaseID } = shortProfile;
    if (auth.isLoggedIn && myID) {
      setUserConnection(myID, true);
      getMessageChatNewCount(myID);
      setDeviceTokenToFirebase(myID, firebaseID, deviceToken);
      await this._handleNotificationSettings(myID);
    }
    Keyboard.dismiss();
  };

  _handleRegister = async (results, status) => {
    const {
      register,
      getAccountNav,
      getMyProfile,
      setUserConnection,
      getShortProfile,
      getMessageChatNewCount,
      deviceToken,
      setDeviceTokenToFirebase,
    } = this.props;
    status === "success" && (await register(results));
    getAccountNav();
    getMyProfile();
    await getShortProfile();
    const { shortProfile, auth } = this.props;
    const myID = shortProfile.userID;
    const { firebaseID } = shortProfile;
    if (auth.isLoggedIn) {
      setUserConnection(myID, true);
      getMessageChatNewCount(myID);
      setDeviceTokenToFirebase(myID, firebaseID, deviceToken);
      await this._handleNotificationSettings(myID);
    }
    Keyboard.dismiss();
  };

  _handleTab = (type) => async () => {
    Animated.timing(this.state.animation, {
      toValue:
        type === "login" ? 10 - (SCREEN_WIDTH > 600 ? 600 : SCREEN_WIDTH) : 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      this.setState({
        formTypeFocus: type,
      });
    });
  };

  _handleLostPassword = () => {
    this.setState({
      isModalVisible: true,
    });
  };

  _handleCloseLostPasswordModal = () => {
    this.setState({
      isModalVisible: false,
    });
  };

  _renderFormLogin() {
    const { settings, loginError, translations } = this.props;
    const { oFacebook } = settings;
    const { fbLoginErrorMessage } = this.state;
    return (
      <View style={{ width: (SCREEN_WIDTH > 600 ? 600 : SCREEN_WIDTH) - 20 }}>
        <Form
          headerTitle={translations.login}
          headerIcon="lock"
          colorPrimary={settings.colorPrimary}
          validationData={translations.validationData}
          renderTopComponent={() => {
            if (!!fbLoginErrorMessage) {
              return (
                <P style={{ color: Consts.colorQuaternary }}>
                  {fbLoginErrorMessage}
                </P>
              );
            }
            return (
              loginError && (
                <P style={{ color: Consts.colorQuaternary }}>
                  {translations[loginError]}
                </P>
              )
            );
          }}
          data={[
            {
              type: "text",
              name: "username",
              label: translations.username,
              required: true,
              validationType: "username",
            },
            {
              type: "password",
              name: "password",
              label: translations.password,
            },
          ]}
          renderButtonSubmit={(results, status) => {
            const { isLoginLoading } = this.props;
            const { isLoadingFbLogin, isLoadingApple } = this.state;
            return (
              <View>
                <Button
                  backgroundColor="primary"
                  colorPrimary={settings.colorPrimary}
                  size="lg"
                  radius="round"
                  block={true}
                  isLoading={isLoginLoading}
                  onPress={this._handleLoginDefault(results, status)}
                >
                  {translations.login}
                </Button>
                {settings.isAllowRegistering === "yes" && (
                  <View
                    style={{
                      alignItems: "center",
                      borderTopWidth: 1,
                      borderTopColor: Consts.colorGray1,
                      marginTop: 15,
                      paddingTop: 15,
                    }}
                  >
                    <Button
                      backgroundColor="secondary"
                      color="light"
                      size="sm"
                      radius="round"
                      onPress={this._handleTab("login")}
                    >
                      {translations.register}
                    </Button>
                  </View>
                )}

                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={this._handleLostPassword}
                  style={{ alignItems: "center", marginTop: 15 }}
                >
                  <P>{translations.lostPassword}</P>
                </TouchableOpacity>

                {oFacebook.isEnableFacebookLogin && (
                  <View style={{ marginTop: 10 }}>
                    <FBButton
                      radius="round"
                      isLoading={isLoadingFbLogin}
                      appID={oFacebook.appID}
                      onAction={this._handleLoginFb}
                      onError={this._handleLoginFbError}
                    />
                  </View>
                )}
                {Platform.OS === "ios" && majorVersionIOS > 12 && (
                  <View style={{ marginTop: 10 }}>
                    <AppleButton
                      onAction={this._handleLoginApple}
                      isLoading={isLoadingApple}
                    />
                  </View>
                )}
              </View>
            );
          }}
        />
      </View>
    );
  }

  _renderFormRegister() {
    const { settings, translations, signUpForm, signupError } = this.props;
    const _signUpForm =
      !_.isEqual(signUpForm) &&
      signUpForm.map((item) => ({
        type: item.type,
        label: !!translations[item.label]
          ? translations[item.label]
          : item.label,
        name: item.key,
        ...(item.required ? { required: item.required } : {}),
        ...(!!item.validationType
          ? { validationType: item.validationType }
          : {}),
        ...(item.link ? { link: item.link } : {}),
      }));
    return (
      <View
        style={{
          position: "relative",
          left: 10,
          width: (SCREEN_WIDTH > 600 ? 600 : SCREEN_WIDTH) - 20,
        }}
      >
        <ViewWithLoading
          isLoading={this.state.isLoading}
          contentLoader="contentHeader"
        >
          <Form
            headerTitle={translations.register}
            headerIcon="check-square"
            colorPrimary={settings.colorPrimary}
            validationData={translations.validationData}
            renderTopComponent={() => {
              return (
                signupError && (
                  <P style={{ color: Consts.colorQuaternary }}>
                    {translations[signupError]}
                  </P>
                )
              );
            }}
            data={_signUpForm}
            renderButtonSubmit={(results, status) => {
              const { translations, isSignupLoading, settings } = this.props;
              return (
                <View>
                  <Button
                    backgroundColor="primary"
                    colorPrimary={settings.colorPrimary}
                    size="lg"
                    radius="round"
                    block={true}
                    isLoading={isSignupLoading}
                    onPress={async () => this._handleRegister(results, status)}
                  >
                    {translations.register}
                  </Button>

                  <View
                    style={{
                      alignItems: "center",
                      borderTopWidth: 1,
                      borderTopColor: Consts.colorGray1,
                      marginTop: 15,
                      paddingTop: 15,
                    }}
                  >
                    <Button
                      backgroundColor="secondary"
                      color="light"
                      size="sm"
                      radius="round"
                      onPress={this._handleTab("register")}
                    >
                      {translations.login}
                    </Button>
                  </View>
                </View>
              );
            }}
          />
        </ViewWithLoading>
      </View>
    );
  }

  render() {
    const { settings } = this.props;
    const { isModalVisible } = this.state;
    return (
      <View
        style={{
          overflow: "hidden",
        }}
      >
        <Animated.View
          style={{
            flexDirection: "row",
            width: (SCREEN_WIDTH > 600 ? 600 : SCREEN_WIDTH) * 2,
            transform: [
              {
                translateX: this.state.animation,
              },
            ],
          }}
        >
          {this._renderFormLogin()}
          {settings.isAllowRegistering === "yes" && this._renderFormRegister()}
        </Animated.View>
        <LostPasswordModal
          visible={isModalVisible}
          onRequestClose={this._handleCloseLostPasswordModal}
          source={{ uri: settings.resetPasswordURL }}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  settings: state.settings,
  auth: state.auth,
  loginError: state.loginError,
  isLoginLoading: state.isLoginLoading,
  translations: state.translations,
  signUpForm: state.signUpForm,
  signupError: state.signupError,
  isSignupLoading: state.isSignupLoading,
  shortProfile: state.shortProfile,
  deviceToken: state.deviceToken,
  notificationAdminSettings: state.notificationAdminSettings,
});
const mapDispatchToProps = {
  login,
  loginFb,
  getAccountNav,
  getMyProfile,
  register,
  getSignUpForm,
  getShortProfile,
  setUserConnection,
  getMessageChatNewCount,
  setDeviceTokenToFirebase,
  getNotificationAdminSettings,
  setNotificationSettings,
  loginApple,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginFormContainer);
