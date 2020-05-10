import React from "react";
import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Consts from "../../constants/styleConstants";
import { ArticleContainer } from "../smarts";
import { Layout } from "../dumbs";
import { connect } from "react-redux";

const ArticleScreen = props => {
  const { navigation, settings, tabNavigator, translations } = props;
  const { params } = navigation.state;
  const name = !!params
    ? params.name
    : tabNavigator.filter(item => item.screen === "blogStack")[0].name;
  return (
    <Layout
      navigation={navigation}
      headerType={!!params ? "headerHasBack" : "default"}
      textSearch={translations.search}
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
      renderContent={() => <ArticleContainer navigation={navigation} />}
      scrollViewEnabled={false}
      scrollViewStyle={{
        backgroundColor: Consts.colorGray2
      }}
      colorPrimary={settings.colorPrimary}
    />
  );
};
const mapStateToProps = ({ settings, tabNavigator, translations }) => ({
  settings,
  tabNavigator,
  translations
});
export default connect(mapStateToProps)(ArticleScreen);
