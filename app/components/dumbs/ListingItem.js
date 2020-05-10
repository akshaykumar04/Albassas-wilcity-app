import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ViewPropTypes,
} from "react-native";
import _ from "lodash";
import * as Consts from "../../constants/styleConstants";
import stylesBase from "../../stylesBase";
import Heading from "./Heading";
import {
  IconTextSmall,
  ImageCover,
  mapDistance,
  Image2,
} from "../../wiloke-elements";
import Rated from "./Rated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ITEM_WIDTH_HORIZONTAL = (SCREEN_WIDTH > 600 ? 600 : SCREEN_WIDTH) / 1.8;
const ITEM_WIDTH_VERTICAL = (SCREEN_WIDTH > 600 ? 600 : SCREEN_WIDTH) / 2 - 15;

export default class ListingItem extends PureComponent {
  static propTypes = {
    layout: PropTypes.oneOf(["vertical", "horizontal"]),
    image: PropTypes.string,
    logo: PropTypes.string,
    name: PropTypes.string,
    tagline: PropTypes.string,
    location: PropTypes.string,
    phone: PropTypes.string,
    reviewMode: PropTypes.number,
    reviewAverage: PropTypes.number,
    businessStatus: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.objectOf(PropTypes.string),
      PropTypes.string,
    ]),
    onPress: PropTypes.func,
    colorPrimary: PropTypes.string,
    containerStyle: ViewPropTypes.style,
    featureImageWidth: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    mapDistance: PropTypes.string,
    claimStatus: PropTypes.bool,
  };
  static defaultProps = {
    contentLoader: false,
    colorPrimary: Consts.colorPrimary,
    isFooterAutoDisable: true,
    mapDistance: "",
    claimStatus: false,
  };

  renderRated() {
    const { reviewMode, reviewAverage } = this.props;
    return (
      <Rated
        rate={reviewAverage}
        max={reviewMode}
        rateStyle={{ fontSize: 13, marginRight: 2 }}
        maxStyle={{ fontSize: 9 }}
      />
    );
  }

  renderVerified = () => {
    const { translations, colorPrimary } = this.props;
    return (
      <View
        style={[
          styles.claim,
          {
            backgroundColor: colorPrimary,
          },
        ]}
      >
        <View
          style={[
            styles.before,
            { borderTopColor: colorPrimary, borderBottomColor: colorPrimary },
          ]}
        />
        <Text style={styles.claimText}>{translations.verfied}</Text>
        <View style={[styles.after, { borderTopColor: colorPrimary }]} />
        <View style={[styles.after, { borderTopColor: "rgba(0,0,0,0.3)" }]} />
      </View>
    );
  };

  renderImage() {
    const { layout, image, featureImageWidth } = this.props;
    return (
      <Image2
        uri={image}
        preview={image}
        width={
          !!featureImageWidth
            ? featureImageWidth
            : layout === "horizontal"
            ? ITEM_WIDTH_HORIZONTAL
            : ITEM_WIDTH_VERTICAL
        }
        percentRatio="56.25%"
        containerStyle={{
          borderTopLeftRadius: Consts.round,
          borderTopRightRadius: Consts.round,
        }}
      />
    );
  }
  _renderBusinessText = (status) => {
    const { translations } = this.props;
    switch (status) {
      case true:
        return translations.open;
      case "day_off":
        return translations.dayOff;
      case "always_open":
        return translations.always_open;
      case "no_hours_available":
        return null;
      default:
        return translations.closed;
    }
  };

  renderFooter = () => {
    const { businessStatus, translations } = this.props;
    return (
      <View style={styles.footer}>
        {this.renderRated()}
        <Text
          style={{
            fontSize: 11,
            color:
              !businessStatus ||
              businessStatus === "day_off" ||
              businessStatus === "close"
                ? Consts.colorQuaternary
                : Consts.colorSecondary,
          }}
        >
          {this._renderBusinessText(businessStatus)}
        </Text>
      </View>
    );
  };

  renderVerified = () => {
    const { translations, colorPrimary } = this.props;
    return (
      <View
        style={[
          styles.claim,
          {
            backgroundColor: colorPrimary,
          },
        ]}
      >
        <View
          style={[
            styles.before,
            { borderTopColor: colorPrimary, borderBottomColor: colorPrimary },
          ]}
        />
        <Text style={styles.claimText}>{translations.verfied}</Text>
        <View style={[styles.after, { borderTopColor: colorPrimary }]} />
        <View style={[styles.after, { borderTopColor: "rgba(0,0,0,0.3)" }]} />
      </View>
    );
  };

  renderContent = () => {
    const {
      businessStatus,
      reviewAverage,
      isFooterAutoDisable,
      location,
      logo,
      onPress,
      title,
      tagline,
      colorPrimary,
      mapDistance,
      claimStatus,
    } = this.props;
    const footerCondition = !isFooterAutoDisable || !!reviewAverage;
    return (
      <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
        <View style={{ position: "relative" }}>
          <View style={styles.wrap}>
            {this.renderImage()}
            {!!mapDistance && (
              <View
                style={[
                  styles.mapDistance,
                  {
                    backgroundColor: Consts.colorSecondary,
                  },
                ]}
              >
                <Text style={styles.mapDistanceText}>{mapDistance}</Text>
              </View>
            )}
            <View style={styles.logoWrap}>
              <ImageCover
                src={logo}
                width={30}
                styles={styles.logo}
                borderRadius={15}
              />
              <Image
                source={require("../../../assets/wave.png")}
                style={styles.wave}
              />
            </View>
          </View>
          {claimStatus && this.renderVerified()}

          <View style={[stylesBase.pd10, styles.pd]}>
            <Heading
              title={title}
              text={tagline}
              titleSize={12}
              textSize={11}
              titleNumberOfLines={1}
              textNumberOfLines={1}
            />
            {!!location && (
              <View style={styles.textWrap}>
                <IconTextSmall
                  text={location}
                  iconName="map-pin"
                  numberOfLines={1}
                  iconColor={colorPrimary}
                />
              </View>
            )}
            {this.renderFooter()}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const { layout, containerStyle } = this.props;
    return (
      <View
        style={[
          styles.container,
          {
            width:
              layout === "horizontal"
                ? ITEM_WIDTH_HORIZONTAL
                : ITEM_WIDTH_VERTICAL,
          },
          containerStyle,
        ]}
      >
        {this.renderContent()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: Consts.round,
    margin: 5,
  },
  logoWrap: {
    position: "relative",
    zIndex: 9,
    marginTop: -15.5,
    marginLeft: 0,
    marginBottom: -5,
    width: 66,
  },
  wave: {
    width: 66,
    height: (66 * 131) / 317,
    position: "absolute",
    zIndex: -1,
    top: 0,
    left: 0,
  },
  logo: {
    marginLeft: 18,
    marginTop: 2,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // borderTopWidth: 1,
    // borderTopColor: Consts.colorGray2,
    marginTop: 8,
    marginBottom: -2,
    marginHorizontal: -10,
    paddingTop: 5,
    paddingHorizontal: 10,
  },
  textWrap: { marginRight: 10, marginTop: 2 },
  pd: { paddingTop: 10, paddingBottom: 10 },
  wrap: {
    position: "relative",
  },
  mapDistance: {
    position: "absolute",
    zIndex: 9,
    top: 6,
    left: 6,
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: Consts.round,
  },
  mapDistanceText: {
    color: "#fff",
    fontSize: 13,
  },
  claim: {
    position: "absolute",
    top: 10,
    right: -5,
    zIndex: 9999,
  },
  claimText: {
    position: "relative",
    color: "#fff",
    paddingVertical: 3,
    paddingHorizontal: 10,
    fontSize: 12,
  },
  after: {
    position: "absolute",
    height: 0,
    width: 0,
    bottom: -5,
    right: 0,
    borderTopWidth: 5,
    borderRightWidth: 5,
    borderRightColor: "transparent",
  },
  before: {
    position: "absolute",
    height: 0,
    width: 0,
    top: 0,
    left: -10,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderRightWidth: 10,
    borderRightColor: "transparent",
    borderLeftWidth: 10,
    borderLeftColor: "transparent",
  },
});
