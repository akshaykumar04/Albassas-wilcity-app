import React, { Component, PureComponent } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Platform,
  FlatList,
  ActivityIndicator,
  AppState,
  Keyboard
} from "react-native";
import LinkPreview from "react-native-link-preview";
import { Feather } from "@expo/vector-icons";
import * as Consts from "../../constants/styleConstants";
import { connect } from "react-redux";
import Constants from "expo-constants";
import * as WebBrowser from "expo-web-browser";
import MapView from "react-native-maps";
import {
  InputAccessoryLayoutFullScreen,
  ImageCircleAndText,
  MessageTyping,
  ActionSheet,
  P,
  getEmoijFromString,
  ImageCache,
  getTime
} from "../../wiloke-elements";
import {
  getMessageChat,
  getMessageChatLoadmore,
  putMessageChat,
  putMessageChatOff,
  resetMessageChat,
  getUser,
  addUsersToFirebase,
  postWritingMessageChat,
  checkDispatchWritingMessageChat,
  messageChatActive,
  readNewMessageChat,
  resetMessageActive,
  deleteChatItem,
  editChatItem,
  messagePushNotification,
  getCurrentSendMessageScreen
} from "../../actions";
import _ from "lodash";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");
const HEADER_HEIGHT = 52 + Constants.statusBarHeight;
const CONTENT_HEIGHT = SCREEN_HEIGHT - HEADER_HEIGHT;
const END_REACHED_THRESHOLD = Platform.OS === "ios" ? 0 : 1;
const PAGESIZE = 40;

function toDegreesMinutesAndSeconds(coordinate) {
  const absolute = Math.abs(coordinate);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = Math.floor((minutesNotTruncated - minutes) * 60);
  return `${degrees} ${minutes} ${seconds}`;
}

function convertDMS(lat, lng) {
  const latitude = toDegreesMinutesAndSeconds(lat);
  const latitudeCardinal = Math.sign(lat) >= 0 ? "N" : "S";

  const longitude = toDegreesMinutesAndSeconds(lng);
  const longitudeCardinal = Math.sign(lng) >= 0 ? "E" : "W";

  return `${latitude} ${latitudeCardinal}\n${longitude} ${longitudeCardinal}`;
}

class MyMapView extends Component {
  shouldComponentUpdate(nextProps) {
    return false;
  }
  render() {
    const { latitude, longitude } = this.props;
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
          coordinate={{
            latitude,
            longitude
          }}
        />
      </MapView>
    );
  }
}

class SendMessageScreen extends Component {
  state = {
    isLoadMore: true,
    message: "",
    isEditing: false,
    itemEditing: {},
    linkPreviews: {}
  };

  _handleAppStateChange = (myID, key) => nextAppState => {
    this.props.resetMessageActive(myID, key, nextAppState !== "active");
  };

