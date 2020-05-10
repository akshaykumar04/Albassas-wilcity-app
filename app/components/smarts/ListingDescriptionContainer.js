import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { connect } from "react-redux";
import _ from "lodash";
import he from "he";
import {
  getListingBoxCustom,
  getListingDescription,
  changeListingDetailNavigation,
  getScrollTo
} from "../../actions";
import stylesBase from "../../stylesBase";
import {
  ViewWithLoading,
  ContentBox,
  RequestTimeoutWrapped,
  HtmlViewer,
  RTL
} from "../../wiloke-elements";
import { ButtonFooterContentBox } from "../dumbs";
import * as Consts from "../../constants/styleConstants";

class ListingDescriptionContainer extends Component {
  _getListingDescription = () => {
    const {
      params,
      getListingDescription,
      getListingBoxCustom,
      type,
      listingCustomBox,
      listingDescription,
      listingDescriptionAll
    } = this.props;
    const { id, item, max } = params;

    type === null &&
      (item.key === "content"
        ? getListingDescription(id, item.key, max)
        : getListingBoxCustom(id, item.key, max));
  };

  componentDidMount() {
    this._getListingDescription();
  }

  componentWillUnmount() {
    this._timeout && clearTimeout(this._timeout);
  }

  renderContent = (id, item, isLoading, descriptions, type) => {
    const {
      isListingDetailDesRequestTimeout,
      translations,
      settings,
      listingDescriptionAll,
      listingDescription
    } = this.props;
    if (descriptions === "__empty__") {
      return null;
    }
    return (
      <ViewWithLoading isLoading={isLoading} contentLoader="contentHeader">
        {!_.isEmpty(descriptions) && (
          <ContentBox
            headerTitle={item.name}
            headerIcon="file-text"
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
              isTimeout={isListingDetailDesRequestTimeout}
              onPress={this._getListingDescription}
              text={translations.networkError}
              buttonText={translations.retry}
            >
              {descriptions[0].search(/<(img|div|p|span|em|strong|i|a|br)/g) !==
              -1 ? (
                <View style={{ marginLeft: -10 }}>
                  <HtmlViewer
                    htmlWrapCssString={`font-size: 13px; color: ${
                      Consts.colorDark2
                    }; line-height: 1.4em; ${RTL() && `texAlign: left`}`}
                    html={descriptions[0].replace(/<br\s*\/?>/gm, "")}
                    containerMaxWidth={Consts.screenWidth - 22}
                    containerStyle={{ paddingLeft: 10, paddingRight: 0 }}
                  />
                </View>
              ) : (
                <Text style={[stylesBase.text, { textAlign: "left" }]}>
                  {he.decode(descriptions[0])}
                </Text>
              )}
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
      getListingDescription,
      getScrollTo
    } = this.props;
    return (
      <ButtonFooterContentBox
        text={translations.viewAll.toUpperCase()}
        onPress={() => {
          changeListingDetailNavigation(key);
          getListingDescription(listingId, key, null);
          getScrollTo(0);
        }}
      />
    );
  };

  render() {
    const {
      listingCustomBox,
      listingDescription,
      listingDescriptionAll,
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
          _.isEmpty(listingDescriptionAll[id]),
          item.key === "content" ? listingDescriptionAll[id] : customBoxListing,
          "all"
        )
      : this.renderContent(
          id,
          item,
          _.isEmpty(listingDescription[id]),
          item.key === "content" ? listingDescription[id] : customBoxListing
        );
  }
}

const htmlViewStyles = StyleSheet.create({
  div: {
    fontSize: 13,
    color: Consts.colorDark2,
    lineHeight: 19
  },
  a: {
    textDecorationLine: "underline"
  },
  blockquote: {
    fontSize: 14,
    fontStyle: "italic",
    color: Consts.colorDark3,
    marginVertical: 10
  },
  strong: {
    display: "flex"
  }
});

const mapStateToProps = state => ({
  translations: state.translations,
  listingCustomBox: state.listingCustomBox,
  listingDescription: state.listingDescription,
  listingDescriptionAll: state.listingDescriptionAll,
  loadingListingDetail: state.loadingListingDetail,
  isListingDetailDesRequestTimeout: state.isListingDetailDesRequestTimeout,
  settings: state.settings,
  listingDetail: state.listingDetail
});

const mapDispatchToProps = {
  getListingBoxCustom,
  getListingDescription,
  changeListingDetailNavigation,
  getScrollTo
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListingDescriptionContainer);
