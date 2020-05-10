import React, { Component } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
  StyleSheet,
  Text
} from "react-native";
import { Image } from "react-native-expo-image-cache";
import { connect } from "react-redux";
import _ from "lodash";
import he from "he";

import * as Consts from "../../constants/styleConstants";
import { Layout } from "../dumbs";
import {
  ViewWithLoading,
  ImageCircleAndText,
  LoadingFull,
  Toast,
  MessageError
} from "../../wiloke-elements";
import {
  getMyNotifications,
  getMyNotificationsLoadmore,
  deleteMyNotifications
} from "../../actions";
import AppleStyleSwipeableRow from "../../wiloke-elements/components/atoms/SwiperApple/AppleSwipeable";

const END_REACHED_THRESHOLD = Platform.OS === "ios" ? 0 : 1;

class NotificationsScreen extends Component {
  state = {
    isLoading: true,
    isScrollEnabled: true,
    isDeleteLoading: false,
    startLoadmore: false
  };

  _getMyNotifications = async _ => {
    await this.setState({ isLoading: true });
    await this.props.getMyNotifications();
    this.setState({ isLoading: false, startLoadmore: true });
  };

  componentDidMount() {
    this._getMyNotifications();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!_.isEqual(nextProps.myNotifications, this.props.myNotifications)) {
      return true;
    }
    if (!_.isEqual(nextState.isLoading, this.state.isLoading)) {
      return true;
    }
    if (!_.isEqual(nextState.isScrollEnabled, this.state.isScrollEnabled)) {
      return true;
    }
    if (!_.isEqual(nextState.isDeleteLoading, this.state.isDeleteLoading)) {
      return true;
    }
    return false;
  }

  _handleListItem = item => _ => {
    const { navigation } = this.props;
    !!item.screen &&
      navigation.navigate(item.screen, {
        id: null,
        key: null,
        item: item.oDetails,
        autoFocus: false,
        mode: item.mode
      });
  };

  _deleteListItem = ID => async _ => {
    console.log(ID);
    const { translations } = this.props;
    await this.setState({ isDeleteLoading: true });
    await this.props.deleteMyNotifications(ID);
    this.setState({ isDeleteLoading: false });
    const { deleteMyNotificationError } = this.props;
    if (!!deleteMyNotificationError) {
      this._toast.show(translations[deleteMyNotificationError], 3000);
      return;
    }
    this._toast.show(translations["deletedNotification"], 3000);
  };

  _handleEndReached = next => {
    const { startLoadmore } = this.state;
    const { getMyNotificationsLoadmore } = this.props;
    !!next && startLoadmore && getMyNotificationsLoadmore(next);
  };

  renderNotifyItem = ({ item, index }) => {
    const { translations } = this.props;
    const preview = {
      uri: item.image
    };
    const uri = item.image;
    return (
      <AppleStyleSwipeableRow
        translations={translations}
        onPressRight={this._deleteListItem(item.ID)}
      >
        <TouchableOpacity
          activeOpacity={1}
          // onPress={this._handleListItem(item)}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 10,
            width: Consts.screenWidth
          }}
        >
          <View style={styles.header}>
            <Image
              {...{ preview, uri }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25
              }}
              tint="light"
            />
            <View style={{ paddingLeft: 5 }}>
              {!!item.title && <Text style={styles.title}>{item.title}</Text>}
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </View>
          <View style={styles.content}>
            <Text style={{ fontSize: 14, color: Consts.colorDark3 }}>
              {item.message}
            </Text>
          </View>
        </TouchableOpacity>
      </AppleStyleSwipeableRow>
    );
  };

  renderContent = () => {
    const { myNotifications, translations } = this.props;
    const { oResults, next, status, msg } = myNotifications;
    const { isLoading, isDeleteLoading, startLoadmore } = this.state;
    const _oResults = !_.isEmpty(oResults)
      ? oResults.map(item => ({
          ID: item.ID,
          oDetails: item.oDetails,
          screen: item.screen,
          time: item.time,
          type: item.type,
          image: item.oFeaturedImg.thumbnail,
          name: item.postTitle ? he.decode(item.postTitle) : "",
          message: item.postContent ? he.decode(item.postContent) : ""
        }))
      : [];
    return (
      <ViewWithLoading
        isLoading={isLoading}
        contentLoader="headerAvatar"
        avatarSize={44}
        contentLoaderItemLength={10}
        gap={0}
      >
        <FlatList
          data={_oResults}
          renderItem={this.renderNotifyItem}
          keyExtractor={(_, index) => index.toString()}
          scrollEnabled={this.state.isScrollEnabled}
          onEndReachedThreshold={END_REACHED_THRESHOLD}
          onEndReached={() => this._handleEndReached(next)}
          ListFooterComponent={() => {
            return (
              <View>
                {!!next && status === "success" && startLoadmore && (
                  <ViewWithLoading
                    isLoading={true}
                    contentLoader="headerAvatar"
                    avatarSize={44}
                    contentLoaderItemLength={1}
                    gap={0}
                  />
                )}

                {status === "error" && (
                  <MessageError message={translations[msg]} />
                )}
                <View style={{ height: 30 }} />
              </View>
            );
          }}
          ItemSeparatorComponent={() => (
            <View
              style={{
                width: "100%",
                height: 1,
                backgroundColor: Consts.colorGray1
              }}
            />
          )}
        />
        <LoadingFull visible={isDeleteLoading} />
        <Toast ref={c => (this._toast = c)} />
      </ViewWithLoading>
    );
  };

  render() {
    const { navigation, settings, translations, auth } = this.props;
    const { isLoggedIn } = auth;
    const { name } = navigation.state.params;
    return (
      <Layout
        navigation={navigation}
        headerType="headerHasBack"
        title={name}
        goBack={() => navigation.goBack()}
        renderContent={this.renderContent}
        textSearch={translations.search}
        isLoggedIn={isLoggedIn}
        scrollViewEnabled={false}
        scrollViewStyle={{
          backgroundColor: "#fff"
        }}
        tintColor={Consts.colorDark1}
        colorPrimary={Consts.colorGray2}
        statusBarStyle="dark-content"
      />
    );
  }
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 7
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    paddingVertical: 3
  },
  time: {
    fontSize: 12,
    color: Consts.colorDark4
  },
  content: {
    paddingLeft: 7,
    paddingVertical: 5
  }
});

const mapStateToProps = state => ({
  myNotifications: state.myNotifications,
  settings: state.settings,
  translations: state.translations,
  auth: state.auth,
  deleteMyNotificationError: state.deleteMyNotificationError
});

const mapDispatchToProps = {
  getMyNotifications,
  deleteMyNotifications,
  getMyNotificationsLoadmore
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationsScreen);
