import React from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet } from "react-native";
import { isEmpty } from "../../wiloke-elements";
import * as Consts from "../../constants/styleConstants";

const _getCurrentDayColor = (item, oCurrent) => {
  if (item.is !== oCurrent.is) return Consts.colorDark2;
  return oCurrent.status === "closed" ||
    oCurrent.status === "close" ||
    oCurrent.status === "day_off"
    ? Consts.colorQuaternary
    : Consts.colorSecondary;
};

const Item = oCurrent => (item, index) => (
  <View
    key={index.toString()}
    style={[styles.spaceBetween, { paddingVertical: 8 }]}
  >
    <View style={styles.left}>
      <Text
        style={[styles.text, { color: _getCurrentDayColor(item, oCurrent) }]}
      >
        {item.is}
      </Text>
    </View>
    {item.status === "day_off" ? (
      <View style={styles.spaceBetween}>
        <Text
          style={[styles.text, { color: _getCurrentDayColor(item, oCurrent) }]}
        >
          {item.text}
        </Text>
      </View>
    ) : (
      <View style={styles.spaceBetween}>
        {item.firstOpenHour &&
          item.firstCloseHour && (
            <Text
              style={[
                styles.text,
                { color: _getCurrentDayColor(item, oCurrent) }
              ]}
            >
              {item.firstOpenHour} - {item.firstCloseHour}
            </Text>
          )}

        {item.firstOpenHour &&
          item.firstCloseHour &&
          item.secondOpenHour &&
          item.secondCloseHour && <View style={{ width: 15 }} />}

        {item.secondOpenHour &&
          item.secondCloseHour && (
            <Text
              style={[
                styles.text,
                { color: _getCurrentDayColor(item, oCurrent) }
              ]}
            >
              {item.secondOpenHour} - {item.secondCloseHour}
            </Text>
          )}
      </View>
    )}
  </View>
);

const AlwayOpenItem = props => (
  <View
    style={{
      padding: 10,
      backgroundColor: Consts.colorSecondary,
      flexDirection: "column",
      alignItems: "center",
      borderRadius: Consts.round
    }}
  >
    <Text
      style={{
        color: "#fff",
        fontSize: 13
      }}
    >
      {props.alwaysOpenText}
    </Text>
  </View>
);

const ListingHours = props => {
  const { data, alwaysOpenText } = props;
  const { mode } = data;
  switch (mode) {
    case "rest":
      const { oDetails } = data;
      const { oCurrent } = oDetails;
      const { oAllBusinessHours } = oDetails;
      return (
        <View>
          {oAllBusinessHours &&
            !isEmpty(oAllBusinessHours) &&
            oAllBusinessHours.map(Item(oCurrent))}
        </View>
      );
    case "always_open":
      return <AlwayOpenItem alwaysOpenText={alwaysOpenText} />;
    default:
      return false;
  }
};

ListingHours.propTypes = {
  currentDay: PropTypes.object,
  data: PropTypes.object
};

const styles = StyleSheet.create({
  spaceBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  text: {
    color: Consts.colorDark2,
    fontSize: 11
  }
});

export default ListingHours;
