import React, { PureComponent } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Platform
} from "react-native";
import { withNavigation } from "react-navigation";
import { Feather } from "@expo/vector-icons";
import { colorGray1, screenWidth } from "../../constants/styleConstants";
import {
  ViewWithLoading,
  MessageError,
  Toast,
  wait,
  bottomBarHeight
} from "../../wiloke-elements";
import { OrderItem, Layout, GradeView, AnimatedView } from "../dumbs";

const IOS = Platform.OS === "ios";
class ShopOrderScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isScrollEnabled: true,
      currentPage: 1,
      refreshing: false,
      loadmore: false,
      startLoadMore: false
    };
    this.current = false;
  }
  componentDidMount() {
    this._getListOrder();
  }

  _handleRefresh = async () => {
    await this.setState({
      refreshing: true,
      currentPage: 1
    });
    this._getListOrder();
  };

  _handlePressItem = item => () => {
    this.props.navigation.navigate("OrderDetailsScreen", {
      orderID: item.id,
      statusOrder: item.status
    });
  };
  _onEndHandlerIOS = () => {
    if (this.state.startLoadmore) {
      this._handleLoadMore();
      return;
    }
  };

  _onEndReached = () => {
    IOS ? this._onEndHandlerIOS() : this._handleLoadMore();
  };

  _handleLoadMore = async () => {
    const { myOrder, getListOrder, auth } = this.props;
    if (this.state.currentPage > myOrder.totalPageOrder) {
      this.setState({
        startLoadMore: false
      });
      return;
    }
    await getListOrder(auth.token, this.state.currentPage);
    await this.setState({
      loadmore: false,
      currentPage: this.state.currentPage + 1
    });
  };

  _getListOrder = async () => {
    const { auth, getListOrder } = this.props;
    await getListOrder(auth.token);
    this.setState({
      isLoading: false,
      refreshing: false,
      currentPage: this.state.currentPage + 1,
      loadmore: false
    });
    await wait(1000);
    this.setState({
      startLoadmore: true
    });
  };

  _keyExtractor = (item, index) => item.id.toString();

  _renderItem = ({ item, index }) => {
    const { translations, settings } = this.props;
    return (
      <AnimatedView>
        <TouchableOpacity
          activeOpacity={1}
          onPress={this._handlePressItem(item)}
        >
          <OrderItem
            id={item.id}
            timing={item.createdAt}
            price={item.total}
            status={item.status}
            colorPrimary={settings.colorPrimary}
            translations={translations}
          />
        </TouchableOpacity>
      </AnimatedView>
    );
  };

  _renderEmpty = () => {
    const { translations } = this.props;
    return <MessageError message={translations.noOrder} />;
  };

  _renderFooterList = () => {
    const { isLoading } = this.state;
    if (!this.state.startLoadMore) return null;
    return (
      <ViewWithLoading
        isLoading={true}
        contentLoader="content"
        contentLoaderItemLength={1}
        gap={0}
      />
    );
  };

  renderContent = () => {
    const { myOrder } = this.props;
    const { aOrders } = myOrder;
    const { isLoading, refreshing } = this.state;
    return (
      <AnimatedView
        style={{ width: screenWidth, marginBottom: bottomBarHeight }}
      >
        <ViewWithLoading
          isLoading={isLoading}
          contentLoader="content"
          contentLoaderItemLength={2}
          gap={0}
        >
          <FlatList
            data={aOrders}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
            ListEmptyComponent={this._renderEmpty}
            refreshing={this.state.refreshing}
            onRefresh={this._handleRefresh}
            onEndReachedThreshold={0.2}
            onEndReached={this._onEndReached}
            ListFooterComponent={this._renderFooterList}
            // style={{ flex: 1 }}
          />
        </ViewWithLoading>
      </AnimatedView>
    );
  };

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
        renderRight={() => (
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.icon}
            onPress={() => navigation.navigate("CartScreen")}
          >
            <Feather name="shopping-cart" size={25} color="#fff" />
            <GradeView
              gradeText={myCart.totalItems}
              containerStyle={styles.totalItems}
              textStyle={{ color: "#333", fontWeight: "200", fontSize: 11 }}
              RATED_SIZE={20}
            />
          </TouchableOpacity>
        )}
      />
    );
  }
}
const styles = StyleSheet.create({
  icon: {
    position: "relative",
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  totalItems: {
    backgroundColor: "#fff",
    position: "absolute",
    top: -10,
    right: 0
  }
});
export default withNavigation(ShopOrderScreen);
