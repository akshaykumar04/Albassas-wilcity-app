import React, { memo } from "react";
import PropTypes from "prop-types";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import * as Consts from "../../constants/styleConstants";
import stylesBase from "../../stylesBase";
import { Overlay } from "../../wiloke-elements";
import { Image2 } from "../../wiloke-elements";

const { height } = Dimensions.get("window");

const Hero = props => {
  const uri = props.src;
  return (
    <View style={styles.container}>
      <Image2
        uri={uri}
        containerStyle={styles.background}
        width="100%"
        height="100%"
      />
      <Overlay opacity={1} backgroundColor={props.overlayColor} />
      <View style={styles.content}>
        <Text
          style={[stylesBase.h2, { color: props.titleColor }, styles.title]}
        >
          {props.title}
        </Text>
        <Text
          style={[stylesBase.text, { color: props.textColor }, styles.text]}
        >
          {props.text}
        </Text>
      </View>
    </View>
  );
};
Hero.propTypes = {
  titleColor: PropTypes.string,
  textColor: PropTypes.string,
  title: PropTypes.string,
  text: PropTypes.string,
  src: PropTypes.string,
  overlayColor: PropTypes.string
};
Hero.defaultProps = {
  titleColor: Consts.colorPrimary,
  textColor: Consts.colorGray1,
  overlayColor: "rgba(0,0,0,0.4)"
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 9,
    height: height / 3.5
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: -2
  },
  content: {
    position: "relative",
    zIndex: 9,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20
  },
  title: {
    marginBottom: 5,
    textAlign: "center"
  },
  text: {
    textAlign: "center",
    fontSize: 15,
    lineHeight: 20
  }
});

export default memo(Hero);
