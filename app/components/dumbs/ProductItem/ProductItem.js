import React, { PureComponent } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from "react-native";
import PropTypes from "prop-types";
import { HtmlViewer, Rating, Image2 } from "../../../wiloke-elements";
import * as Consts from "../../../constants/styleConstants";
import GradeView from "../GradeView/GradeView";
import TextDecode from "../TextDecode/TextDecode";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ITEM_WIDTH_HORIZONTAL = (SCREEN_WIDTH > 600 ? 600 : SCREEN_WIDTH) / 1.8;
const ITEM_WIDTH_VERTICAL = (SCREEN_WIDTH > 600 ? 600 : SCREEN_WIDTH) / 2 - 15;

export default class ProductItem extends PureComponent {
  static propTypes = {
    productName: PropTypes.string,
    priceHTML: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    salePrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    featureImage: PropTypes.string,
    containerStyle: PropTypes.object,
    onPress: PropTypes.func,
    salePriceHTML: PropTypes.string,
    rating: PropTypes.number,
    colorPrimary: PropTypes.string
  };

  _renderFooter = () => {
    const { category, rating } = this.props;
    return (
      <View style={styles.row}>
        <Rating
          startingValue={rating}
          fractions={2}
          ratingCount={5}
          showRating={false}
          readonly={true}
          imageSize={10}
          style={{ padding: 5 }}
        />
        <Text style={styles.category}>{category}</Text>
      </View>
    );
  };

  _renderGradeView = () => {
    const { discount, colorPrimary } = this.props;
    return (
      <View style={styles.gradeView}>
        <GradeView
          containerStyle={{ borderRadius: 3 }}
          RATED_SIZE={25}
          textStyle={{ fontSize: 10 }}
          gradeText={discount}
          colorPrimary={colorPrimary}
        />
      </View>
    );
  };

  render() {
    const {
      containerStyle,
      featureImage,
      productName,
      priceHTML,
      salePrice,
      onPress,
      salePriceHTML,
      rating,
      colorPrimary,
      layout
    } = this.props;
    const preview = {
      uri: featureImage
    };
    const uri = featureImage;
    return (
      <TouchableOpacity
        style={[
          styles.container,
          containerStyle,
          {
            width: layout === "slider" ? ITEM_WIDTH_HORIZONTAL : `100%`
          }
        ]}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <Image2
          uri={uri}
          preview={uri}
          width={layout === "slider" ? ITEM_WIDTH_HORIZONTAL : `100%`}
          percentRatio={layout === "slider" ? `75%` : `100%`}
          containerStyle={styles.image}
        />
        <View
          style={[
            styles.details,
            { paddingBottom: !salePrice ? 20 : 0, alignItems: "flex-start" }
          ]}
        >
          <TextDecode
            text={productName}
            style={[
              styles.name,
              {
                width:
                  layout === "slider"
                    ? ITEM_WIDTH_HORIZONTAL
                    : ITEM_WIDTH_VERTICAL
              }
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          />
          <View style={{ alignItems: "flex-start" }}>
            {!!salePrice && (
              <HtmlViewer
                html={salePriceHTML}
                containerStyle={{ padding: 0, paddingRight: 5 }}
                htmlWrapCssString={`color: ${colorPrimary}`}
              />
            )}
            <HtmlViewer
              html={priceHTML}
              containerStyle={{
                padding: 0
              }}
              htmlWrapCssString={
                !!salePrice
                  ? `text-decoration-line: line-through; color:#e5e5e5;`
                  : `color: ${colorPrimary}`
              }
            />
          </View>
        </View>
        {this._renderFooter()}
        {!!salePrice && this._renderGradeView()}
      </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 1,
    borderRadius: 5,
    backgroundColor: "#fff",
    overflow: "hidden"
  },
  details: {
    paddingHorizontal: 7,
    paddingTop: 7
  },
  logo: {
    width: "100%",
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5
  },
  name: {
    fontSize: 15,
    color: "#333",
    flexWrap: "wrap",
    fontWeight: "bold",
    textAlign: "left"
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 3,
    width: "100%"
  },
  category: {
    fontSize: 11,
    color: "#333",
    padding: 10,
    paddingRight: 5
  },
  gradeView: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 10
  },
  image: {
    borderTopLeftRadius: Consts.round,
    borderTopRightRadius: Consts.round
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  }
});
