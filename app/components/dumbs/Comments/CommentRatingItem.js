import React, { PureComponent } from "react";
import { Text, View, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { ImageCover, Rating } from "../../../wiloke-elements";
import { colorGray1 } from "../../../constants/styleConstants";

export default class CommentRatingItem extends PureComponent {
  static propTypes = {
    rating: PropTypes.number,
    author: PropTypes.string,
    authorAvatar: PropTypes.string,
    date: PropTypes.string,
    content: PropTypes.string
  };

  _renderHeader = () => {
    const { author, authorAvatar, rating, date } = this.props;
    return (
      <View style={styles.header}>
        <View style={styles.author}>
          <View style={{ width: 40, height: 40, borderRadius: 100 }}>
            <ImageCover src={authorAvatar} width="100%" borderRadius={100} />
          </View>
          <View>
            <Text style={styles.name}>{author}</Text>
            <Text style={styles.date}>{date}</Text>
          </View>
        </View>
        <Rating
          startingValue={rating}
          fractions={2}
          ratingCount={5}
          showRating={false}
          readonly={true}
          imageSize={10}
        />
      </View>
    );
  };

  _renderContent = () => {
    const { content } = this.props;
    return (
      <View style={styles.content}>
        <Text style={styles.text}>{content}</Text>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        {this._renderHeader()}
        {this._renderContent()}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingHorizontal: 5,
    paddingVertical: 10
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  author: {
    flexDirection: "row",
    alignItems: "center"
  },
  name: {
    fontSize: 11,
    color: "#333",
    fontWeight: "bold",
    paddingHorizontal: 5
  },
  date: {
    fontSize: 10,
    color: "#333",
    paddingHorizontal: 5
  },
  content: {
    paddingVertical: 5
  },
  text: {
    textAlign: "left"
  }
});
