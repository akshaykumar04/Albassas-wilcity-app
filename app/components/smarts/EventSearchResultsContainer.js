import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { View, Platform, FlatList, StyleSheet, Dimensions } from "react-native";
import _ from "lodash";
import he from "he";
import { connect } from "react-redux";
import {
  getEventSearchResults,
  getEventSearchResultsLoadmore
} from "../../actions";
import { EventItem } from "../dumbs";
import {
  MessageError,
  RequestTimeoutWrapped,
  ViewWithLoading,
  ContentLoader,
  Row,
  Col
} from "../../wiloke-elements";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const END_REACHED_THRESHOLD = Platform.OS === "ios" ? 0 : 1;

class EventSearchResultsContainer extends Component {
  static defaultProps = {
    horizontal: false
  };

  static propTypes = {
    horizontal: PropTypes.bool
  };

  state = {
    startLoadMore: false
  };

  _getListing = async () => {
    try {
      const { navigation, getEventSearchResults } = this.props;
      const { state } = navigation;
      const { params } = navigation.state;
      await getEventSearchResults(params._results);
      this.setState({ startLoadMore: true });
    } catch (err) {
      console.log(err);
    }
  };

  componentDidMount() {
    this._getListing();
  }

  _handleEndReached = next => {
    const { navigation, getEventSearchResultsLoadmore } = this.props;
    const { params } = navigation.state;
    const { startLoadMore } = this.state;
    startLoadMore &&
      next !== false &&
      getEventSearchResultsLoadmore(next, params._results);
  };

  renderItem = ({ item, index }) => {
    const { navigation, translations } = this.props;
    return (
      <Col column={2} gap={10}>
        <EventItem
          image={item.oFeaturedImg.medium}
          name={he.decode(item.postTitle)}
          date={
            item.oCalendar
              ? `${item.oCalendar.oStarts.date} - ${item.oCalendar.oStarts.hour}`
              : null
          }
          address={he.decode(item.oAddress.address)}
          hosted={`${translations.hostedBy} ${item.oAuthor.displayName}`}
          interested={`${item.oFavorite.totalFavorites} ${item.oFavorite.text}`}
          style={{
            width: "100%"
          }}
          onPress={() =>
            navigation.navigate("EventDetailScreen", {
              id: item.ID,
              name: he.decode(item.postTitle),
              image:
                SCREEN_WIDTH > 420
                  ? item.oFeaturedImg.large
                  : item.oFeaturedImg.medium,
              address: he.decode(item.oAddress.address),
              hosted: `${translations.hostedBy} ${item.oAuthor.displayName}`,
              interested: `${item.oFavorite.totalFavorites} ${item.oFavorite.text}`
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

  renderContentSuccess(eventSearchResults) {
    const { startLoadMore } = this.state;
    return (
      <View style={{ width: "100%" }}>
        <FlatList
          data={eventSearchResults.oResults}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => item.ID.toString() + index.toString()}
          numColumns={this.props.horizontal ? 1 : 2}
          horizontal={this.props.horizontal}
          showsHorizontalScrollIndicator={false}
          onEndReachedThreshold={END_REACHED_THRESHOLD}
          onEndReached={() => this._handleEndReached(eventSearchResults.next)}
          ListFooterComponent={() =>
            startLoadMore && eventSearchResults.next !== false ? (
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
      </View>
    );
  }

  renderContentError(eventSearchResults) {
    const { translations } = this.props;
    return (
      eventSearchResults && <MessageError message={translations.noPostFound} />
    );
  }

  render() {
    const {
      eventSearchResults,
      isEventSearchRequestTimeout,
      translations,
      loading
    } = this.props;
    const condition =
      !_.isEmpty(eventSearchResults) && eventSearchResults.status === "success";
    return (
      <ViewWithLoading {...this._getWithLoadingProps(loading)}>
        <RequestTimeoutWrapped
          isTimeout={isEventSearchRequestTimeout}
          onPress={this._getListing}
          fullScreen={true}
          style={styles.container}
          text={translations.networkError}
          buttonText={translations.retry}
        >
          {condition
            ? this.renderContentSuccess(eventSearchResults)
            : this.renderContentError(eventSearchResults)}
        </RequestTimeoutWrapped>
      </ViewWithLoading>
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
  eventSearchResults: state.eventSearchResults,
  loading: state.loading,
  isEventSearchRequestTimeout: state.isEventSearchRequestTimeout,
  translations: state.translations
});

export default connect(mapStateToProps, {
  getEventSearchResults,
  getEventSearchResultsLoadmore
})(EventSearchResultsContainer);
