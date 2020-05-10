import React, { PureComponent } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet
} from "react-native";
import { isEmpty, isEqual } from "lodash";
import { connect } from "react-redux";
import { screenWidth } from "../../constants/styleConstants";
import { getWithDrawnDokan, getRequestStatusDokan } from "../../actions";
import { Layout, AnimatedView } from "../dumbs";
import {
  ViewWithLoading,
  Loader,
  MessageError,
  ContentBox,
  HtmlViewer,
  Button
} from "../../wiloke-elements";
import * as Consts from "../../constants/styleConstants";
import RequestItem from "../dumbs/Requests/RequestItem";

class DokanWithDrawnScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      error: false,
      currentIndex: 0,
      loadingTab: true
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { getWithDrawnDokan, auth } = this.props;
    if (
      !isEqual(
        prevProps.myDokan.cancelRequestStatus,
        this.props.myDokan.cancelRequestStatus
      ) ||
      !isEqual(
        prevProps.myDokan.postRequestResults,
        this.props.myDokan.postRequestResults
      )
    ) {
      getWithDrawnDokan(auth.token);
    }
  }

  componentDidMount() {
    this._getWithDrawnDokan();
  }

  _getWithDrawnDokan = async () => {
    const { getWithDrawnDokan, auth } = this.props;
    await getWithDrawnDokan(auth.token);
    const { myDokan } = this.props;
    if (!isEmpty(myDokan.withdrawnDokan)) {
      this.setState({
        isLoading: false,
        error: false
      });
    } else {
      this.setState({
        isLoading: false,
        error: true
      });
    }
  };

  _renderHeaderList = () => {
    const { myDokan, navigation, translations } = this.props;
    const { withdrawnDokan } = myDokan;
    return (
      <View style={styles.row}>
        <Text style={styles.title}>
          {withdrawnDokan.oLatestRequest.heading}
        </Text>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate("DokanRequestScreen")}
        >
          <Text style={styles.txtBtn}>{translations.viewAll}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  _renderEmpty = () => {
    const { myDokan } = this.props;
    const { withdrawnDokan } = myDokan;
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 10
        }}
      >
        <Text>{withdrawnDokan.oLatestRequest.oLatestRequests.msg}</Text>
      </View>
    );
  };

  _renderActivityItem = ({ item, index }) => {
    const { translations } = this.props;
    return (
      <View>
        <RequestItem
          id={item.id}
          status={item.status}
          date={item.date}
          amount={item.amountHtml}
          method={item.method}
          translations={translations}
        />
      </View>
    );
  };

  _renderDrawn = () => {
    const { myDokan, navigation, settings } = this.props;
    const { withdrawnDokan } = myDokan;
    const results =
      withdrawnDokan.oLatestRequest.oLatestRequests.status === "success"
        ? withdrawnDokan.oLatestRequest.oLatestRequests.oResults
        : [];
    return (
      <View style={styles.content}>
        <View style={styles.box}>
          <ContentBox headerTitle={withdrawnDokan.oInfo.balance.name}>
            <HtmlViewer
              html={withdrawnDokan.oInfo.balance.value}
              htmlWrapCssString={`font-size: 18px; font-weight: bold;`}
            />
          </ContentBox>
        </View>
        <View style={styles.box}>
          <FlatList
            ListHeaderComponent={this._renderHeaderList}
            keyExtractor={(item, index) => index.toString()}
            data={results}
            ListEmptyComponent={this._renderEmpty}
            renderItem={this._renderActivityItem}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  width: "100%",
                  height: 1,
                  backgroundColor: Consts.colorGray1
                }}
              />
            )}
          />
        </View>
        <View style={styles.viewRequest}>
          <Button
            block={true}
            animation={true}
            backgroundColor="primary"
            colorPrimary={settings.colorPrimary}
            onPress={() =>
              navigation.navigate("MakeRequestScreen", {
                name: withdrawnDokan.oMakeARequest.name
              })
            }
            radius="round"
            size="md"
          >
            {withdrawnDokan.oMakeARequest.name}
          </Button>
        </View>
      </View>
    );
  };

  renderContent = () => {
    const { myDokan } = this.props;
    const { isLoading, error } = this.state;
    return (
      <View style={{ width: screenWidth, flex: 1 }}>
        {isLoading ? <Loader /> : this._renderDrawn()}
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
        scrollViewStyle={{ position: "relative" }}
        scrollViewEnabled={false}
      />
    );
  }
}
const styles = StyleSheet.create({
  box: {
    paddingHorizontal: 10,
    paddingVertical: 5
  },

  content: {},

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5
  },
  title: {
    color: Consts.colorDark1,
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 2,
    marginLeft: 5,
    textTransform: "uppercase"
  },
  btn: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10
  },
  viewRequest: {
    position: "absolute",
    top: "100%",
    left: 0,
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 100
  }
});

const mapStateToProps = state => ({
  auth: state.auth,
  myDokan: state.dokanReducer,
  settings: state.settings,
  translations: state.translations
});
const mapDispatchToProps = {
  getWithDrawnDokan,
  getRequestStatusDokan
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DokanWithDrawnScreen);
