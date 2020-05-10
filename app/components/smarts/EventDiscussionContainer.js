import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Platform,
  Alert
} from "react-native";
import { connect } from "react-redux";
import {
  getEventDiscussion,
  getEventDiscussionLoadmore,
  postEventDiscussion,
  deleteEventDiscussion,
  editEventDiscussion,
  likeEventDiscussion
} from "../../actions";
import { CommentReview } from "../dumbs";
import * as Consts from "../../constants/styleConstants";
import stylesBase from "../../stylesBase";
import he from "he";
import {
  Button,
  ViewWithLoading,
  Loader,
  Modal,
  InputMaterial,
  cutTextEllipsis,
  Toast,
  wait,
  LoadingFull
} from "../../wiloke-elements";
import _ from "lodash";

const END_REACHED_THRESHOLD = Platform.OS === "ios" ? 0 : 1;

class EventDiscussionContainer extends PureComponent {
  static defaultProps = {
    colorPrimary: Consts.colorPrimary
  };

  static propTypes = {
    colorPrimary: PropTypes.string
  };

  state = {
    isLoading: true,
    isDiscussionForm: false,
    messageDiscussion: "",
    isDeleteDiscussion: false,
    discussionStatus: "",
    discussionID: null
  };

  _getEventDiscussion = async () => {
    try {
      const { getEventDiscussion, id, type } = this.props;
      await getEventDiscussion(id, type);
      this.setState({ isLoading: false });
    } catch (err) {
      console.log(err);
    }
  };

