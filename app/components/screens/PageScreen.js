import React from "react";
import { TouchableOpacity } from "react-native";
import { Layout } from "../dumbs";
import { PageContainer } from "../smarts";
import { Feather } from "@expo/vector-icons";
import { connect } from "react-redux";

const PageScreen = props => {
  const { navigation } = props;
  const { params } = navigation.state;
  const { name } = params;
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
      renderContent={() => <PageContainer navigation={navigation} />}
      colorPrimary={props.settings.colorPrimary}
    />
  );
};
const mapStateToProps = state => ({
  settings: state.settings
});
export default connect(mapStateToProps)(PageScreen);
