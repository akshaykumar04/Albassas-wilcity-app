import React, { memo } from "react";
import PropTypes from "prop-types";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ViewPropTypes
} from "react-native";
import * as Consts from "../../constants/styleConstants";
import stylesBase from "../../stylesBase";
import { Image2 } from "../../wiloke-elements";
import Heading from "./Heading";

const EventItem = props => (
  <TouchableOpacity
    activeOpacity={0.6}
    onPress={props.onPress}
    style={[styles.container, props.style]}
  >
    <Image2
      uri={props.image}
      preview={props.image}
      width="100%"
      percentRatio="56.25%"
      containerStyle={styles.image}
    />
    {!!props.mapDistance && (
      <View
        style={[
          styles.mapDistance,
          {
            backgroundColor: Consts.colorSecondary
          }
        ]}
      >
        <Text style={styles.mapDistanceText}>{props.mapDistance}</Text>
      </View>
    )}
    <View style={[{ padding: 8 }, props.bodyStyle]}>
      <Heading
        title={props.name}
        text={props.date}
        titleSize={12}
        textSize={11}
        titleNumberOfLines={1}
        textNumberOfLines={1}
      />
      {!!props.address && (
        <Text
          style={{ fontSize: 10, color: Consts.colorDark3, textAlign: "left" }}
          numberOfLines={1}
        >
          {props.address}
        </Text>
      )}
      <View style={{ height: 4 }} />
      <Text
        style={{ fontSize: 10, color: Consts.colorDark3, textAlign: "left" }}
        numberOfLines={1}
      >
        {props.interested}
      </Text>
    </View>
    <View style={[styles.footer, props.footerStyle]}>
      <Text
        style={{ fontSize: 11, color: Consts.colorDark3, textAlign: "left" }}
      >
        {props.hosted}
      </Text>
    </View>
  </TouchableOpacity>
);

EventItem.propTypes = {
  image: PropTypes.string,
  name: PropTypes.string,
  date: PropTypes.string,
  address: PropTypes.string,
  hosted: PropTypes.string,
  interested: PropTypes.string,
  onPress: PropTypes.func,
  bodyStyle: ViewPropTypes.style,
  style: ViewPropTypes.style,
  footerStyle: ViewPropTypes.style
};

EventItem.defaultProps = {
  onPress: _ => {}
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    borderRadius: Consts.round,
    backgroundColor: "#fff",
    overflow: "hidden"
  },
  footer: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: Consts.colorGray2,
    flexDirection: "row",
    justifyContent: "space-between"
  },

  mapDistance: {
    position: "absolute",
    zIndex: 9,
    top: 6,
    right: 6,
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: Consts.round
  },
  mapDistanceText: {
    color: "#fff",
    fontSize: 13
  },
  image: {
    borderTopLeftRadius: Consts.round,
    borderTopRightRadius: Consts.round
  }
});

export default memo(EventItem);
