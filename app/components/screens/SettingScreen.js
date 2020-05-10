import React, { PureComponent } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { Layout } from "../dumbs";
import { Feather } from "@expo/vector-icons";
import { ListItemTouchable } from "../../wiloke-elements";
import { screenWidth } from "../../constants/styleConstants";

class SettingScreen extends PureComponent {
  constructor(props) {
    super(props);
    const { translations } = this.props;
    this.data = [
      {
        iconName: "bell",
        text: `${translations.notifications} ${translations.settings}`,
        screen: "NotificationSettingScreen"
      },
      {
        iconName: "edit",
        text: translations.editProfile,
        screen: "EditProfile"
      }
    ];
  }

  _renderItem = (item, index) => {
    return (
      <ListItemTouchable
        key={item.text}
        iconName={item.iconName}
        text={item.text}
        onPress={() => {
          this.props.navigation.navigate(item.screen);
        }}
      />
    );
  };

  _renderContent = () => {
    return (
      <View style={{ width: screenWidth }}>
        {this.data.map(this._renderItem)}
      </View>
    );
  };

  render() {
    const { navigation, settings, translations } = this.props;
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
        renderContent={this._renderContent}
        colorPrimary={settings.colorPrimary}
        textSearch={translations.search}
      />
    );
  }
}

const mapStateToProps = state => ({
  settings: state.settings,
  translations: state.translations
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingScreen);
