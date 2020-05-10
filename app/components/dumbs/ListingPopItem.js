import React, { PureComponent } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet
} from "react-native";
import PropTypes from "prop-types";
import * as Consts from "../../constants/styleConstants";
import stylesBase from "../../stylesBase";
import Heading from "./Heading";
import { IconTextSmall, Image2 } from "../../wiloke-elements";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width / 1.3;

export default class ListingPopItem extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
    image: PropTypes.string,
    logo: PropTypes.string,
    name: PropTypes.string,
    tagline: PropTypes.string,
    location: PropTypes.string,
    colorPrimary: PropTypes.string,
    mapDistance: PropTypes.string
  };
  static defaultProps = {
    contentLoader: false,
    onPress: () => {},
    colorPrimary: Consts.colorPrimary,
    mapDistance: ""
  };
  renderLoader = () => <View style={styles.contentLoader} />;

  renderContent = () => (
    <TouchableOpacity activeOpacity={0.6} onPress={this.props.onPress}>
      <View style={styles.inner}>
        <View>
          <Image2
            uri={this.props.image}
            preview={this.props.image}
            width="100%"
            percentRatio="56.25%"
            containerStyle={{
              borderRadius: Consts.round
            }}
          />
        </View>
        {!!this.props.mapDistance && (
          <View
            style={[
              styles.mapDistance,
              {
                backgroundColor: Consts.colorSecondary
              }
            ]}
          >
            <Text style={styles.mapDistanceText}>{this.props.mapDistance}</Text>
          </View>
        )}
        <View style={[stylesBase.pd10, styles.content]}>
          <View style={styles.logoWrap}>
            <Image2
              uri={this.props.logo}
              width={30}
              height={30}
              containerStyle={{ borderRadius: 15 }}
            />
          </View>
          <Heading
            title={this.props.name}
            text={this.props.tagline}
            titleSize={13}
            textSize={11}
            titleNumberOfLines={1}
            textNumberOfLines={1}
          />
          <View style={{ marginRight: 20, marginTop: 2 }}>
            <IconTextSmall
              text={this.props.location}
              iconName="map-pin"
              textStyle={styles.metaText}
              numberOfLines={1}
              iconColor={this.props.colorPrimary}
            />
            {/* <View style={{ width: 10 }} />
            <IconTextSmall
              text={this.props.phone}
              iconName="phone"
              textStyle={styles.metaText}
            /> */}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
  render() {
    return (
      <View style={styles.container}>
        {!this.props.contentLoader ? this.renderContent() : this.renderLoader()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Consts.round,
    overflow: "hidden",
    width: ITEM_WIDTH,
    maxWidth: Consts.screenWidth / 1.8
  },
  inner: {
    position: "relative",
    zIndex: 9,
    paddingBottom: 60
  },
  logoWrap: {
    marginBottom: 8
  },
  content: {
    position: "absolute",
    left: 10,
    right: 10,
    bottom: 0,
    zIndex: 1,
    backgroundColor: "#fff",
    borderRadius: Consts.round
  },
  // metaText: {
  //   color: Consts.colorGray1
  // },
  contentLoader: {
    backgroundColor: Consts.colorGray1,
    borderRadius: Consts.round,
    width: ITEM_WIDTH,
    maxWidth: Consts.screenWidth / 1.8,
    height: ITEM_WIDTH * (56.25 / 100)
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
  }
});
