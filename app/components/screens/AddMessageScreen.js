import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  TextInput,
  Dimensions,
  FlatList
} from "react-native";
import stylesBase from "../../stylesBase";
import * as Consts from "../../constants/styleConstants";
import { Layout } from "../dumbs";
import { connect } from "react-redux";
import { Feather } from "@expo/vector-icons";
import Constants from "expo-constants";
import { searchUsers, getKeyFirebase } from "../../actions";
import {
  ImageCircleAndText,
  ViewWithLoading,
  bottomBarHeight
} from "../../wiloke-elements";
import _ from "lodash";

const HEADER_HEIGHT = 52 + Constants.statusBarHeight;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CONTENT_HEIGHT = SCREEN_HEIGHT - HEADER_HEIGHT;

class AddMessageScreen extends Component {
  state = {
    isLoading: false
  };
  async componentDidMount() {
    this._searchUsers = _.debounce(async username => {
      await this.setState({ isLoading: true });
      await this.props.searchUsers(username);
      this.setState({ isLoading: false });
    }, 400);
  }

  _handleSearch = username => {
    username.length > 0 && this._searchUsers(username);
  };

  _renderHeader = height => {
    const { navigation, settings, translations } = this.props;
    return (
      <View
        style={[
          styles.header,
          { height, backgroundColor: settings.colorPrimary }
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={_ => navigation.goBack()}
        >
          <Feather name="chevron-left" size={30} color="#fff" />
        </TouchableOpacity>
        <View>
          <TextInput
            underlineColorAndroid="transparent"
            selectionColor={settings.colorPrimary}
            placeholder={translations.searchUsersInChat}
            autoCorrect={false}
            style={styles.input}
            clearButtonMode="always"
            autoFocus={true}
            onChangeText={this._handleSearch}
          />
        </View>
      </View>
    );
  };

  _handleAddUserFirebase = user => async _ => {
    const { navigation, getKeyFirebase, shortProfile } = this.props;
    const { userID, displayName } = user;
    const myID = shortProfile.userID;
    await getKeyFirebase(myID, userID);
    const { keyFirebase } = this.props;
    navigation.navigate("SendMessageScreen", {
      userID,
      displayName,
      key: keyFirebase
    });
  };

  _renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={this._handleAddUserFirebase(item)}
        style={styles.item}
      >
        <ImageCircleAndText
          image={item.avatar}
          title={item.displayName}
          horizontal={true}
          imageSize={40}
        />
      </TouchableOpacity>
    );
  };

  _renderContent = _ => {
    const { users } = this.props;
    const { isLoading } = this.state;
    return (
      <ViewWithLoading
        isLoading={isLoading}
        contentLoader="headerAvatar"
        avatarSize={40}
        contentLoaderItemLength={4}
        gap={0}
      >
        <FlatList
          data={users}
          renderItem={this._renderItem}
          keyExtractor={(item, index) => item.userID.toString()}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always"
          ListFooterComponent={() => (
            <View
              style={{
                paddingBottom: bottomBarHeight
              }}
            />
          )}
        />
      </ViewWithLoading>
    );
  };

  render() {
    const { auth, navigation, settings } = this.props;
    const { isLoggedIn } = auth;
    return (
      <Layout
        navigation={navigation}
        renderHeader={this._renderHeader}
        renderContent={this._renderContent}
        colorPrimary={settings.colorPrimary}
        isLoggedIn={isLoggedIn}
        scrollViewEnabled={false}
        scrollViewStyle={{
          backgroundColor: "#fff"
        }}
        tintColor={Consts.colorDark1}
        keyboardDismiss={true}
        contentHeight={CONTENT_HEIGHT}
      />
    );
  }
}

const styles = StyleSheet.create({
  header: {
    paddingLeft: 5,
    paddingRight: 10,
    paddingTop: Platform.OS === "ios" ? Constants.statusBarHeight : 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  input: {
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    width: SCREEN_WIDTH - 55,
    height: 40,
    borderRadius: 5,
    fontSize: 14,
    color: Consts.colorDark2
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: Consts.colorGray1,
    width: Consts.screenWidth
  }
});

const mapStateToProps = state => ({
  auth: state.auth,
  settings: state.settings,
  users: state.users,
  usersError: state.usersError,
  keyFirebase: state.keyFirebase,
  shortProfile: state.shortProfile,
  translations: state.translations
});

const mapDispatchToProps = {
  searchUsers,
  getKeyFirebase
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddMessageScreen);
