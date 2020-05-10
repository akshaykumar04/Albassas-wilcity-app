import React, { PureComponent } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import { getListingRestaurantMenu, getScrollTo } from "../../actions";
import {
  ViewWithLoading,
  ContentBox,
  FontIcon,
  DeepLinkingSocial
} from "../../wiloke-elements";
import RestaurantMenuItem from "../dumbs/RestaurantMenu/RestaurantMenuItem.js";
import { colorGray1 } from "../../constants/styleConstants";

class ListingResMenuContainer extends PureComponent {
  componentDidMount() {
    const {
      getListingRestaurantMenu,
      params,
      listingRestaurantMenu,
      type
    } = this.props;
    const { id, item } = params;
    type === null && getListingRestaurantMenu(id);
  }

  _getData = data => {
    return Object.keys(data).map(item => {
      return data[item];
    });
  };

  _handleListingItem = link => () => {
    if (link === "#") return;
    return DeepLinkingSocial(link);
  };

  _renderMenuItem = ({ item, index, separators }) => {
    const isGallery = !!item.gallery;
    return (
      <RestaurantMenuItem
        title={item.title}
        description={item.description}
        price={item.price}
        gallery={(isGallery && Object.values(item.gallery).map(i => i)) || []}
        onPress={this._handleListingItem(item.link_to)}
      />
    );
  };

  _keyExtractor = (item, index) => index.toString();

  _renderHeaderItem = (item, index) => () => {
    const { translations, settings } = this.props;
    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <View style={styles.headerItem}>
          <Text style={styles.text}>{item.group_title}</Text>
          <FontIcon
            name={item.group_icon}
            size={22}
            color={settings.colorPrimary}
          />
        </View>
        <Text style={styles.shortDes}>{item.group_description}</Text>
      </View>
    );
  };

  _renderItem = length => (item, index) => {
    return (
      <FlatList
        key={item.wrapper_class}
        data={item.items}
        keyExtractor={this._keyExtractor}
        ListHeaderComponent={this._renderHeaderItem(item, index)}
        renderItem={this._renderMenuItem}
        ItemSeparatorComponent={() => (
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: colorGray1,
              borderStyle: "dashed"
            }}
          />
        )}
        style={
          length > 1 && {
            borderBottomWidth: 1,
            borderBottomColor: colorGray1
          }
        }
      />
    );
  };

  _renderContent = (id, item, isLoading, restaurantMenu) => {
    const { translations, settings } = this.props;
    const restaurantList = !isEmpty(restaurantMenu)
      ? this._getData(restaurantMenu)
      : [];
    const length = restaurantList.length;
    if (restaurantMenu === "__empty__") {
      return null;
    }
    return (
      <ViewWithLoading isLoading={isLoading} contentLoader="contentHeader">
        {!isEmpty(restaurantList) && (
          <ContentBox
            headerTitle={item.name}
            headerIcon={item.icon}
            style={{
              marginBottom: 10,
              marginTop: 10,
              width: "100%"
            }}
            // renderFooter={
            //   item.status &&
            //   item.status === "yes" &&
            //   this._renderFooterContentBox(id, item.key)
            // }
            colorPrimary={settings.colorPrimary}
          >
            {restaurantList.map(this._renderItem(length))}
          </ContentBox>
        )}
      </ViewWithLoading>
    );
  };

  // _renderFooterContentBox = (id, key) => {
  //   const {
  //     translations,
  //     changeListingDetailNavigation,
  //     getListingEvents,
  //     getScrollTo
  //   } = this.props;
  //   return (
  //     <ButtonFooterContentBox
  //       text={translations.viewAll.toUpperCase()}
  //       onPress={() => {
  //         changeListingDetailNavigation(key);
  //         getListingEvents(listingId, key, null);
  //         getScrollTo(0);
  //       }}
  //     />
  //   );
  // };

  render() {
    const { params, listingRestaurantMenu } = this.props;
    const { id, item } = params;
    return this._renderContent(
      id,
      item,
      isEmpty(listingRestaurantMenu),
      listingRestaurantMenu[id]
    );
  }
}

const styles = StyleSheet.create({
  headerItem: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
    paddingHorizontal: 5,
    textAlign: "left"
  },
  separator: {
    height: 3,
    width: "100%",
    backgroundColor: "#333"
  },
  shortDes: {
    fontSize: 11
  }
});
const mapStateToProps = state => ({
  translations: state.translations,
  settings: state.settings,
  listingRestaurantMenu: state.listingRestaurantMenu
});
const mapDispatchToProps = {
  getScrollTo,
  getListingRestaurantMenu
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListingResMenuContainer);
