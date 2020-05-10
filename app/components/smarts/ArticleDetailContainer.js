import React, { PureComponent } from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import { getArticleDetail } from "../../actions";
import {
  isEmpty,
  ViewWithLoading,
  IconTextSmall,
  HtmlViewer
} from "../../wiloke-elements";
import * as Consts from "../../constants/styleConstants";

class ArticleDetailContainer extends PureComponent {
  state = {
    isLoading: true
  };

  _getArticleDetail = async () => {
    try {
      const { navigation } = this.props;
      const { params } = navigation.state;
      await this.props.getArticleDetail(params.id);
      this.setState({ isLoading: false });
    } catch (err) {
      console.log(err);
    }
  };

  componentDidMount() {
    this._getArticleDetail();
  }

  renderMeta = () => {
    const { articleDetail, translations, settings } = this.props;
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
          paddingTop: 8,
          backgroundColor: "#fff"
        }}
      >
        <IconTextSmall
          iconName="calendar"
          text={articleDetail.postDate}
          iconSize={14}
          textSize={12}
          iconColor={settings.colorPrimary}
        />
        <View style={{ width: 10 }} />
        <IconTextSmall
          iconName="message-square"
          text={`${articleDetail.countComments} ${translations.comments}`}
          iconSize={14}
          textSize={12}
          iconColor={settings.colorPrimary}
        />
      </View>
    );
  };

  render() {
    const { articleDetail } = this.props;
    const { isLoading } = this.state;
    return (
      <View
        style={{
          width: Consts.screenWidth,
          marginHorizontal: -10,
          marginBottom: isLoading ? -10 : 0,
          paddingTop: isLoading ? 10 : 5,
          backgroundColor: "#fff"
        }}
      >
        <ViewWithLoading isLoading={isLoading} contentLoader="content">
          {this.renderMeta()}
          {!isEmpty(articleDetail) && (
            <View style={{ backgroundColor: "#fff" }}>
              <HtmlViewer
                html={articleDetail.postContent.replace("\r\n", "<br/>")}
                htmlWrapCssString={`font-size: 13px; color: ${Consts.colorDark2}; line-height: 1.4em`}
              />
            </View>
          )}
        </ViewWithLoading>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  articleDetail: state.articleDetail,
  translations: state.translations,
  settings: state.settings
});

const mapDispatchToProps = {
  getArticleDetail
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ArticleDetailContainer);
