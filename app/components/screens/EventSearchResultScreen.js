import React, { PureComponent } from "react";
import { TouchableOpacity, Dimensions } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Consts from "../../constants/styleConstants";
import { EventSearchResultsContainer } from "../smarts";
import { Layout } from "../dumbs";
import Constants from "expo-constants";
import { connect } from "react-redux";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const HEADER_HEIGHT = 52 + Constants.statusBarHeight;
const CONTENT_HEIGHT = SCREEN_HEIGHT - HEADER_HEIGHT;

class EventSearchResultScreen extends PureComponent {
  renderContent = () => {
    const { navigation } = this.props;
    return <EventSearchResultsContainer navigation={navigation} />;
  };
  render() {
    const { navigation, translations, settings } = this.props;
    return (
      <Layout
        navigation={navigation}
        headerType="headerHasBack"
        title={translations.searchResults}
        goBack={() => navigation.goBack()}
        renderRight={() => (
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.goBack()}
          >
            <Feather name="search" size={20} color="#fff" />
          </TouchableOpacity>
        )}
        renderContent={this.renderContent}
        scrollViewEnabled={false}
        scrollViewStyle={{
          backgroundColor: Consts.colorGray2
        }}
        contentHeight={CONTENT_HEIGHT}
        colorPrimary={settings.colorPrimary}
      />
    );
  }
}

const mapStateToProps = state => ({
  translations: state.translations,
  settings: state.settings
});

export default connect(mapStateToProps)(EventSearchResultScreen);
