import React, { PureComponent } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Modalize from "react-native-modalize";
import PropTypes from "prop-types";
import { colorGray1, colorPrimary } from "../../../constants/styleConstants";
import { HtmlViewer, ImageCover, FontIcon } from "../../../wiloke-elements";
import Variantions from "../ModalVariations/Variantions";

export default class ModalCart extends PureComponent {
  _renderLeft = () => {
    return (
      <View style={[styles.view, { paddingHorizontal: 10 }]}>
        <FontIcon name="check-circle" color="#16ce35" size={20} />
        <Text style={{ fontSize: 15, color: "#16ce35", paddingHorizontal: 5 }}>
          Added to cart
        </Text>
      </View>
    );
  };

  _renderRight = () => {
    return (
      <TouchableOpacity style={styles.icon} onPress={this._closeModal}>
        <FontIcon name="x" size={25} />
      </TouchableOpacity>
    );
  };

  _renderHeaderModal = () => {
    return (
      <View style={styles.headerModal}>
        <View />
        <View />
        {this._renderRight()}
      </View>
    );
  };

  _renderContentModal = () => {
    const { product } = this.props;
    const productDetails = product.details;
    const src = !!productDetails.gallery
      ? productDetails.gallery.medium[0].url
      : "http://demo.wilcityapp.com/wp-content/plugins/kingcomposer/assets/images/get_start.jpg";
    return (
      <View style={styles.modal}>
        <View style={styles.modalContent}>
          <View style={{ width: 150, borderRadius: 5 }}>
            <ImageCover src={src} width="100%" borderRadius={5} />
          </View>
          <View style={styles.contentTextModal}>
            <Text style={[styles.name, { fontSize: 15 }]}>
              {productDetails.name}
            </Text>
            <HtmlViewer html={productDetails.price_html} />
          </View>
        </View>
        <Variantions product={product} />
        <View>
          <TouchableOpacity style={styles.button2} onPress={this.props.onCart}>
            <Text style={styles.textBtn}>Add To Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  _openModal = () => {
    this.modal.open();
  };
  _closeModal = () => {
    this.modal.close();
  };

  render() {
    return (
      <Modalize
        HeaderComponent={this._renderHeaderModal}
        ref={ref => (this.modal = ref)}
        {...this.props}
      >
        {this._renderContentModal()}
      </Modalize>
    );
  }
}
const styles = StyleSheet.create({
  headerModal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  view: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  icon: {
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    position: "relative"
  },
  modalContent: {
    padding: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: colorGray1,
    flexDirection: "row"
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 10
  },
  button2: {
    paddingVertical: 7,
    backgroundColor: colorPrimary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginHorizontal: 10,
    marginBottom: 20
  },
  textBtn: {
    padding: 5,
    color: "#fff",
    fontWeight: "bold"
  }
});
