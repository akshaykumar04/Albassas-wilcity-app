import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { ImageCache } from "../atoms/ImageCache";

const NotifyItem = ({ imageSize, image }) => {
  const preview = {
    uri: image
  };
  const uri = image;
  return (
    <View style={styles.container}>
      <ImageCache
        {...{ preview, uri }}
        tint="light"
        source={{ uri: image }}
        resizeMode="cover"
        style={[
          {
            width: imageSize,
            height: imageSize
          },
          styleImage
        ]}
      />
      <View style={styles.content} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row"
  }
});
