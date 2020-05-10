import React, { PureComponent } from "react";
import {
  View,
  Text,
  ViewPropTypes,
  StyleSheet,
  FlatList,
  TouchableOpacity
} from "react-native";
import PropTypes from "prop-types";
import { ImageCover, NewGallery } from "../../../wiloke-elements";
import Label from "../Label/Label";
import GradeView from "../GradeView/GradeView";
import { isEmpty } from "lodash";
import * as Const from "../../../constants/styleConstants";

export default class CommentItem extends PureComponent {
  static propTypes = {
    avatar: PropTypes.string,
    gallery: PropTypes.object,
    userName: PropTypes.string,
    grade: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    content: PropTypes.string,
    containerStyle: ViewPropTypes.style,
    post: PropTypes.string,
    toListingDetailReview: PropTypes.func,
    toListingDetail: PropTypes.func,
    postDate: PropTypes.string,
    galleryThumbnailMax: PropTypes.number,
    colorPrimary: PropTypes.string
  };

  static defaultProps = {
    avatar: "",
    gallery: [],
    grade: 0,
    galleryThumbnailMax: 2,
    colorPrimary: Const.colorPrimary
  };

  _renderInfo = () => {
    const { title, avatar, userName, post, postDate } = this.props;
    return (
      <View style={styles.userInfo}>
        <ImageCover
          width={50}
          height={50}
          borderRadius={100}
          src={
            avatar ||
            "http://anhbiafb.com/uploads/images/tuyen-tap-25-avatar-doi-cuc-dang-yeu-danh-cho-cac-cap-doi-dang-yeu-nhau-1485163167-26.jpg"
          }
        />
        <View
          style={{
            justifyContent: "center",
            alignItems: "flex-start",
            paddingLeft: 10,
            flex: 1
          }}
        >
          <Label textNumberOfLines={1}>{userName}</Label>
          <Text style={{ color: Const.colorDark3, fontSize: 10 }}>
            {postDate}
          </Text>
        </View>
      </View>
    );
  };

  _renderGradeView = () => {
    const { grade, colorPrimary } = this.props;
    return (
      <View style={styles.gradeView}>
        <GradeView
          containerStyle={{ backgroundColor: "#7ED321", borderRadius: 3 }}
          RATED_SIZE={25}
          textStyle={{ fontSize: 11 }}
          gradeText={grade}
          colorPrimary={colorPrimary}
        />
      </View>
    );
  };

  _renderContent = () => {
    const { content, title } = this.props;
    return (
      <View style={styles.content}>
        <Label fontSize={13}>{title}</Label>
        <Text style={styles.textContent} numberOfLines={5} ellipsizeMode="tail">
          {content}
        </Text>
        {this._renderListImage()}
      </View>
    );
  };

  _getUrlFromGallery = item => {
    return item.url;
  };

  _renderListImage = () => {
    const { gallery, galleryThumbnailMax, colorPrimary } = this.props;
    return (
      !isEmpty(gallery) && (
        <NewGallery
          thumbnails={gallery.medium.map(this._getUrlFromGallery)}
          modalSlider={gallery.large.map(this._getUrlFromGallery)}
          thumbnailMax={galleryThumbnailMax}
          column={galleryThumbnailMax}
          colorPrimary={colorPrimary}
        />
      )
    );
  };

  _renderButton = () => {
    const { post, onListing } = this.props;
    return (
      <TouchableOpacity style={styles.button} onPress={onListing}>
        <Text style={styles.textBtn}>Wrote reviews for {post}</Text>
      </TouchableOpacity>
    );
  };

  _renderBody = _ => {
    return (
      <View>
        {this._renderInfo()}
        {this._renderContent()}
        {this._renderButton()}
      </View>
    );
  };

  _renderButton = () => {
    const { post, toListingDetail } = this.props;
    return (
      <TouchableOpacity style={styles.button} onPress={toListingDetail}>
        <Text style={styles.textBtn}>{post}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    const { containerStyle, toListingDetailReview } = this.props;
    return (
      <TouchableOpacity
        style={[styles.container, containerStyle]}
        onPress={toListingDetailReview}
        activeOpacity={0.9}
      >
        <View style={styles.body}>{this._renderBody()}</View>
        {this._renderGradeView()}
      </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    position: "relative",
    borderRadius: 3
  },
  body: {
    margin: 10,
    position: "relative"
  },
  userInfo: {
    flexDirection: "row"
  },
  gradeView: {
    position: "absolute",
    top: 0,
    right: 0
  },
  textContent: {
    fontSize: 13,
    color: "#686868",
    paddingBottom: 8,
    textAlign: "left"
  },
  content: {
    paddingVertical: 5,
    alignItems: "flex-start"
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Const.colorGray1,
    borderRadius: 3,
    marginTop: 5,
    paddingVertical: 10,
    paddingHorizontal: 7
  },
  textBtn: {
    fontSize: 12,
    color: Const.colorDark,
    fontWeight: "bold",
    textAlign: "center"
  }
});
