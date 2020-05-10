import React, { Component } from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import he from "he";
import _ from "lodash";
import {
  changeListingDetailNavigation,
  getListingListFeature,
  getListingBoxCustom,
  getScrollTo
} from "../../actions";
import {
  isEmpty,
  Row,
  Col,
  IconTextMedium,
  ViewWithLoading,
  ContentBox,
  RequestTimeoutWrapped,
  P
} from "../../wiloke-elements";
import { ButtonFooterContentBox } from "../dumbs";
import * as Consts from "../../constants/styleConstants";

class ListingListFeatureContainer extends Component {
  _getListingFeature() {
    const {
      params,
      getListingListFeature,
      getListingBoxCustom,
      listingListFeature,
      listingListFeatureAll,
      listingCustomBox,
      type
    } = this.props;
    const { id, item, max } = params;
    type === null &&
      (item.key === "tags"
        ? getListingListFeature(id, item.key, max)
        : getListingBoxCustom(id, item.key, max));
  }

  componentDidMount() {
    this._getListingFeature();
  }

  renderContent = (id, item, isLoading, listFeature, type) => {
    const {
      isListingDetailListRequestTimeout,
      translations,
      settings
    } = this.props;
    if (listFeature === "__empty__") {
      return null;
    }
    return (
      <ViewWithLoading isLoading={isLoading} contentLoader="contentHeader">
        {!isEmpty(listFeature) && (
          <ContentBox
            headerTitle={item.name}
            headerIcon="list"
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
              isTimeout={isListingDetailListRequestTimeout}
              onPress={this._getListingFeature}
              text={translations.networkError}
              buttonText={translations.retry}
            >
              <Row gap={15}>
                {listFeature.map((item, index) => (
                  <Col key={index.toString()} column={2} gap={15}>
                    {!!item.icon ? (
                      <IconTextMedium
                        iconName={item.icon}
                        iconSize={30}
                        text={he.decode(item.name)}
                        texNumberOfLines={1}
                        disabled={item.unChecked === "yes"}
                        iconBackgroundColor={
                          !!item.color ? item.color : Consts.colorGray2
                        }
                        iconColor={!!item.color ? "#fff" : Consts.colorDark2}
                        textStyle={{
                          color: !!item.color ? item.color : Consts.colorDark2
                        }}
                      />
                    ) : (
                      <P
                        style={{
                          fontSize: 12,
                          textDecorationLine:
                            item.unChecked === "yes" ? "line-through" : "none",
                          color: !!item.color ? item.color : Consts.colorDark2
                        }}
                      >
                        {he.decode(item.name)}
                      </P>
                    )}
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
      getListingListFeature,
      getScrollTo
    } = this.props;
    return (
      <ButtonFooterContentBox
        text={translations.viewAll.toUpperCase()}
        onPress={() => {
          changeListingDetailNavigation(key);
          getListingListFeature(listingId, key, null);
          getScrollTo(0);
        }}
      />
    );
  };

  render() {
    const {
      listingListFeature,
      listingListFeatureAll,
      listingCustomBox,
      type,
      params,
      listingDetail
    } = this.props;
    const { id, item } = params;
    const customBoxListing = _.get(listingCustomBox, `${id}[${item.key}]`, []);
    return type === "all"
      ? this.renderContent(
          id,
          item,
          _.isEmpty(listingListFeatureAll[id]),
          item.key === "tags" ? listingListFeatureAll[id] : customBoxListing,
          "all"
        )
      : this.renderContent(
          id,
          item,
          _.isEmpty(listingListFeature[id]),
          item.key === "tags" ? listingListFeature[id] : customBoxListing
        );
  }
}

const mapStateToProps = state => ({
  listingListFeature: state.listingListFeature,
  listingListFeatureAll: state.listingListFeatureAll,
  loadingListingDetail: state.loadingListingDetail,
  translations: state.translations,
  isListingDetailListRequestTimeout: state.isListingDetailListRequestTimeout,
  settings: state.settings,
  listingCustomBox: state.listingCustomBox,
  listingDetail: state.listingDetail
});

const mapDispatchToProps = {
  changeListingDetailNavigation,
  getListingListFeature,
  getListingBoxCustom,
  getScrollTo
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListingListFeatureContainer);
