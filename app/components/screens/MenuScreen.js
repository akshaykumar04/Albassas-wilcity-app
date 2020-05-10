import React from "react";
import { Layout } from "../dumbs";
import { MenuContainer } from "../smarts";
import { connect } from "react-redux";

const MenuScreen = props => {
  const { navigation, translations, settings, auth } = props;
  const { isLoggedIn } = auth;
  return (
    <Layout
      navigation={navigation}
      textSearch={translations.search}
      renderContent={() => <MenuContainer navigation={navigation} />}
      colorPrimary={settings.colorPrimary}
      isLoggedIn={isLoggedIn}
    />
  );
};
const mapStateToProps = state => ({
  settings: state.settings,
  translations: state.translations,
  auth: state.auth
});
export default connect(mapStateToProps)(MenuScreen);
