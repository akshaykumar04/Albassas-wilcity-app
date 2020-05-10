import React, { PureComponent } from "react";
import {
  Dimensions,
  View,
  TouchableOpacity,
  Alert,
  FlatList,
  Platform
} from "react-native";
import { connect } from "react-redux";
import { Feather } from "@expo/vector-icons";
import he from "he";
import _ from "lodash";
import Swipeout from "react-native-swipeout";
import { Layout, ListingSmallCard, Rated } from "../dumbs";
import {
  ViewWithLoading,
  LoadingFull,
  MessageError,
  Toast,
  wait
} from "../../wiloke-elements";
import { getProductFavorites, deleteProductFavorites } from "../../actions";

import { screenWidth, colorGray1 } from "../../constants/styleConstants";
import FavoriteItem from "../dumbs/ProductItem/FavoriteItem";

const IOS = Platform.OS === "ios";
class ProductWishListScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isScrollEnabled: true,
      isDeleteLoading: false,
      currentPage: 1,
      refreshing: false,
      loadmore: false,
      startLoadMore: false
    };
  }
  componentDidMount() {
    this._getMyFavorites();
  }

  onEndReachedHandlerIos = async () => {
    if (this.state.startLoadMore) {
      this._handleLoadMore();
    }
  };

  onEndReachedHandlerAndroid = () => {
    this._handleLoadMore();
  };

  _handleLoadMore = async () => {
    const { myFavorites, getProductFavorites, auth } = this.props;
    await this.setState({
      loadmore: true
    });
    if (this.state.currentPage > myFavorites.totalPageProduct) {
      this.setState({
        loadmore: false,
        startLoadMore: false
      });
      return;
    }
    await getProductFavorites(auth.token, this.state.currentPage);
    this.setState({
      currentPage: this.state.currentPage + 1,
      loadmore: false
    });
  };

  _onEndReached = async () => {
    IOS ? this.onEndReachedHandlerIos() : this.onEndReachedHandlerAndroid();
  };

  _handleRefresh = async () => {
    await this.setState({
      refreshing: true,
      currentPage: 1,
      loadmore: false
    });
    this._getMyFavorites();
  };

  _handlePressItem = item => () => {
    this.props.navigation.navigate("ProductDetailScreen", {
      productID: item.id
    });
  };

  _deleteListItem = item => async () => {
    const { deleteProductFavorites, auth } = this.props;
    await this.setState({ isDeleteLoading: true });
    await deleteProductFavorites(
      auth.token,
      item.id,
      item.wishlistToken,
      item.wishListID
    );
    const { myFavorites } = this.props;
    if (myFavorites.statusDel.status === "success") {
      // await this._getMyFavorites(auth.token);
      this.setState({ isDeleteLoading: false });
    }
  };

  _getMyFavorites = async () => {
    const { getProductFavorites, auth } = this.props;
    await getProductFavorites(auth.token);
    await this.setState({
      isLoading: false,
      refreshing: false,
      currentPage: this.state.currentPage + 1
    });
    await wait(1000);
    this.setState({
      startLoadMore: true
    });
  };

  _renderItem = ({ item, index }) => {
    const { translations, settings } = this.props;
    return (
      <Swipeout
        right={[
          {
            text: translations.delete,
            type: "delete",
            onPress: () => {
              Alert.alert(
                `${translations.delete} ${he.decode(item.name)}`,
                translations.confirmDeleteFavorites,
                [
                  {
                    text: translations.cancel,
                    style: "cancel"
                  },
                  {
                    text: translations.ok,
                    onPress: this._deleteListItem(item)
                  }
                ],
                { cancelable: false }
              );
            }
          }
        ]}
        autoClose={true}
        scroll={event => this.setState({ isScrollEnabled: event })}
        style={{
          backgroundColor: "#fff"
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={{ padding: 5, marginVertical: 5 }}
          onPress={this._handlePressItem(item)}
        >
          <FavoriteItem
            productName={item.name}
            priceHtml={item.priceHtml}
            salePriceHtml={item.salePriceHtml}
            salePrice={item.salePrice}
            src={item.oFeaturedImg.medium}
            rating={item.averageRating}
            colorPrimary={settings.colorPrimary}
          />
        </TouchableOpacity>
      </Swipeout>
    );
  };

  _keyExtractor = (item, index) => `${item.id}_${item.wishListID}`;

  _renderFooterList = () => {
    if (!this.state.loadmore) return null;
    return (
      <ViewWithLoading
        isLoading={true}
        contentLoader="headerAvatar"
        avatarSquare={true}
        avatarSize={60}
        contentLoaderItemLength={2}
        gap={0}
      />
    );
  };

  _renderEmpty = () => {
    const { myFavorites } = this.props;
    const { msg } = myFavorites;
    return <MessageError message={msg} />;
  };

  renderContent = () => {
    const { myFavorites } = this.props;
    const { status, msg, aProducts } = myFavorites;
    const { isLoading, isDeleteLoading } = this.state;
    return (
      <View style={{ width: screenWidth }}>
        <ViewWithLoading
          isLoading={isLoading}
          contentLoader="headerAvatar"
          avatarSquare={true}
          avatarSize={60}
          contentLoaderItemLength={4}
          gap={0}
        >
          <FlatList
            data={aProducts}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
            ListEmptyComponent={this._renderEmpty}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  width: "100%",
                  height: 1,
                  backgroundColor: colorGray1
                }}
              />
            )}
            refreshing={this.state.refreshing}
            onRefresh={this._handleRefresh}
            ListFooterComponent={this._renderFooterList}
            onEndReached={this._onEndReached}
            onEndReachedThreshold={0.5}
          />
          <LoadingFull visible={isDeleteLoading} />
          <Toast ref={ref => (this._toast = ref)} />
        </ViewWithLoading>
      </View>
    );
  };

  render() {
    const { navigation, settings, translations, auth } = this.props;
    const { isLoggedIn } = auth;
    const { name } = navigation.state.params;
    return (
      <Layout
        navigation={navigation}
        headerType="headerHasBack"
        title={name}
        goBack={() => navigation.goBack()}
        renderContent={this.renderContent}
        colorPrimary={settings.colorPrimary}
        isLoggedIn={isLoggedIn}
        scrollViewEnabled={false}
      />
    );
  }
}
const mapStateToProps = state => {
  return {
    myFavorites: state.listProductFavorites,
    settings: state.settings,
    translations: state.translations,
    auth: state.auth
  };
};

const mapDispatchToProps = {
  getProductFavorites,
  deleteProductFavorites
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductWishListScreen);
