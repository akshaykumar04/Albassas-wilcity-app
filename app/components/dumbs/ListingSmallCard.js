import React from "react";
import PropTypes from "prop-types";
import {
  View,
  ActivityIndicator,
  ViewPropTypes,
  StyleSheet
} from "react-native";
import { H6, P, Image2 } from "../../wiloke-elements";
import * as Consts from "../../constants/styleConstants";
import he from "he";

const ListingSmallCard = props => {
  const { image, title, text, style, renderRate } = props;
  const preview = {
    uri: image
  };
  const uri = image;
  return (
    <View style={[styles.container, style]}>
      <View style={styles.imageWrapped}>
        <Image2 uri={uri} preview={uri} width="100%" height="100%" />
      </View>
      <View style={{ paddingRight: 70 }}>
        {renderRate()}
        <H6 numberOfLines={1}>{he.decode(title)}</H6>
        <P style={{ marginTop: -5 }} numberOfLines={1}>
          {he.decode(text)}
        </P>
      </View>
    </View>
  );
};
ListingSmallCard.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
  text: PropTypes.string,
  style: ViewPropTypes.style,
  renderRate: PropTypes.func
};

ListingSmallCard.defaultProps = {
  renderRate: () => {}
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Consts.colorGray1,
    padding: 10
  },
  imageWrapped: {
    marginRight: 10,
    width: 60,
    height: 60,
    backgroundColor: Consts.colorGray2
  }
});

export default ListingSmallCard;
