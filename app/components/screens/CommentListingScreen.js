import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  Text,
  View,
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback,
  Share,
  Platform,
  Alert,
  ScrollView
} from "react-native";
import Constants from "expo-constants";
import he from "he";
import {
  NewGallery,
  cutTextEllipsis,
  LoadingFull,
  Modal,
  InputMaterial,
  wait,
  ViewWithLoading,
  Loader
} from "../../wiloke-elements";
import { CommentReview } from "../dumbs";
import stylesBase from "../../stylesBase";
import { connect } from "react-redux";
import {
  getCommentInReviews,
  postCommentReview,
  likeReview,
  deleteReview,
  deleteCommentReview,
  editCommentReview,
  shareReview
} from "../../actions";
import * as Consts from "../../constants/styleConstants";
import _ from "lodash";

const TIME_FAKE = 4000;

class CommentListingScreen extends PureComponent {
  state = {
    isLoading: true,
    isDeleteReviewLoading: false,
    isDeleteCommentReviewLoading: false,
    messageEdit: "",
    reviewID: null,
    commentID: null,
    isVisibleFormEditComment: false,
    isSubmit: false,
    item: {}
  };
  async componentDidMount() {
    const {
      navigation,
      getCommentInReviews,
      listingReviewsAll,
      listingReviews
    } = this.props;
    const { params } = navigation.state;
    const { item: _item, id } = params;
    const { userID: reviewUserID, ID: reviewID } = params.item;
    const aReviewsAll = _.get(listingReviewsAll, `${id}.aReviews`, []);
    const aReviewssss = _.get(listingReviews, `${id}.aReviews`, []);
    const reviews = !_.isEmpty(aReviewsAll) ? aReviewsAll : aReviewssss;
    const item = {
      ..._item,
      ...(!_.isEmpty(reviews)
        ? reviews.filter(item => item.ID === reviewID)[0]
        : [])
    };

    await getCommentInReviews(reviewID);
    this.setState({ isLoading: false, item });
    // RealTime Faker
    // this._realTimeFaker = setInterval(() => {
    //   getCommentInReviews(commentId);
    // }, TIME_FAKE);
  }

  UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
    const { navigation } = this.props;
    const { item: _item, id } = navigation.state.params;
    const { userID: reviewUserID, ID: reviewID } = navigation.state.params.item;

    const { listingReviews, listingReviewsAll } = nextProps;

