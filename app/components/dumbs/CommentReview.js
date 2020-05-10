import React, { Component, PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewPropTypes
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Constants from "expo-constants";
import {
  ImageCircleAndText,
  ActionSheet,
  IconTextSmall,
  InputAccessoryLayoutFullScreen,
  ViewWithLoading,
  RTL
} from "../../wiloke-elements";
import * as Consts from "../../constants/styleConstants";
import Rated from "./Rated";
import { connect } from "react-redux";
import _ from "lodash";

class Comments extends PureComponent {
  renderItemComments = (item, index) => {
    const { userID: commentUserID } = item;
    return (
      <ActionSheet
        {...this.props.commentsActionSheet(
          item.title,
          item.message,
          commentUserID,
          item.id
        )}
        key={item.id.toString()}
        renderButtonItem={() => (
          <View
            style={{
              borderTopWidth: index === 0 ? 0 : 1,
              borderTopColor: Consts.colorGray1,
              paddingHorizontal: 10,
              paddingVertical: 15
            }}
          >
            <ImageCircleAndText
              image={item.image}
              title={item.title}
              text={item.text}
              message={item.message}
              horizontal={true}
              imageSize={40}
              style={{
                alignItems: "flex-start"
              }}
            />
          </View>
        )}
      />
    );
  };

  render() {
    const { comments, isLoading } = this.props;
    return (
      <ViewWithLoading
        isLoading={isLoading}
        contentLoader="headerAvatar"
        contentLoaderItemLength={8}
        gap={0}
      >
        <View>
          {comments.data && comments.data.map(this.renderItemComments)}
        </View>
      </ViewWithLoading>
    );
  }
}

class CommentReview extends Component {
  static propTypes = {
    headerActionSheet: PropTypes.object,
    renderContent: PropTypes.func,
    onLike: PropTypes.func,
    onComment: PropTypes.func,
    onShare: PropTypes.func,
    goBack: PropTypes.func,
    comments: PropTypes.shape({
      data: PropTypes.array,
      count: PropTypes.number
    }),
    likes: PropTypes.shape({
      count: PropTypes.number
    }),
    shares: PropTypes.shape({
      count: PropTypes.number
    }),
    style: ViewPropTypes.style,
    fullScreen: PropTypes.bool,
    rated: PropTypes.number,
    ratedMax: PropTypes.number,
    ratedText: PropTypes.string,
    inputAutoFocus: PropTypes.bool,
    colorPrimary: PropTypes.string,
    likeText: PropTypes.string,
    likeTextColor: PropTypes.string,
    onSubmitCommentReview: PropTypes.func,
    commentsActionSheet: PropTypes.func,
    onChangeText: PropTypes.func,
    isSubmit: PropTypes.bool,
    TEMPORARY_ShareDisable: PropTypes.bool
  };

  static defaultProps = {
    renderContent: () => {},
    onLike: () => {},
    onComment: () => {},
    onShare: () => {},
    goBack: () => {},
    onSubmitCommentReview: () => {},
    commentsActionSheet: () => {},
    onChangeText: () => {},
    fullScreen: false,
    inputAutoFocus: true,
    colorPrimary: Consts.colorPrimary,
    likeText: "Like",
    likeTextColor: Consts.colorDark4,
    isSubmit: false,
    TEMPORARY_ShareDisable: false
  };

  state = {
    keyboardAvoidingViewEnabled: false,
    commentText: ""
  };

  componentDidMount() {
    this.setState({ keyboardAvoidingViewEnabled: true });
  }

  _handlePressComment = () => {
    this.props.onSubmitCommentReview(this.state.commentText);
    this.setState({
      commentText: ""
    });
  };

  _handleChangeComment = text => {
    this.setState({
      commentText: text
    });
    this.props.onChangeText(text);
  };

  renderActionSheet = () => {
    const { headerActionSheet } = this.props;
    return (
      !_.isEmpty(headerActionSheet) && (
        <ActionSheet
          {...headerActionSheet}
          renderButtonItem={() => (
            <View style={styles.actionSheet}>
              <Feather
                name="more-horizontal"
                size={20}
                color={Consts.colorDark3}
              />
            </View>
          )}
        />
      )
    );
  };

  renderHeader() {
    const { onPressMoreHorizontal, fullScreen, goBack } = this.props;
    const rtl = RTL();
    return (
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {fullScreen && (
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={goBack}
              style={{ marginRight: 0 }}
            >
              <Feather
                name={rtl ? "chevron-right" : "chevron-left"}
                size={30}
                color={Consts.colorDark2}
              />
            </TouchableOpacity>
          )}
          <ImageCircleAndText {...this.props.headerAuthor} horizontal={true} />
        </View>
        <View style={styles.headerRight}>
          {!!this.props.rated && (
            <Rated
              rate={this.props.rated}
              max={this.props.ratedMax}
              text={this.props.ratedText}
            />
          )}
          {this.renderActionSheet()}
        </View>
      </View>
    );
  }

  renderContent() {
    const { renderContent } = this.props;
    return <View style={styles.content}>{renderContent()}</View>;
  }

  renderActionGroup() {
    const { onLike, onComment, onShare, TEMPORARY_ShareDisable } = this.props;
    const propsGeneral = {
      iconColor: Consts.colorDark3,
      iconSize: 16,
      textSize: 12,
      textColor: Consts.colorDark3
    };
    return (
      <View style={styles.actionGroup}>
        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.icon}
          onPress={onLike}
        >
          <IconTextSmall
            {...propsGeneral}
            text={this.props.likeText}
            iconName="thumbs-up"
            iconColor={this.props.likeTextColor}
            textColor={this.props.likeTextColor}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.icon}
          onPress={onComment}
        >
          <IconTextSmall
            {...propsGeneral}
            text={this.props.translations.comment}
            iconName="message-square"
          />
        </TouchableOpacity>
        {!TEMPORARY_ShareDisable && (
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.icon}
            onPress={onShare}
          >
            <IconTextSmall
              {...propsGeneral}
              text={this.props.translations.share}
              iconName="share"
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // renderItemComments = (item, index) => {
  //   return (
  //     <ActionSheet
  //       {...this.props.commentsActionSheet}
  //       key={item.id.toString()}
  //       renderButtonItem={() => (
  //         <View
  //           style={{
  //             borderTopWidth: index === 0 ? 0 : 1,
  //             borderTopColor: Consts.colorGray1,
  //             paddingHorizontal: 10,
  //             paddingVertical: 15
  //           }}
  //         >
  //           <ImageCircleAndText
  //             image={item.image}
  //             title={item.title}
  //             text={item.text}
  //             message={item.message}
  //             horizontal={true}
  //             imageSize={40}
  //             style={{
  //               alignItems: "flex-start"
  //             }}
  //           />
  //         </View>
  //       )}
  //     />
  //   );
  // };

  renderComments() {
    const { comments, commentsActionSheet } = this.props;
    const { isLoading } = comments;
    return (
      <Comments
        isLoading={!!isLoading}
        comments={comments}
        commentsActionSheet={commentsActionSheet}
      />
    );
    // return (
    //   <ViewWithLoading isLoading={!!isLoading}>
    //     <View>
    //       {comments.data && comments.data.map(this.renderItemComments)}
    //     </View>
    //   </ViewWithLoading>
    // );
  }

  renderMeta() {
    const { likes, comments, shares, TEMPORARY_ShareDisable } = this.props;
    return (
      <View style={styles.meta}>
        <Text style={styles.metaItem}>
          {likes.count} {likes.text}
        </Text>
        <Text style={styles.metaItem}>
          {comments.count} {comments.text}
        </Text>
        {!TEMPORARY_ShareDisable && (
          <Text style={styles.metaItem}>
            {shares.count} {shares.text}
          </Text>
        )}
      </View>
    );
  }

  render() {
    const { keyboardAvoidingViewEnabled } = this.state;
    const { comments, settings, isSubmit } = this.props;
    return (
      <Fragment>
        {!this.props.fullScreen ? (
          <View
            style={[
              styles.container,
              {
                borderWidth: comments.data && comments.data.length > 0 ? 1 : 0
              },
              this.props.style
            ]}
          >
            {this.renderHeader()}
            {this.renderContent()}
            {this.renderMeta()}
            {this.renderActionGroup()}
            {this.renderComments()}
          </View>
        ) : (
          <InputAccessoryLayoutFullScreen
            style={{ backgroundColor: "#fff" }}
            isSubmit={isSubmit}
            renderHeader={() => (
              <View>
                <View
                  style={{
                    height: Constants.statusBarHeight,
                    backgroundColor: "#fff"
                  }}
                />
                {this.renderHeader()}
              </View>
            )}
            renderContent={() => (
              <View style={{ backgroundColor: "#fff" }}>
                {this.renderContent()}
                {this.renderMeta()}
                {this.renderActionGroup()}
                {this.renderComments()}
              </View>
            )}
            groupActionEnabled={false}
            textInputProps={{
              placeholder: "Aa",
              multiline: true,
              autoFocus: true,
              autoCorrect: false,
              value: this.state.commentText,
              onPressText: this._handlePressComment,
              onChangeText: this._handleChangeComment,
              colorPrimary: settings.colorPrimary,
              iconName: "fa fa-paper-plane"
            }}
          />
        )}
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderColor: Consts.colorGray1
  },
  header: {
    position: "relative",
    zIndex: 9,
    borderBottomWidth: 1,
    borderBottomColor: Consts.colorGray1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff"
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center"
  },
  content: {
    padding: 10
  },
  actionGroup: {
    borderTopWidth: 1,
    borderTopColor: Consts.colorGray1,
    borderBottomWidth: 1,
    borderBottomColor: Consts.colorGray1,
    paddingHorizontal: 10,
    flexDirection: "row"
  },
  icon: {
    marginRight: 25,
    paddingVertical: 10
  },
  meta: {
    paddingHorizontal: 10,
    paddingTop: 3,
    paddingBottom: 13,
    flexDirection: "row"
  },
  metaItem: {
    color: Consts.colorDark3,
    fontSize: 11,
    marginRight: 10
  },
  actionSheet: {
    width: 30,
    height: 40,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10
  }
});

const mapStateToProps = ({ translations, settings }) => ({
  translations,
  settings
});

export default connect(mapStateToProps)(CommentReview);