  componentDidMount() {
    this._getEventDiscussion();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.isToggleDiscussion) {
      this.setState({
        isDiscussionForm: true,
        discussionStatus: "post"
      });
    }
  }

  _handleEndReached = (id, next) => {
    this.props.getEventDiscussionLoadmore(id, next);
  };

  _handleAccountScreen = () => {
    const { translations, navigation } = this.props;
    Alert.alert(translations.login, translations.requiredLogin, [
      {
        text: translations.cancel,
        style: "cancel"
      },
      {
        text: translations.continue,
        onPress: () => navigation.navigate("AccountScreen")
      }
    ]);
  };

  _handleCommentScreen = (item, autoFocus) => () => {
    const { navigation } = this.props;
    navigation.navigate("EventCommentDiscussionScreen", {
      item,
      autoFocus
    });
  };

  _handleLikeDiscussion = discussionID => () => {
    const { auth } = this.props;
    const { isLoggedIn } = auth;
    isLoggedIn
      ? this.props.likeEventDiscussion(discussionID)
      : this._handleAccountScreen();
  };

  _handleModalPostDiscussion = () => {
    this.setState({
      isDiscussionForm: true,
      discussionStatus: "post"
    });
  };

  _handleDiscussionFormBackdropPress = () => {
    this.setState({
      isDiscussionForm: false
    });
  };

  _handleChangeTextDiscussion = text => {
    this.setState({
      messageDiscussion: text
    });
  };

  _handleSubmitEventDiscussion = eventID => async () => {
    const { messageDiscussion } = this.state;
    await this.props.postEventDiscussion(eventID, messageDiscussion);
    const { eventDiscussionMessage } = this.props;
    await this.setState({
      isDiscussionForm: false,
      messageDiscussion: ""
    });
    await wait(600);
    this._toast.show(eventDiscussionMessage, 2000);
  };

  _handleEditEventDiscussion = eventID => async () => {
    const { messageDiscussion, discussionID } = this.state;
    await this.props.editEventDiscussion(
      eventID,
      discussionID,
      messageDiscussion
    );
    this.setState({
      isDiscussionForm: false,
      messageDiscussion: ""
    });
  };

  _handleOpenModalEditDiscussion = (content, discussionID) => {
    this.setState({
      isDiscussionForm: true,
      messageDiscussion: content,
      discussionStatus: "edit",
      discussionID
    });
  };

  _handleDeleteDiscussion = discussionID => async () => {
    const { id: eventID } = this.props;
    this.setState({ isDeleteDiscussion: true });
    await this.props.deleteEventDiscussion(eventID, discussionID);
    this.setState({ isDeleteDiscussion: false });
  };

  renderItem = ({ item, index }) => {
    const { translations, settings, auth, shortProfile } = this.props;
    const { isLoggedIn } = auth;
    const { userID } = shortProfile;
    const { userID: discussionUserID } = item.oAuthor;
    const flatten = isLoggedIn && discussionUserID === userID;
    return (
      <View>
        {index === 0 && this._renderButtonToggleModal()}
        <CommentReview
          key={index.toString()}
          TEMPORARY_ShareDisable
          colorPrimary={settings.colorPrimary}
          headerActionSheet={{
            options: [
              translations.cancel,
              ...(flatten ? [translations.comment] : []),
              ...(flatten ? [translations.edit] : []),
              ...(flatten ? [translations.delete] : [])
            ],
            title: he.decode(item.oAuthor.displayName),
            message: he.decode(cutTextEllipsis(40)(item.postContent)),
            destructiveButtonIndex: 3,
            cancelButtonIndex: 0,
            onPressButtonItem: () => {
              console.log("press");
            },
            onAction: buttonIndex => {
              console.log(buttonIndex);
              switch (buttonIndex) {
                case 1:
                  this._handleCommentScreen(item, true)();
                  break;
                case 2:
                  this._handleOpenModalEditDiscussion(
                    item.postContent,
                    item.ID
                  );
                  break;
                case 3:
                  Alert.alert(
                    translations.delete,
                    translations.confirmDeleteComment,
                    [
                      {
                        text: translations.cancel,
                        style: "cancel"
                      },
                      {
                        text: translations.ok,
                        onPress: this._handleDeleteDiscussion(item.ID)
                      }
                    ],
                    { cancelable: false }
                  );
                  break;
                default:
                  return false;
              }
            }
          }}
          headerAuthor={{
            image: item.oAuthor.avatar,
            title: he.decode(item.oAuthor.displayName),
            text: item.postDate
          }}
          renderContent={() => (
            <View>
              <Text style={stylesBase.text}>
                {he.decode(cutTextEllipsis(200)(item.postContent))}
              </Text>
              {item.postContent.length > 200 && (
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={this._handleCommentScreen(item, false)}
                  style={{ marginTop: 4 }}
                >
                  <Text style={[stylesBase.text, { color: Consts.colorDark4 }]}>
                    {translations.seeMoreReview}
                  </Text>
                </TouchableOpacity>
              )}
              <View style={{ height: 3 }} />
            </View>
          )}
          shares={{
            count: item.countShared,
            text:
              item.countShared > 1 ? translations.shares : translations.share
          }}
          comments={{
            count: item.countDiscussions,
            isLoading: false,
            text:
              item.countDiscussions > 1
                ? translations.comments
                : translations.comment
          }}
          likes={{
            count: item.countLiked,
            text: item.countLiked > 1 ? translations.likes : translations.like
          }}
          likeText={item.isLiked ? translations.liked : translations.like}
          likeTextColor={
            item.isLiked ? settings.colorPrimary : Consts.colorDark3
          }
          onComment={this._handleCommentScreen(item, true)}
          onLike={this._handleLikeDiscussion(item.ID)}
          // onShare={this._handleShareDiscussion(item.permalink, reviewID)}
          style={{ marginBottom: 10 }}
        />
      </View>
    );
  };

  _renderButtonToggleModal = () => {
    const { translations, settings, auth } = this.props;
    const { isLoggedIn } = auth;
    return (
      <View style={{ marginBottom: 10 }}>
        <Button
          size="lg"
          block={true}
          backgroundColor="primary"
          radius="round"
          style={{
            paddingVertical: 0,
            height: 50,
            justifyContent: "center"
          }}
          onPress={
            isLoggedIn
              ? this._handleModalPostDiscussion
              : this._handleAccountScreen
          }
          colorPrimary={settings.colorPrimary}
        >
          {translations.discussion}
        </Button>
      </View>
    );
  };

  _renderModalDiscussion = () => {
    const { translations, settings, id } = this.props;
    const {
      messageDiscussion,
      isDiscussionForm,
      discussionStatus
    } = this.state;
    return (
      <Modal
        isVisible={isDiscussionForm}
        headerIcon="edit"
        headerTitle={
          discussionStatus === "post"
            ? translations.discussion
            : translations.edit
        }
        colorPrimary={settings.colorPrimary}
        cancelText={translations.cancel}
        submitText={
          discussionStatus === "post"
            ? translations.discussion
            : translations.update
        }
        onBackdropPress={this._handleDiscussionFormBackdropPress}
        onSubmitAsync={
          discussionStatus === "post"
            ? this._handleSubmitEventDiscussion(id)
            : this._handleEditEventDiscussion(id)
        }
      >
        <View>
          <InputMaterial
            autoFocus
            multiline
            clearTextEnabled={false}
            placeholder={""}
            colorPrimary={settings.colorPrimary}
            value={messageDiscussion}
            onChangeText={this._handleChangeTextDiscussion}
          />
        </View>
      </Modal>
    );
  };

  render() {
    const {
      eventDiscussion,
      eventDiscussionLatest,
      type,
      id,
      translations,
      navigation
    } = this.props;
    const _eventDiscussion =
      type === "latest" ? eventDiscussionLatest : eventDiscussion;
    const data = _eventDiscussion.oResults;
    const { isLoading } = this.state;
    return (
      <View>
        <ViewWithLoading
          isLoading={isLoading}
          contentLoader="contentHeaderAvatar"
          contentLoaderItemLength={3}
        >
          {!_.isEmpty(data) && type === "latest" && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
                marginTop: 10
              }}
            >
              <Text
                style={{
                  color: this.props.settings.colorPrimary,
                  fontSize: 24,
                  fontWeight: "500"
                }}
              >
                {_eventDiscussion.countDiscussions}
              </Text>
              <Text
                style={{
                  color: Consts.colorDark2,
                  fontSize: 18,
                  fontWeight: "500"
                }}
              >
                {` ${
                  _eventDiscussion.countDiscussions === 1
                    ? translations.discussion
                    : translations.discussions
                }`}
              </Text>
            </View>
          )}
          {data && data.length > 0 && (
            <FlatList
              data={data}
              renderItem={this.renderItem}
              keyExtractor={item => item.ID.toString()}
              showsVerticalScrollIndicator={false}
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps="always"
              scrollEnabled={type !== "latest"}
              onEndReachedThreshold={END_REACHED_THRESHOLD}
              onEndReached={() =>
                _eventDiscussion &&
                _eventDiscussion.next !== false &&
                type !== "latest"
                  ? this._handleEndReached(id, _eventDiscussion.next)
                  : {}
              }
              ListFooterComponent={() =>
                _eventDiscussion &&
                _eventDiscussion.next !== false &&
                type !== "latest" && <Loader size={30} height={80} />
              }
            />
          )}
          {_.isEmpty(eventDiscussionLatest.oResults) &&
            this._renderButtonToggleModal()}
          {data.length > 0 && type === "latest" && (
            <View style={{ marginBottom: 20 }}>
              <Button
                size="lg"
                block={true}
                backgroundColor="light"
                color="dark"
                onPress={() => {
                  navigation.navigate("EventDiscussionAllScreen", {
                    id
                  });
                }}
              >
                {translations.seeMoreDiscussions}
              </Button>
            </View>
          )}
          {this._renderModalDiscussion()}
        </ViewWithLoading>
        <Toast ref={c => (this._toast = c)} />
        <LoadingFull visible={this.state.isDeleteDiscussion} />
      </View>
    );
  }
}

const mapStateToProps = ({
  eventDiscussion,
  eventDiscussionLatest,
  eventDiscussionMessage,
  translations,
  shortProfile,
  settings,
  auth
}) => ({
  eventDiscussion,
  eventDiscussionLatest,
  eventDiscussionMessage,
  translations,
  shortProfile,
  settings,
  auth
});

const mapDispatchToProps = {
  getEventDiscussion,
  getEventDiscussionLoadmore,
  postEventDiscussion,
  deleteEventDiscussion,
  editEventDiscussion,
  likeEventDiscussion
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventDiscussionContainer);
