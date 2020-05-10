import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import {
  InputMaterial,
  Button,
  CheckBox,
  ContentBox,
  P,
  ImageUpload,
  Switch,
  SocialField,
  validEmail,
  validPhone,
  validUrl
} from "../../wiloke-elements";
import _ from "lodash";
import * as Consts from "../../constants/styleConstants";
import * as WebBrowser from "expo-web-browser";

const mapResultToResultError = arr => {
  return arr.map(item => ({
    ...item,
    presence: false,
    special: false,
    length: false
  }));
};

const getStatus = validations =>
  validations.filter(item => item.presence || item.special || item.length)
    .length > 0
    ? "error"
    : "success";

export default class Form extends Component {
  static propTypes = {
    ...InputMaterial.propTypes,
    ...Button.propTypes,
    ...ContentBox.propTypes,
    ...CheckBox.propTypes,
    ...ImageUpload.propTypes,
    ...Switch.propTypes,
    ...SocialField.propTypes,
    colorPrimary: PropTypes.string,
    text: PropTypes.string,
    renderTopComponent: PropTypes.func,
    renderBottomComponent: PropTypes.func,
    onSubmitResults: PropTypes.func,
    onResult: PropTypes.func,
    defaultResults: PropTypes.object,
    renderButtonSubmit: PropTypes.func
  };

  static defaultProps = {
    renderTopComponent: _ => {},
    renderBottomComponent: _ => {},
    onSubmitResults: _ => {},
    onResult: _ => {},
    renderButtonSubmit: _ => {},
    defaultResults: {}
  };

  constructor(props) {
    super(props);
    const { defaultResults, data } = this.props;
    this.state = {
      results: defaultResults,
      validations: mapResultToResultError(data),
      isFieldFocus: null,
      isFieldFocusObj: {},
      status: "success"
    };
    this.props.onResult(defaultResults, "error");
  }

