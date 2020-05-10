import React from "react";
import { View, Dimensions } from "react-native";
import * as Consts from "../../constants/styleConstants";
import { EventDiscussionContainer } from "../smarts";
import { Layout } from "../dumbs";
import Constants from "expo-constants";
import { connect } from "react-redux";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const HEADER_HEIGHT = 52 + Constants.statusBarHeight;
const CONTENT_HEIGHT = SCREEN_HEIGHT - HEADER_HEIGHT;

const EventDiscussionAllScreen = props => {
  const { navigation, eventDiscussion, settings } = props;
  const { params } = navigation.state;
  return (
    <Layout
      navigation={navigation}
      headerType="headerHasBack"
      title={eventDiscussion.discussionsOn}
      goBack={() => navigation.goBack()}
      renderRight={() => {}}
      renderContent={() => (
        <View style={{ padding: 10 }}>
          <EventDiscussionContainer
            id={params.id}
            type=""
            navigation={navigation}
            colorPrimary={settings.colorPrimary}
          />
        </View>
      )}
      scrollViewEnabled={false}
      contentHeight={CONTENT_HEIGHT}
      scrollViewStyle={{
        backgroundColor: Consts.colorGray2
      }}
      colorPrimary={settings.colorPrimary}
    />
  );
};

const mapStateToProps = state => ({
  eventDiscussion: state.eventDiscussion,
  settings: state.settings
});

export default connect(mapStateToProps)(EventDiscussionAllScreen);