    const aReviewsAll = _.get(listingReviewsAll, `${id}.aReviews`, []);
    const aReviewssss = _.get(listingReviews, `${id}.aReviews`, []);
    const reviews = !_.isEmpty(aReviewsAll) ? aReviewsAll : aReviewssss;
    const nextItem = {
      ..._item,
      ...(!_.isEmpty(reviews)
        ? reviews.filter(item => item.ID === reviewID)[0]
        : [])
    };
    if (
      !_.isEqual(this.props.listingReview, listingReviews) ||
      !_.isEqual(this.props.listingReviewsAll, listingReviewsAll)
    ) {
      this.setState({
        item: nextItem
      });
    }
  }

  // componentWillUnmount() {
  //   clearInterval(this._realTimeFaker);
  // }

  _handleGoBack = () => {
    const { navigation } = this.props;
    Keyboard.dismiss();
    navigation.goBack();
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

  _handleCommentReview = isLoggedIn => async content => {
    const { navigation, postCommentReview } = this.props;
    const { params } = navigation.state;
    const { ID: reviewID } = params.item;
    isLoggedIn
      ? await postCommentReview(reviewID, content, params.id)
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

  _handleLike = (isLoggedIn, reviewID, listingID) => () => {
    isLoggedIn
      ? this.props.likeReview(reviewID, listingID)
      : this._handleAccountScreen();
  };

  _handleShare = (link, reviewID) => async () => {
    try {
      const result = await Share.share({
        ...Platform.select({
          ios: {
            message: "",
            url: link
          },
          android: {
            message: link
          }
        })
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
          this.props.shareReview(reviewID);
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (err) {
      console.log(err);
    }
  };

  _handleDeleteReview = (listingID, reviewID) => () => {
    const { listingReviews, listingReviewsAll, navigation } = this.props;
    const { type } = navigation.state.params;
    this.setState({ isDeleteReviewLoading: true });
    this.props.navigation.goBack();
    const total =
      type !== "all"
        ? listingReviews[listingID].total
        : listingReviewsAll[listingID].total;
    this.props.deleteReview(listingID, reviewID, total);
  };

  _handleDeleteCommentReview = (reviewID, commentID, listingID) => async () => {
    this.setState({ isDeleteCommentReviewLoading: true });
    await this.props.deleteCommentReview(reviewID, commentID, listingID);
    this.setState({ isDeleteCommentReviewLoading: false });
  };

  _handleEditCommentFormBackdropPress = () => {
    this.setState({ isVisibleFormEditComment: false, messageEdit: "" });
  };

  _handleEditCommentReview = (reviewID, commentID, message) => {
    this.setState({
      isVisibleFormEditComment: true,
      messageEdit: message,
      reviewID,
      commentID
    });
  };

  _handleSubmitEditCommentReview = async () => {
    const { reviewID, commentID, messageEdit } = this.state;
    await this.props.editCommentReview(reviewID, commentID, messageEdit);
    this.setState({
      isVisibleFormEditComment: false
    });
  };

  _handleChangeTextEditComment = text => {
    this.setState({
      messageEdit: text
    });
  };

  componentWillUnmount() {
    this.setState({ isDeleteReviewLoading: false });
  }

  renderReviewGallery = item => {
    const { settings } = this.props;
    if (_.isEmpty(item.oGallery)) return false;
    return (
      !!item.oGallery && (
        <View style={{ paddingTop: 8 }}>
          <NewGallery
            thumbnails={item.oGallery.medium.map(item => item.url)}
            modalSlider={item.oGallery.large.map(item => item.url)}
            colorPrimary={settings.colorPrimary}
          />
        </View>
      )
    );
  };

  _renderModalEditComment = () => {
    const { translations, settings } = this.props;
    return (
      <Modal
        isVisible={this.state.isVisibleFormEditComment}
        headerIcon="edit"
        headerTitle={translations.edit}
        colorPrimary={settings.colorPrimary}
        cancelText={translations.cancel}
        submitText={translations.update}
        onBackdropPress={this._handleEditCommentFormBackdropPress}
        onSubmitAsync={this._handleSubmitEditCommentReview}
      >
        <View>
          <InputMaterial
            autoFocus
            multiline
            clearTextEnabled={false}
            placeholder={""}
            colorPrimary={settings.colorPrimary}
            value={this.state.messageEdit}
            onChangeText={this._handleChangeTextEditComment}
          />
        </View>
      </Modal>
    );
  };

  render() {
    const {
      navigation,
      translations,
      commentInReviews,
      auth,
      settings,
      shortProfile,
      listingReviews,
      listingReviewsAll,
      listingDetail
    } = this.props;
    const {
      isDeleteReviewLoading,
      isDeleteCommentReviewLoading,
      isLoading,
      item,
      isSubmit
    } = this.state;
    const { isLoggedIn } = auth;
    const { params } = navigation.state;
    const { autoFocus, mode, id, key } = params;
    const { userID: reviewUserID, ID: reviewID } = params.item;
    const { userID } = shortProfile;
    const flatten = isLoggedIn && reviewUserID === userID;
    const dataComments =
      commentInReviews.length > 0
        ? commentInReviews.map(item => ({
            id: item.ID,
            image: item.oUserInfo.avatar,
            title: item.oUserInfo.displayName,
            userID: item.oUserInfo.userID,
            message: item.postContent,
            text: item.postDate
          }))
        : [];
    if (isLoading) {
      return <Loader size="small" height={150} />;
    }
    return (
      <View style={{ paddingTop: isLoading ? Constants.statusBarHeight : 0 }}>
        {this._renderModalEditComment()}
        <StatusBar barStyle="dark-content" />
        <LoadingFull visible={isDeleteReviewLoading} />
        <LoadingFull visible={isDeleteCommentReviewLoading} />
        <CommentReview
          fullScreen={true}
          isSubmit={isSubmit}
          colorPrimary={settings.colorPrimary}
          inputAutoFocus={autoFocus ? true : false}
          rated={_.get(item, "oReviews.average", 0)}
          ratedMax={mode}
          ratedText={_.get(item, "oReviews.quality", 0)}
          headerAuthor={{
            image: _.get(item, "oUserInfo.avatar", ""),
            title: he.decode(_.get(item, "oUserInfo.displayName", "")),
            text: item.postDate
          }}
          renderContent={() => (
            <View>
              <Text
                style={[stylesBase.h5, { marginBottom: 3, textAlign: "left" }]}
              >
                {he.decode(_.get(item, "postTitle", ""))}
              </Text>
              <Text style={[stylesBase.text, { textAlign: "left" }]}>
                {he.decode(_.get(item, "postContent", ""))}
              </Text>
              {this.renderReviewGallery(item)}
              <View style={{ height: 3 }} />
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
          goBack={this._handleGoBack}
          style={{ borderWidth: 0 }}
          likeText={item.isLiked ? translations.liked : translations.like}
          likeTextColor={
            item.isLiked ? settings.colorPrimary : Consts.colorDark3
          }
          onSubmitCommentReview={this._handleCommentReview(isLoggedIn)}
          onChangeText={this._handleChangeComment}
          onLike={this._handleLike(isLoggedIn, reviewID, id)}
          onShare={this._handleShare(item.permalink, reviewID)}
          headerActionSheet={{
            options: [
              translations.cancel,
              translations.like,
              translations.share,
              ...(flatten ? [translations.editReview] : []),
              ...(flatten ? [translations.deleteReview] : [])
            ],
            title: he.decode(_.get(item, "postTitle", "")),
            message: he.decode(
              cutTextEllipsis(40)(_.get(item, "postContent", ""))
            ),
            destructiveButtonIndex: 4,
            cancelButtonIndex: 0,
            onPressButtonItem: () => {
              console.log("press");
            },
            onAction: buttonIndex => {
              switch (buttonIndex) {
                case 1:
                  this._handleLike(isLoggedIn, reviewID, id)();
                  break;
                case 2:
                  this._handleShare(item.shareURL, reviewID)();
                  break;
                case 3:
                  navigation.navigate("ReviewFormScreen", {
                    mode: listingDetail[id].oReview.mode,
                    id,
                    reviewID,
                    item,
                    type: "edit"
                  });
                  break;
                case 4:
                  Alert.alert(
                    `${translations.delete} ${he.decode(
                      _.get(item, "postTitle", "")
                    )}`,
                    translations.confirmDeleteReview,
                    [
                      {
                        text: translations.cancel,
                        style: "cancel"
                      },
                      {
                        text: translations.ok,
                        onPress: this._handleDeleteReview(params.id, reviewID)
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
          commentsActionSheet={(title, message, commentUserID, commentID) => {
            const flatten = isLoggedIn && commentUserID === userID;
            return {
              options: [
                translations.cancel,
                ...(flatten ? [translations.edit] : []),
                ...(flatten ? [translations.delete] : [])
              ],
              destructiveButtonIndex: 2,
              cancelButtonIndex: 0,
              title: he.decode(title),
              message: he.decode(message),
              onAction: buttonIndex => {
                switch (buttonIndex) {
                  case 1:
                    this._handleEditCommentReview(reviewID, commentID, message);
                    break;
                  case 2:
                    Alert.alert(
                      `${translations.delete} ${he.decode(message)}`,
                      translations.confirmDeleteComment,
                      [
                        {
                          text: translations.cancel,
                          style: "cancel"
                        },
                        {
                          text: translations.ok,
                          onPress: this._handleDeleteCommentReview(
                            reviewID,
                            commentID,
                            id
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
        />
      </View>
    );
  }
}

const mapStateToProps = ({
  translations,
  commentInReviews,
  settings,
  auth,
  shortProfile,
  listingReviews,
  listingReviewsAll,
  listingDetail
}) => ({
  translations,
  commentInReviews,
  settings,
  auth,
  shortProfile,
  listingReviews,
  listingReviewsAll,
  listingDetail
});

const mapDispatchToProps = {
  getCommentInReviews,
  postCommentReview,
  likeReview,
  deleteReview,
  deleteCommentReview,
  editCommentReview,
  shareReview
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommentListingScreen);
