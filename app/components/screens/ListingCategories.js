import React from "react";
import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Consts from "../../constants/styleConstants";
import { ListingByCatContainer } from "../smarts";
import { Layout } from "../dumbs";
import { connect } from "react-redux";

const ListingCategories = props => {
  const { navigation, settings } = props;
  return (
    <Layout
      navigation={navigation}
      headerType="headerHasBack"
      title={navigation.state.params.name}
      goBack={() => navigation.goBack()}
      renderRight={() => (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.navigate("SearchScreen")}
        >
          <Feather name="search" size={20} color="#fff" />
        </TouchableOpacity>
      )}
      renderContent={() => <ListingByCatContainer navigation={navigation} />}
      scrollViewEnabled={false}
      scrollViewStyle={{
        backgroundColor: Consts.colorGray2
      }}
      colorPrimary={settings.colorPrimary}
    />
  );
};
const mapStateToProps = state => ({
  settings: state.settings
});
export default connect(mapStateToProps)(ListingCategories);
