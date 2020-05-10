import React, { PureComponent } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import {
  ImageCover,
  Button,
  Loader,
  FontIcon,
  HtmlViewer
} from "../../../wiloke-elements";
import { Feather } from "@expo/vector-icons";
import { colorPrimary } from "../../../constants/styleConstants";
import TextDecode from "../TextDecode/TextDecode";

export default class ListingProductItem extends PureComponent {
  static propTypes = {
    src: PropTypes.string,
    productName: PropTypes.string,
    priceHtml: PropTypes.string,
    minValue: PropTypes.number,
    maxValue: PropTypes.number,
    txtButton: PropTypes.string,
    onPress: PropTypes.func,
    isLoading: PropTypes.oneOf(["loading", "none", "loaded"])
  };

  static defaultProps = {
    isLoading: "none"
  };

  _renderQuantity = () => {
    const { minValue, maxValue } = this.props;
    if (minValue < maxValue) {
      return (
        <View>
          <Text>123123123</Text>
        </View>
      );
    }
    return null;
  };

  _renderButtonContent = () => {
    const { isLoading, txtButton } = this.props;
    switch (isLoading) {
      case "loading":
        return <Loader size="sm" />;
      case "none":
        return <Text style={styles.txtButton}>{txtButton}</Text>;
      case "loaded":
        return <Feather name="check" size={20} color={colorPrimary} />;
    }
  };

  render() {
    const {
      src,
      productName,
      priceHtml,
      onPress,
      isLoading,
      txtButton
    } = this.props;
    return (
      <View style={styles.container}>
        <View style={{ padding: 10, flexDirection: "row" }}>
          <View style={styles.logo}>
            <ImageCover src={src} width="100%" borderRadius={5} />
          </View>
          <View style={styles.infoProduct}>
            <TextDecode
              text={productName}
              style={styles.name}
              numberOfLines={1}
              ellipsizeMode="tail"
            />
            <View style={styles.price}>
              <HtmlViewer
                html={priceHtml}
                containerStyle={{
                  padding: 0
                }}
                htmlWrapCssString={`font-size: 12px;`}
              />
            </View>
            {this._renderQuantity()}
          </View>
        </View>
        <View
          style={{
            justifyContent: "flex-end",
            alignItems: "flex-end",
            marginTop: 10
          }}
        >
          <TouchableOpacity style={styles.button}>
            {this._renderButtonContent()}
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 5
  },
  infoProduct: {
    paddingLeft: 10
  },
  name: {
    fontSize: 12,
    color: "#333",
    flexWrap: "wrap",
    fontWeight: "bold",
    paddingVertical: 3,
    textTransform: "uppercase"
  },
  button: {
    width: 80,
    height: 30,
    borderRadius: 5,
    backgroundColor: colorPrimary,
    alignItems: "center",
    justifyContent: "center"
  },
  txtButton: {
    padding: 5,
    color: "#fff",
    fontSize: 12
  }
});
