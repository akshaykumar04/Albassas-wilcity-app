import React, { Component } from "react";
import { View, Dimensions, TouchableOpacity, Alert } from "react-native";
import { Layout, ListingSmallCard, Rated } from "../dumbs";
import {
  ViewWithLoading,
  LoadingFull,
  MessageError
} from "../../wiloke-elements";
import { connect } from "react-redux";
import { getMyFavorites, addMyFavorites } from "../../actions";
import { Feather } from "@expo/vector-icons";
import _ from "lodash";
import he from "he";
import { screenWidth } from "../../constants/styleConstants";
import AppleStyleSwipeableRow from "../../wiloke-elements/components/atoms/SwiperApple/AppleSwipeable";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

class FavoritesScreen extends Component {
  state = {
    isLoading: true,
    isScrollEnabled: true,
    isDeleteLoading: false
  };
  async componentDidMount() {
    const { getMyFavorites, navigation } = this.props;
    await getMyFavorites();
    this.setState({ isLoading: false });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!_.isEqual(nextProps.myFavorites, this.props.myFavorites)) {
      return true;
    }
    if (!_.isEqual(nextState.isLoading, this.state.isLoading)) {
      return true;
    }
    if (!_.isEqual(nextState.isScrollEnabled, this.state.isScrollEnabled)) {
      return true;
    }
    if (!_.isEqual(nextState.isDeleteLoading, this.state.isDeleteLoading)) {
      return true;
    }
    return false;
  }

  _handlePressItem = item => () => {
    const { navigation } = this.props;
    navigation.navigate("ListingDetailScreen", {
      id: item.ID,
      name: he.decode(item.title),
      tagline: !!item.tagLine ? he.decode(item.tagLine) : null,
      link: item.permalink,
      author: item.oAuthor,
      image:
        SCREEN_WIDTH > 420 ? item.oFeaturedImg.large : item.oFeaturedImg.medium,
      logo: item.logo ? item.logo : item.oFeaturedImg.thumbnail
    });
  };

  _deleteListItem = ID => async _ => {
    const { addMyFavorites } = this.props;
    await this.setState({ isDeleteLoading: true });
    await addMyFavorites(ID);
    this.setState({ isDeleteLoading: false });
  };

  renderItem = item => {
    const { listIdPostFavoritesRemoved, translations } = this.props;
    const condition =
      listIdPostFavoritesRemoved.filter(_item => _item.id === item.ID).length >
      0;
    return (
      !condition && (
        <AppleStyleSwipeableRow
          key={item.ID}
          onPressRight={() => {
            Alert.alert(
              `${translations.delete} ${he.decode(item.title)}`,
              translations.confirmDeleteFavorites,
              [
                {
                  text: translations.cancel,
                  style: "cancel"
                },
                {
                  text: translations.ok,
                  onPress: this._deleteListItem(item.ID)
                }
              ],
              { cancelable: false }
            );
          }}
          translations={translations}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={this._handlePressItem(item)}
          >
            <ListingSmallCard
              image={item.oFeaturedImg.thumbnail}
              image={
                SCREEN_WIDTH > 420
                  ? item.oFeaturedImg.large
                  : item.oFeaturedImg.medium
              }
              title={item.title}
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
        </AppleStyleSwipeableRow>
      )
    );
  };

  renderContent = () => {
    const { myFavorites, translations } = this.props;
    const { oResults, status, msg } = myFavorites;
    const { isLoading, isDeleteLoading } = this.state;
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
          <LoadingFull visible={isDeleteLoading} />
          {status === "error" && <MessageError message={translations[msg]} />}
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
      />
    );
  }
}

const mapStateToProps = state => ({
  myFavorites: state.myFavorites,
  listIdPostFavoritesRemoved: state.listIdPostFavoritesRemoved,
  settings: state.settings,
  translations: state.translations,
  auth: state.auth
});

const mapDispatchToProps = {
  getMyFavorites,
  addMyFavorites
};

export default connect(mapStateToProps, mapDispatchToProps)(FavoritesScreen);
