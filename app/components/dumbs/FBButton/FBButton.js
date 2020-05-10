import React, { PureComponent } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewPropTypes,
  Platform,
  Alert
} from "react-native";
import PropTypes from "prop-types";
import axios from "axios";
import { Button } from "../../../wiloke-elements";
import * as Facebook from "expo-facebook";
import { FontAwesome } from "@expo/vector-icons";
import { colorLight } from "../../../constants/styleConstants";

const IOS = Platform.OS === "ios";
export default class FBButton extends PureComponent {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    textButton: PropTypes.string,
    containerStyle: ViewPropTypes.style,
    onAction: PropTypes.func,
    onError: PropTypes.func,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    appID: PropTypes.string,
    isLoading: PropTypes.bool
  };

  static defaultProps = {
    isLoading: false,
    textButton: "Login with Facebook",
    containerStyle: {},
    onAction: () => {},
    onError: () => {},
    width: 250,
    height: 40,
    appID: ""
  };

  componentDidMount() {}

  _handleLogin = async () => {
    const { onAction, onError, appID } = this.props;
    try {
      await Facebook.initializeAsync(appID);
      await Facebook.setAutoInitEnabledAsync(true);
      const {
        type,
        token,
        expires,
        permissions,
        declinedPermissions
      } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ["public_profile", "email"]
      });
      if (type === "success") {
        const { data } = await axios.get(
          `https://graph.facebook.com/me?access_token=${token}&fields=id,name,email`
        );
        console.log({ data });
        if (!!data.email) {
          onAction(data, token);
        } else {
          onError("fbEmailError");
        }
      } else {
        throw "Error";
      }
    } catch (err) {
      console.log("hello 12312312");
      console.log(err);
    }
  };

  // _handleLogin = () => {
  //   const { onAction, onError, appID } = this.props;
  //   Facebook.logInWithReadPermissionsAsync(appID, {
  //     permissions: ["public_profile", "email"],
  //     behavior: IOS ? "system" : "native"
  //   })
  //     .then(result => {
  //       if (result.type === "success") {
  //         Alert.alert("Đăng nhập thành công");
  //       } else {
  //         Alert.alert("Cancel Dang nhap");
  //       }
  //     })
  //     .catch(err => {
  //       this.setState({
  //         message: JSON.stringify(err)
  //       });
  //     });

  // };

  _renderFacebookIcon = () => {
    return (
      <FontAwesome
        name="facebook-square"
        size={26}
        color="#fff"
        style={{ marginRight: 10 }}
      />
    );
  };

  render() {
    const { textButton, containerStyle, isLoading } = this.props;
    return (
      <View>
        <Button
          {...this.props}
          backgroundColor="primary"
          colorPrimary="#3b5998"
          size="md"
          block={true}
          isLoading={isLoading}
          textStyle={{ fontSize: 17 }}
          onPress={this._handleLogin}
          renderBeforeText={this._renderFacebookIcon}
        >
          {textButton}
        </Button>
      </View>
    );
  }
}
