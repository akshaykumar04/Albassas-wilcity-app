import React, { PureComponent } from "react";
import { Text, View, FlatList, StyleSheet } from "react-native";
import * as WebBrowser from "expo-web-browser";
import _ from "lodash";
import PropTypes from "prop-types";
import ProductItem from "../ProductItem/ProductItem";
import { adMobModal } from "../../../wiloke-elements";

export default class ProductsWC extends PureComponent {
  static propTypes = {
    data: PropTypes.array,
    customStyle: PropTypes.object
  };

  _handleItem = item => async () => {
    const { navigation, admob } = this.props;
    const isAdmob = _.get(admob, "oFullWidth", false);
    !!isAdmob && adMobModal({ variant: admob.oFullWidth.variant });
    if (item.type !== "booking") {
      navigation.navigate("ProductDetailScreen", {
        productID: item.id,
        oFeaturedImg: item.oFeaturedImg.medium,
        name: item.name
      });
      return;
    }
    WebBrowser.openBrowserAsync(item.link);
  };

  _renderItem = ({ item, index }) => {
    const { numColumns, type, colorPrimary } = this.props;
    // const discount = (
    //   (item.regularPrice - item.salePrice) /
    //   item.regularPrice
    // ).toFixed(1);
    return (
      <View style={type === "slider" ? styles.slider : styles.grid}>
        <ProductItem
          productName={item.name}
          featureImage={item.oFeaturedImg.thumbnail}
          priceHTML={item.regularPriceHtml}
          salePriceHTML={item.salePriceHtml || ""}
          salePrice={item.salePrice}
          onPress={this._handleItem(item)}
          rating={item.averageRating}
          category={item.oCategories[0]}
          discount={`${item.saleOff}%`}
          colorPrimary={colorPrimary}
          layout={type}
        />
      </View>
    );
  };

  _renderHeaderProductWC = () => {
    const { title } = this.props;
    return <Text style={styles.title}>{title}</Text>;
  };

  _keyExtractor = (item, index) => index.toString();

  render() {
    const { data, customStyle, type, columns } = this.props;
    return (
      <View style={[styles.container, customStyle]}>
        {/* {this._renderHeaderProductWC()} */}
        {type === "grid" ? (
          <FlatList
            {...this.props}
            data={data}
            renderItem={this._renderItem}
            keyExtractor={this._keyExtractor}
            numColumns={columns}
            style={{ margin: 10 }}
          />
        ) : (
          <FlatList
            {...this.props}
            data={data}
            renderItem={this._renderItem}
            keyExtractor={this._keyExtractor}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{ margin: 10 }}
          />
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    margin: -5,
    flex: 1
  },
  slider: {
    padding: 10 / 2,
    overflow: "hidden"
  },
  grid: {
    flex: 0.5,
    padding: 10 / 2
  },
  title: {
    fontSize: 20,
    color: "#333",
    fontWeight: "bold",
    paddingVertical: 5,
    paddingHorizontal: 10,
    paddingTop: 10
  }
});
