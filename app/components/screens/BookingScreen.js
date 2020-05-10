import React, { PureComponent } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Platform,
  TouchableOpacity
} from "react-native";
import { ViewWithLoading, MessageError } from "../../wiloke-elements";
import { screenWidth } from "../../constants/styleConstants";
import { Layout } from "../dumbs";
import { BookingItem } from "../dumbs";

const IOS = Platform.OS === "ios";
export default class BookingScreen extends PureComponent {
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
    this._getListBooking();
  }

  _handleItem = item => () => {
    const { navigation } = this.props;
    navigation.navigate("BookingDetailScreen", { bookingID: item.id });
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
    const { booking, getListBooking, auth } = this.props;
    if (this.state.currentPage > booking.total) {
      await this.setState({
        loadmore: false
      });
      return;
    }
    await getListBooking(auth.token, this.state.currentPage);
    this.setState({
      currentPage: this.state.currentPage + 1
    });
  };

  _handleRefresh = async () => {
    await this.setState({
      refreshing: true,
      currentPage: 1
    });
    this._getListBooking();
  };

  _getListBooking = async () => {
    const { auth, getListBooking } = this.props;
    await getListBooking(auth.token);
    const { booking } = this.props;
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
      <TouchableOpacity onPress={this._handleItem(item)} activeOpacity={0.5}>
        <BookingItem
          startDate={item.startDate}
          endDate={item.endDate}
          id={item.id}
          status={item.status}
          title={item.postTitle}
          colorPrimary={settings.colorPrimary}
          translations={translations}
        />
      </TouchableOpacity>
    );
  };

  _renderEmpty = () => {
    const { booking } = this.props;
    const { errorBooking } = booking;
    return <MessageError message={errorBooking.msg} />;
  };

  _renderFooterList = () => {
    if (!this.state.loadmore) return null;
    return (
      <ViewWithLoading
        isLoading={this.state.loadmore}
        contentLoader="content"
        contentLoaderItemLength={2}
        gap={0}
      />
    );
  };

  renderContent = () => {
    const { booking } = this.props;
    const { aBookings } = booking;
    const { isLoading, refreshing } = this.state;
    return (
      <View style={{ width: screenWidth }}>
        <ViewWithLoading
          isLoading={isLoading}
          contentLoader="content"
          contentLoaderItemLength={2}
          gap={0}
        >
          <FlatList
            data={aBookings}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
            ListEmptyComponent={this._renderEmpty}
            refreshing={refreshing}
            onRefresh={this._handleRefresh}
            onEndReachedThreshold={0.2}
            onEndReached={this._onEndReached}
            ListFooterComponent={this._renderFooterList}
          />
        </ViewWithLoading>
      </View>
    );
  };

  _keyExtractor = (item, index) => item.id.toString();

  render() {
    const { navigation, settings, translations, auth, myCart } = this.props;
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
