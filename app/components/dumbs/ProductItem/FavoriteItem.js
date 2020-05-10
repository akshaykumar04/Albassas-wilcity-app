import React, { PureComponent } from "react";
import { Text, View, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { ImageCover, HtmlViewer, Rating } from "../../../wiloke-elements";
import * as Consts from "../../../constants/styleConstants";

export default class FavoriteItem extends PureComponent {
  static propTypes = {
    src: PropTypes.string,
    priceHtml: PropTypes.string,
    salePriceHtml: PropTypes.string,
    rating: PropTypes.number,
    productName: PropTypes.string,
    salePrice: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  };

  render() {
    const {
      src,
      priceHtml,
      salePriceHtml,
      productName,
      salePrice,
      rating,
      colorPrimary
    } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.logo}>
          <ImageCover src={src} width="100%" borderRadius={5} />
        </View>
        <View style={styles.infoProduct}>
          <Text style={styles.name}>{productName}</Text>
          <View style={styles.price}>
            {!!salePrice && typeof salePrice === "string" && (
              <HtmlViewer
                html={salePriceHtml}
                containerStyle={{ padding: 0, paddingRight: 5 }}
                htmlWrapCssString={`color: ${colorPrimary}`}
              />
            )}
            <HtmlViewer
              html={priceHtml}
              containerStyle={{
                padding: 0
              }}
              htmlWrapCssString={
                !!salePrice && typeof salePrice === "string"
                  ? `text-decoration-line: line-through; color:#e5e5e5;`
                  : `color: ${colorPrimary}`
              }
            />
          </View>
          <Rating
            startingValue={rating}
            fractions={2}
            ratingCount={5}
            showRating={false}
            readonly={true}
            imageSize={14}
            style={{ paddingVertical: 5 }}
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingLeft: 10
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 5
  },
  infoProduct: {
    paddingLeft: 10
  },
  name: {
    fontSize: 15,
    color: "#333",
    flexWrap: "wrap",
    fontWeight: "bold",
    paddingVertical: 3,
    textTransform: "uppercase"
  },
  price: {
    flexDirection: "row"
  }
});
