import React, { PureComponent } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { getSubMenuDokan } from "../../actions";
import { Layout, AnimatedView } from "../dumbs";
import {
  ViewWithLoading,
  MessageError,
  ListItemTouchable
} from "../../wiloke-elements";
import { screenWidth } from "../../constants/styleConstants";

class DokanScreen extends PureComponent {
  state = {
    isLoading: true
  };

  componentDidMount = () => {
    this._getSubmenuDokan();
  };

  _handleItem = item => () => {
    const { navigation } = this.props;
    navigation.navigate(this._getNameScreen(item.endpoint), {
      name: item.name
    });
  };

  _getNameScreen = endpoint => {
    switch (endpoint) {
      case "dokan/statistic":
        return "DokanStaticScreen";
      case "dokan/products":
        return "DokanProductScreen";
      case "dokan/orders":
        return "DokanOrderScreen";
      case "dokan/withdraw":
        return "DokanWithDrawnScreen";
    }
  };

  _getSubmenuDokan = async () => {
    const { getSubMenuDokan, auth } = this.props;
    await getSubMenuDokan(auth.token);
    this.setState({
      isLoading: false
    });
  };

  _renderItem = ({ item, index }) => {
    return (
      <AnimatedView>
        <ListItemTouchable
          text={item.name}
          iconName={item.icon}
          onPress={this._handleItem(item)}
        />
      </AnimatedView>
    );
  };

  _keyExtractor = (item, index) => index.toString();

  renderContent = () => {
    const { dokan } = this.props;
    const { dokanMenu } = dokan;
    const { isLoading } = this.state;
    return (
      <View style={{ width: screenWidth }}>
        <ViewWithLoading
          isLoading={isLoading}
          contentLoader="header"
          contentLoaderItemLength={4}
          gap={0}
        >
          <FlatList
            data={dokanMenu}
            renderItem={this._renderItem}
            keyExtractor={this._keyExtractor}
          />
        </ViewWithLoading>
      </View>
    );
  };
  render() {
    const { dokan } = this.props;
    const { navigation, settings, translations, auth } = this.props;
    const { isLoggedIn } = auth;
    const { name } = navigation.state.params;
    return (
      <Layout
        navigation={navigation}
        headerType="headerHasBack"
        title={name}
        goBack={() => navigation.goBack()}
        renderContent={this.renderContent}
        colorPrimary={settings.colorPrimary}
        isLoggedIn={isLoggedIn}
        scrollEnabled={false}
      />
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
const mapStateToProps = state => ({
  auth: state.auth,
  dokan: state.dokanReducer,
  translations: state.translations,
  settings: state.settings
});
const mapDispatchToProps = {
  getSubMenuDokan
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DokanScreen);
