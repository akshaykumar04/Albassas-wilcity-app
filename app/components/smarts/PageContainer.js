import React, { PureComponent } from "react";
import { View, Text, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  ListItemTouchable,
  ViewWithLoading,
  isEmpty,
  RequestTimeoutWrapped,
  HtmlViewer
} from "../../wiloke-elements";
import { getPage } from "../../actions";
import * as Consts from "../../constants/styleConstants";

class PageContainer extends PureComponent {
  state = {
    isLoading: true
  };
  _getPage = async () => {
    const { navigation } = this.props;
    const { params } = navigation.state;
    const { key } = params;
    await this.props.getPage(key);
    this.setState({ isLoading: false });
  };
  componentDidMount() {
    this._getPage();
  }

  _handlePress = (stackNavListing, item) => () => {
    const { navigation } = this.props;
    navigation.navigate(item.navigation, {
      name: item.name,
      key: item.key
    });
  };

  renderItem = stackNavListing => item => (
    <ListItemTouchable
      key={item.key}
      iconName={item.iconName}
      text={item.name}
      onPress={this._handlePress(stackNavListing, item)}
    />
  );

  render() {
    const { page, navigation } = this.props;
    const { isLoading } = this.state;
    const { params } = navigation.state;
    const { key } = params;
    console.log(isLoading);
    return (
      <ViewWithLoading isLoading={isLoading}>
        {/* <RequestTimeoutWrapped
          isTimeout={isMenuRequestTimeout}
          onPress={this._getPage}
          fullScreen={true}
          text={translations.networkError}
          buttonText={translations.retry}
        >
          {!isEmpty(stackNavigator) &&
            stackNavigator.map(this.renderItem(stackNavListing))}
        </RequestTimeoutWrapped> */}
        {!isEmpty(page[key]) && (
          <View style={{ backgroundColor: "#fff" }}>
            <HtmlViewer
              html={page[key].postContent}
              htmlWrapCssString={`font-size: 13px; color: ${
                Consts.colorDark2
              }; line-height: 1.4em`}
            />
          </View>
        )}
      </ViewWithLoading>
    );
  }
}

const mapStateToProps = state => ({
  page: state.page,
  translations: state.translations
});

const mapDispatchToProps = {
  getPage
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PageContainer);
