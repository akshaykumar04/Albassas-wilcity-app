import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  Clipboard
} from "react-native";
import { Print } from "expo";
import PropTypes from "prop-types";
import { ImageCover, FontIcon, Toast } from "../../../wiloke-elements";
import * as Consts from "../../../constants/styleConstants";
import ButtonSocial from "../ButtonSocial/ButtonSocial";
import CountDown from "../CountDown/CountDown";

export default class ListingCoupon extends PureComponent {
  _handleShare = async () => {
    const { data } = this.props;
    try {
      const result = await Share.share({
        message: data.code
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log(result);
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  _handleClipBoard = () => {
    const { data, translations } = this.props;
    Clipboard.setString(data.code);
    this._toast.show(translations.copied, {
      delay: 3000
    });
  };

  _handlePrint = async () => {
    const { data } = this.props;
    await Print.printAsync({
      html: `<div><image src="${data.popup_image}"/><h1>${data.title}</h1><h2>${data.highlight}</h2><h2>${data.code}</h2> <h3>${data.expiry_date}</h3></div>`
    });
  };

  _renderContent = () => {
    const { data, translations, colorPrimary } = this.props;
    const image = !data.popup_image ? "" : data.popup_image;
    console.log(data.expiry_date);
    return (
      <View style={styles.content}>
        <View style={styles.image}>
          <ImageCover src={image} width="100%" />
        </View>
        <View style={styles.text}>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={styles.title}>{data.title}</Text>
            <Text style={[styles.highlight, { color: colorPrimary }]}>
              {data.highlight}
            </Text>
          </View>
          <View style={[styles.box, { borderColor: colorPrimary }]}>
            <Text style={[styles.code, { color: colorPrimary }]}>
              {data.code}
            </Text>
          </View>
          {!!data.expiry_date && (
            <Text style={[styles.expire, { color: colorPrimary }]}>
              {typeof data.expiry_date === "number"
                ? translations.couponEndsIn
                : translations.expiryDate}{" "}
              <CountDown
                time={
                  typeof data.expiry_date === "number"
                    ? data.expiry_date * 1000
                    : data.expiry_date
                }
              />
            </Text>
          )}
        </View>
      </View>
    );
  };

  _renderFooter = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 5
        }}
      >
        <ButtonSocial
          nameIcon="fa-print"
          backgroundColor="#3DBDFF"
          onPress={this._handlePrint}
          borderRadius={50}
        />
        <ButtonSocial
          nameIcon="fa-share-alt"
          backgroundColor="#FF736E"
          onPress={this._handleShare}
          borderRadius={50}
        />
        <ButtonSocial
          nameIcon="fa-copy"
          backgroundColor="#FFB13D"
          onPress={this._handleClipBoard}
          borderRadius={50}
        />
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        {this._renderContent()}
        {this._renderFooter()}
        <Toast ref={ref => (this._toast = ref)} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff"
  },
  content: {
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: Consts.colorGray1
  },
  image: {
    width: 120
  },
  text: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    fontSize: 24,
    color: "#333",
    fontWeight: "bold",
    textAlign: "center"
  },
  highlight: {
    fontSize: 13,
    paddingVertical: 7,
    fontWeight: "bold",
    paddingHorizontal: 10,
    textAlign: "center",
    flexWrap: "wrap"
  },
  description: {
    color: "#333"
  },
  box: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderStyle: "dashed",
    marginVertical: 5
  },
  code: {
    paddingHorizontal: 17,
    paddingVertical: 5,
    textAlign: "center",
    fontWeight: "bold"
  },
  expire: {
    paddingVertical: 10,
    fontWeight: "bold"
  }
});
