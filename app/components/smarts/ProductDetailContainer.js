import React from "react";
import { connect } from "react-redux";
import {
  getProductDetails,
  addToCart,
  changeQuantity,
  getProductsCart,
  getVariations,
  selectedAttribute,
  resetAttribute,
  addProductFavorites,
  deleteProductFavorites,
  getKeyFirebase,
  messageChatActive,
  addWishListToken
} from "../../actions";
import ProductDetailScreen from "../screens/ProductDetailScreen";

const mapStateToProps = state => ({
  myProduct: state.productReducer,
  isProductDetailsTimeout: state.isProductDetailsTimeout,
  translations: state.translations,
  auth: state.auth,
  myCart: state.cartReducer,
  settings: state.settings,
  listProductFavorites: state.listProductFavorites,
  shortProfile: state.shortProfile,
  keyFirebase: state.keyFirebase
});

const mapDispatchToProps = {
  getProductDetails,
  addToCart,
  changeQuantity,
  getProductsCart,
  getVariations,
  selectedAttribute,
  resetAttribute,
  addProductFavorites,
  deleteProductFavorites,
  getKeyFirebase,
  messageChatActive,
  addWishListToken
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductDetailScreen);
