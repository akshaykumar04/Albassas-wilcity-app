import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  Text,
  View,
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback,
  Alert
} from "react-native";
import he from "he";
import {
  NewGallery,
  wait,
  cutTextEllipsis,
  Modal,
  InputMaterial,
  LoadingFull
} from "../../wiloke-elements";
import { CommentReview } from "../dumbs";
import stylesBase from "../../stylesBase";
import { connect } from "react-redux";
import {
  getCommentInDiscussionEvent,
  postCommentInDiscussionEvent,
  editCommentInDiscussionEvent,
  deleteCommentInDiscussionEvent,
  resetCmtEventDiscussion
} from "../../actions";
import _ from "lodash";

const TIME_FAKE = 20000;

class EventCommentDiscussionScreen extends PureComponent {
  state = {
    isLoading: true,
    isSubmit: false,
    isVisibleModalEdit: false,
    discussionID: null,
    commentID: null,
    messageEdit: "",
    isDeleteLoading: false
  };

  async componentDidMount() {
    const { navigation, getCommentInDiscussionEvent } = this.props;
    const { params } = navigation.state;
    const { item } = params;
    const discussionId = item.ID;
    await getCommentInDiscussionEvent(discussionId);
    this.setState({ isLoading: false });
    // RealTime Faker
    // this._realTimeFaker = setInterval(() => {
    //   getCommentInDiscussionEvent(discussionId);
    // }, TIME_FAKE);
  }

  componentWillUnmount() {
    // clearInterval(this._realTimeFaker);
    this.props.resetCmtEventDiscussion();
  }

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

  _handleCmtInDiscussionEvent = isLoggedIn => async content => {
    const { navigation, postCommentInDiscussionEvent } = this.props;
    const { params } = navigation.state;
    const { ID: discussionID } = params.item;
    isLoggedIn
      ? await postCommentInDiscussionEvent(discussionID, content)
      : this._handleAccountScreen();
    this.setState({
      isSubmit: true
    });
    await wait(300);
    this.setState({
      isSubmit: false
    });
  };

  _handleChangeComment = () => {
    this.state.isSubmit &&
      this.setState({
        isSubmit: false
      });
  };

  _handleGoBack = () => {
    const { navigation } = this.props;
    Keyboard.dismiss();
    navigation.goBack();
  };

  _handleOpenModalEditComment = (discussionID, commentID, message) => {
    this.setState({
      isVisibleModalEdit: true,
      discussionID,
      commentID,
      messageEdit: message
    });
  };

  _handleSubmitEditComment = async () => {
    const { discussionID, commentID, messageEdit } = this.state;
    await this.props.editCommentInDiscussionEvent(
      discussionID,
      commentID,
      messageEdit
    );
    this.setState({
      isVisibleModalEdit: false
    });
  };

  _handleChangeTextEditComment = text => {
    this.setState({
      messageEdit: text
    });
  };

  _handleEditCommentFormBackdropPress = () => {
    this.setState({
      isVisibleModalEdit: false
    });
  };

  _handleDeleteComment = (discussionID, commentID) => async () => {
    this.setState({ isDeleteLoading: true });
    await this.props.deleteCommentInDiscussionEvent(discussionID, commentID);
    this.setState({ isDeleteLoading: false });
  };

  _renderModalEditComment = () => {
    const { translations, settings } = this.props;
    const { isVisibleModalEdit, messageEdit } = this.state;
    return (
      <Modal
        isVisible={isVisibleModalEdit}
        headerIcon="edit"
        headerTitle={translations.edit}
        colorPrimary={settings.colorPrimary}
        cancelText={translations.cancel}
        submitText={translations.update}
        onBackdropPress={this._handleEditCommentFormBackdropPress}
        onSubmitAsync={this._handleSubmitEditComment}
      >
        <View>
          <InputMaterial
            autoFocus
            multiline
            clearTextEnabled={false}
            placeholder={""}
            colorPrimary={settings.colorPrimary}
            value={messageEdit}
            onChangeText={this._handleChangeTextEditComment}
          />
        </View>
      </Modal>
    );
  };

  renderReviewGallery = item => {
    const { settings } = this.props;
    return (
      item.oGallery !== false && (
        <View style={{ paddingTop: 8 }}>
          <NewGallery
            thumbnails={item.oGallery.medium}
            modalSlider={item.oGallery.large}
            colorPrimary={settings.colorPrimary}
          />
        </View>
      )
    );
  };

