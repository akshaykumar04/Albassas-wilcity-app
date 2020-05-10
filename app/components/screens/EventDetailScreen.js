import React, { Component } from "react";
import { TouchableOpacity, View, Text, StyleSheet, Alert } from "react-native";
import * as Consts from "../../constants/styleConstants";
import { ParallaxScreen, ActionSheet } from "../../wiloke-elements";
import { Feather } from "@expo/vector-icons";
import { EventDetailContainer, EventDiscussionContainer } from "../smarts";
import { Heading } from "../dumbs";
import { connect } from "react-redux";

class EventDetailScreen extends Component {
  state = {
    isToggleDiscussion: false
  };

  _handleAccountScreen = () => {
    const { translations, navigation } = this.props;
    Alert.alert(translations.login, translations.requiredLogin, [
      {
        text: translations.cancel,
        style: "cancel"
      },
      {
        text: translations.continue,
        onPress: () => navigation.navigate("AccountScreen")
      }
    ]);
  };

  _handleDiscussion = async buttonIndex => {
    if (buttonIndex === 1) {
      await this.setState({
        isToggleDiscussion: true
      });
      this.setState({
        isToggleDiscussion: false
      });
    }
  };

  renderHeaderLeft = () => {
    const { navigation } = this.props;
    return (
      <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.goBack()}>
        <View style={styles.back}>
          <Feather name="chevron-left" size={26} color="#fff" />
        </View>
      </TouchableOpacity>
    );
  };

  renderHeaderCenter = () => {
    const { navigation } = this.props;
    const { params } = navigation.state;
    return (
      <Text style={{ color: "#fff" }} numberOfLines={1}>
        {params.name}
      </Text>
    );
  };

  renderHeaderRight = () => {
    const { translations, auth } = this.props;
    const { isLoggedIn } = auth;
    return (
      <ActionSheet
        options={[translations.cancel, translations.discussion]}
        // destructiveButtonIndex={1}
        cancelButtonIndex={0}
        renderButtonItem={() => (
          <View style={styles.more}>
            <Feather name="more-horizontal" size={24} color="#fff" />
          </View>
        )}
        onAction={
          isLoggedIn ? this._handleDiscussion : this._handleAccountScreen
        }
      />
    );
  };

  render() {
    const { navigation, settings } = this.props;
    const { params } = navigation.state;
    const { isToggleDiscussion } = this.state;
    console.log({ isToggleDiscussion });
    return (
      <ParallaxScreen
        headerImageSource={params.image}
        overlayRange={[0, 0.9]}
        overlayColor={settings.colorPrimary}
        renderHeaderLeft={this.renderHeaderLeft}
        renderHeaderCenter={this.renderHeaderCenter}
        renderHeaderRight={this.renderHeaderRight}
        renderContent={() => (
          <View style={{ padding: 10 }}>
            <Heading title={params.name} titleSize={18} textSize={12} />

            <View style={styles.meta}>
              <Text style={styles.textSmall}>{params.hosted}</Text>
              <View style={{ paddingHorizontal: 5 }}>
                <Text style={styles.textSmall}>.</Text>
              </View>
              <Text style={styles.textSmall}>{params.interested}</Text>
            </View>
            <View style={styles.space} />
            <View style={styles.wrap}>
              <EventDetailContainer navigation={navigation} />
              <View style={{ maxWidth: Consts.screenWidth }}>
                <EventDiscussionContainer
                  id={params.id}
                  type="latest"
                  navigation={navigation}
                  isToggleDiscussion={isToggleDiscussion}
                />
              </View>
            </View>
          </View>
        )}
      />
    );
  }
}

const styles = StyleSheet.create({
  textSmall: {
    fontSize: 11,
    color: Consts.colorDark3
  },
  more: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center"
  },
  back: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center"
  },
  wrap: {
    marginHorizontal: -10,
    paddingHorizontal: 10,
    backgroundColor: Consts.colorGray2,
    alignItems: "center"
  },
  meta: {
    flexDirection: "row",
    marginTop: 10
  },
  space: {
    height: 10
  }
});

const mapStateToProps = ({ settings, translations, auth }) => ({
  settings,
  translations,
  auth
});

export default connect(mapStateToProps)(EventDetailScreen);
