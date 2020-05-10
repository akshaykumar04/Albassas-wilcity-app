import React, { PureComponent } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Constants from "expo-constants";
import { connect } from "react-redux";
import { LoginFormContainer } from "../smarts";
import { FontIcon } from "../../wiloke-elements";
import { getProductsCart } from "../../actions";

class LoginScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  _renderHeader = () => {
    const { settings } = this.props;
    return (
      <View style={[styles.header, { backgroundColor: settings.colorPrimary }]}>
        <TouchableOpacity style={styles.icon} onPress={this._handleGoBack}>
          <FontIcon name="fa-angle-left" size={30} color="#fff" />
        </TouchableOpacity>
        <Text />
        <Text />
      </View>
    );
  };

  _handleGoBack = () => {
    this.props.navigation.goBack();
  };

  _handleLoginAccount = async () => {
    const { auth, getProductsCart } = this.props;
    const { isLoggedIn } = auth;
    if (isLoggedIn) {
      await getProductsCart(auth.token);
      this._handleGoBack();
    }
  };

  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        {this._renderHeader()}
        <View
          style={{
            paddingVertical: 20,
            paddingLeft: 10
          }}
        >
          <LoginFormContainer
            onLogin={this._handleLoginAccount}
            navigation={navigation}
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: Constants.statusBarHeight + 52,
    paddingTop: Constants.statusBarHeight
  },
  icon: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center"
  }
});

const mapStateToProps = state => ({
  auth: state.auth,
  settings: state.settings
});

const mapDispatchToProps = {
  getProductsCart
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
