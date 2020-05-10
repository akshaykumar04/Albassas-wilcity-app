import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet
} from "react-native";
import { connect } from "react-redux";
import {
  getListingDetailNavigation,
  changeListingDetailNavigation,
  getListingDescription,
  getListingBoxCustom,
  getListingListFeature,
  getListingPhotos,
  getListingVideos,
  getListingReviews,
  getListingEvents,
  getScrollTo,
  getListingRestaurantMenu,
  getListingProducts
} from "../../actions";
import * as Consts from "../../constants/styleConstants";
import _ from "lodash";
import { bottomBarHeight, FontIcon } from "../../wiloke-elements";

class ListingDetailNavContainer extends Component {
  static defaultProps = {
    colorPrimary: Consts.colorPrimary
  };

  static propTypes = {
    colorPrimary: PropTypes.string
  };
  state = {
    imageIndex: 0,
    isImageViewVisible: false,
    loadOnly: true
  };

  componentDidMount() {
    const { data } = this.props;
    const { getListingDetailNavigation } = this.props;
    getListingDetailNavigation(data);
  }

  componentDidUpdate(prevProps) {
    if (_.isEqual(prevProps.data, this.props.data)) return false;
    this.props.getListingDetailNavigation(this.props.data);
  }

  _handlePress = (item, index) => {
    const {
      listingId,
      changeListingDetailNavigation,
      getListingDescription,
      getListingBoxCustom,
      getListingListFeature,
      getListingReviews,
      getListingPhotos,
      getListingVideos,
      getListingEvents,
      listingDetailNav,
      getListingRestaurantMenu,
      getListingProducts
    } = this.props;
    const checkCurrent = listingDetailNav.filter(_item => _item.current)[0];

    if (!_.isEqual(checkCurrent, item)) {
      changeListingDetailNavigation(item.key);
      this.props.getScrollTo(0);
    }

    if (!item.loaded) {
      switch (item.category) {
        case "content":
          return getListingDescription(listingId, item.key, null);
        case "text":
          return getListingBoxCustom(listingId, item.key, null);
        case "tags":
        case "boxIcon":
          return getListingListFeature(listingId, item.key, null);
        case "reviews":
          return getListingReviews(listingId, item.key, null);
        case "photos":
          return getListingPhotos(listingId, item.key, null);
        case "videos":
          return getListingVideos(listingId, item.key, null);
        case "events":
          return getListingEvents(listingId, item.key, null);
        case "restaurant_menu":
          return getListingRestaurantMenu(listingId);
        case "my_products":
          return getListingProducts(listingId, item.key, null);
        default:
          return false;
      }
    }
  };

  // _getIcon = category => {
  //   switch (category) {
  //     case "home":
  //       return "home";
  //     case "photos":
  //       return "image";
  //     case "videos":
  //       return "video";
  //     case "events":
  //       return "calendar";
  //     case "reviews":
  //       return "star";
  //     case "content":
  //       return "file-text";
  //     case "tags":
  //       return "list";
  //     default:
  //       return "check";
  //   }
  // };

  renderItemNav = ({ item, index }) => {
    return (
      <View>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => this._handlePress(item, index)}
          style={[
            styles.itemNav,
            {
              borderTopWidth: 2,
              borderTopColor: item.current
                ? this.props.colorPrimary
                : "transparent"
            }
          ]}
        >
          <FontIcon
            name={item.icon}
            size={16}
            color={item.current ? this.props.colorPrimary : Consts.colorDark3}
          />
          <View style={{ width: 5 }} />
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: item.current ? this.props.colorPrimary : Consts.colorDark3
            }}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // _getTabEmpty = () => {
  //   const {
  //     listingVideosAll,
  //     listingPhotosAll,
  //     listingEventsAll,
  //     listingListFeatureAll,
  //     listingDescriptionAll
  //   } = this.props;
  //   return [
  //     isEmpty(listingVideosAll) ? "videos" : null,
  //     isEmpty(listingPhotosAll) ? "photos" : null,
  //     isEmpty(listingEventsAll) ? "events" : null,
  //     isEmpty(listingListFeatureAll) ? "tags" : null,
  //     isEmpty(listingDescriptionAll) ? "content" : null
  //   ];
  // };

  render() {
    const { listingDetailNav } = this.props;
    return (
      <FlatList
        style={styles.navigation}
        // data={listingDetailNav.filter(
        //   item => !this._getTabEmpty().includes(item.category)
        // )}
        data={listingDetailNav}
        keyExtractor={(item, index) => index.toString()}
        renderItem={this.renderItemNav}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      />
    );
  }
}

const styles = StyleSheet.create({
  navigation: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: Consts.colorGray1,
    paddingBottom: bottomBarHeight
  },
  itemNav: {
    height: 43,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  }
});

const mapStateToProps = state => ({
  listingDetailNav: state.listingDetailNav
  // listingVideosAll: state.listingVideosAll,
  // listingPhotosAll: state.listingPhotosAll,
  // listingEventsAll: state.listingEventsAll,
  // listingListFeatureAll: state.listingListFeatureAll,
  // listingDescriptionAll: state.listingDescriptionAll
});

export default connect(mapStateToProps, {
  getListingDetailNavigation,
  changeListingDetailNavigation,
  getListingDescription,
  getListingBoxCustom,
  getListingListFeature,
  getListingPhotos,
  getListingVideos,
  getListingReviews,
  getListingEvents,
  getScrollTo,
  getListingRestaurantMenu,
  getListingProducts
})(ListingDetailNavContainer);