  async componentDidMount() {
    const {
      navigation,
      getMessageChat,
      getUser,
      shortProfile,
      checkDispatchWritingMessageChat,
      messageChatActive,
      readNewMessageChat,
      getCurrentSendMessageScreen
    } = this.props;
    const { params } = navigation.state;
    const { userID, key } = params;
    const myID = shortProfile.userID;
    getUser(userID);
    this.setState({ isLoadMore: false });
    await getMessageChat(myID, userID);
    const { messageChat } = this.props;
    checkDispatchWritingMessageChat("on", messageChat.chatId, userID);
    getCurrentSendMessageScreen(true);
    !!key && messageChatActive(myID, key, true);
    !!key && readNewMessageChat(myID, key);
    !!key &&
      AppState.addEventListener(
        "change",
        this._handleAppStateChange(myID, key)
      );
    this._setLinkPreviews(messageChat.chats);
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps.messageChat.chats, this.props.messageChat.chats)) {
      this._setLinkPreviews(this.props.messageChat.chats);
    }
  }

  async componentWillUnmount() {
    const {
      navigation,
      messageChat,
      shortProfile,
      postWritingMessageChat,
      resetMessageChat,
      messageChatActive,
      checkDispatchWritingMessageChat
    } = this.props;
    const myID = shortProfile.userID;
    const { chatId } = messageChat;
    const { params } = navigation.state;
    const { key, userID } = params;
    resetMessageChat(chatId);
    postWritingMessageChat(myID, chatId, "");
    checkDispatchWritingMessageChat("off", messageChat.chatId, userID);
    this.setState({ isLoadMore: false });
    !!key && messageChatActive(myID, key, false);
    !!key &&
      AppState.removeEventListener(
        "change",
        this._handleAppStateChange(myID, key)
      );
  }

  _handleSendMessage = async () => {
    const {
      messageChat,
      putMessageChat,
      putMessageChatOff,
      addUsersToFirebase,
      navigation,
      shortProfile,
      postWritingMessageChat,
      editChatItem,
      messagePushNotification
    } = this.props;
    const { params } = navigation.state;
    const { userID, displayName, key } = params;
    const {
      userID: myID,
      displayName: myDisplayName,
      firebaseID
    } = shortProfile;
    const { chatId } = messageChat;
    const { isEditing, itemEditing, message } = this.state;
    if (message.length > 0) {
      try {
        this.setState({ message: "" });
        if (isEditing) {
          await editChatItem(myID, chatId, itemEditing.key, message);
        } else {
          await putMessageChatOff(myID, myDisplayName, chatId, message);
          await postWritingMessageChat(myID, chatId, "");
          await putMessageChat(
            myID,
            myDisplayName,
            chatId,
            message,
            firebaseID
          );
          messagePushNotification(userID, myDisplayName, message, myID, key);
          addUsersToFirebase(
            userID,
            displayName,
            myID,
            myDisplayName,
            message,
            firebaseID
          );
        }
        this._setLinkPreviews([{ message }]);
      } catch (err) {
        console.log(err);
      }
    }
    this.setState({ isEditing: false });
  };

  _handleChangeMessage = message => {
    const { shortProfile, messageChat, postWritingMessageChat } = this.props;
    const myID = shortProfile.userID;
    const { chatId } = messageChat;
    postWritingMessageChat(myID, chatId, message);
    this.setState({ message });
  };

  _handleEndReached = (firstKey, chatId) => async _ => {
    const { messageChat } = this.props;
    const { length } = messageChat.chats;
    try {
      if (length >= PAGESIZE) {
        const isLoadMore = await this.props.getMessageChatLoadmore(
          firstKey,
          chatId
        );
        this.setState({ isLoadMore });
        this._setLinkPreviews(messageChat.chats);
      }
    } catch (err) {
      console.log(err);
    }
  };

  _getTimestamp = () => {
    const { messageChat, shortProfile } = this.props;
    const myID = shortProfile.userID;
    const messageOfUser = _.get(messageChat, "chats").filter(
      item => item.userID !== myID
    );
    return messageOfUser.length ? messageOfUser[0].timestamp : "";
  };

  _renderHeader = () => {
    const { navigation, user, userConnections, translations } = this.props;
    const { params } = navigation.state;
    const { userID, displayName } = params;
    const newTimestamp = this._getTimestamp();
    return (
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => navigation.goBack()}
            style={{ marginRight: 10 }}
          >
            <Feather name="chevron-left" size={30} color={Consts.colorDark2} />
          </TouchableOpacity>
          <ImageCircleAndText
            title={displayName}
            text={!!newTimestamp ? getTime(newTimestamp) : ""}
            // text={
            //   userConnections[userID]
            //     ? translations.online
            //     : translations.offline
            // }
            image={user.avatar}
            horizontal={true}
            // dotEnabled={true}
            // dotTintColor={
            //   userConnections[userID]
            //     ? Consts.colorSecondary
            //     : Consts.colorQuaternary
            // }
          />
        </View>
      </View>
    );
  };

  _renderImageCircleSmall = img => {
    const preview = {
      uri: img
    };
    const uri = img;
    return (
      <View style={styles.imageCircleSmall}>
        <ImageCache
          {...{ preview, uri }}
          tint="light"
          resizeMode="cover"
          style={styles.imageCircleSmallImage}
        />
      </View>
    );
  };

  _handleChatItemDelete = async key => {
    const { messageChat } = this.props;
    const { chatId } = messageChat;
    this.props.deleteChatItem(chatId, key);
    await this.setState({
      message: "",
      isEditing: false,
      itemEditing: {}
    });
  };

  _handleChatItemEdit = item => {
    this.setState({
      message: item.message,
      isEditing: true,
      itemEditing: item
    });
  };

  _handleCancelChatEdit = _ => {
    this.setState({
      message: "",
      isEditing: false,
      itemEditing: {}
    });
  };

  _actionSheetMoreOptions = item => {
    const { translations } = this.props;
    return {
      options: [translations.cancel, translations.delete, translations.edit],
      destructiveButtonIndex: 1,
      cancelButtonIndex: 0,
      // onPressButtonItem: () => {
      //   console.log(item);
      // },
      onAction: buttonIndex => {
        switch (buttonIndex) {
          case 1:
            return this._handleChatItemDelete(item.key);
          case 2:
            return this._handleChatItemEdit(item);
          default:
            break;
        }
      }
    };
  };

  _renderChatItemText = (myID, item, index) => () => {
    const { settings, messageChat, translations } = this.props;
    const { isEditing, itemEditing } = this.state;
    const checkForMe = item.userID === myID;
    const intersectAtTheEnd =
      index >= 1 &&
      messageChat.chats[index].displayName !==
        messageChat.chats[index - 1].displayName;
    const intersectAtTheStart =
      index < messageChat.chats.length - 1 &&
      messageChat.chats[index].displayName !==
        messageChat.chats[index + 1].displayName;
    const styleMe = {
      borderTopLeftRadius: 10,
      borderBottomLeftRadius: 10,
      borderTopRightRadius:
        intersectAtTheStart || index === messageChat.chats.length - 1 ? 10 : 3,
      borderBottomRightRadius: intersectAtTheEnd || index === 0 ? 10 : 3
    };
    const styleOrther = {
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      borderTopLeftRadius:
        intersectAtTheStart || index === messageChat.chats.length - 1 ? 10 : 3,
      borderBottomLeftRadius: intersectAtTheEnd || index === 0 ? 10 : 3,
      marginRight: 20,
      marginLeft: 5
    };

    const { message } = item;
    return (
      <View>
        {message.length === 2 && getEmoijFromString(message).length > 0 ? (
          <View style={{ marginBottom: -6 }}>
            <Text style={{ fontSize: 50 }}>{getEmoijFromString(message)}</Text>
          </View>
        ) : (
          <View
            style={[
              {
                paddingHorizontal: 10,
                paddingVertical: 5,
                backgroundColor: checkForMe
                  ? isEditing && item.key === itemEditing.key
                    ? Consts.colorTertiary
                    : settings.colorPrimary
                  : Consts.colorGray1
              },
              checkForMe ? styleMe : styleOrther
            ]}
          >
            <Text
              style={{
                color: item.userID === myID ? "#fff" : Consts.colorDark1,
                lineHeight: 20
              }}
              {...(message.includes("http") ? { numberOfLines: 2 } : {})}
            >
              {message.search(/longitude|latitude/g) !== -1
                ? `${translations.showMap} ↓`
                : message}
            </Text>
          </View>
        )}
      </View>
    );
  };

  _handleUrlPreview = url => () => {
    WebBrowser.openBrowserAsync(url);
  };

  _renderUrlPreview = url => {
    const { linkPreviews } = this.state;
    const data = !_.isEmpty(linkPreviews) && linkPreviews[url];
    const imageWidth = SCREEN_WIDTH / 2;
    const imageHeight = (imageWidth * 56.25) / 100;
    return !_.isEmpty(linkPreviews) ? (
      !!data && (
        <View style={styles.urlPreview}>
          {!_.isEmpty(linkPreviews[url].images) && (
            <ImageCache
              {...{
                preview: {
                  uri: linkPreviews[url].images[0]
                },
                uri: linkPreviews[url].images[0]
              }}
              tint="light"
              resizeMode="cover"
              style={{
                width: imageWidth,
                height: imageHeight
              }}
            />
          )}
          <View style={styles.urlPreviewContent}>
            <P style={{ lineHeight: 18, fontWeight: "500" }}>
              {linkPreviews[url].title}
            </P>
            <View style={{ marginTop: -5 }}>
              <P
                style={{
                  fontSize: 11,
                  color: Consts.colorDark4,
                  lineHeight: 15
                }}
                numberOfLines={1}
              >
                {linkPreviews[url].url.replace(/\/$/g, "")}
              </P>
            </View>
          </View>
        </View>
      )
    ) : (
      <View style={styles.urlPreview}>
        <View
          style={{
            width: imageWidth,
            height: imageHeight
          }}
        />
        <View style={styles.urlPreviewContent} />
      </View>
    );
  };

  _getLinkPreview = async chats => {
    const messageUrls = chats.reduce((arr, item) => {
      return [
        ...arr,
        ...(item.message &&
          item.message
            .split(" ")
            .filter(
              item =>
                item.search(/http(s|):\/\/(.*www\..*(?=\.)|(?!www).*\.)/g) !==
                -1
            ))
      ];
    }, []);
    const messageUrlPromises = messageUrls.map(LinkPreview.getPreview);
    const newMessageUrlPreviews = await Promise.all(messageUrlPromises);
    return messageUrls.reduce((obj, messageUrl) => {
      const pattern = /http.*\/\/(www\.|)/g;
      return {
        ...obj,
        [messageUrl]: newMessageUrlPreviews.filter(
          item =>
            messageUrl.search(
              item.url.replace(/\/$/g, "").replace(pattern, "")
            ) !== -1
        )[0]
      };
    }, {});
  };

  _setLinkPreviews = async chats => {
    const newLinkPreviews = await this._getLinkPreview(chats);
    this.setState(prevState => {
      return {
        linkPreviews: {
          ...prevState.linkPreviews,
          ...newLinkPreviews
        }
      };
    });
  };

  _handleDragMapEnd = coordinate => {
    this.setState({
      message: JSON.stringify(coordinate)
    });
  };

  _handleOpenMapView = coordinate => {
    this.setState({
      message: JSON.stringify(coordinate)
    });
  };

  _handleEmoijSelected = async icon => {
    const { message } = this.state;
    await this.setState({
      message: message.length > 0 ? `${message}${icon}` : icon
    });
    if (this.state.message.length === 2) this._handleSendMessage();
  };

  _handleOpenMapViewScreen = (longitude, latitude) => () => {
    if (!!longitude && !!latitude) {
      WebBrowser.openBrowserAsync(
        `https://www.google.com/maps/place/${convertDMS(
          latitude,
          longitude
        )}/@${latitude},${longitude},13z`.replace(/\s/g, "%20")
      );
    }
    // this.props.navigation.navigate("WebViewScreen", {
    //   url: {
    //     title: "",
    //     description: "",
    //     lat: latitude,
    //     lng: longitude
    //   }
    // });
  };

  _renderUrl = position => (item, index) => {
    return (
      <TouchableOpacity
        key={index.toString()}
        activeOpacity={0.6}
        onPress={this._handleUrlPreview(item)}
        style={position === "end" ? { alignItems: "flex-end" } : {}}
      >
        {this._renderUrlPreview(item)}
      </TouchableOpacity>
    );
  };

  _renderMapView = (message, position) => {
    const latlng = JSON.parse(message);
    const { longitude, latitude } = latlng;
    const width = SCREEN_WIDTH / 5;
    return (
      <View style={position === "end" ? { alignItems: "flex-end" } : {}}>
        <View
          style={[
            {
              width,
              height: width
            },
            styles.mapView
          ]}
        >
          <MyMapView latitude={latitude} longitude={longitude} />
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.mapViewOverlay}
            onPress={this._handleOpenMapViewScreen(longitude, latitude)}
          />
        </View>
      </View>
    );
  };

  _renderChatItem = ({ item, index }) => {
    const {
      shortProfile,
      user,
      translations,
      messageChat,
      settings
    } = this.props;
    const myID = shortProfile.userID;
    const { isEditing, itemEditing } = this.state;
    const checkDisplayNameCoincident =
      index >= 1 &&
      messageChat.chats[index].displayName !==
        messageChat.chats[index - 1].displayName;
    // messageChat.chats[index - 1].timestamp -
    //   messageChat.chats[index].timestamp >
    //   20000;
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: item.userID === myID ? "flex-end" : "flex-start",
          paddingLeft: 15,
          marginBottom: checkDisplayNameCoincident ? 15 : 3
        }}
      >
        {item.userID !== myID && (
          <View
            style={{
              opacity: checkDisplayNameCoincident || index === 0 ? 1 : 0
            }}
          >
            {this._renderImageCircleSmall(user.avatar)}
          </View>
        )}
        {item.userID === myID ? (
          <View
            style={{
              maxWidth: "80%",
              position: "relative",
              paddingRight: 15
            }}
          >
            <ActionSheet
              {...this._actionSheetMoreOptions(item)}
              renderButtonItem={this._renderChatItemText(myID, item, index)}
            />
            {isEditing && item.key === itemEditing.key && (
              <TouchableOpacity
                style={{ alignItems: "flex-end", paddingBottom: 10 }}
                onPress={this._handleCancelChatEdit}
              >
                <P style={{ color: Consts.colorQuaternary }}>
                  {translations.cancel}
                </P>
              </TouchableOpacity>
            )}
            {!item.key && (
              <View
                style={[
                  styles.iconLoadingSend,
                  { borderColor: settings.colorPrimary }
                ]}
              />
            )}
            {item.message.search("http") !== -1 &&
              item.message
                .split(" ")
                .filter(item => item.search("http") !== -1)
                .map(this._renderUrl("end"))}
            {item.message.search(/longitude|latitude/g) !== -1 &&
              this._renderMapView(item.message, "end")}
          </View>
        ) : (
          <View
            style={{
              maxWidth: "80%"
            }}
          >
            {this._renderChatItemText(myID, item, index)()}
            {item.message.search("http") !== -1 &&
              item.message
                .split(" ")
                .filter(item => item.search("http") !== -1)
                .map(this._renderUrl("start"))}
            {item.message.search(/longitude|latitude/g) !== -1 &&
              this._renderMapView(item.message, "start")}
          </View>
        )}
      </View>
    );
  };

  _renderListFooterComponent = _ => {
    const { isLoadMore } = this.state;
    return (
      <View
        style={{
          opacity: isLoadMore ? 1 : 0,
          alignItems: "center",
          padding: 10
        }}
      >
        <ActivityIndicator size="small" />
      </View>
    );
  };

  _renderListHeaderComponent = () => {
    const { isWritingMessageChat, messageChat, user } = this.props;
    const { chatId } = messageChat;
    return (
      !!isWritingMessageChat[chatId] && (
        <MessageTyping
          image={user.avatar}
          style={{ paddingVertical: 5, paddingHorizontal: 15 }}
        />
      )
    );
  };

  render() {
    const { messageChat, settings, navigation, translations } = this.props;
    // const { params } = navigation.state;
    // const { userID, key } = params;

    // db.ref(`messages/chats/${messageChat.chatId}/writings/${userID}`).on(
    //   "value",
    //   snapshot => {
    //     console.log(snapshot.val());
    //   }
    // );
    return (
      <InputAccessoryLayoutFullScreen
        translations={translations}
        groupButtonItemColorActive={settings.colorPrimary}
        contentScrollViewEnabled={false}
        renderHeader={() => (
          <View>
            <View
              style={{
                height: Constants.statusBarHeight,
                backgroundColor: "#fff"
              }}
            />
            {this._renderHeader()}
          </View>
        )}
        renderContent={() => (
          <View style={{ backgroundColor: "#fff", paddingBottom: 5 }}>
            {/* <OfflineNotice /> */}
            <FlatList
              data={messageChat.chats}
              inverted={true}
              renderItem={this._renderChatItem}
              keyExtractor={(_, index) => index.toString()}
              keyboardShouldPersistTaps="always"
              keyboardDismissMode="on-drag"
              onEndReachedThreshold={END_REACHED_THRESHOLD}
              onEndReached={this._handleEndReached(
                messageChat.firstKey,
                messageChat.chatId
              )}
              ListFooterComponent={this._renderListFooterComponent}
              ListHeaderComponent={this._renderListHeaderComponent}
              style={{ minHeight: "100%" }}
            />
          </View>
        )}
        textInputProps={{
          placeholder: "Aa",
          multiline: true,
          autoFocus: true,
          autoCorrect: false,
          value: this.state.message,
          onPressText: this._handleSendMessage,
          onChangeText: this._handleChangeMessage,
          colorPrimary: settings.colorPrimary,
          iconName: "fa fa-paper-plane"
        }}
        groupActionEnabled={true}
        onDragMapEnd={this._handleDragMapEnd}
        onEmoijSeleted={this._handleEmoijSelected}
        onOpenMapView={this._handleOpenMapView}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderColor: Consts.colorGray1
  },
  header: {
    position: "relative",
    zIndex: 9,
    borderBottomWidth: 1,
    borderBottomColor: Consts.colorGray1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff"
  },
  iconLoadingSend: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 2,
    right: 3
  },
  urlPreview: {
    width: SCREEN_WIDTH / 2,
    borderWidth: 1,
    borderColor: Consts.colorGray1,
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 3,
    marginLeft: 5,
    backgroundColor: Consts.colorGray2
  },
  urlPreviewContent: {
    padding: 10,
    paddingBottom: 0,
    backgroundColor: "#fff",
    minHeight: 50
  },
  mapView: {
    position: "relative",
    borderWidth: 1,
    borderColor: Consts.colorGray1,
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 3,
    marginLeft: 5,
    backgroundColor: Consts.colorGray2
  },
  mapViewOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    zIndex: 9
  },
  imageCircleSmall: {
    borderRadius: 12,
    width: 24,
    height: 24,
    overflow: "hidden",
    marginBottom: 2
  },
  imageCircleSmallImage: {
    width: 24,
    height: 24
  }
});
const mapStateToProps = state => ({
  settings: state.settings,
  translations: state.translations,
  messageChat: state.messageChat,
  user: state.user,
  shortProfile: state.shortProfile,
  isWritingMessageChat: state.isWritingMessageChat,
  userConnections: state.userConnections
});

const mapDispatchToProps = {
  getMessageChat,
  getMessageChatLoadmore,
  putMessageChat,
  putMessageChatOff,
  resetMessageChat,
  getUser,
  addUsersToFirebase,
  postWritingMessageChat,
  checkDispatchWritingMessageChat,
  messageChatActive,
  readNewMessageChat,
  resetMessageActive,
  deleteChatItem,
  editChatItem,
  messagePushNotification,
  getCurrentSendMessageScreen
};
export default connect(mapStateToProps, mapDispatchToProps)(SendMessageScreen);
