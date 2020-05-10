import React, { PureComponent } from "react";
import { View, Dimensions, TouchableOpacity, Animated } from "react-native";
import * as Consts from "../../constants/styleConstants";
import { PhoneItem, WebItem, Icon } from "../dumbs";
import {
  ViewWithLoading,
  ContentBox,
  P,
  H6,
  IconTextMedium,
  ParallaxScreen,
  DeepLinkingSocial,
  getSocialColor,
  ImageCover,
  bottomBarHeight,
  RTL
} from "../../wiloke-elements";
import { connect } from "react-redux";
import { getMyProfile } from "../../actions";
import { Feather } from "@expo/vector-icons";
import _ from "lodash";

const AVATAR_SIZE = 60;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

class ProfileScreen extends PureComponent {
  state = {
    isLoading: true,
    scrollY: new Animated.Value(0),
    headerMaxHeight: 0,
    headerMinHeight: 0
  };

  async componentDidMount() {
    try {
      const { getMyProfile } = this.props;
      await getMyProfile();
      this.setState({ isLoading: false });
    } catch (err) {
      console.log(err);
    }
  }

  renderHeaderLeft = () => {
    const { navigation } = this.props;
    const rtl = RTL();
    return (
      <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.goBack()}>
        <View
          style={{
            width: 30,
            height: 30,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Feather
            name={!rtl ? "chevron-left" : "chevron-right"}
            size={26}
            color="#fff"
          />
        </View>
      </TouchableOpacity>
    );
  };

  renderHeaderRight = () => {
    const { navigation } = this.props;
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        style={{
          width: 40,
          height: 40,
          justifyContent: "center",
          alignItems: "center"
        }}
        onPress={() => navigation.navigate("EditProfile")}
      >
        <Feather name="edit" size={22} color="#fff" />
      </TouchableOpacity>
    );
  };

