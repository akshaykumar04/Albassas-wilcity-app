import React, { PureComponent } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Platform
} from "react-native";
import PropTypes from "prop-types";
import Carousel, { Pagination } from "react-native-snap-carousel";
import * as Consts from "../../../constants/styleConstants";
import ListingCarouselItem from "./ListingCarouselItem";
import Heading from "../Heading";
import { wp, RTL } from "../../../wiloke-elements";

const itemHorizontalMargin = wp(2);
const slideWidth = wp(90);
const sliderWidth = Consts.screenWidth;
const itemWidth = slideWidth + itemHorizontalMargin * 2;

export default class ListingCarousel extends PureComponent {
  static propTypes = {
    data: PropTypes.array
  };

  _handleMore = () => {
    const { navigation, viewMore } = this.props;
    navigation.navigate("ListingSearchResultScreen", viewMore.params);
  };

  _renderItem = ({ item, index }) => {
    const { navigation, colorPrimary, admob } = this.props;
    return (
      <ListingCarouselItem
        data={item}
        navigation={navigation}
        colorPrimary={colorPrimary}
        admob={admob}
      />
    );
  };

  _renderHeader = () => {
    const { setting, viewMore, colorPrimary } = this.props;
    return (
      <View style={[styles.row]}>
        <Heading title={setting.heading} />
        <TouchableOpacity
          activeOpacity={1}
          style={styles.buttonMore}
          onPress={this._handleMore}
        >
          <Text style={[styles.txtbtn, { color: colorPrimary }]}>
            {viewMore.btnName}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  render() {
    const { data } = this.props;
    return (
      <View style={{ padding: 5 }}>
        {this._renderHeader()}
        <Carousel
          data={RTL() ? data.reverse() : data}
          firstItem={RTL() ? data.length - 1 : data.length}
          renderItem={this._renderItem}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          inactiveSlideScale={1}
          inactiveSlideOpacity={1}
          snapToEnd={true}
          activeSlideAlignment={"start"}
          swipeThreshold={0}
          // useScrollView={true}
          containerCustomStyle={styles.slider}
          // style={{ marginLeft: -10 }}
          activeAnimationType={"spring"}
          activeAnimationOptions={{
            friction: 4,
            tension: 40
          }}
          scrollEnabled={data.length > 1}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 5
  },
  buttonMore: {
    paddingHorizontal: 7,
    justifyContent: "center",
    alignItems: "center"
  },
  txtbtn: {
    fontWeight: "400",
    fontSize: 15
  }
  // slider: {
  //   marginTop: 15,
  //   overflow: "visible" // for custom animations
  // },
  // sliderContentContainer: {
  //   paddingVertical: 10 // for custom animation
  // }
});
