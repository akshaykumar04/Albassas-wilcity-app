import React, { Component } from "react";
import { TouchableOpacity, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Consts from "../../constants/styleConstants";
import { withNavigationFocus, FlatListRedux } from "../../wiloke-elements";
import {
  ListingsContainer,
  LocationModalPickerContainer,
  NearbyContainer
} from "../smarts";
import { Layout } from "../dumbs";
import { connect } from "react-redux";
import _ from "lodash";

class Listing extends Component {
  _getListingSuccess = (listings, postType) => {
    return (
      !_.isEmpty(listings) &&
      !_.isEmpty(listings[postType]) &&
      listings[postType].status === "success"
    );
  };

  _renderHeaderRight = () => {
    const { navigation } = this.props;
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => navigation.navigate("SearchScreen")}
        style={{ width: 25, alignItems: "flex-end" }}
      >
        <Feather name="search" size={20} color="#fff" />
      </TouchableOpacity>
    );
  };

  _renderHeaderCenter = () => {
    const { isFocused } = this.props;
    const postType = this._getPostType();
    return (
      <LocationModalPickerContainer postType={postType} isFocused={isFocused} />
    );
  };

  _renderHeaderLeft = () => {
    const postType = this._getPostType();
    return <NearbyContainer postType={postType} />;
  };

  _renderContent = () => {
    const { navigation } = this.props;
    return <ListingsContainer navigation={navigation} />;
  };

  _getPostType = () => {
    const { navigation } = this.props;
    const { state } = navigation;
    const nextRoute = navigation.dangerouslyGetParent().state;
    const postType = state.params ? state.params.key : nextRoute.key;
    return postType;
  };

  render() {
    const { navigation, settings, listings } = this.props;
    const postType = this._getPostType();
    const condition = this._getListingSuccess(listings, postType);

    return (
      <Layout
        navigation={navigation}
        headerType="headerHasFilter"
        renderLeft={this._renderHeaderLeft}
        renderCenter={this._renderHeaderCenter}
        renderRight={this._renderHeaderRight}
        renderContent={this._renderContent}
        scrollViewEnabled={false}
        scrollViewStyle={{
          backgroundColor: Consts.colorGray2
        }}
        colorPrimary={settings.colorPrimary}
        containerFixed={false}
        adMob={condition && listings[postType].oAdmob}
      />
    );
  }
}
const mapStateToProps = ({ settings, listings }) => ({
  settings,
  listings
});
export default connect(mapStateToProps)(withNavigationFocus(Listing));
