import React, { PureComponent } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert
} from "react-native";
import { connect } from "react-redux";
import {
  InputMaterial,
  Button,
  Loader,
  ModalPicker,
  Validator,
  ContentBox,
  HtmlViewer
} from "../../wiloke-elements";
import { Layout, AnimatedView, Heading } from "../dumbs";
import {
  screenWidth,
  colorPrimary,
  colorGray2,
  colorDark3
} from "../../constants/styleConstants";
import { makeRequestDokan, postRequestDokan } from "../../actions";
import FormBilling from "../dumbs/FormPayment/FormBilling";

const validateData = {
  amount: {
    presence: {
      message: "Please enter your amount"
    }
  },
  method: {
    presence: {
      message: "Please select your method"
    }
  }
};
class MakeRequestScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      error: false,
      success: false,
      loadingRequest: false
    };
  }

  componentDidMount() {
    this._makeRequestDokan();
  }

  _handleChangeText = props => text => {
    this.setState({
      [`${props.name}`]: text
    });
    props.onChange(text);
  };

  _handleChangeOptions = props => async (options, selected) => {
    props.onChange(selected[0].id);
  };

  _handleClearText = props => () => {
    this._handleChangeText(props)("");
  };

  _handleSubmit = async props => {
    const { postRequestDokan, auth } = this.props;
    await this.setState({
      loadingRequest: true
    });
    if (props.valid) {
      await postRequestDokan(auth.token, props.result);
      await this.setState({
        loadingRequest: true
      });
      const { myDokan } = this.props;
      if (myDokan.postRequestResults.status === "error") {
        Alert.alert(myDokan.postRequestResults.msg);
      } else
        this.setState({
          success: true
        });
    }
  };

  _makeRequestDokan = async () => {
    const { makeRequestDokan, auth } = this.props;
    await makeRequestDokan(auth.token);
    const { myDokan } = this.props;
    if (myDokan.makeStatusRequest.status === "success") {
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

  _getDefaultResult = () => {
    const { myDokan } = this.props;
    const { makeStatusRequest } = myDokan;
    return makeStatusRequest.oResults.aFields.reduce((obj, item) => {
      return {
        ...obj,
        [item.name]: item.value
      };
    }, {});
  };

  _renderTextInput = props => {
    return (
      <View style={{ padding: 10 }}>
        <InputMaterial
          placeholder={props.label}
          name={props.name}
          required={props.required}
          value={this.state[`${props.name}`]}
          onFocus={() => props.onFocus(this.state[`${props.name}`])}
          onChangeText={this._handleChangeText(props)}
          onClearText={this._handleClearText(props)}
          defaultValue={props.defaultValue}
        />
        <Text style={styles.validate}>{props.error.message}</Text>
      </View>
    );
  };

  _renderSelectBox = props => {
    return (
      <View style={{ padding: 10 }} key={props.name}>
        <ModalPicker
          options={props.options}
          required={props.required}
          placeholder={props.label}
          label={props.label}
          onChangeOptions={this._handleChangeOptions(props)}
          matterial={true}
          multiple={false}
          clearSelectEnabled={false}
          // containerStyle={{ paddingVertical: 0 }}
        />
      </View>
    );
  };

  _renderError = () => {
    const { myDokan } = this.props;
    return (
      <AnimatedView style={{ padding: 10 }}>
        <Text
          style={{
            textAlign: "center",
            fontSize: 20,
            color: colorDark3,
            lineHeight: 28
          }}
        >
          {myDokan.makeStatusRequest.msg}
        </Text>
      </AnimatedView>
    );
  };

  _renderSuccess = () => {
    const { myDokan } = this.props;
    return (
      <AnimatedView style={{ padding: 10 }}>
        <Text
          style={{
            textAlign: "center",
            fontSize: 20,
            color: colorDark3,
            lineHeight: 26
          }}
        >
          {myDokan.postRequestResults.msg}
        </Text>
      </AnimatedView>
    );
  };

  _keyExtractor = (item, index) => index.toString();

  _renderForm = () => {
    const { myDokan, navigation } = this.props;
    const { makeStatusRequest } = myDokan;
    const { name } = navigation.state.params;
    const { success, loadingRequest } = this.state;
    const defaultStatus = this._getDefaultResult();
    return !success ? (
      <AnimatedView>
        <Heading
          title={makeStatusRequest.oResults.heading}
          textSize={17}
          style={styles.title}
        />
        <View style={styles.box}>
          <ContentBox
            headerTitle={makeStatusRequest.oResults.oInfo.balance.name}
          >
            <HtmlViewer
              html={makeStatusRequest.oResults.oInfo.balance.value}
              htmlWrapCssString={`font-size: 15px; font-weight: bold;`}
            />
          </ContentBox>
        </View>
        <Validator
          fields={makeStatusRequest.oResults.aFields}
          onSubmit={this._handleSubmit}
          renderSelectBox={this._renderSelectBox}
          renderTextInput={this._renderTextInput}
          defaultResult={defaultStatus}
          validateData={validateData}
          renderElementWithIndex={{
            render: handleSubmit => {
              return (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginHorizontal: 15,
                    marginVertical: 50
                  }}
                >
                  <Button
                    {...this.props}
                    backgroundColor="primary"
                    colorPrimary={colorPrimary}
                    size="md"
                    textStyle={{ fontSize: 17 }}
                    onPress={handleSubmit}
                    block={true}
                    isLoading={loadingRequest}
                    radius="round"
                  >
                    {name}
                  </Button>
                </View>
              );
            },
            moveByIndex: dataLength => {
              return dataLength;
            }
          }}
        />
      </AnimatedView>
    ) : (
      this._renderSuccess()
    );
  };

  renderContent = () => {
    const { myDokan } = this.props;
    const { isLoading, error } = this.state;
    return (
      <View style={{ width: screenWidth }}>
        {isLoading ? (
          <Loader />
        ) : error ? (
          this._renderError()
        ) : (
          this._renderForm()
        )}
      </View>
    );
  };
  render() {
    const { navigation, settings, translations, auth } = this.props;
    const { name } = navigation.state.params;

    const { isLoggedIn } = auth;
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
  validate: {
    color: "red",
    fontSize: 11
  },
  box: {
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  title: {
    paddingHorizontal: 10,
    paddingVertical: 10
  }
});
const mapStateToProps = state => ({
  myDokan: state.dokanReducer,
  auth: state.auth,
  settings: state.settings,
  translations: state.translations
});
const mapDispatchToProps = {
  makeRequestDokan,
  postRequestDokan
};
export default connect(mapStateToProps, mapDispatchToProps)(MakeRequestScreen);