  _renderSocials = myProfile => {
    const { settings } = this.props;
    const { social_networks } = myProfile;
    return (
      <View>
        <View style={{ height: 10 }} />
        <ContentBox
          headerTitle={"Social"}
          headerIcon="fa fa-share-alt"
          colorPrimary={settings.colorPrimary}
        >
          <View style={{ flexDirection: "row" }}>
            {!_.isEmpty(social_networks) &&
              social_networks.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index.toString()}
                    activeOpacity={0.5}
                    onPress={() => DeepLinkingSocial(item.url)}
                    style={{ marginRight: 5, marginBottom: 5 }}
                  >
                    <Icon
                      name={item.id === "youtube" ? "youtube-play" : item.id}
                      color="#fff"
                      backgroundColor={getSocialColor(
                        item.id.replace(/(fa\s+|)fa-/g, "")
                      )}
                    />
                  </TouchableOpacity>
                );
              })}
          </View>
        </ContentBox>
      </View>
    );
  };

  _handleGetScrollYAnimation = (scrollY, headerMeasure) => {
    const { headerMaxHeight, headerMinHeight } = headerMeasure;
    this.setState({ scrollY, headerMaxHeight, headerMinHeight });
  };

  _getHeaderDistance = () => {
    const { headerMaxHeight, headerMinHeight } = this.state;
    return headerMaxHeight - headerMinHeight;
  };

  _getAfterImageStyle = () => {
    const { scrollY } = this.state;
    const scale = scrollY.interpolate({
      inputRange: [0, this._getHeaderDistance()],
      outputRange: [1, 0.9],
      extrapolate: "clamp"
    });
    const translateY = scrollY.interpolate({
      inputRange: [0, this._getHeaderDistance()],
      outputRange: [-13, -5],
      extrapolate: "clamp"
    });
    return {
      transform: [{ scale }, { translateY }]
    };
  };

  _getAvatarStyle = () => {
    const { scrollY } = this.state;
    const scale = scrollY.interpolate({
      inputRange: [0, this._getHeaderDistance()],
      outputRange: [1, 0.7],
      extrapolate: "clamp"
    });
    const translateX = scrollY.interpolate({
      inputRange: [0, this._getHeaderDistance()],
      outputRange: [0, 5],
      extrapolate: "clamp"
    });
    const translateY = scrollY.interpolate({
      inputRange: [0, this._getHeaderDistance()],
      outputRange: [0, 15],
      extrapolate: "clamp"
    });
    return {
      transform: [{ scale }, { translateX }, { translateY }]
    };
  };
  _getUserNameStyle = () => {
    const { scrollY } = this.state;
    const scale = scrollY.interpolate({
      inputRange: [0, this._getHeaderDistance()],
      outputRange: [1, 0.9],
      extrapolate: "clamp"
    });
    const translateX = scrollY.interpolate({
      inputRange: [0, this._getHeaderDistance()],
      outputRange: [0, -10],
      extrapolate: "clamp"
    });
    const translateY = scrollY.interpolate({
      inputRange: [0, this._getHeaderDistance()],
      outputRange: [0, 10],
      extrapolate: "clamp"
    });
    return {
      transform: [{ scale }, { translateX }, { translateY }]
    };
  };

  _renderInsideImage = myProfile => {
    return (
      <Animated.View
        style={[
          {
            position: "relative",
            zIndex: 9999,
            paddingHorizontal: 15
          },
          this._getAfterImageStyle()
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end"
          }}
        >
          <Animated.View
            style={[
              {
                borderWidth: 2,
                borderColor: "#fff",
                borderRadius: 3,
                width: AVATAR_SIZE,
                backgroundColor: Consts.colorGray1
              },
              this._getAvatarStyle()
            ]}
          >
            <ImageCover src={myProfile.avatar} width="100%" />
          </Animated.View>
          <Animated.View style={[{ marginLeft: 10 }, this._getUserNameStyle()]}>
            <H6 style={{ color: "#fff", marginBottom: -1 }}>
              {myProfile.display_name}
            </H6>
            <P style={{ color: "#fff" }}>{myProfile.position}</P>
          </Animated.View>
        </View>
      </Animated.View>
    );
  };

  _renderAfterImage = () => {
    return (
      <View
        style={{
          backgroundColor: "#fff",
          height: 40,
          borderBottomWidth: 1,
          borderBottomColor: Consts.colorGray1
        }}
      >
        <P>Menu</P>
      </View>
    );
  };

  renderContent = myProfile => {
    const { settings, translations, navigation } = this.props;
    const { isLoading } = this.state;
    return (
      <View
        style={{
          padding: 10,
          paddingBottom: 100 + bottomBarHeight
        }}
      >
        <ViewWithLoading
          isLoading={isLoading}
          contentLoader="contentHeader"
          avatarSquare={true}
          avatarSize={60}
          contentLoaderItemLength={3}
          gap={10}
        >
          {!_.isEmpty(myProfile) && (
            <View>
              <ContentBox
                headerTitle={translations.profile}
                headerIcon="user"
                colorPrimary={settings.colorPrimary}
              >
                <P>{myProfile.description}</P>
              </ContentBox>
              {this._renderSocials(myProfile)}
              <View style={{ height: 10 }} />
              <ContentBox
                headerTitle={"Info"}
                headerIcon="file-text"
                colorPrimary={settings.colorPrimary}
              >
                <View>
                  {!!myProfile.address && (
                    <View style={{ marginBottom: 14 }}>
                      <IconTextMedium
                        iconName="map-pin"
                        iconSize={30}
                        text={myProfile.address}
                        iconColor="#fff"
                        iconBackgroundColor={Consts.colorSecondary}
                      />
                    </View>
                  )}
                  {!!myProfile.phone && (
                    <View style={{ marginBottom: 14 }}>
                      <PhoneItem phone={myProfile.phone} />
                    </View>
                  )}
                  {!!myProfile.website && (
                    <View style={{ marginBottom: 14 }}>
                      <WebItem
                        url={myProfile.website}
                        navigation={navigation}
                      />
                    </View>
                  )}
                </View>
              </ContentBox>
            </View>
          )}
        </ViewWithLoading>
      </View>
    );
  };

  render() {
    const { settings, myProfile } = this.props;
    const _myProfile = Object.values(myProfile).reduce(
      (acc, cur) => ({
        ...acc,
        ...cur
      }),
      {}
    );
    return (
      <ParallaxScreen
        headerMaxHeight={(75 * SCREEN_WIDTH) / 100}
        headerImageSource={_myProfile.cover_image}
        overlayRange={[0, 1]}
        overlayColor={settings.colorPrimary}
        renderHeaderLeft={this.renderHeaderLeft}
        renderHeaderRight={this.renderHeaderRight}
        renderInsideImage={() => this._renderInsideImage(_myProfile)}
        renderContent={() => this.renderContent(_myProfile)}
        // renderAfterImage={this._renderAfterImage}
        onGetScrollYAnimation={this._handleGetScrollYAnimation}
        containerStyle={{
          backgroundColor: Consts.colorGray2
        }}
      />
    );
  }
}

const mapStateToProps = state => ({
  settings: state.settings,
  translations: state.translations,
  myProfile: state.myProfile,
  auth: state.auth
});

const mapDispatchToProps = {
  getMyProfile
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);
