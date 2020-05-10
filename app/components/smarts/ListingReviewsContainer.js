import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  Share,
  Platform
} from "react-native";
import { connect } from "react-redux";
import he from "he";
import _ from "lodash";
import {
  getListingReviews,
  deleteReview,
  likeReview,
  shareReview
} from "../../actions";
import stylesBase from "../../stylesBase";
import {
  NewGallery,
  ViewWithLoading,
  RequestTimeoutWrapped,
  cutTextEllipsis,
  LoadingFull
} from "../../wiloke-elements";
import { CommentReview } from "../dumbs";
import * as Consts from "../../constants/styleConstants";

class ListingReviewsContainer extends Component {
  static propTypes = {
    params: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      key: PropTypes.string
    }),
    type: PropTypes.string,
    colorPrimary: PropTypes.string
  };

  static defaultProps = {
    data: "",
    colorPrimary: Consts.colorPrimary
  };

  state = {
    imageIndex: 0,
    isImageViewVisible: false,
    isDeleteReviewLoading: false
  };

  _getListingReviews = () => {
    const {
      params,
      type,
      getListingReviews,
      listingReviews,
      listingReviewsAll
    } = this.props;
    const { id, item, max } = params;
    if (type === null) {
      getListingReviews(id, item.key, max);
    }
  };

  componentDidMount() {
    this._getListingReviews();
  }

  componentWillUnmount() {
    this._timeout && clearTimeout(this._timeout);
  }

  _handleCommentScreen = (_item, mode, autoFocus) => () => {
    const { navigation } = this.props;
    const { params } = this.props;
    const { id, item } = params;
    navigation.navigate("CommentListingScreen", {
      id,
      key: item.key,
      item: _item,
      autoFocus,
      mode
    });
  };

  _handleDeleteReview = (listingID, reviewID) => async () => {
    const { listingReviews, listingReviewsAll, type } = this.props;
    this.setState({ isDeleteReviewLoading: true });
    await this.props.deleteReview(
      listingID,
      reviewID,
      type !== "all"
        ? listingReviews[listingID].total
        : listingReviewsAll[listingID].total
    );
    this.setState({ isDeleteReviewLoading: false });
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

  _handleLike = (isLoggedIn, reviewID) => () => {
    const { params } = this.props;
    const { id } = params;
    isLoggedIn
      ? this.props.likeReview(reviewID, id)
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

  renderReviewGallery = item => {
    const { settings } = this.props;
    const thumbnails = item.oGallery.medium
      .filter(item => item)
      .map(item => item.url);
    const modalSlider = item.oGallery.large
      .filter(item => item)
      .map(item => item.url);
    return (
      <View style={{ paddingTop: 8 }}>
        {!_.isEmpty(thumbnails) && (
          <NewGallery
            thumbnails={thumbnails}
            modalSlider={modalSlider}
            thumbnailMax={3}
            colorPrimary={settings.colorPrimary}
          />
        )}
      </View>
    );
  };

  renderItemReview = mode => (item, index) => {
    const {
      translations,
      navigation,
      listingDetail,
      params,
      auth,
      shortProfile,
      settings
    } = this.props;
    const { isDeleteReviewLoading } = this.state;
    const { isLoggedIn } = auth;
    const { userID: reviewUserID, ID: reviewID } = item;
    const { userID } = shortProfile;
    const flatten = isLoggedIn && reviewUserID === userID;
    return (
      <CommentReview
        key={index.toString()}
        colorPrimary={this.props.settings.colorPrimary}
        headerActionSheet={{
          options: [
            translations.cancel,
            translations.share,
            translations.comment,
            translations.like,
            ...(flatten ? [translations.editReview] : []),
            ...(flatten ? [translations.deleteReview] : [])
            // "Pin to Top of Review",
          ],
          title: he.decode(item.postTitle),
          message: he.decode(cutTextEllipsis(40)(item.postContent)),
          destructiveButtonIndex: 5,
          cancelButtonIndex: 0,
          onAction: buttonIndex => {
            switch (buttonIndex) {
              case 1:
                this._handleShare(item.shareURL, reviewID)();
                break;
              case 2:
                this._handleCommentScreen(item, mode, true)();
                break;
              case 3:
                this._handleLike(isLoggedIn, reviewID)();
                break;
              case 4:
                navigation.navigate("ReviewFormScreen", {
                  mode,
                  id: params.id,
                  reviewID,
                  item,
                  type: "edit"
                });
                break;
              case 5:
                Alert.alert(
                  `${translations.delete} ${he.decode(item.postTitle)}`,
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
        rated={item.oReviews.average}
        ratedMax={mode}
        ratedText={item.oReviews.quality ? item.oReviews.quality : ""}
        headerAuthor={{
          image: item.oUserInfo.avatar,
          title: he.decode(item.oUserInfo.displayName),
          text: item.postDate
        }}
        renderContent={() => (
          <View>
            <LoadingFull visible={isDeleteReviewLoading} />
            <Text
              style={[stylesBase.h5, { marginBottom: 3, textAlign: "left" }]}
            >
              {he.decode(item.postTitle)}
            </Text>
            <Text style={[stylesBase.text, { textAlign: "left" }]}>
              {he.decode(cutTextEllipsis(200)(item.postContent))}
            </Text>
            {item.postContent.length > 200 && (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={this._handleCommentScreen(item, mode, false)}
                style={{ marginTop: 4 }}
              >
                <Text
                  style={[
                    stylesBase.text,
                    { color: Consts.colorDark4, textAlign: "left" }
                  ]}
                >
                  {translations.seeMoreReview}
                </Text>
              </TouchableOpacity>
            )}
            {item.oGallery &&
              !_.isEmpty(item.oGallery) &&
              this.renderReviewGallery(item)}
            <View style={{ height: 3 }} />
          </View>
        )}
        shares={{
          count: item.countShared,
          text: item.countShared > 1 ? translations.shares : translations.share
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
        likeTextColor={item.isLiked ? settings.colorPrimary : Consts.colorDark3}
        onComment={this._handleCommentScreen(item, mode, true)}
        onLike={this._handleLike(isLoggedIn, reviewID)}
        onShare={this._handleShare(item.permalink, reviewID)}
        style={styles.itemReview}
      />
    );
  };

  renderContent = (data, mode, isLoading) => {
    const { isListingDetailReviewsRequestTimeout, translations } = this.props;
    if (data === "__empty__") {
      return null;
    }
    return (
      <RequestTimeoutWrapped
        isTimeout={isListingDetailReviewsRequestTimeout}
        onPress={this._getListingReviews}
        text={translations.networkError}
        buttonText={translations.retry}
      >
        <ViewWithLoading
          isLoading={isLoading}
          contentLoader="contentHeaderAvatar"
          contentLoaderItemLength={3}
        >
          <View>
            {!_.isEmpty(data) && data.map(this.renderItemReview(mode))}
          </View>
        </ViewWithLoading>
      </RequestTimeoutWrapped>
    );
  };

  renderTotalReviews = total => {
    const { navigation, translations } = this.props;
    const { name } = navigation.state.params;
    return (
      total &&
      total !== "undefined" && (
        <View style={styles.totalReviews}>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={[
                stylesBase.text,
                { color: this.props.colorPrimary, fontSize: 18, paddingLeft: 7 }
              ]}
            >
              {total}
            </Text>
            <Text
              style={[stylesBase.text, { fontSize: 16 }]}
            >{` ${translations.reviewsFor} ${name}`}</Text>
          </View>
        </View>
      )
    );
  };

  render() {
    const {
      listingReviews,
      listingReviewsAll,
      type,
      navigation,
      listingDetail,
      params
    } = this.props;
    const { id, item, max } = params;
    const oReview = _.get(listingDetail, `${id}.oReview`, {});
    const total = _.get(listingReviews, `${id}.total`, null);
    const aReviews =
      type !== "all"
        ? _.get(listingReviews, `${id}.aReviews`, [])
        : _.get(listingReviewsAll, `${id}.aReviews`, []);
    return (
      <View>
        {type === "all" ? (
          this.renderContent(
            aReviews,
            oReview.mode,
            _.isEmpty(listingReviewsAll[id])
          )
        ) : (
          <Fragment>
            {this.renderTotalReviews(total)}
            {this.renderContent(
              aReviews,
              oReview.mode,
              _.isEmpty(listingReviews[id])
            )}
          </Fragment>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  totalReviews: {
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Consts.colorGray1
  },
  itemReview: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Consts.colorGray1
  }
});

const mapStateToProps = state => ({
  listingReviews: state.listingReviews,
  listingReviewsAll: state.listingReviewsAll,
  listingDetail: state.listingDetail,
  translations: state.translations,
  loadingListingDetail: state.loadingListingDetail,
  isListingDetailReviewsRequestTimeout:
    state.isListingDetailReviewsRequestTimeout,
  settings: state.settings,
  auth: state.auth,
  shortProfile: state.shortProfile
});

const mapDispatchToProps = {
  getListingReviews,
  deleteReview,
  likeReview,
  shareReview
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListingReviewsContainer);
