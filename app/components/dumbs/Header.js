import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  StyleSheet
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Constants from "expo-constants";
import * as Consts from "../../constants/styleConstants";
import stylesBase from "../../stylesBase";
import { connect } from "react-redux";
import { getCountNotifications, getMessageChatNewCount } from "../../actions";
import _ from "lodash";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const HEADER_HEIGHT = 52 + Constants.statusBarHeight;
const FORM_HEIGHT = 32;

class Header extends Component {
  static propTypes = {
    renderRight: PropTypes.func,
    renderLeft: PropTypes.func,
    backgroundColor: PropTypes.string,
    textSearch: PropTypes.string
  };

  static defaultProps = {
    backgroundColor: Consts.colorPrimary
  };

  componentDidMount() {
    const { shortProfile, auth, getMessageChatNewCount } = this.props;
    const myID = shortProfile.userID;
    auth.isLoggedIn && getMessageChatNewCount(myID);
  }

  _getCountNotifications = _ => {
    const { getCountNotifications } = this.props;
    if (this.props.auth.isLoggedIn) {
      getCountNotifications();
    }
  };

  _handleHeaderRightPress = _ => {
    const { navigation, translations } = this.props;
    this._getCountNotifications();
    navigation.navigate("NotificationsScreen", {
      name: translations.notifications
    });
  };

  _handleHeaderLeftPress = () => {
    const { navigation, translations, shortProfile } = this.props;
    !_.isEmpty(shortProfile) &&
      navigation.navigate("MessageScreen", {
        name: translations.messages
      });
  };

  render() {
    const {
      navigation,
      isLoggedIn,
      countNotify,
      countNotifyRealTimeFaker,
      messageNewCount
    } = this.props;
    const notifyNewCount = countNotifyRealTimeFaker - countNotify;
    return (
      <View>
        <StatusBar barStyle="light-content" />
        <View
          style={[
            styles.container,
            {
              backgroundColor: this.props.backgroundColor
            }
          ]}
        >
          {isLoggedIn && (
            <View style={styles.headerIcon}>
              {this.props.renderLeft ? (
                this.props.renderLeft()
              ) : (
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={this._handleHeaderRightPress}
                  style={styles.headerIcon}
                >
                  <Feather name="bell" size={20} color="#fff" />
                  {notifyNewCount > 0 && (
                    <View style={styles.count}>
                      <Text style={{ color: "#fff", fontSize: 10 }}>
                        {notifyNewCount > 50 ? 50 : notifyNewCount}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              )}
            </View>
          )}

          <TouchableOpacity
            activeOpacity={0.4}
            onPress={() => navigation.navigate("SearchScreen")}
          >
            <View
              style={[
                styles.formItem,
                {
                  width: SCREEN_WIDTH - (isLoggedIn ? 100 : 20)
                }
              ]}
            >
              <Feather
                style={styles.formItemIcon}
                name="search"
                size={16}
                color="#fff"
              />
              <Text style={[stylesBase.text, styles.search]}>
                {this.props.textSearch}
              </Text>
            </View>
          </TouchableOpacity>

          {isLoggedIn &&
            (this.props.renderRight ? (
              this.props.renderRight()
            ) : (
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={this._handleHeaderLeftPress}
                style={styles.headerIcon}
              >
                <Feather name="message-square" size={20} color="#fff" />
                {messageNewCount > 0 && (
                  <View style={styles.count}>
                    <Text style={{ color: "#fff", fontSize: 10 }}>
                      {messageNewCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    height: HEADER_HEIGHT,
    paddingTop: Constants.statusBarHeight
  },
  formItem: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: FORM_HEIGHT / 2,
    height: FORM_HEIGHT,
    alignItems: "center",
    justifyContent: "center"
  },
  formItemIcon: {
    marginRight: 5
  },
  search: {
    color: "#fff",
    fontSize: 14
  },
  headerIcon: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center"
  },
  count: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Consts.colorQuaternary,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    right: 0
  }
});

const mapStateToProps = state => ({
  translations: state.translations,
  auth: state.auth,
  countNotify: state.countNotify,
  countNotifyRealTimeFaker: state.countNotifyRealTimeFaker,
  shortProfile: state.shortProfile,
  messageNewCount: state.messageNewCount
});

const mapDispatchToProps = {
  getCountNotifications,
  getMessageChatNewCount
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
