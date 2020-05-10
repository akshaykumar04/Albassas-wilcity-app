import React, { PureComponent } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform
} from "react-native";
import { isEmpty } from "lodash";
import { connect } from "react-redux";
import * as Consts from "../../constants/styleConstants";
import { Layout, AnimatedView, RequestItem } from "../dumbs";
import {
  ViewWithLoading,
  Loader,
  MessageError,
  ContentBox,
  HtmlViewer,
  LoadingFull,
  wait
} from "../../wiloke-elements";
import {
  getRequestStatusDokan,
  cancelRequest,
  getTabsDokan
} from "../../actions";

const IOS = Platform.OS === "ios";
class DokanRequestScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      currentIndex: 0,
      refreshing: false,
      loadmore: false,
      currentPage: 1,
      loadingTab: true,
      loadingCancel: false,
      startLoadmore: false
    };
  }

  componentDidMount() {
    this._getTabsDokan();
  }
  // componentDidUpdate(prevProps, prevState) {
  //   if (prevState.currentIndex !== this.state.currentIndex) {
  //     listRef.current = false;
  //   }
  // }

  _onEndHandlerIOS = () => {
    if (this.state.loadmore) {
      this._handleLoadmore();
    }
  };

  _onEndReached = () => {
    IOS ? this._onEndHandlerIOS() : this._handleLoadmore();
  };

  _handleLoadmore = async () => {
    const { myDokan, getRequestStatusDokan, auth } = this.props;
    const { currentIndex } = this.state;
    const tabs = this._getNewTabs();
    if (this.state.currentPage > myDokan.totalPage3) {
      this.setState({
        loadmore: false,
        startLoadmore: false
      });
      return;
    }
    await getRequestStatusDokan(
      auth.token,
      tabs[currentIndex].endpoint,
      this.state.currentPage
    );
    this.setState({
      currentPage: this.state.currentPage + 1
    });
  };

  _handleRefresh = async () => {
    await this.setState({
      refreshing: true,
      currentPage: 1
    });
    this._getStatusWithDrawn();
  };

  _handleCancelRequest = item => async () => {
    const { cancelRequest, auth } = this.props;
    await Alert.alert(
      "Cancel request",
      "Do you want to cancel request?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "OK",
          onPress: async () => {
            await this.setState({
              loadingCancel: true
            });
            await cancelRequest(auth.token, item.id);
            const { myDokan } = this.props;
            await this.setState({
              loadingCancel: false
            });
            const { cancelRequestStatus } = myDokan;
            if (cancelRequestStatus.status === "success") {
              this._getStatusWithDrawn();
            } else {
              Alert.alert(cancelRequestStatus.msg);
            }
          }
        }
      ],
      { cancelable: false }
    );
  };

  _handlePressTab = (item, index) => async () => {
    const { getRequestStatusDokan, auth, requestStatusDokan } = this.props;
    await this.setState({
      currentIndex: index,
      loadingTab: true,
      loadmore: false,
      startLoadMore: false
    });
    await getRequestStatusDokan(auth.token, item.endpoint);
    await this.setState({
      loadingTab: false,
      refreshing: false,
      currentPage: 1
    });
    await wait(1000);
    this.setState({
      startLoadmore: true
    });
  };

  _getStatusWithDrawn = async () => {
    const { getRequestStatusDokan, auth } = this.props;
    const { currentIndex } = this.state;
    const tabs = this._getNewTabs();
    await getRequestStatusDokan(auth.token, tabs[currentIndex].endpoint);
    this.setState({
      loadingTab: false,
      refreshing: false,
      currentPage: this.state.currentPage + 1
    });
    await wait(1000);
    this.setState({
      startLoadMore: true
    });
  };

  _getTabsDokan = async () => {
    const { getTabsDokan, auth } = this.props;
    await getTabsDokan(auth.token);
    const { myDokan } = this.props;
    const { tabsDokan } = myDokan;
    if (!isEmpty(tabsDokan)) {
      await this.setState({
        isLoading: false
      });
      this._getStatusWithDrawn();
    }
  };
  _getNewTabs = () => {
    const { currentIndex } = this.state;
    const { myDokan } = this.props;
    const { tabsDokan } = myDokan;
    const tabs = !tabsDokan
      ? []
      : tabsDokan.map((item, index) => ({
          ...item,
          current: index === currentIndex
        }));
    return tabs;
  };

  _renderEmpty = () => {
    const { myDokan } = this.props;
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <MessageError message={myDokan.msgErrorStatusDraw} />
      </View>
    );
  };

  _renderItem = ({ item, index }) => {
    const { translations } = this.props;
    return (
      <AnimatedView style={{ paddingVertical: 5 }}>
        <RequestItem
          id={item.id}
          status={item.status}
          date={item.date}
          amount={item.amountHtml}
          method={item.method}
          onPress={this._handleCancelRequest(item)}
          colorPrimary={this.props.settings.colorPrimary}
          translations={translations}
        />
      </AnimatedView>
    );
  };

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

  _renderTabContent = () => {
    const { myDokan } = this.props;
    const { requestStatusDokan } = myDokan;
    return (
      <ViewWithLoading
        isLoading={this.state.loadingTab}
        contentLoader="headerAvatar"
        avatarSquare={true}
        avatarSize={60}
        contentLoaderItemLength={2}
        gap={0}
      >
        <FlatList
          data={requestStatusDokan}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor2}
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
          refreshing={this.state.refreshing}
          onRefresh={this._handleRefresh}
          ListFooterComponent={this._renderFooterList}
          onEndReachedThreshold={0.5}
          onEndReached={this._onEndReached}
        />
      </ViewWithLoading>
    );
  };

  _renderTabItem = ({ item, index }) => {
    const { settings } = this.props;
    return (
      <AnimatedView>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={this._handlePressTab(item, index)}
          style={[
            styles.itemNav,
            {
              borderBottomWidth: 2,
              borderBottomColor: item.current
                ? settings.colorPrimary
                : "transparent"
            }
          ]}
        >
          <View style={{ width: 5 }} />
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: item.current ? settings.colorPrimary : Consts.colorDark3
            }}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      </AnimatedView>
    );
  };

  _keyExtractor2 = (item, index) => index.toString();

  _keyExtractor = (item, index) => item.endpoint;

  renderContent = () => {
    const { isLoading, currentIndex, loadingCancel } = this.state;
    const tabs = this._getNewTabs();
    return (
      <View style={{ width: Consts.screenWidth, flex: 1 }}>
        {isLoading ? (
          <Loader size={30} />
        ) : (
          <View>
            <FlatList
              data={tabs}
              renderItem={this._renderTabItem}
              keyExtractor={this._keyExtractor}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            />
            <LoadingFull visible={loadingCancel} />
            <View style={{ paddingBottom: 50 }}>
              {this._renderTabContent()}
            </View>
          </View>
        )}
      </View>
    );
  };

  render() {
    const { navigation, settings, translations, auth } = this.props;
    const { isLoggedIn } = auth;
    // const { name } = navigation.state.params;
    return (
      <Layout
        navigation={navigation}
        headerType="headerHasBack"
        title={translations.dokanRequest}
        goBack={() => navigation.goBack()}
        renderContent={this.renderContent}
        colorPrimary={settings.colorPrimary}
        isLoggedIn={isLoggedIn}
        scrollViewEnabled={false}
      />
    );
  }
}
const styles = StyleSheet.create({
  itemNav: {
    height: 43,
    paddingHorizontal: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  }
});
const mapStateToProps = state => ({
  myDokan: state.dokanReducer,
  settings: state.settings,
  translations: state.translations,
  auth: state.auth
});
const mapDispatchToProps = {
  getRequestStatusDokan,
  cancelRequest,
  getTabsDokan
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DokanRequestScreen);
