import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, FlatList, StyleSheet, Dimensions, Platform } from "react-native";
import _ from "lodash";
import he from "he";
import { connect } from "react-redux";
import { getArticles, getArticlesLoadmore } from "../../actions";
import { PostCard } from "../dumbs";
import {
  MessageError,
  RequestTimeoutWrapped,
  ViewWithLoading,
  ContentLoader,
  Row,
  Col,
  IconTextSmall,
  isEmpty
} from "../../wiloke-elements";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const END_REACHED_THRESHOLD = Platform.OS === "ios" ? 0.8 : 1;

class ArticleContainer extends Component {
  static defaultProps = {
    horizontal: false
  };

  static propTypes = {
    horizontal: PropTypes.bool
  };

  state = {
    startLoadmore: false
  };

  // _getId = () => {
  //   const { categoryList, locationList } = this.props;
  //   const getId = arr => arr.filter(item => item.selected)[0].id;
  //   const categoryId =
  //     categoryList.length > 0 && getId(categoryList) !== "wilokeListingCategory"
  //       ? getId(categoryList)
  //       : null;
  //   const locationId =
  //     locationList.length > 0 && getId(locationList) !== "wilokeListingLocation"
  //       ? getId(locationList)
  //       : null;
  //   return { categoryId, locationId };
  // };

  _getArticles = async () => {
    try {
      const { getArticles } = this.props;
      // const { categoryId, locationId } = this._getId();
      await getArticles();
      this.setState({ startLoadmore: true });
    } catch (err) {
      console.log(err);
    }
  };

  componentDidMount() {
    this._getArticles();
  }

  _handleEndReached = next => {
    const { navigation, getArticlesLoadmore } = this.props;
    const { params } = navigation.state;
    const { startLoadmore } = this.state;
    startLoadmore && next !== false && getArticlesLoadmore(next);
  };

  renderItem = ({ item, index }) => {
    const { navigation, translations, settings } = this.props;
    return (
      <Col column={2} gap={10}>
        <PostCard
          image={item.oFeaturedImg.medium}
          title={he.decode(item.postTitle)}
          text={he.decode(item.postContent)}
          renderMeta={() => (
            <View>
              <IconTextSmall
                iconName="calendar"
                text={item.postDate}
                iconColor={settings.colorPrimary}
              />
              <View style={{ height: 6 }} />
              <IconTextSmall
                iconName="message-square"
                text={`${item.countComments} ${translations.comments}`}
                iconColor={settings.colorPrimary}
              />
              <View style={{ height: 3 }} />
            </View>
          )}
          style={{
            width: "100%"
          }}
          onPress={() =>
            navigation.navigate("ArticleDetailScreen", {
              id: item.postID,
              name: he.decode(item.postTitle),
              image:
                SCREEN_WIDTH > 420
                  ? item.oFeaturedImg.large
                  : item.oFeaturedImg.medium
            })
          }
        />
      </Col>
    );
  };

  _getWithLoadingProps = loading => ({
    isLoading: loading,
    contentLoader: "content",
    contentHeight: 90,
    contentLoaderItemLength: 6,
    featureRatioWithPadding: "56.25%",
    column: 2,
    gap: 10,
    containerPadding: 10
  });

  renderContentSuccess(loading, articles) {
    const { startLoadmore } = this.state;
    return (
      <ViewWithLoading {...this._getWithLoadingProps(loading)}>
        <FlatList
          data={articles.oResults}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          horizontal={false}
          showsHorizontalScrollIndicator={false}
          onEndReachedThreshold={END_REACHED_THRESHOLD}
          onEndReached={() => this._handleEndReached(articles.next)}
          ListFooterComponent={() =>
            startLoadmore && articles.next !== false ? (
              <View style={{ padding: 5 }}>
                <Row gap={10}>
                  {Array(2)
                    .fill(null)
                    .map((_, index) => (
                      <Col key={index.toString()} column={2} gap={10}>
                        <ContentLoader
                          featureRatioWithPadding="56.25%"
                          contentHeight={90}
                          content={true}
                        />
                      </Col>
                    ))}
                </Row>
              </View>
            ) : (
              <View style={{ paddingBottom: 20 }} />
            )
          }
          style={{ padding: 5 }}
        />
      </ViewWithLoading>
    );
  }

  renderContentError(loading, articles) {
    return (
      <ViewWithLoading {...this._getWithLoadingProps(loading)}>
        <MessageError message={articles.msg} />
      </ViewWithLoading>
    );
  }

  render() {
    const {
      articles,
      isArticleRequestTimeout,
      loading,
      translations
    } = this.props;
    return (
      <RequestTimeoutWrapped
        isTimeout={isArticleRequestTimeout}
        onPress={this._getArticles}
        fullScreen={true}
        style={styles.container}
        text={translations.networkError}
        buttonText={translations.retry}
      >
        {!_.isEmpty(articles) && articles.oResults
          ? this.renderContentSuccess(loading, articles)
          : this.renderContentError(loading, articles)}
      </RequestTimeoutWrapped>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row"
  }
});

const mapStateToProps = state => ({
  articles: state.articles,
  loading: state.loading,
  translations: state.translations,
  isArticleRequestTimeout: state.isArticleRequestTimeout,
  settings: state.settings
});

const mapDispatchToProps = {
  getArticles,
  getArticlesLoadmore
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ArticleContainer);
