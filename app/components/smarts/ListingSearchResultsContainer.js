import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { View, Platform, FlatList, StyleSheet, Dimensions } from "react-native";
import _ from "lodash";
import he from "he";
import { connect } from "react-redux";
import {
  getListingSearchResults,
  getListingSearchResultsLoadmore,
} from "../../actions";
import ListingItem from "../dumbs/ListingItem";
import {
  MessageError,
  RequestTimeoutWrapped,
  ViewWithLoading,
  ContentLoader,
  Row,
  Col,
  getBusinessStatus,
} from "../../wiloke-elements";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const END_REACHED_THRESHOLD = Platform.OS === "ios" ? 0 : 1;

class ListingSearchResultsContainer extends Component {
  static defaultProps = {
    horizontal: false,
  };

  static propTypes = {
    horizontal: PropTypes.bool,
  };

  state = {
    startLoadMore: false,
  };

  _getListing = async () => {
    try {
      const { navigation, getListingSearchResults } = this.props;
      const { state } = navigation;
      const { params } = navigation.state;
      await getListingSearchResults(params._results);
      this.setState({ startLoadMore: true });
    } catch (err) {
      console.log(err);
    }
  };

  componentDidMount() {
    this._getListing();
  }

  _handleEndReached = (next) => {
    const { navigation, getListingSearchResultsLoadmore } = this.props;
    const { params } = navigation.state;
    const { startLoadMore } = this.state;
    startLoadMore &&
      next !== false &&
      getListingSearchResultsLoadmore(next, params._results);
  };

  renderItem = ({ item }) => {
    const { navigation, settings, translations } = this.props;
    const isOpen =
      item.hourMode === "open_for_selected_hours"
        ? getBusinessStatus(item.businessHours, item.timezone)
        : item.hourMode;

    return (
      <Col column={2} gap={10}>
        <ListingItem
          image={item.oFeaturedImg.medium}
          title={he.decode(item.postTitle)}
          translations={translations}
          claimStatus={item.claimStatus === "claimed"}
          tagline={item.tagLine ? he.decode(item.tagLine) : null}
          logo={item.logo !== "" ? item.logo : item.oFeaturedImg.thumbnail}
          location={he.decode(item.oAddress.address)}
          claimStatus={item.claimStatus === "claimed"}
          reviewMode={item.oReview.mode}
          reviewAverage={item.oReview.average}
          businessStatus={isOpen}
          colorPrimary={settings.colorPrimary}
          onPress={() =>
            navigation.navigate("ListingDetailScreen", {
              id: item.ID,
              name: he.decode(item.postTitle),
              tagline: !!item.tagLine ? he.decode(item.tagLine) : null,
              link: item.postLink,
              author: item.oAuthor,
              image:
                SCREEN_WIDTH > 420
                  ? item.oFeaturedImg.large
                  : item.oFeaturedImg.medium,
              logo: item.logo !== "" ? item.logo : item.oFeaturedImg.thumbnail,
            })
          }
          layout={this.props.horizontal ? "horizontal" : "vertical"}
        />
      </Col>
    );
  };

  _getWithLoadingProps = (loading) => ({
    isLoading: loading,
    contentLoader: "content",
    contentHeight: 90,
    contentLoaderItemLength: 6,
    featureRatioWithPadding: "56.25%",
    column: 2,
    gap: 10,
    containerPadding: 10,
  });

  renderContentSuccess(listingSearchResults) {
    const { startLoadMore } = this.state;
    return (
      <View style={{ width: "100%" }}>
        <FlatList
          data={listingSearchResults.oResults}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => item.ID.toString() + index.toString()}
          numColumns={this.props.horizontal ? 1 : 2}
          horizontal={this.props.horizontal}
          showsHorizontalScrollIndicator={false}
          onEndReachedThreshold={END_REACHED_THRESHOLD}
          onEndReached={() => this._handleEndReached(listingSearchResults.next)}
          ListFooterComponent={() =>
            startLoadMore && listingSearchResults.next !== false ? (
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
          style={{
            padding: 5,
          }}
        />
      </View>
    );
  }

  renderContentError(listingSearchResults) {
    return (
      listingSearchResults && (
        <MessageError message={listingSearchResults.msg} />
      )
    );
  }

  render() {
    const {
      listingSearchResults,
      isListingSearchRequestTimeout,
      loading,
      translations,
    } = this.props;
    const condition =
      !_.isEmpty(listingSearchResults) &&
      listingSearchResults.status === "success";
    return (
      <ViewWithLoading {...this._getWithLoadingProps(loading)}>
        <RequestTimeoutWrapped
          isTimeout={isListingSearchRequestTimeout}
          onPress={this._getListing}
          fullScreen={true}
          style={styles.container}
          text={translations.networkError}
          buttonText={translations.retry}
        >
          {condition
            ? this.renderContentSuccess(listingSearchResults)
            : this.renderContentError(listingSearchResults)}
        </RequestTimeoutWrapped>
      </ViewWithLoading>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const mapStateToProps = (state) => ({
  listingSearchResults: state.listingSearchResults,
  loading: state.loading,
  isListingSearchRequestTimeout: state.isListingSearchRequestTimeout,
  translations: state.translations,
  settings: state.settings,
});

export default connect(mapStateToProps, {
  getListingSearchResults,
  getListingSearchResultsLoadmore,
})(ListingSearchResultsContainer);
