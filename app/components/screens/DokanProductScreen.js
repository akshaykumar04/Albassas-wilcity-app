import React, { PureComponent } from "react";
import { Text, View, FlatList, Platform } from "react-native";
import { connect } from "react-redux";
import * as WebBrowser from "expo-web-browser";

import { getDokanProducts } from "../../actions";
import { ViewWithLoading, MessageError } from "../../wiloke-elements";

import * as Consts from "../../constants/styleConstants";
import { Layout, ListingProductItemClassic, AnimatedView } from "../dumbs";

const IOS = Platform.OS === "ios";
class DokanProductScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      currentPage: 1,
      refreshing: false,
      loadmore: false
    };
    this.current = false;
  }

  componentDidMount() {
    this._getProductsDokan();
  }

  _handleItem = item => async () => {
    const { navigation } = this.props;
    if (item.type === "booking") {
      WebBrowser.openBrowserAsync(item.link);
      return;
    }
    navigation.navigate("ProductDetailScreen", { productID: item.id });
  };

  _onEndReached = () => {
    IOS ? this._onEndHandlerIOS() : this._handleLoadMore();
  };

  _onEndHandlerIOS = async () => {
    if (!this.current) {
      this.current = true;
      return;
    }
    if (this.current) {
      this._handleLoadMore();
    }
  };

  _handleLoadMore = async () => {
    const { myDokan, getDokanProducts, auth } = this.props;
    if (this.state.currentPage > myDokan.totalPage1) return;
    await this.setState({
      loadmore: true
    });
    await getDokanProducts(auth.token, this.state.currentPage);
    this.setState({
      loadmore: false,
      currentPage: this.state.currentPage + 1
    });
  };

  _handleRefresh = async () => {
    await this.setState({
      currentPage: 1,
      refreshing: true
    });
    this._getProductsDokan();
  };

  _getProductsDokan = async () => {
    const { getDokanProducts, auth } = this.props;
    await getDokanProducts(auth.token);
    this.setState({
      isLoading: false,
      refreshing: false,
      currentPage: this.state.currentPage + 1
    });
  };

  _renderItem = ({ item, index }) => {
    return (
      <AnimatedView style={{ padding: 5 }}>
        <ListingProductItemClassic
          src={item.oFeaturedImg.thumbnail}
          productName={item.name}
          priceHtml={item.priceHtml}
          salePriceHtml={item.salePriceHtml}
          salePrice={item.salePrice}
          category={item.oCategories[0]}
          author={item.oAuthor.displayName}
          onPress={this._handleItem(item)}
          status={item.postStatus}
          colorPrimary={this.props.settings.colorPrimary}
        />
      </AnimatedView>
    );
  };

  _renderEmpty = () => {
    const { myDokan } = this.props;
    const { errorProductDokan } = myDokan;
    return <MessageError message={errorProductDokan.msg} />;
  };

  _renderFooterList = () => {
    const { isLoading } = this.state;
    if (!this.state.loadmore) return null;
    return (
      <ViewWithLoading
        isLoading={this.state.loadmore}
        contentLoader="headerAvatar"
        avatarSquare={true}
        avatarSize={60}
        contentLoaderItemLength={2}
        gap={0}
      />
    );
  };

  _keyExtractor = (item, index) => index.toString();

  renderContent = () => {
    const { myDokan } = this.props;
    const { dokanProducts } = myDokan;
    const { isLoading, refreshing } = this.state;
    return (
      <View style={{ width: Consts.screenWidth }}>
        <ViewWithLoading
          isLoading={isLoading}
          contentLoader="headerAvatar"
          avatarSquare={true}
          avatarSize={60}
          contentLoaderItemLength={4}
          gap={0}
        >
          <FlatList
            data={dokanProducts}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
            ListEmptyComponent={this._renderEmpty}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  width: "100%",
                  height: 1,
                  backgroundColor: Consts.colorGray1
                }}
              />
            )}
            refreshing={refreshing}
            onRefresh={this._handleRefresh}
            ListFooterComponent={this._renderFooterList}
            onEndReached={this._onEndReached}
            onEndReachedThreshold={0.8}
          />
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
const mapStateToProps = state => ({
  myDokan: state.dokanReducer,
  settings: state.settings,
  translations: state.translations,
  auth: state.auth
});
const mapDispatchToProps = {
  getDokanProducts
};
export default connect(mapStateToProps, mapDispatchToProps)(DokanProductScreen);
