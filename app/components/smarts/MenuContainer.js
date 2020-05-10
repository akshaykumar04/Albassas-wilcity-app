import React, { PureComponent } from "react";
import { connect } from "react-redux";
import {
  ListItemTouchable,
  ViewWithLoading,
  isEmpty,
  RequestTimeoutWrapped
} from "../../wiloke-elements";
import { getStackNavigator } from "../../actions";
import { screenWidth } from "../../constants/styleConstants";

class MenuContainer extends PureComponent {
  state = {
    isLoading: true
  };
  _getStackNavigator = async () => {
    try {
      await this.props.getStackNavigator();
      this.setState({ isLoading: false });
    } catch (err) {
      this.setState({ isLoading: false });
    }
  };
  componentDidMount() {
    this._getStackNavigator();
  }

  _handlePress = (stackNavListing, item) => () => {
    const { navigation } = this.props;
    console.log(item.navigation);
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
      style={{ width: screenWidth }}
    />
  );

  render() {
    const { stackNavigator, isMenuRequestTimeout, translations } = this.props;
    const { isLoading } = this.state;
    const stackNavListing = stackNavigator
      .filter(item => item.screen === "listingStack")
      .map(item => item.key);
    return (
      <ViewWithLoading
        isLoading={isLoading}
        contentLoader="header"
        contentLoaderItemLength={4}
        gap={0}
      >
        <RequestTimeoutWrapped
          isTimeout={isMenuRequestTimeout}
          onPress={this._getStackNavigator}
          fullScreen={true}
          text={translations.networkError}
          buttonText={translations.retry}
        >
          {!isEmpty(stackNavigator) &&
            stackNavigator.map(this.renderItem(stackNavListing))}
        </RequestTimeoutWrapped>
      </ViewWithLoading>
    );
  }
}

const mapStateToProps = state => ({
  stackNavigator: state.stackNavigator,
  isMenuRequestTimeout: state.isMenuRequestTimeout,
  translations: state.translations
});

const mapDispatchToProps = {
  getStackNavigator
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MenuContainer);