  async componentDidMount() {
    const { defaultResults, data } = this.props;
    await this.setState({
      results: defaultResults,
      validations: mapResultToResultError(data)
    });
    this.props.onResult(this.state.results);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!_.isEqual(nextState.results, this.state.results)) {
      return true;
    }
    if (!_.isEqual(nextState.validations, this.state.validations)) {
      return true;
    }
    if (
      !_.isEqual(nextProps.renderButtonSubmit, this.props.renderButtonSubmit)
    ) {
      return true;
    }
    return false;
  }

  renderMessageError = (validationType, typeErr) => {
    const { validationData } = this.props;
    const message =
      !_.isEmpty(validationData[validationType][typeErr]) &&
      validationData[validationType][typeErr].message;
    return (
      message && (
        <View style={{ marginTop: -8 }}>
          <P
            style={{
              color: Consts.colorQuaternary,
              fontSize: 12,
              textAlign: "left"
            }}
          >
            {message}
          </P>
        </View>
      )
    );
  };

  _renderInputText = (item, type) => {
    const { colorPrimary, validationData } = this.props;
    return (
      <View>
        <InputMaterial
          {...item}
          placeholder={item.placeholder || item.label}
          colorPrimary={colorPrimary}
          secureTextEntry={type === "password" && true}
          multiline={type === "textarea" && true}
          value={this.state.results[item.name]}
          clearTextEnabled={false}
          onFocus={({ nativeEvent }) => {
            const { validations, results } = this.state;
            const eventCount = !_.isEmpty(results[item.name])
              ? results[item.name].length
              : 0;
            this.setState({
              validations: validations.map(_item => {
                return {
                  ..._item,
                  presence:
                    item.required && item.name === _item.name
                      ? eventCount === 0
                        ? true
                        : false
                      : _item.presence
                };
              })
            });
          }}
          onChangeText={text => {
            const { results, validations } = this.state;
            const eventCount = text.length;
            this.setState({
              results: {
                ...results,
                [item.name]: text
              },
              validations: validations.map(_item => {
                return {
                  ..._item,
                  presence:
                    item.required && item.name === _item.name
                      ? eventCount === 0
                        ? true
                        : false
                      : _item.presence,
                  length:
                    item.required && item.name === _item.name
                      ? eventCount > 1 &&
                        !_.isEmpty(
                          validationData[item.validationType].length
                        ) &&
                          eventCount <
                            validationData[item.validationType].length
                              .minimum &&
                        !_item.special
                        ? true
                        : false
                      : _item.length,
                  special:
                    item.required && item.name === _item.name
                      ? eventCount > 0 &&
                        ((!validEmail(text) &&
                          item.validationType === "email") ||
                          (!validPhone(text) &&
                            item.validationType === "phone") ||
                          (!validUrl(text) && item.validationType === "url"))
                        ? true
                        : false
                      : _item.special
                };
              })
            });
            this.props.onResult(
              this.state.results,
              getStatus(this.state.validations)
            );
          }}
        />
        {item.presence &&
          this.renderMessageError(item.validationType, "presence")}
        {item.length && this.renderMessageError(item.validationType, "length")}
        {item.special &&
          this.renderMessageError(item.validationType, "special")}
      </View>
    );
  };

  _renderLink = item => {
    return (
      <View>
        <View style={{ height: 20 }} />
        <TouchableOpacity activeOpacity={0.6} {...item}>
          <P>{item.text}</P>
        </TouchableOpacity>
      </View>
    );
  };

  // _renderButton = item => {
  //   const { colorPrimary, onSubmitResults } = this.props;
  //   const { results, validations } = this.state;
  //   this.props.renderButtonSubmit(results, getStatus(validations));
  //   // return (
  //   //   <Button
  //   //     colorPrimary={colorPrimary}
  //   //     {...item}
  //   //     onPress={() => {
  //   //       onSubmitResults(results);
  //   //     }}
  //   //   >
  //   //     {item.buttonText}
  //   //   </Button>
  //   // );
  // };

  _renderCheckbox = item => {
    const { colorPrimary } = this.props;
    return (
      <View>
        <CheckBox
          circleAnimatedColor={[Consts.colorDark4, colorPrimary]}
          iconBackgroundColor={colorPrimary}
          {...item}
          onPress={async (name, isChecked) => {
            await this.setState({
              results: {
                ...this.state.results,
                [name]: isChecked
              }
            });
            this.props.onResult(this.state.results);
          }}
        />
        <View style={{ height: 10 }} />
      </View>
    );
  };

  _handleWebBrowser = url => _ => {
    WebBrowser.openBrowserAsync(url);
  };

  _renderCheckbox2 = item => {
    const { colorPrimary } = this.props;
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 7
        }}
      >
        <TouchableOpacity
          activeOpacity={0.6}
          style={{ width: "80%", marginTop: 6 }}
          onPress={this._handleWebBrowser(item.link)}
        >
          <P style={{ textDecorationLine: "underline" }}>{item.label}</P>
        </TouchableOpacity>
        <CheckBox
          circleAnimatedColor={[Consts.colorDark4, colorPrimary]}
          iconBackgroundColor={colorPrimary}
          name={item.name}
          onPress={async (name, isChecked) => {
            await this.setState({
              results: {
                ...this.state.results,
                [name]: isChecked
              }
            });
            this.props.onResult(this.state.results);
          }}
        />
      </View>
    );
  };

  _renderImageUpload = item => {
    const { results } = this.state;
    return (
      <View>
        <ImageUpload
          {...item}
          defaultUri={!_.isEmpty(results) ? results[item.name] : ""}
          aspect={item.name === "avatar" ? [1, 1] : [16, 9]}
          onChange={async result => {
            const { base64, uri } = result;
            const filename = uri.split("/").pop();
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image`;
            await this.setState({
              results: {
                ...this.state.results,
                [item.name]: {
                  uri,
                  name: filename,
                  base64,
                  type
                }
              }
            });
            this.props.onResult(this.state.results);
          }}
        />
        <View style={{ height: 10 }} />
      </View>
    );
  };

  _renderSwitch = item => {
    const { colorPrimary } = this.props;
    return (
      <View>
        <Switch
          {...item}
          colorActive={colorPrimary}
          swipeActiveColor={colorPrimary}
          circleAnimatedColor={[Consts.colorDark4, colorPrimary]}
          style={{
            borderBottomWidth: 2,
            borderBottomColor: Consts.colorGray1,
            paddingBottom: 8
          }}
          onPress={async (name, isChecked) => {
            await this.setState({
              results: {
                ...this.state.results,
                [name]: isChecked
              }
            });
            this.props.onResult(this.state.results);
          }}
        />
        <View style={{ height: 10 }} />
      </View>
    );
  };

  _renderSocial = item => {
    const { colorPrimary } = this.props;
    const defaultResults =
      !_.isEmpty(this.state.results) && this.state.results[item.name].length > 0
        ? this.state.results[item.name]
        : [{ id: "", url: "" }];
    return (
      <View>
        <SocialField
          {...item}
          socials={item.options}
          colorPrimary={colorPrimary}
          defaultResults={defaultResults}
          onChangeResults={async results => {
            await this.setState({
              results: {
                ...this.state.results,
                [item.name]: results
              }
            });
            this.props.onResult(this.state.results);
          }}
        />
      </View>
    );
  };

  _checkRender = item => {
    switch (item.type) {
      case "inputText":
      case "text":
        return this._renderInputText(item);
      case "textarea":
        return this._renderInputText(item, "textarea");
      case "password":
        return this._renderInputText(item, "password");
      case "link":
        return this._renderLink(item);
      // case "submit":
      //   return this._renderButton(item);
      case "checkbox":
        return this._renderCheckbox(item);
      case "checkbox2":
        return this._renderCheckbox2(item);
      case "file":
        return this._renderImageUpload(item);
      case "switch":
        return this._renderSwitch(item);
      case "social_networks":
        return this._renderSocial(item);
      default:
        return false;
    }
  };

  render() {
    const {
      colorPrimary,
      data,
      renderTopComponent,
      renderBottomComponent,
      renderButtonSubmit,
      ...contentBoxProps
    } = this.props;
    const { validations, results } = this.state;

    return (
      <View style={{ position: "relative" }}>
        <ContentBox {...contentBoxProps} colorPrimary={colorPrimary}>
          <View>
            {renderTopComponent()}
            {!_.isEmpty(validations) &&
              validations.map((item, index) => (
                <View key={index.toString()}>{this._checkRender(item)}</View>
              ))}
            {renderButtonSubmit(results, getStatus(validations))}
            {renderBottomComponent()}
          </View>
        </ContentBox>
      </View>
    );
  }
}
