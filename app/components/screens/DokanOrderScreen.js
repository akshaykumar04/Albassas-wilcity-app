import React, { PureComponent } from "react";
import { Text, View, FlatList, TouchableOpacity, Platform } from "react-native";
import { connect } from "react-redux";
import * as WebBrowser from "expo-web-browser";

import { getDokanOrders } from "../../actions";
import { ViewWithLoading, MessageError } from "../../wiloke-elements";

import { colorGray1, screenWidth } from "../../constants/styleConstants";
import {
  Layout,
  ListingProductItemClassic,
  OrderItem,
  AnimatedView
} from "../dumbs";

const IOS = Platform.OS === "ios";
class DokanOrderScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      currentPage: 1,
      refreshing: false,
      loadmore: false
    };
  }

  componentDidMount() {
    this._getOrdersDokan();
  }

  _handleRefresh = async () => {
    await this.setState({
      currentPage: 1,
      refreshing: true
    });
    this._getOrdersDokan();
  };

  _onEndHandlerIOS = () => {
    if (this.state.loadmore) {
      this._handleLoadMore();
    }
  };

  _onEndReached = () => {
    IOS ? this._onEndHandlerIOS() : this._handleLoadMore();
  };

  _handleLoadMore = async () => {
    const { myDokan, getDokanOrders, auth } = this.props;
    if (this.state.currentPage > myDokan.totalPage2) {
      this.setState({
        loadmore: false
      });
      return;
    }
    await getDokanOrders(auth.token, this.state.currentPage);
    this.setState({
      currentPage: this.state.currentPage + 1
    });
  };

  _getOrdersDokan = async () => {
    const { getDokanOrders, auth } = this.props;
    await getDokanOrders(auth.token, this.state.currentPage);
    await this.setState({
      isLoading: false,
      refreshing: false,
      currentPage: this.state.currentPage + 1
    });
    await wait(1000);
    this.setState({
      loadmore: true
    });
  };

  _renderItem = ({ item, index }) => {
    const { settings, translations } = this.props;
    return (
      <AnimatedView>
        <OrderItem
          id={item.id}
          timing={item.createdAt}
          status={item.status}
          price={item.total}
          colorPrimary={settings.colorPrimary}
          translations={translations}
        />
      </AnimatedView>
    );
  };

  _renderEmpty = () => {
    const { myDokan } = this.props;
    return <MessageError message={myDokan.errorOrderDokan.msg} />;
  };

  _renderFooterList = () => {
    const { loadmore } = this.state;
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

  _keyExtractor = (item, index) => index.toString();

  renderContent = () => {
    const { myDokan } = this.props;
    const { dokanOrders } = myDokan;
    const { isLoading, refreshing } = this.state;
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
            data={dokanOrders}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
            ListEmptyComponent={this._renderEmpty}
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
        // scrollEnabled={false}
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
  getDokanOrders
};
export default connect(mapStateToProps, mapDispatchToProps)(DokanOrderScreen);
