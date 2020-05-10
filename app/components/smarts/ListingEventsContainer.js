import React, { Component } from "react";
import { View, Dimensions } from "react-native";
import { connect } from "react-redux";
import _ from "lodash";
import he from "he";
import {
  getListingEvents,
  changeListingDetailNavigation,
  getScrollTo
} from "../../actions";
import {
  ViewWithLoading,
  isEmpty,
  ContentBox,
  RequestTimeoutWrapped
} from "../../wiloke-elements";
import { EventItem } from "../dumbs";
import * as Consts from "../../constants/styleConstants";
import { ButtonFooterContentBox } from "../dumbs";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

class ListingEventsContainer extends Component {
  _getListingEvents = () => {
    const {
      params,
      getListingEvents,
      type,
      listingEvents,
      listingEventsAll
    } = this.props;
    const { id, item, max } = params;
    type === null && getListingEvents(id, item.key, max);
  };

  componentDidMount() {
    this._getListingEvents();
  }

  renderItem = item => {
    const { navigation, translations } = this.props;
    return (
      <EventItem
        key={item.ID.toString()}
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
        style={{
          marginBottom: 10
        }}
        bodyStyle={{
          borderWidth: 1,
          borderColor: Consts.colorGray1,
          borderTopWidth: 0
        }}
        footerStyle={{
          borderWidth: 1,
          borderColor: Consts.colorGray1,
          borderTopWidth: 0,
          paddingVertical: 10
        }}
      />
    );
  };

  renderContent = (id, item, isLoading, events, type) => {
    const {
      isListingDetailEventRequestTimeout,
      translations,
      settings
    } = this.props;
    if (events === "__empty__") {
      return null;
    }
    return (
      <ViewWithLoading isLoading={isLoading} contentLoader="contentHeader">
        {!isEmpty(events) && (
          <ContentBox
            headerTitle={item.name}
            headerIcon="calendar"
            style={{
              marginBottom: type !== "all" ? 10 : 50,
              width: "100%"
            }}
            renderFooter={
              item.status &&
              item.status === "yes" &&
              this.renderFooterContentBox(id, item.key)
            }
            colorPrimary={settings.colorPrimary}
          >
            <RequestTimeoutWrapped
              isTimeout={isListingDetailEventRequestTimeout}
              onPress={this._getListingEvents}
              text={translations.networkError}
              buttonText={translations.retry}
            >
              {events.map(this.renderItem)}
            </RequestTimeoutWrapped>
          </ContentBox>
        )}
      </ViewWithLoading>
    );
  };

  renderFooterContentBox = (listingId, key) => {
    const {
      translations,
      changeListingDetailNavigation,
      getListingEvents,
      getScrollTo
    } = this.props;
    return (
      <ButtonFooterContentBox
        text={translations.viewAll.toUpperCase()}
        onPress={() => {
          changeListingDetailNavigation(key);
          getListingEvents(listingId, key, null);
          getScrollTo(0);
        }}
      />
    );
  };

  render() {
    const {
      listingEvents,
      listingEventsAll,
      params,
      type,
      listingDetail
    } = this.props;
    const { id, item } = params;
    return type === "all"
      ? this.renderContent(
          id,
          item,
          _.isEmpty(listingEventsAll[id]),
          listingEventsAll[id],
          "all"
        )
      : this.renderContent(
          id,
          item,
          _.isEmpty(listingEvents[id]),
          listingEvents[id]
        );
  }
}

const mapStateToProps = state => ({
  listingEvents: state.listingEvents,
  listingEventsAll: state.listingEventsAll,
  loadingListingDetail: state.loadingListingDetail,
  translations: state.translations,
  isListingDetailEventRequestTimeout: state.isListingDetailEventRequestTimeout,
  settings: state.settings,
  listingDetail: state.listingDetail
});

export default connect(mapStateToProps, {
  getListingEvents,
  changeListingDetailNavigation,
  getScrollTo
})(ListingEventsContainer);
