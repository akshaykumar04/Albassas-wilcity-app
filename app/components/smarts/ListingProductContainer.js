import React, { PureComponent } from "react";
import { Text, View, FlatList, StyleSheet } from "react-native";
import { connect } from "react-redux";
import _ from "lodash";
import { getListingProducts } from "../../actions";
import { ViewWithLoading, ContentBox } from "../../wiloke-elements";
import { ProductsWC, ListingProductClassic } from "../dumbs";

class ListingProductContainer extends PureComponent {
  componentDidMount() {
    this._getListingProducts();
  }

  _getListingProducts = () => {
    const {
      getListingProducts,
      params,
      type,
      listingProducts,
      listingProductsAll
    } = this.props;
    const { id, item, max } = params;
    type === null && getListingProducts(id, type, max);
  };

  // _renderItem = ({ item, index }) => {};

  // _keyExtractor = (item, index) => item.id;

  _renderContent = (id, item, isLoading, listingProducts, type) => {
    const { translations, settings, navigation } = this.props;
    if (listingProducts === "__empty__") {
      return null;
    }
    return (
      <ViewWithLoading isLoading={isLoading} contentLoader="contentHeader">
        <ContentBox
          headerTitle={item.name}
          headerIcon={item.icon}
          style={{
            marginBottom: 10,
            width: "100%"
          }}
          colorPrimary={settings.colorPrimary}
        >
          <ListingProductClassic
            data={listingProducts}
            navigation={navigation}
            colorPrimary={settings.colorPrimary}
          />
        </ContentBox>
      </ViewWithLoading>
    );
  };

  render() {
    const { params, listingProducts, type, listingProductsAll } = this.props;
    const { id, item } = params;
    return type === "all"
      ? this._renderContent(
          id,
          item,
          _.isEmpty(listingProductsAll[id]),
          listingProductsAll[id],
          "all"
        )
      : this._renderContent(
          id,
          item,
          _.isEmpty(listingProducts[id]),
          listingProducts[id]
        );
  }
}

const mapStateToProps = state => ({
  translations: state.translations,
  settings: state.settings,
  listingProducts: state.listingProducts,
  listingProductsAll: state.listingProductsAll
});
const mapDispatchToProps = {
  getListingProducts
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListingProductContainer);
