import React, { PureComponent } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
// import { Image } from "react-native-expo-image-cache";
import {
  FontIcon,
  HtmlViewer,
  CheckBox,
  Image2
} from "../../../wiloke-elements";
// import { colorPrimary } from "../../../constants/styleConstants";
import TextDecode from "../TextDecode/TextDecode";

export default class ListingProductItemClassic extends PureComponent {
  static propTypes = {
    src: PropTypes.string,
    productName: PropTypes.string,
    priceHtml: PropTypes.string,
    salePriceHtml: PropTypes.string,
    onPress: PropTypes.func,
    category: PropTypes.string,
    author: PropTypes.string,
    status: PropTypes.string,
    salePrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    colorPrimary: PropTypes.string,
    checkbox: PropTypes.bool,
    onChecked: PropTypes.func,
    isLoggedIn: PropTypes.bool
  };
  static defaultProps = {
    checkbox: false,
    onChecked: () => {}
  };
  constructor(props) {
    super(props);
    const { checked } = props;
    this.state = {
      checked
    };
  }

  // _handlePressCheck = async (name, checked) => {
  //   const { onChecked, isLoggedIn } = this.props;
  //   if (!isLoggedIn) {
  //     onChecked(false);
  //     return;
  //   }

  //   await this.setState({
  //     checked: !this.state.checked
  //   });
  //   onChecked && onChecked(this.state.checked);
  // };

  renderCheckBox = () => {
    const { isLoggedIn } = this.props;
    const { checked } = this.state;
    return (
      <View>
        <CheckBox
          checked={isLoggedIn ? checked : false}
          size={22}
          borderWidth={1}
          radius={100}
          name="checkbox"
          // condition={!isLoggedIn}
          // onPress={this._handlePressCheck}
          circleAnimatedSize={0}
          disabled={true}
        />
      </View>
    );
  };

  render() {
    const {
      src,
      productName,
      priceHtml,
      salePriceHtml,
      onPress,
      category,
      author,
      salePrice,
      status,
      colorPrimary,
      checkbox
    } = this.props;
    const preview = {
      uri: src
    };
    const uri = src;
    return (
      <View style={styles.container}>
        <View style={{ paddingVertical: 5, flexDirection: "row" }}>
          <View style={styles.logo}>
            <Image2
              containerStyle={styles.images}
              width="100%"
              percentRatio="100%"
              uri={uri}
            />
            {/* <Image
              {...{ preview, uri }}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 5
              }}
              tint="light"
            /> */}
          </View>
          <View style={styles.infoProduct}>
            <TextDecode
              text={productName}
              style={styles.name}
              numberOfLines={1}
              ellipsizeMode="tail"
              onPress={onPress}
            />
            <View>
              {!!salePrice && (
                <HtmlViewer
                  html={salePriceHtml}
                  containerStyle={{ padding: 0, paddingRight: 5 }}
                  htmlWrapCssString={`color: ${colorPrimary}; font-size: 10px;`}
                />
              )}
              <HtmlViewer
                html={priceHtml}
                containerStyle={{
                  padding: 0
                }}
                htmlWrapCssString={
                  !!salePrice
                    ? `text-decoration-line: line-through; color:#e5e5e5; font-size: 10px;`
                    : `color: ${colorPrimary}, font-size: 12px;`
                }
              />
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.text}>{author}</Text>
              <Text style={styles.text}>{category}</Text>
              {status && (
                <Text style={[styles.text, { color: "#32C267" }]}>
                  {status}
                </Text>
              )}
            </View>
          </View>
        </View>
        {/* {checkbox && this.renderCheckBox()} */}
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
    width: 80,
    height: 80,
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
  text: {
    fontSize: 12,
    color: "#222",
    paddingRight: 5
  },
  images: {
    borderRadius: 5
  }
});