  render() {
    const {
      navigation,
      translations,
      commentInDiscussionEvent,
      auth,
      shortProfile,
      eventDiscussion,
      eventDiscussionLatest
    } = this.props;
    const { isLoggedIn } = auth;
    const { params } = navigation.state;
    const { item: _item, autoFocus } = params;
    const { ID: discussionID } = params.item;
    const { userID: discussionUserID } = params.item.oAuthor;
    const discussions = !_.isEmpty(eventDiscussion.oResults)
      ? eventDiscussion.oResults
      : eventDiscussionLatest.oResults;
    const item = {
      ..._item,
      ...discussions.filter(item => item.ID === discussionID)[0]
    };

    const { isLoading } = this.state;
    const { userID } = shortProfile;
    const flatten = isLoggedIn && discussionUserID === userID;
    console.log(discussionUserID, userID, flatten);
    const dataComments =
      commentInDiscussionEvent.oResults &&
      commentInDiscussionEvent.oResults.length > 0
        ? commentInDiscussionEvent.oResults.map(item => ({
            id: item.ID,
            image: item.oAuthor.avatar,
            title: item.oAuthor.displayName,
            userID: item.oAuthor.userID,
            message: item.postContent,
            text: item.postDate
          }))
        : [];
    return (
      <View>
        {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}> */}
        <View>
          <StatusBar barStyle="dark-content" />
          <CommentReview
            TEMPORARY_ShareDisable
            fullScreen={true}
            isSubmit={this.state.isSubmit}
            colorPrimary={this.props.settings.colorPrimary}
            inputAutoFocus={autoFocus ? true : false}
            // headerActionSheet={{
            //   options: [
            //     translations.cancel,
            //     translations.like,
            //     translations.share,
            //     ...(flatten ? [translations.edit] : []),
            //     ...(flatten ? [translations.delete] : [])
            //   ],
            //   title: he.decode(item.postTitle),
            //   message: he.decode(cutTextEllipsis(40)(item.postContent)),
            //   destructiveButtonIndex: 4,
            //   cancelButtonIndex: 0
            // }}
            headerAuthor={{
              image: item.oAuthor.avatar,
              title: he.decode(item.oAuthor.displayName),
              text: item.postDate
            }}
            renderContent={() => (
              <View>
                <Text style={stylesBase.text}>
                  {he.decode(item.postContent)}
                </Text>
              </View>
            )}
            shares={{
              count: item.countShared,
              text:
                item.countShared > 1 ? translations.shares : translations.share
            }}
            comments={{
              data: dataComments.reverse(),
              count: item.countDiscussions,
              isLoading,
              text:
                item.countDiscussions > 1
                  ? translations.comments
                  : translations.comment
            }}
            likes={{
              count: item.countLiked,
              text: item.countLiked > 1 ? translations.likes : translations.like
            }}
            commentsActionSheet={(title, message, commentUserID, commentID) => {
              const flatten = isLoggedIn && commentUserID === userID;
              return {
                options: [
                  translations.cancel,
                  ...(flatten ? [translations.edit] : []),
                  ...(flatten ? [translations.delete] : [])
                ],
                title: he.decode(title),
                message: he.decode(cutTextEllipsis(40)(message)),
                destructiveButtonIndex: 2,
                cancelButtonIndex: 0,
                onAction: buttonIndex => {
                  switch (buttonIndex) {
                    case 1:
                      this._handleOpenModalEditComment(
                        discussionID,
                        commentID,
                        message
                      );
                      break;
                    case 2:
                      Alert.alert(
                        `${translations.delete} ${he.decode(item.postTitle)}`,
                        translations.confirmDeleteComment,
                        [
                          {
                            text: translations.cancel,
                            style: "cancel"
                          },
                          {
                            text: translations.ok,
                            onPress: this._handleDeleteComment(
                              discussionID,
                              commentID
                            )
                          }
                        ],
                        { cancelable: false }
                      );
                      break;
                    default:
                      return false;
                  }
                }
              };
            }}
            goBack={this._handleGoBack}
            style={{ borderWidth: 0 }}
            onSubmitCommentReview={this._handleCmtInDiscussionEvent(isLoggedIn)}
            onChangeText={this._handleChangeComment}
          />
        </View>
        {this._renderModalEditComment()}
        <LoadingFull visible={this.state.isDeleteLoading} />
        {/* </TouchableWithoutFeedback> */}
      </View>
    );
  }
}

const mapStateToProps = ({
  translations,
  commentInDiscussionEvent,
  settings,
  auth,
  shortProfile,
  eventDiscussion,
  eventDiscussionLatest
}) => ({
  translations,
  commentInDiscussionEvent,
  settings,
  auth,
  shortProfile,
  eventDiscussion,
  eventDiscussionLatest
});

const mapDispatchToProps = {
  getCommentInDiscussionEvent,
  postCommentInDiscussionEvent,
  editCommentInDiscussionEvent,
  deleteCommentInDiscussionEvent,
  resetCmtEventDiscussion
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventCommentDiscussionScreen);
