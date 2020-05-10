import React, { PureComponent } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList
} from "react-native";
import PropTypes from "prop-types";
import Carousel, { Pagination } from "react-native-snap-carousel";
import * as Consts from "../../../constants/styleConstants";
import ListingProductClassic from "../ListingProduct/ListingProductClassic";
import Heading from "../Heading";
import { wp } from "../../../wiloke-elements";

const itemHorizontalMargin = wp(2);
const slideWidth = wp(90);
const sliderWidth = Consts.screenWidth;
const itemWidth = slideWidth + itemHorizontalMargin * 2;

export default class ProductCarousel extends PureComponent {
  static propTypes = {
    data: PropTypes.array
  };

  _renderItem = ({ item, index }) => {
    const { navigation, colorPrimary, admob } = this.props;
    return (
      <ListingProductClassic
        data={item}
        navigation={navigation}
        colorPrimary={colorPrimary}
        admob={admob}
      />
    );
  };

  _renderHeader = () => {
    const { setting } = this.props;
    return (
      <View style={[styles.row]}>
        <Heading title={setting.heading} />
        {/* <TouchableOpacity style={styles.buttonMore}>
          <Text style={styles.txtbtn}>More</Text>
        </TouchableOpacity> */}
      </View>
    );
  };

  render() {
    const { data } = this.props;
    return (
      <View style={{ padding: 5 }}>
        {this._renderHeader()}
        <Carousel
          data={data}
          renderItem={this._renderItem}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          inactiveSlideScale={1}
          inactiveSlideOpacity={1}
          swipeThreshold={0}
          // useScrollView={true}
          activeSlideAlignment={"start"}
          containerCustomStyle={styles.slider}
          contentContainerCustomStyle={styles.sliderContentContainer}
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
  container: {},
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
    color: Consts.colorPrimary,
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
