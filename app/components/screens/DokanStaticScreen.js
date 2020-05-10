import React, { PureComponent } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet
} from "react-native";
import { connect } from "react-redux";
import { getStaticsDokan } from "../../actions";
import { Layout, AnimatedView } from "../dumbs";
import {
  ViewWithLoading,
  MessageError,
  ContentBox,
  HtmlViewer
} from "../../wiloke-elements";
import { screenWidth, colorDark } from "../../constants/styleConstants";
class DokanStaticScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };
  }

  componentDidMount() {
    this._getDokanStatic();
  }

  _getDokanStatic = async () => {
    const { getStaticsDokan, auth } = this.props;
    await getStaticsDokan(auth.token);
    this.setState({
      isLoading: false
    });
  };

  _renderRow = ({ item, index }) => {
    return (
      <View style={styles.row}>
        <Text style={styles.text}>{item.name}</Text>
        {typeof item.value === "number" ? (
          <Text style={styles.text}>{item.value}</Text>
        ) : (
          <HtmlViewer
            html={item.value}
            containerStyle={{ padding: 0 }}
            htmlWrapCssString={`font-size: 12px; color: ${colorDark}`}
          />
        )}
      </View>
    );
  };

  _renderItem = item => {
    return (
      <FlatList
        data={item}
        keyExtractor={(item, index) => index.toString()}
        renderItem={this._renderRow}
      />
    );
  };

  _renderEmpty = () => {
    return <MessageError message="Error" />;
  };

  _renderSection = ({ item, index }) => {
    return (
      <AnimatedView style={{ paddingVertical: 5 }}>
        <ContentBox headerTitle={item.heading}>
          {this._renderItem(item.aItems)}
        </ContentBox>
      </AnimatedView>
    );
  };

  _keyExtractor = (item, index) => index.toString();

  renderContent = () => {
    const { myDokan } = this.props;
    const { staticDokan } = myDokan;
    const { isLoading } = this.state;
    const data = !!staticDokan ? Object.values(staticDokan) : [];
    return (
      <View style={{ width: screenWidth }}>
        <ViewWithLoading
          isLoading={isLoading}
          contentLoader="contentHeader"
          gap={0}
          contentLoaderItemLength={2}
        >
          <FlatList
            data={data}
            renderItem={this._renderSection}
            keyExtractor={this._keyExtractor}
            ListEmptyComponent={this._renderEmpty}
          />
        </ViewWithLoading>
      </View>
    );
  };

  render() {
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
        scrollViewEnabled={false}
      />
    );
  }
}
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5
  },
  text: {
    color: "#9D9D9D",
    fontSize: 12
  }
});
const mapStateToProps = state => ({
  auth: state.auth,
  myDokan: state.dokanReducer,
  settings: state.settings,
  translations: state.translations
});
const mapDispatchToProps = {
  getStaticsDokan
};
export default connect(mapStateToProps, mapDispatchToProps)(DokanStaticScreen);
