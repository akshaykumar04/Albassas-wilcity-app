import React, { Component } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Alert,
  StyleSheet
} from "react-native";
import { Layout, ListingSmallCard, Rated } from "../dumbs";
import {
  ViewWithLoading,
  ModalPicker,
  isCloseToBottom,
  MessageError
} from "../../wiloke-elements";
import { connect } from "react-redux";
import {
  getMyEvents,
  getMyEventsLoadmore,
  getEventStatus
} from "../../actions";
import { Feather } from "@expo/vector-icons";
import _ from "lodash";
import he from "he";
import { screenWidth } from "../../constants/styleConstants";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ICON_WIDTH = 30;
const ICON_HEIGHT = 30;

class MyEventsScreen extends Component {
  state = {
    isLoading: true,
    isScrollEnabled: true,
    postStatus: "all",
    isLoadMore: true,
    isFetch: false,
    startLoadmore: false
  };

  _getMyEvents = async ({ postStatus }) => {
    const { getMyEvents } = this.props;
    await getMyEvents({ postStatus });
  };

  async componentDidMount() {
    const { getEventStatus } = this.props;
    await this.setState({ isLoading: true });
    await getEventStatus("Status");
    await this._getMyEvents({
      postStatus: "all"
    });
    this.setState({ isLoading: false, startLoadmore: true });
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps.myEvents, this.props.myEvents)) {
      this.setState({
        isFetch: true
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!_.isEqual(nextProps.myEvents, this.props.myEvents)) {
      return true;
    }
    if (!_.isEqual(nextState.isLoading, this.state.isLoading)) {
      return true;
    }
    return false;
  }

  _handlePressItem = item => _ => {
    const { navigation, translations } = this.props;
    navigation.navigate("EventDetailScreen", {
      id: item.ID,
      name: he.decode(item.postTitle),
      image:
        SCREEN_WIDTH > 420 ? item.oFeaturedImg.large : item.oFeaturedImg.medium,
      address: he.decode(item.oAddress.address),
      hosted: `${translations.hostedBy} ${item.oAuthor.displayName}`,
      interested: `${item.oFavorite.totalFavorites} ${item.oFavorite.text}`
    });
  };

  renderItem = (item, index) => {
    return (
      <TouchableOpacity
        key={index.toString()}
        activeOpacity={0.6}
        onPress={this._handlePressItem(item)}
      >
        <ListingSmallCard
          image={item.oFeaturedImg.thumbnail}
          image={
            SCREEN_WIDTH > 420
              ? item.oFeaturedImg.large
              : item.oFeaturedImg.medium
          }
          title={item.postTitle}
          text={item.tagLine}
          renderRate={() => {
            return (
              item.oReview && (
                <Rated
                  rate={item.oReview.average}
                  max={item.oReview.mode}
                  rateStyle={{ fontSize: 13, marginRight: 2 }}
                  maxStyle={{ fontSize: 9 }}
                  style={{ marginVertical: 5 }}
                />
              )
            );
          }}
        />
      </TouchableOpacity>
    );
  };

  renderContent = () => {
    const { myEvents, myEventError, translations } = this.props;
    const { oResults, next } = myEvents;
    const { isLoading, isLoadMore } = this.state;
    return (
      <View style={{ width: screenWidth }}>
        <ViewWithLoading
          isLoading={isLoading}
          contentLoader="headerAvatar"
          avatarSquare={true}
          avatarSize={60}
          contentLoaderItemLength={8}
          gap={0}
        >
          {!_.isEmpty(oResults) && oResults.map(this.renderItem)}
        </ViewWithLoading>
        {next && (
          <ViewWithLoading
            isLoading={isLoadMore}
            contentLoader="headerAvatar"
            avatarSquare={true}
            avatarSize={60}
            contentLoaderItemLength={1}
            gap={0}
          />
        )}
        {_.isEmpty(myEvents.oResults) && !!myEventError && (
          <MessageError message={translations[myEventError]} />
        )}
        <View style={{ height: 30 }} />
      </View>
    );
  };

  _renderHeaderCenter = (options, onChangeOptions) => {
    const { settings } = this.props;
    return (
      <View style={styles.headerCenterWrapper}>
        {options.length > 0 ? (
          <ModalPicker
            options={options}
            onChangeOptions={onChangeOptions}
            underlayBorder={false}
            textResultStyle={{
              color: "#fff",
              fontSize: 12,
              marginRight: 4,
              width: 120
            }}
            textResultNumberOfLines={1}
            iconResultColor="#fff"
            clearSelectEnabled={false}
            colorPrimary={settings.colorPrimary}
          />
        ) : (
          <View style={{ height: 46, width: 120, justifyContent: "center" }}>
            <Text style={{ color: "#fff" }}>...</Text>
          </View>
        )}
        <View style={styles.headerCenterBorder} />
      </View>
    );
  };

  _handleChangeOptions = modify => async (options, selected) => {
    await this.setState({ isLoading: true });
    await this.setState({
      postStatus:
        modify === "postStatus" ? selected[0].id : this.state.postStatus
    });
    await this._getMyEvents({
      postStatus: this.state.postStatus
    });
    this.setState({ isLoading: false, startLoadmore: true });
  };

  _handleLoadmore = async _ => {
    const { myEvents } = this.props;
    const { next } = myEvents;
    const { startLoadmore } = this.state;
    this.setState({
      isFetch: false
    });
    !!next &&
      startLoadmore &&
      this.state.isFetch &&
      (await this.props.getMyEventsLoadmore({
        next,
        postStatus: this.state.postStatus
      }));
    this.setState({
      isFetch: true
    });
  };

  render() {
    const {
      navigation,
      settings,
      translations,
      auth,
      eventStatus
    } = this.props;
    const { isLoggedIn } = auth;
    return (
      <Layout
        navigation={navigation}
        headerType="headerHasFilter"
        renderCenter={() => (
          <View style={{ flexDirection: "row" }}>
            {this._renderHeaderCenter(
              eventStatus,
              this._handleChangeOptions("postStatus")
            )}
          </View>
        )}
        renderLeft={() => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
          >
            <View
              style={[
                styles.icon,
                {
                  alignItems: "flex-start"
                }
              ]}
            >
              <Feather name="chevron-left" size={26} color="#fff" />
            </View>
          </TouchableOpacity>
        )}
        renderRight={() => (
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.navigate("SearchScreen")}
          >
            <Feather name="search" size={20} color="#fff" />
          </TouchableOpacity>
        )}
        renderContent={this.renderContent}
        colorPrimary={settings.colorPrimary}
        textSearch={translations.search}
        isLoggedIn={isLoggedIn}
        scrollEnabled={this.state.isScrollEnabled}
        scrollEventThrottle={16}
        onMomentumScrollEnd={({ nativeEvent }) => {
          isCloseToBottom(nativeEvent) && this._handleLoadmore();
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  headerCenterWrapper: {
    position: "relative",
    paddingLeft: 8,
    paddingRight: 5,
    zIndex: 9
  },
  headerCenterBorder: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 12,
    bottom: 12,
    borderWidth: 1,
    borderColor: "#fff",
    opacity: 0.8,
    borderRadius: 5,
    zIndex: -1
  },
  container: {
    flexDirection: "row"
  },
  lineVertical: {
    position: "absolute",
    top: 12,
    bottom: 12,
    left: 0,
    width: 1,
    backgroundColor: "#fff"
  },

  icon: {
    width: ICON_WIDTH,
    height: ICON_HEIGHT,
    justifyContent: "center",
    alignItems: "center"
  }
});

const mapStateToProps = state => ({
  myEvents: state.myEvents,
  settings: state.settings,
  translations: state.translations,
  auth: state.auth,
  myEventError: state.myEventError,
  eventStatus: state.eventStatus
});

const mapDispatchToProps = {
  getMyEvents,
  getMyEventsLoadmore,
  getEventStatus
};

export default connect(mapStateToProps, mapDispatchToProps)(MyEventsScreen);
