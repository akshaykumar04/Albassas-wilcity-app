import React, { Component } from "react";
import { View, Text, Dimensions, TextInput, StyleSheet } from "react-native";
import * as Consts from "../../constants/styleConstants";
import { Layout } from "../dumbs";
import { ImageCircleAndText } from "../../wiloke-elements";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default class Account extends Component {
  renderContent = () => {
    return (
      <View style={{ padding: 10 }}>
        <ImageCircleAndText
          image="https://trip.wilcity.com/wp-content/uploads/2018/06/Madrid_2-280x200.jpg"
          title="Nguyen Long"
          text="Designer"
          imageSize={80}
        />
      </View>
    );
  };
  render() {
    const { navigation } = this.props;
    return (
      <Layout navigation={navigation} renderContent={this.renderContent} />
    );
  }
}

const styles = StyleSheet.create({});
