import React, { PureComponent } from "react";
import { View, Modal } from "react-native";
import { connect } from "react-redux";
import configureApp from "../../../configureApp.json";
import {
  FormFirstLogin,
  WilWebView,
  LostPasswordModal,
  FBButton,
} from "../dumbs";
import {
  login,
  loginFb,
  getAccountNav,
  getShortProfile,
  getMyProfile,
  setUserConnection,
  getMessageChatNewCount,
  setDeviceTokenToFirebase,
  getNotificationAdminSettings,
  setNotificationSettings,
  loginApple,
  getProductsCart,
} from "../../actions";
import { FontIcon } from "../../wiloke-elements";
import AppleButton from "../dumbs/AppleButton/AppleButton";
import { majorVersionIOS } from "../smarts/LoginFormContainer";

const {
  title: firstLoginTitle,
  text: firstLoginText,
  skipButtonText,
} = configureApp.loginScreenStartApp;

class FirstLoginScreen extends PureComponent {
  state = {
    isLoginLoading: false,
    isLoadingFbLogin: false,
    fbLoginErrorMessage: "",
    modalVisible: false,
    loadingApple: false,
  };

  _handleLoginDefault = async (results) => {
    const { login } = this.props;
    this.setState({
      isLoginLoading: true,
    });
    await login(results);
    this._getInfo();
  };

  _handleLoginFb = async (data, token) => {
    const { loginFb } = this.props;
    this.setState({ isLoadingFbLogin: true });
    await loginFb(data.id, token);
    this._getInfo();
  };

  _handleLoginFbError = (errorType) => {
    const { translations } = this.props;
    this.setState({
      fbLoginErrorMessage: translations[errorType],
    });
  };

  _handleLoginApple = async (credential) => {
    const { loginApple } = this.props;
    const { authorizationCode, email, identityToken } = credential;

    await this.setState({
      loadingApple: true,
    });
    await loginApple(authorizationCode, identityToken, email);
    if (!auth.token) {
      Alert.alert(auth.message);
    }
    await this.setState({ loadingApple: false });
    this._getInfo();
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
      navigation,
      getProductsCart,
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
      getProductsCart(auth.token);
      await this._handleNotificationSettings(myID);
      navigation.navigate("HomeScreen");
    }
    this.setState({
      isLoginLoading: false,
      isLoadingFbLogin: false,
    });
    Keyboard.dismiss();
  };

  _handleNotificationSettings = async (myID) => {
    await this.props.getNotificationAdminSettings();
    const { notificationAdminSettings } = this.props;
    await this.props.setNotificationSettings(
      myID,
      notificationAdminSettings,
      "start"
    );
  };

  _handleSkip = () => {
    const { navigation } = this.props;
    navigation.navigate("HomeScreen");
  };

  _handleNavigateRegister = () => {
    const { navigation } = this.props;
    navigation.navigate("AccountScreen", {
      activeType: "register",
    });
  };

  _handleNavigateLostPassword = () => {
    const url = "https://wilcity.com/login/?action=rp";
    this.setState({
      modalVisible: true,
    });
  };

  _handleGoBack = () => {
    this.setState({
      modalVisible: false,
    });
  };

  _renderBottom = () => {
    const { settings } = this.props;
    const { isLoadingFbLogin, loadingApple } = this.state;
    const { oFacebook } = settings;
    return (
      <View>
        {!!oFacebook && oFacebook.isEnableFacebookLogin && (
          <FBButton
            radius="round"
            isLoading={isLoadingFbLogin}
            appID={oFacebook.appID}
            onAction={this._handleLoginFb}
            onError={this._handleLoginFbError}
          />
        )}
        {Platform.OS === "ios" && majorVersionIOS > 12 && (
          <View style={{ marginTop: 10 }}>
            <AppleButton
              onAction={this._handleLoginApple}
              isLoading={loadingApple}
            />
          </View>
        )}
      </View>
    );
  };

  render() {
    const { translations, settings, loginError } = this.props;
    const { isLoginLoading, fbLoginErrorMessage, modalVisible } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <FormFirstLogin
          title={firstLoginTitle}
          text={firstLoginText}
          skipButtonText={skipButtonText}
          colorPrimary={settings.colorPrimary}
          translations={translations}
          onSkip={this._handleSkip}
          onNavigateRegister={this._handleNavigateRegister}
          onNavigateLostPassword={this._handleNavigateLostPassword}
          isLoginLoading={isLoginLoading}
          onLogin={this._handleLoginDefault}
          loginError={loginError ? translations[loginError] : ""}
          loginFbError={fbLoginErrorMessage}
          renderBottom={this._renderBottom}
        />
        <LostPasswordModal
          visible={modalVisible}
          onRequestClose={this._handleGoBack}
          source={{ uri: settings.resetPasswordURL }}
        />
      </View>
    );
  }
}

const mapStateToProps = ({
  translations,
  deviceToken,
  shortProfile,
  auth,
  settings,
  notificationAdminSettings,
  loginError,
}) => ({
  translations,
  deviceToken,
  shortProfile,
  auth,
  settings,
  notificationAdminSettings,
  loginError,
});

const mapDispatchToProps = {
  login,
  loginFb,
  getAccountNav,
  getShortProfile,
  getMyProfile,
  setUserConnection,
  getMessageChatNewCount,
  setDeviceTokenToFirebase,
  getNotificationAdminSettings,
  setNotificationSettings,
  loginApple,
  getProductsCart,
};

export default connect(mapStateToProps, mapDispatchToProps)(FirstLoginScreen);
