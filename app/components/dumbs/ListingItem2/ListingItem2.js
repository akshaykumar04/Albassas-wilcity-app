import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewPropTypes
} from "react-native";
import PropTypes from "prop-types";
import {
  round,
  screenWidth,
  colorQuaternary,
  colorSecondary,
  colorGray2,
  colorTertiary
} from "../../../constants/styleConstants";
import { Image2, IconTextSmall } from "../../../wiloke-elements";
import stylesBase from "../../../stylesBase";
import Heading from "../Heading";
import Rated from "../Rated";

const ITEM_WIDTH_VERTICAL = (screenWidth > 600 ? 600 : screenWidth) / 2 - 15;

export default class ListingItem2 extends PureComponent {
  static propTypes = {
    image: PropTypes.string,
    logo: PropTypes.string,
    name: PropTypes.string,
    tagline: PropTypes.string,
    location: PropTypes.string,
    phone: PropTypes.string,
    author: PropTypes.string,
    reviewMode: PropTypes.number,
    reviewAverage: PropTypes.number,
    businessStatus: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.objectOf(PropTypes.string),
      PropTypes.string
    ]),
    onPress: PropTypes.func,
    colorPrimary: PropTypes.string,
    containerStyle: ViewPropTypes.style,
    mapDistance: PropTypes.string,
    claimStatus: PropTypes.bool
  };

  _renderBusinessText = status => {
    const { translations } = this.props;
    switch (status) {
      case true:
        return translations.open;
      case "day_off":
        return translations.dayOff;
      default:
        return translations.closed;
    }
  };

  renderRated() {
    const { reviewMode, reviewAverage } = this.props;
    return (
      <Rated
        rate={reviewAverage}
        max={reviewMode}
        rateStyle={{ fontSize: 15, marginRight: 2 }}
        maxStyle={{ fontSize: 10 }}
      />
    );
  }

  renderFooter = () => {
    const { businessStatus, translations } = this.props;
    return (
      <View style={styles.footer}>
        {this.renderRated()}
        <Text
          style={{
            fontSize: 15,
            color:
              !businessStatus || businessStatus === "day_off"
                ? colorQuaternary
                : colorSecondary
          }}
        >
          {this._renderBusinessText(businessStatus)}
        </Text>
      </View>
    );
  };

  renderFeatureImage = () => {
    const { image, logo } = this.props;
    return (
      <View style={styles.wrap}>
        <Image2
          uri={image}
          preview={image}
          width="100%"
          percentRatio="56.25%"
          containerStyle={{
            borderTopLeftRadius: round,
            borderTopRightRadius: round
          }}
        />
        <View style={styles.logoWrap}>
          <Image2
            uri={logo}
            percentRatio="100%"
            width={50}
            borderRadius={100}
          />
        </View>
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
            backgroundColor: colorPrimary
          }
        ]}
      >
        <View
          style={[
            styles.before,
            { borderTopColor: colorPrimary, borderBottomColor: colorPrimary }
          ]}
        />
        <Text style={styles.claimText}>{translations.verfied}</Text>
      </View>
    );
  };

  render() {
    const {
      title,
      tagline,
      location,
      colorPrimary,
      businessStatus,
      reviewAverage,
      author,
      claimStatus
    } = this.props;
    const footerCondition = !!businessStatus || !!reviewAverage;
    return (
      <View style={styles.container}>
        {this.renderFeatureImage()}
        {claimStatus && this.renderVerified()}
        <View style={[stylesBase.pd10, styles.pd]}>
          <Text style={[stylesBase.text, styles.tagline]} numberOfLines={2}>
            {tagline}
          </Text>
          <Text style={[stylesBase.h3, styles.title]} numberOfLines={2}>
            {title}
          </Text>
        </View>
        {!!location && (
          <View style={styles.textWrap}>
            <IconTextSmall
              text={location}
              iconName="map-pin"
              numberOfLines={1}
              iconColor={colorPrimary}
              iconSize={18}
              textSize={12}
              textColor={"#222"}
            />
          </View>
        )}
        {!!author && (
          <View style={styles.textWrap}>
            <IconTextSmall
              text={author}
              iconName="users"
              numberOfLines={1}
              iconColor={colorTertiary}
              iconSize={18}
              textSize={12}
              textColor={"#222"}
            />
          </View>
        )}
        {footerCondition && this.renderFooter()}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: round,
    margin: 5,
    width: screenWidth - 20
  },
  wrap: {
    position: "relative"
  },
  logoWrap: {
    position: "absolute",
    zIndex: 9,
    top: "100%",
    right: 10,
    marginTop: -25
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colorGray2,
    paddingVertical: 10,
    paddingHorizontal: 10
  },
  pd: { paddingVertical: 10, maxWidth: "80%" },
  tagline: {
    fontWeight: "bold",
    fontSize: 12,
    paddingBottom: 7
  },
  title: {
    fontWeight: "bold"
  },
  textWrap: { paddingHorizontal: 10, paddingBottom: 5, maxWidth: "80%" },
  claim: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 9999,
    borderRadius: round
  },
  claimText: {
    position: "relative",
    color: "#fff",
    paddingVertical: 7,
    paddingHorizontal: 15,
    fontSize: 15
  }
});
