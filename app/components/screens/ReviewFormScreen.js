import React, { PureComponent } from "react";
import { View, Dimensions } from "react-native";
import { ReviewForm, Layout } from "../dumbs";
import { connect } from "react-redux";
import { colorGray2, colorDark1 } from "../../constants/styleConstants";
import {
  Button,
  bottomBarHeight,
  Loader,
  Toast,
  KeyboardAnimationRP,
  KeyboardSpacer
} from "../../wiloke-elements";
import Constants from "expo-constants";
import { submitReview, editReview, getReviewFields } from "../../actions";
import * as ImageManipulator from "expo-image-manipulator";
import _ from "lodash";
import { screenWidth } from "../../constants/styleConstants";
const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const HEADER_HEIGHT = 52 + Constants.statusBarHeight;
const CONTENT_HEIGHT = SCREEN_HEIGHT - HEADER_HEIGHT - 50 - bottomBarHeight;

class ReviewFormScreen extends PureComponent {
  state = {
    isScrollEnabled: true,
    isSubmitLoading: false,
    formResults: {},
    defaultResults: {},
    isLoading: true
  };

  async componentDidMount() {
    const { navigation } = this.props;
    const { params } = navigation.state;
    await this.props.getReviewFields(params.id);
    const defaultResults = !_.isEmpty(params.item)
      ? {
          gallery:
            !_.isEmpty(params.item.oGallery.medium) &&
            params.item.oGallery.medium,
          title: params.item.postTitle,
          content: params.item.postContent,
          ...params.item.oReviews.oDetails.reduce(
            (obj, item) => ({
              ...obj,
              [item.key]: item.score
            }),
            {}
          )
        }
      : {};
    this.setState({ isLoading: false, defaultResults });
  }

  _handleRangeSliderBeginChangeValue = () => {
    this.setState({
      isScrollEnabled: false
    });
  };

  _getToastText = errMessage => {
    const { translations } = this.props;
    return errMessage.search(" ") !== -1
      ? errMessage
      : translations[errMessage];
  };

  _handleSubmitReview = async () => {
    try {
      const { navigation, listingReviews } = this.props;
      const { id, item, reviewID } = navigation.state.params;
      this.setState({ isSubmitLoading: true });
      const { formResults } = this.state;
      const { gallery } = formResults;
      if (!gallery) {
        if (_.isEmpty(item)) {
          await this.props.submitReview(
            id,
            formResults,
            listingReviews[id].total
          );
        } else {
          await this.props.editReview(id, reviewID, formResults);
        }
        this.setState({ isSubmitLoading: false });

        !!this.props.listingReviewError &&
          this._toast.show(this._getToastText(this.props.listingReviewError), {
            onEndShow: () => {
              this.props.listingReviewError === "reviewSubmittedSuccessfully" &&
                navigation.goBack();
            },
            delay: 1500
          });
        return;
      }
      const galleryAssets = gallery
        .map(item => item.url)
        .filter(uri => uri.search(/^http/g) === -1);
      const galleryHttp = gallery
        .filter(item => item.url.search(/^http/g) !== -1)
        .map(item => item.id);
      const galleryPromise = galleryAssets.map(uri => {
        return ImageManipulator.manipulateAsync(
          uri,
          [{ resize: { width: 500 } }],
          {
            base64: false
          }
        );
      });
      const newGalleryUri = await Promise.all(galleryPromise);
      const newGallery = newGalleryUri.reduce(
        (obj, item) => ({
          ...obj,
          [item.uri]: {
            uri: item.uri,
            name: item.uri.replace(/^.*\//g, ""),
            type: `image/${item.uri.replace(/^.*\./g, "")}`,
            ...(!!item.id ? { id: item.id } : {})
          }
        }),
        {}
      );
      const newFormResults = {
        ...formResults,
        ...newGallery
      };
      delete newFormResults["gallery"];
      if (_.isEmpty(item)) {
        await this.props.submitReview(
          id,
          newFormResults,
          listingReviews[id].total
        );
      } else {
        await this.props.editReview(id, reviewID, {
          ...newFormResults,
          gallery: JSON.stringify(galleryHttp)
        });
      }
      this.setState({ isSubmitLoading: false });
      !!this.props.listingReviewError &&
        this._toast.show(this._getToastText(this.props.listingReviewError), {
          onEndShow: () => {
            this.props.listingReviewError === "reviewSubmittedSuccessfully" &&
              navigation.goBack();
          },
          delay: 1500
        });
    } catch (err) {
      console.log(err);
    }
  };

  renderAfterContent = () => {
    const { navigation, translations, reviewFields } = this.props;
    const { params } = navigation.state;
    const { type } = params;
    const length = Object.keys(reviewFields).length;
    return (
      <View>
        <Button
          size="lg"
          block={true}
          backgroundColor="secondary"
          style={{
            paddingVertical: 0,
            height: 50,
            justifyContent: "center",
            position: "relative"
          }}
          isLoading={this.state.isSubmitLoading}
          onPress={this._handleSubmitReview}
        >
          {type === "edit" ? translations.update : translations.addReview}
        </Button>
        <KeyboardSpacer topSpacing={0} />
      </View>
    );
  };
  renderContent = () => {
    const { settings, translations, navigation, reviewFields } = this.props;
    const { params } = navigation.state;
    const { isLoading } = this.state;
    if (isLoading)
      return (
        <View style={{ height: 200 }}>
          <Loader size="small" />
        </View>
      );
    return (
      !_.isEmpty(reviewFields) && (
        <KeyboardAnimationRP>
          {keyboardHeight => (
            <View
              style={{
                width: screenWidth,
                position: "relative",
                bottom: keyboardHeight === 0 ? 0 : keyboardHeight - 150
              }}
            >
              <Toast ref={c => (this._toast = c)} />
              <ReviewForm
                data={reviewFields}
                defaultResults={this.state.defaultResults}
                style={{ padding: 10 }}
                onRangeSliderBeginChangeValue={
                  this._handleRangeSliderBeginChangeValue
                }
                settings={settings}
                translations={translations}
                mode={params.mode}
                onResults={results => {
                  this.setState({
                    formResults: results
                  });
                }}
              />
            </View>
          )}
        </KeyboardAnimationRP>
      )
    );
  };
  render() {
    const { navigation, translations, auth } = this.props;
    const { isLoggedIn } = auth;
    return (
      <Layout
        navigation={navigation}
        headerType="headerHasBack"
        title={translations.yourReview}
        goBack={() => navigation.goBack()}
        renderContent={this.renderContent}
        renderAfterContent={this.renderAfterContent}
        isLoggedIn={isLoggedIn}
        scrollViewStyle={{
          backgroundColor: "#fff"
        }}
        tintColor={colorDark1}
        colorPrimary={colorGray2}
        statusBarStyle="dark-content"
        scrollViewEnabled={true}
        contentHeight={CONTENT_HEIGHT}
        showsVerticalScrollIndicator={false}
      />
    );
  }
}

const mapStateFromProps = state => ({
  translations: state.translations,
  settings: state.settings,
  auth: state.auth,
  reviewFields: state.reviewFields,
  listingReviewError: state.listingReviewError,
  listingReviews: state.listingReviews
});

const mapDispatchFromProps = {
  submitReview,
  editReview,
  getReviewFields
};

export default connect(
  mapStateFromProps,
  mapDispatchFromProps
)(ReviewFormScreen);
