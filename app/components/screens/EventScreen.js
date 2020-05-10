import React, { Component } from "react";
import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Consts from "../../constants/styleConstants";
import {
  EventsContainer,
  LocationModalPickerContainer,
  NearbyContainer
} from "../smarts";
import { Layout } from "../dumbs";
import { connect } from "react-redux";
import _ from "lodash";

class EventScreen extends Component {
  _getEventSuccess = events => {
    return !_.isEmpty(events) && events.status === "success";
  };

  render() {
    const { navigation, settings, events } = this.props;
    const { state } = navigation;
    const nextRoute = navigation.dangerouslyGetParent().state;
    const postType = state.params ? state.params.key : nextRoute.key;
    const { oAdmob } = events;
    const condition = this._getEventSuccess(events);
    return (
      <Layout
        navigation={navigation}
        headerType="headerHasFilter"
        renderLeft={() => <NearbyContainer postType={postType} />}
        renderCenter={() => (
          <LocationModalPickerContainer postType={postType} />
        )}
        renderRight={() => (
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.navigate("SearchScreen")}
            style={{ width: 25, alignItems: "flex-end" }}
          >
            <Feather name="search" size={20} color="#fff" />
          </TouchableOpacity>
        )}
        renderContent={() => <EventsContainer navigation={navigation} />}
        scrollViewEnabled={false}
        scrollViewStyle={{
          backgroundColor: Consts.colorGray2
        }}
        colorPrimary={settings.colorPrimary}
        containerFixed={false}
        adMob={condition && oAdmob}
      />
    );
  }
}

const mapStateToProps = ({ settings, events }) => ({
  settings,
  events
});
export default connect(mapStateToProps)(EventScreen);
