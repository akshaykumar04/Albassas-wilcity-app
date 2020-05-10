import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { View, Platform, FlatList, StyleSheet, Dimensions } from "react-native";
import _ from "lodash";
import he from "he";
import { connect } from "react-redux";
import { getListingByCat, getListingByCatLoadmore } from "../../actions";
import ListingItem from "../dumbs/ListingItem";
import EventItem from "../dumbs/EventItem";
import {
  MessageError,
  RequestTimeoutWrapped,
  ViewWithLoading,
  ContentLoader,
  Row,
  Col,
  getBusinessStatus,
} from "../../wiloke-elements";
import { screenWidth } from "../../constants/styleConstants";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const END_REACHED_THRESHOLD = Platform.OS === "ios" ? 0 : 1;

class ListingByCatContainer extends Component {
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
      const { navigation, getListingByCat } = this.props;
      const { params } = navigation.state;
      const { endpointAPI, taxonomy, categoryId } = params;
      await getListingByCat(categoryId, taxonomy, endpointAPI);
      this.setState({ startLoadMore: true });
    } catch (err) {
      console.log(err);
    }
  };

  componentDidMount() {
    this._getListing();
  }

  _handleEndReached = (next) => {
    const { navigation, getListingByCatLoadmore } = this.props;
    const { params } = navigation.state;
    const { endpointAPI, taxonomy, categoryId } = params;
    const { startLoadMore } = this.state;
    startLoadMore &&
      next !== false &&
      getListingByCatLoadmore(next, categoryId, taxonomy, endpointAPI);
  };

  renderItem = ({ item }) => {
    const { navigation, settings, translations } = this.props;
    const { params } = navigation.state;
    const { endpointAPI } = params;
    const isOpen =
      item.hourMode === "open_for_selected_hours"
        ? getBusinessStatus(item.businessHours, item.timezone)
        : item.hourMode;

    if (endpointAPI === "events") {
      return (
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
            width: screenWidth / 2 - 15,
            margin: 5,
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
              interested: `${item.oFavorite.totalFavorites} ${item.oFavorite.text}`,
            })
          }
        />
      );
    }
    return (
      <ListingItem
        image={item.oFeaturedImg.medium}
        title={he.decode(item.postTitle)}
        tagline={item.tagLine ? he.decode(item.tagLine) : null}
        logo={item.logo !== "" ? item.logo : item.oFeaturedImg.thumbnail}
        location={he.decode(item.oAddress.address)}
        claimStatus={item.claimStatus === "claimed"}
        translations={translations}
        reviewMode={item.oReview.mode}
        claimStatus={item.claimStatus === "claimed"}
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

  renderContentSuccess(listingByCat) {
    const { startLoadMore } = this.state;
    return (
      <FlatList
        data={listingByCat.oResults}
        renderItem={this.renderItem}
        keyExtractor={(item, index) => item.ID.toString() + index.toString()}
        numColumns={this.props.horizontal ? 1 : 2}
        horizontal={this.props.horizontal}
        showsHorizontalScrollIndicator={false}
        onEndReachedThreshold={END_REACHED_THRESHOLD}
        onEndReached={() => this._handleEndReached(listingByCat.next)}
        ListFooterComponent={() =>
          startLoadMore && listingByCat.next !== false ? (
            <View
              style={{
                width: screenWidth - 10,
                marginLeft: (SCREEN_WIDTH - screenWidth) / 2,
              }}
            >
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
            </View>
          ) : (
            <View style={{ paddingBottom: 20 }} />
          )
        }
        style={{ padding: 5 }}
        columnWrapperStyle={{
          width: screenWidth,
          marginLeft: (SCREEN_WIDTH - screenWidth) / 2,
        }}
      />
    );
  }

  renderContentError(listingByCat) {
    return listingByCat && <MessageError message={listingByCat.msg} />;
  }

  render() {
    const { listingByCat, loading } = this.props;
    const condition =
      !_.isEmpty(listingByCat) && listingByCat.status === "success";
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.inner,
            {
              width: loading ? screenWidth : SCREEN_WIDTH,
            },
          ]}
        >
          <ViewWithLoading {...this._getWithLoadingProps(loading)}>
            {condition
              ? this.renderContentSuccess(listingByCat)
              : this.renderContentError(listingByCat)}
          </ViewWithLoading>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  inner: {
    flex: 1,
    height: "100%",
  },
});

const mapStateToProps = (state) => ({
  listingByCat: state.listingByCat,
  loading: state.loading,
  settings: state.settings,
  translations: state.translations,
});

export default connect(mapStateToProps, {
  getListingByCat,
  getListingByCatLoadmore,
})(ListingByCatContainer);
