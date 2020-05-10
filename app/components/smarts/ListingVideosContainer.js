import React, { Component } from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import _ from "lodash";
import {
  changeListingDetailNavigation,
  getListingVideos,
  getScrollTo
} from "../../actions";
import {
  Row,
  Col,
  ViewWithLoading,
  Video,
  isEmpty,
  ContentBox,
  RequestTimeoutWrapped
} from "../../wiloke-elements";
import { ButtonFooterContentBox } from "../dumbs";
import { screenWidth } from "../../constants/styleConstants";

class ListingVideosContainer extends Component {
  _getListingVideos = () => {
    const {
      params,
      getListingVideos,
      type,
      listingVideos,
      listingVideosAll
    } = this.props;
    const { id, item, max } = params;

    type === null && getListingVideos(id, item.key, max);
  };
  componentDidMount() {
    this._getListingVideos();
  }

  renderContent = (id, item, isLoading, videos, type) => {
    const {
      isListingDetailVideosRequestTimeout,
      translations,
      settings
    } = this.props;
    if (videos === "__empty__") {
      return null;
    }
    return (
      <ViewWithLoading isLoading={isLoading} contentLoader="contentHeader">
        {!isEmpty(videos) && (
          <ContentBox
            headerTitle={item.name}
            headerIcon={item.icon}
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
              isTimeout={isListingDetailVideosRequestTimeout}
              onPress={this._getListingVideos}
              text={translations.networkError}
              buttonText={translations.retry}
            >
              <Row gap={10}>
                {videos.map((item, index) => (
                  <Col key={index.toString()} column={1} gap={10}>
                    <Video source={item.src} thumbnail={item.thumbnail} />
                  </Col>
                ))}
              </Row>
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
      getListingVideos,
      getScrollTo
    } = this.props;
    return (
      <ButtonFooterContentBox
        text={translations.viewAll.toUpperCase()}
        onPress={() => {
          changeListingDetailNavigation(key);
          getListingVideos(listingId, key, null);
          getScrollTo(0);
        }}
      />
    );
  };

  render() {
    const {
      listingVideos,
      listingVideosAll,
      loadingListingDetail,
      params,
      type,
      listingDetail
    } = this.props;
    const { id, item } = params;
    return type === "all"
      ? this.renderContent(
          id,
          item,
          _.isEmpty(listingVideosAll),
          listingVideosAll[id],
          "all"
        )
      : this.renderContent(
          id,
          item,
          _.isEmpty(listingVideos),
          listingVideos[id]
        );
  }
}

const mapStateToProps = state => ({
  listingVideos: state.listingVideos,
  listingVideosAll: state.listingVideosAll,
  loadingListingDetail: state.loadingListingDetail,
  translations: state.translations,
  isListingDetailVideosRequestTimeout:
    state.isListingDetailVideosRequestTimeout,
  settings: state.settings,
  listingDetail: state.listingDetail
});

export default connect(mapStateToProps, {
  changeListingDetailNavigation,
  getListingVideos,
  getScrollTo
})(ListingVideosContainer);
