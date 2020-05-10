import React, { PureComponent } from "react";
import { Text, View, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { connect } from "react-redux";
import { Layout } from "../dumbs";
import { Feather } from "@expo/vector-icons";
import _ from "lodash";
import {
  ListItemTouchable,
  Switch,
  P,
  Loader,
  isEmpty
} from "../../wiloke-elements";
import {
  colorDark4,
  colorGray2,
  colorDark3,
  colorDark1,
  screenWidth
} from "../../constants/styleConstants";
import {
  setNotificationSettings,
  getNotificationSettings
} from "../../actions";

class NotificationSettingScreen extends PureComponent {
  state = {
    data: [],
    dataObj: {},
    isLoading: true
  };

  async componentDidMount() {
    const { shortProfile, notificationAdminSettings } = this.props;
    const myID = shortProfile.userID;
    await this.props.getNotificationSettings(myID);
    this.setState({
      isLoading: false
    });
    const { notificationSettings } = this.props;
    const data = Object.keys(notificationSettings).map(key => ({
      key,
      id: notificationAdminSettings[key].id,
      label: notificationAdminSettings[key].title,
      description: notificationAdminSettings[key].desc,
      checked: notificationSettings[key],
      visible: key === "toggleAll" ? true : notificationSettings.toggleAll
    }));
    this.setState({ data, dataObj: notificationSettings });
  }

  _handleNotificationToggle = key => async (name, isChecked) => {
    const { shortProfile } = this.props;
    const myID = shortProfile.userID;
    await this.setState(prevState => ({
      dataObj: {
        ...prevState.dataObj,
        [key]: isChecked
      },
      data: prevState.data.map(item => {
        return {
          ...item,
          checked: item.key === key ? isChecked : item.checked,
          visible:
            item.key === key ? true : key === "toggleAll" ? isChecked : true
        };
      })
    }));
    const { dataObj } = this.state;
    this.props.setNotificationSettings(myID, dataObj);
  };

  _renderItem = item => {
    const { settings } = this.props;
    return (
      item.visible && (
        <View key={item.key}>
          <View style={styles.switchWrap}>
            <Switch
              checked={item.checked}
              name={item.label}
              size={24}
              swipeActiveColor={settings.colorPrimary}
              circleAnimatedColor={[colorDark4, settings.colorPrimary]}
              colorActive={settings.colorPrimary}
              label={item.label}
              onPress={this._handleNotificationToggle(item.key)}
            />
          </View>
          <View style={styles.destWrap}>
            <P style={styles.desc}>{item.description}</P>
          </View>
        </View>
      )
    );
  };

  _renderContent = () => {
    const { data, isLoading } = this.state;
    const { notificationSettings } = this.props;
    if (isLoading) return <Loader size="small" />;
    if (_.isEmpty(notificationSettings)) {
      return (
        <View style={styles.alert}>
          <Text style={{ textAlign: "center" }}>
            Incorrect Notification Settings. To resolve this issue, go to
            documentation.wilcity.com -> Search for Notification and follow it
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.content}>
        {data.sort((a, b) => a.id - b.id).map(this._renderItem)}
      </View>
    );
  };

  render() {
    const { navigation, settings, translations } = this.props;
    return (
      <Layout
        navigation={navigation}
        headerType="headerHasBack"
        title={`${translations.notifications} ${translations.settings}`}
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
        scrollViewStyle={styles.scrollView}
      />
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: colorGray2
  },
  alert: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 50,
    marginHorizontal: 10
  },
  content: {
    paddingBottom: 20,
    width: screenWidth
  },
  switchWrap: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginVertical: 15
  },
  destWrap: {
    paddingHorizontal: 10,
    marginTop: -10
  },
  desc: {
    fontSize: 12,
    color: colorDark3
  },
  switchLabel: {
    color: colorDark1
  }
});

const mapStateToProps = state => ({
  settings: state.settings,
  translations: state.translations,
  notificationSettings: state.notificationSettings,
  notificationAdminSettings: state.notificationAdminSettings,
  shortProfile: state.shortProfile
});

const mapDispatchToProps = {
  setNotificationSettings,
  getNotificationSettings
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationSettingScreen);
