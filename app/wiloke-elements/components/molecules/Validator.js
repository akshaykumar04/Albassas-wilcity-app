import React, { Component } from "react";
import { View } from "react-native";
import PropTypes from "prop-types";
import { isEmpty, isEqual } from "lodash";

const isDev = process.env.NODE_ENV === "development";

export default class Validator extends Component {
  static propTypes = {
    fields: PropTypes.array.isRequired,
    validateData: PropTypes.object,
    defaultResult: PropTypes.object,
    defaultErrors: PropTypes.object,
    onSubmit: PropTypes.func,
    onChange: PropTypes.func,
    renderTextInput: PropTypes.func,
    renderCheckbox: PropTypes.func,
    renderRadio: PropTypes.func,
    renderSelectBox: PropTypes.func,
    renderChooseFile: PropTypes.func,
    customSubmit: PropTypes.func,
    renderElementWithIndex: PropTypes.shape({
      render: PropTypes.func,
      moveByIndex: PropTypes.func
    }),
    containerProps: PropTypes.object,
    defineFields: PropTypes.object,
    patterns: PropTypes.object
  };

  static defaultProps = {
    validateData: {},
    defaultResult: {},
    defaultErrors: {},
    onSubmit: () => {},
    onChange: () => {},
    renderTextInput: () => null,
    renderCheckbox: () => null,
    renderRadio: () => null,
    renderSelectBox: () => null,
    renderChooseFile: () => null,
    customSubmit: () => {},
    renderElementWithIndex: {
      render: () => {},
      moveByIndex: () => {}
    },
    containerProps: {},
    defineFields: {
      text: "renderTextInput",
      password: "renderTextInput",
      email: "renderTextInput",
      phone: "renderTextInput",
      checkbox: "renderCheckbox",
      radio: "renderRadio",
      file: "renderChooseFile",
      select: "renderSelectBox"
    },
    patterns: {}
  };

