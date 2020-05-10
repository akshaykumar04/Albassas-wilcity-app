import React from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewPropTypes
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Consts from "../../../constants/styleConstants";
import stylesBase from "../../../stylesBase";
import FontIcon from "../molecules/FontIcon";
import { RTL } from "../../functions/wilokeFunc";

const ListItemTouchable = props => {
  const rtl = RTL();
  return (
    <View style={[styles.container, props.style]}>
      <TouchableOpacity activeOpacity={0.5} onPress={props.onPress}>
        <View style={styles.inner}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={[
                styles.iconWrapper,
                {
                  width: props.iconSize,
                  height: props.iconSize,
                  borderRadius: props.iconSize / 2,
                  backgroundColor: props.iconBackgroundColor
                }
              ]}
            >
              <FontIcon
                name={props.iconName}
                size={props.iconSize * (18 / 36)}
                color={props.iconColor}
              />
            </View>
            <View style={{ width: 10 }} />
            <Text style={[stylesBase.text, styles.text]}>{props.text}</Text>
          </View>
          <Feather
            style={styles.icon}
            name={!rtl ? "chevron-right" : "chevron-left"}
            size={22}
            color={Consts.colorDark4}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};
ListItemTouchable.propTypes = {
  text: PropTypes.string,
  iconName: PropTypes.string,
  iconBackgroundColor: PropTypes.string,
  iconColor: PropTypes.string,
  iconSize: PropTypes.number,
  onPress: PropTypes.func,
  style: ViewPropTypes.style
};
ListItemTouchable.defaultProps = {
  iconName: "check",
  iconSize: 36,
  iconColor: Consts.colorDark2,
  iconBackgroundColor: Consts.colorGray2
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: Consts.colorGray1,
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 10
  },
  inner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  text: {
    color: Consts.colorDark2,
    fontSize: 14
  },
  iconWrapper: {
    justifyContent: "center",
    alignItems: "center"
  }
});

export default ListItemTouchable;
