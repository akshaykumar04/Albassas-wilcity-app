import React, { PureComponent } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import he from "he";
import {
  ImageCover,
  NewGallery,
  HtmlViewer,
  RTL,
} from "../../../wiloke-elements";
import { isEmpty } from "lodash";
import {
  colorGray1,
  colorDark2,
  screenWidth,
} from "../../../constants/styleConstants";

export default class RestaurantMenuItem extends PureComponent {
  static propTypes = {
    imageFeature: PropTypes.string,
    gallery: PropTypes.array,
    description: PropTypes.string,
    title: PropTypes.string,
    price: PropTypes.string,
    link: PropTypes.string,
    customStyle: PropTypes.object,
    onPress: PropTypes.func,
  };

  _renderImage = () => {
    const { imageFeature } = this.props;
    return (
      <View style={styles.imageFeature}>
        <ImageCover src={imageFeature} width="100%" borderRadius={5} />
      </View>
    );
  };

  _renderGallery = () => {
    const { gallery } = this.props;
    return (
      !isEmpty(gallery) && (
        <View style={{ width: 60 }}>
          <NewGallery
            thumbnails={gallery}
            thumbnailMax={1}
            column={1}
            modalSlider={gallery}
            borderRadius={7}
            isOverlay={false}
          />
        </View>
      )
    );
  };

  _renderContent = () => {
    const { title, description, price, link, onPress } = this.props;
    return (
      <TouchableOpacity style={styles.content} onPress={onPress}>
        {this._renderGallery()}
        <View style={styles.contentCenter}>
          <Text style={styles.title}>{he.decode(title)}</Text>
          <HtmlViewer
            htmlWrapCssString={`font-size: 13px; color: ${colorDark2}; line-height: 1.4em; ${
              RTL() && `texAlign: left`
            }`}
            html={description}
            containerMaxWidth={screenWidth - 22}
            containerStyle={{ paddingLeft: 5, paddingRight: 0 }}
          />
          {!!price && <Text style={styles.price}>{he.decode(price)}</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const { customStyles } = this.props;
    return (
      <View style={[styles.container, customStyles]}>
        {this._renderContent()}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 10,
  },
  imageFeature: {
    width: 60,
    borderRadius: 5,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
  },
  contentCenter: {
    marginHorizontal: 7,
    flexDirection: "column",
    flex: 1,
  },
  title: {
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
    paddingHorizontal: 5,
    textAlign: "left",
  },
  description: {
    color: "#9EA6BA",
    fontSize: 10,
    paddingHorizontal: 5,
    paddingVertical: 3,
    flexWrap: "wrap",
    textAlign: "left",
    flexShrink: 0,
  },
  price: {
    color: "#FC6464",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "left",
    paddingHorizontal: 5,
  },
});