  state = {
    fields: [],
    validateData: {},
    errors: {},
    result: {}
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      !isEmpty(prevState.fields) &&
      !isEqual(nextProps.fields, prevState.fields)
    ) {
      return {
        fields: nextProps.fields
      };
    }
    return null;
  }

  async componentDidMount() {
    const {
      defaultResult,
      defaultErrors,
      fields,
      validateData,
      customSubmit
    } = this.props;

    // setState component ready
    await this.setState({
      fields,
      result: {
        ...this._getObjectFromArray(fields, ""),
        ...defaultResult
      },
      validateData: {
        ...this._getObjectFromArray(fields, {}),
        ...validateData
      },
      errors: defaultErrors
    });

    // xử lý prop onChange
    this._handleFormOnChange();

    // customSubmit
    customSubmit(this._handleSubmit);
  }

  componentDidUpdate(prevProps, prevState) {
    const { result } = this.state;
    if (!isEqual(result, prevState.result)) {
      this._handleFormOnChange();
    }
  }

  _getDefineFields = () => {
    const { defineFields } = this.props;
    return defineFields;
  };

  _getPatterns = () => {
    const { patterns } = this.props;
    return {
      /* eslint-disable */
      email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
      phone: /^(\+|)\d*$/,
      url: /^(ftp|http|https):\/\/[^ "]+$/,
      ...patterns
    };
  };

  _validFieldSpecial = ({ type, value }) => {
    const patterns = this._getPatterns();
    const pattern = patterns[type];
    return value.length > 0 && pattern.test(String(value));
  };

  _getObjectFromArray = (arr, value) => {
    return arr.reduce((obj, item) => {
      return {
        ...obj,
        [item.name]: value
      };
    }, {});
  };

  // trả về true nếu mảng errors rỗng
  // nghĩa là không có lỗi xảy ra
  _getValid = () => {
    const { errors } = this.state;
    const messageErrors = Object.keys(errors).reduce((arr, name) => {
      const { message } = errors[name];
      return [...arr, ...(!!message ? [message] : [])];
    }, []);
    return isEmpty(messageErrors);
  };

  _handleFormOnChange = () => {
    const { onChange } = this.props;
    const { result, errors } = this.state;
    const valid = this._getValid();
    onChange({ result, valid, errors });
  };

  // check những trường hợp có điền patterns
  _checkFieldSpecial = ({ name, value, special }) => {
    const patterns = this._getPatterns();
    for (const type in patterns) {
      if (name === type) {
        return !this._validFieldSpecial({ type, value }) && special.message;
      }
    }
  };

  _hasValue = value => {
    return typeof value === "object" ? !isEmpty(value) : !!value;
  };

  _getMessageErrorFocus = ({ name, required, value }) => {
    const { validateData } = this.state;
    const { presence } = validateData[name];
    if (!!presence && required && !this._hasValue(value)) {
      return presence.message;
    }
  };

  _getMessageErrorBeforeSubmit = ({ name, required, value }) => {
    const { validateData } = this.state;
    const { presence, length, special } = validateData[name];
    if (!!presence && required && !this._hasValue(value)) {
      return presence.message;
    }
    if (!!length && value.length > 0 && value.length <= length.minimum) {
      return length.message;
    }
    if (!!special && value.length > 0) {
      return this._checkFieldSpecial({ name, value, special });
    }
  };

  _setResult = ({ name, value }) => {
    const { result } = this.state;
    this.setState({
      result: {
        ...result,
        [name]: value
      }
    });
  };

  _setErrors = ({ name, error }) => {
    const { errors } = this.state;
    this.setState({
      errors: {
        ...errors,
        [name]: {
          status: !!error ? true : false,
          message: !!error ? error : ""
        }
      }
    });
  };

  _handleFieldFocus = ({ name, required }) => value => {
    const { result } = this.state;
    const error = this._getMessageErrorFocus({
      name,
      required,
      value
    });
    if (!result[name]) {
      this._setErrors({ name, error });
    }
  };

  _conditionLength = ({ length, presence, special, value, required }) => {
    return (
      !!length &&
      ((!presence && value.length <= length.minimum) ||
        (value.length > 0 && value.length <= length.minimum) ||
        (!!special &&
          !required &&
          value.length > 0 &&
          value.length <= length.minimum) ||
        (required && value.length > 0 && value.length <= length.minimum))
    );
  };

  _conditionSpecial = ({ length, presence, special, value, required }) => {
    return (
      !!special &&
      ((!length && value.length > 0 && required) ||
        (!length && !presence && value.length >= 0) ||
        (!required && value.length > 0) ||
        (!!length && !presence && value.length > 0) ||
        (!!length && !!presence && required && value.length > 0))
    );
  };

  conditionPresence = ({ presence, required, value }) => {
    return !!presence && required && value.length <= 0;
  };

  _getMessageErrorFieldChange = ({ name, value, required }) => {
    const { validateData } = this.state;
    const { length, presence, special } = validateData[name];

    if (this._conditionLength({ length, presence, special, value, required })) {
      return length.message;
    }

    if (
      this._conditionSpecial({ length, presence, special, value, required })
    ) {
      return this._checkFieldSpecial({ name, value, special });
    }

    if (this.conditionPresence({ presence, required, value })) {
      return presence.message;
    }
  };

  _handleDefaultFieldChange = ({ name, required }) => value => {
    const error = this._getMessageErrorFieldChange({
      name,
      value,
      required
    });
    this._setErrors({ name, error });
    this._setResult({ name, value });
  };

  _throwErrorType = item => {
    const defineFields = this._getDefineFields();
    const getDefineTypeKey = Object.keys(defineFields);
    if (isDev) {
      const error = new Error(
        !item.type
          ? `Cần truyền thêm type cho ${JSON.stringify(item)}`
          : `Không có type: ${
              item.type
            }.\nType phải là các phần tử ${JSON.stringify(getDefineTypeKey)}`
      );
      throw error.message;
    }
  };

  _handleBeforeSubmit = async () => {
    const { result, fields, errors } = this.state;
    const getObj = value => {
      return fields.reduce((obj, item) => {
        return {
          ...obj,
          [item.name]: item[value]
        };
      }, {});
    };
    await this.setState({
      errors: {
        ...errors,
        ...Object.keys(result).reduce((obj, name) => {
          const value = result[name];
          const required = getObj("required")[name];
          const type = getObj("type")[name];
          const error = this._getMessageErrorBeforeSubmit({
            name,
            required,
            value
          });
          return {
            ...obj,
            [name]: {
              status: !!error ? true : false,
              message: !!error ? error : ""
            }
          };
        }, {})
      }
    });
  };

  _handleSubmit = async event => {
    const { onSubmit } = this.props;
    const { result } = this.state;
    await this._handleBeforeSubmit();
    const { errors } = this.state;
    const valid = this._getValid();
    onSubmit({ result, valid, errors });
  };

  _handleErrorItemField = item => {
    if (typeof item !== "object") {
      throw new Error(`Phần tử của fields truyền vào phải là 1 object`).message;
    }
    const arr = Object.keys(item);
    if (!arr.includes("name")) {
      throw new Error(`Phần tử của fields truyền vào phải có thuộc tính name`)
        .message;
    }
    if (!arr.includes("type")) {
      throw new Error(`Phần tử của fields truyền vào phải có thuộc tính type`)
        .message;
    }
  };

  _renderItem = item => {
    const { errors, result } = this.state;
    const { type, name, required } = item;
    const errorDefault = {
      status: false,
      message: ""
    };
    const error = errors[item.name] || errorDefault;
    const itemGeneral = {
      ...item,
      error,
      defaultValue: result[name],
      onChange: this._handleDefaultFieldChange({ name, required }),
      onFocus: this._handleFieldFocus({
        name,
        required
      })
    };
    const defineFields = this._getDefineFields();

    for (const prop in defineFields) {
      const fn = defineFields[prop];
      if (type === prop) {
        return this.props[fn](itemGeneral);
      }
    }
    return this._throwErrorType(itemGeneral);
  };

  _handleItem = (item, index, fields) => {
    const { renderElementWithIndex } = this.props;
    const { render, moveByIndex } = renderElementWithIndex;
    const _getIndex = moveByIndex(fields.length);
    const _index =
      _getIndex > fields.length - 1 ? fields.length - 1 : _getIndex;
    this._handleErrorItemField(item);
    const elementWithIndex = (
      <View key="___elementWithIndex___">{render(this._handleSubmit)}</View>
    );
    return [
      _getIndex < 0 && index === 0 && elementWithIndex,
      <View key={item.name}>{this._renderItem(item)}</View>,
      index === _index && elementWithIndex
    ];
  };

  render() {
    const { containerProps } = this.props;
    const { fields } = this.state;
    return (
      <View {...containerProps}>
        {!isEmpty(fields) && fields.map(this._handleItem)}
      </View>
    );
  }
}
