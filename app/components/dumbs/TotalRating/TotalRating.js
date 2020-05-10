import React, { PureComponent } from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import PropTypes from "prop-types";
import * as Progress from "react-native-progress";
import { Rating, RTL } from "../../../wiloke-elements";
import { colorGray1, colorPrimary } from "../../../constants/styleConstants";

export default class TotalRating extends PureComponent {
  static propTypes = {
    avarageRating: PropTypes.number,
    ratingText: PropTypes.string,
    data: PropTypes.array,
    ratingCount: PropTypes.number
  };

  _getColor = star => {
    switch (star) {
      case 1:
        return "#0c8e29";
      case 4:
        return "#f9880e";
      case 5:
        return "#ce1e1e";
      default:
        return "#f1c40f";
    }
  };

  _renderItem = ({ item, index }) => {
    const { ratingCount } = this.props;
    const progress = (item.value / ratingCount).toFixed(1);
    return (
      <View style={styles.item}>
        <Rating
          startingValue={Number(item.numberRating)}
          fractions={2}
          ratingCount={5}
          showRating={false}
          readonly={true}
          imageSize={13}
        />
        <View style={{ paddingHorizontal: 5 }}>
          <Progress.Bar
            progress={Number(progress)}
            width={100}
            borderRadius={0}
            color={this._getColor(Number(item.numberRating))}
            borderColor={colorGray1}
          />
        </View>

        <Text style={styles.ratingcount}>{item.value}</Text>
      </View>
    );
  };

  _keyExtractor = (item, index) => index.toString();
  _renderListRating = () => {
    const { data } = this.props;
    return (
      <FlatList
        data={data}
        renderItem={this._renderItem}
        keyExtractor={this._keyExtractor}
      />
    );
  };

  render() {
    const { avarageRating, ratingText, ratingCount } = this.props;
    const rtl = RTL();
    return (
      <View style={styles.container}>
        <View style={styles.avarageView}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={styles.ratingText}>{ratingText}</Text>
            <Text style={styles.text}>{rtl ? "5/" : "/5"}</Text>
          </View>
          <View>
            <Rating
              startingValue={avarageRating}
              fractions={2}
              ratingCount={5}
              showRating={false}
              readonly={true}
              imageSize={20}
            />
            <Text style={styles.ratingcount}>
              ({ratingCount} luợt đánh giá)
            </Text>
          </View>
        </View>
        {this._renderListRating()}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colorGray1,
    flexDirection: "row",
    alignItems: "center"
  },
  avarageView: {
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderRightColor: colorGray1
  },
  ratingText: {
    color: "#333",
    fontSize: 18,
    fontWeight: "bold"
  },
  text: {
    color: colorPrimary,
    fontSize: 12,
    fontWeight: "bold",
    paddingTop: 10
  },
  ratingcount: {
    color: "#9b8f8f",
    fontSize: 13,
    fontStyle: "italic",
    paddingHorizontal: 5,
    textAlign: "center"
  },
  item: {
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  }
});
