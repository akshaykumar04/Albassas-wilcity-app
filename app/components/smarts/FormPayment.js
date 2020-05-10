import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  ToastAndroid,
  Platform
} from "react-native";
import Constants from "expo-constants";
import { isEmpty, omit } from "lodash";
import { connect } from "react-redux";

import {
  Validator,
  Loader,
  InputMaterial,
  CheckBox,
  RequestTimeoutWrapped,
  ActionSheet
} from "../../wiloke-elements";
import validateData from "../../utils/validateData";
import { colorPrimary, colorGray1 } from "../../constants/styleConstants";
import {
  getBillingForm,
  getShippingForm,
  getResultsBilling,
  getResultsShipping
} from "../../actions";
import { Feather } from "@expo/vector-icons";
import FormBilling from "../dumbs/FormPayment/FormBilling";

const getDefaultResult = fields => {
  return Object.keys(fields).reduce((obj, panel) => {
    return {
      ...obj,
      [panel]: fields[panel].reduce((obj2, item) => {
        return {
          ...obj2,
          [item.name]: item.value || ""
        };
      }, {})
    };
  }, {});
};

class FormPayment extends PureComponent {
  errors = {};
  results = {};
  submitGroup = {};
  valid = [];
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      checked: false,
      page: 0,
      errorHandle: {},
      isComplete: false,
      isVisible: false,
      formPanel: "billingForm",
      type: "edit"
    };
  }

  componentDidMount() {
    this._getBillingForm();
  }

  _getBillingForm = async () => {
    const { getBillingForm, auth } = this.props;
    await getBillingForm(auth.token);
    const { fields } = this.props;

    if (!isEmpty(fields.billingForm)) {
      const defaultResults = getDefaultResult(fields);
      this.results = {
        ...this.results,
        ...defaultResults
      };
      this.setState({
        isLoading: false,
        isComplete: !fields.billingForm.filter(
          item => item.type !== "checkbox" && item.required && !item.value
        ).length
      });
    }
  };

  _handleChangeText = (props, panel) => text => {
    this.setState({
      [`${props.name}_${panel}`]: text
    });
    props.onChange(text);
  };

  _handleClearText = (props, panel) => () => {
    this._handleChangeText(props, panel)("");
  };

  _handlePressCheck = (panel, props) => async (name, checked) => {
    const { getShippingForm, auth } = this.props;
    await props.onChange(checked);

    await getShippingForm(checked, auth.token);
    await this.setState({
      checked
    });

    if (!checked) {
      this.results = omit(this.results, "shippingForm");
      this.errors = omit(this.errors, "shippingForm");
      // fields[panel].forEach(item =>
      //   this.setState({
      //     [`${item.name}_shippingForm`]: ""
      //   })
      // );
      return;
    }
  };

  _handleCustomSubmit = panel => handleSubmit => {
    this.submitGroup = {
      ...this.submitGroup,
      [panel]: handleSubmit
    };
  };

  _handleSubmit = panel => async props => {
    const { fields, getResultsBilling, getResultsShipping } = this.props;
    this.results = {
      ...this.results,
      [panel]: props.result
    };
    this.errors = {
      ...this.errors,
      [panel]: props.errors
    };
    this.valid = [...this.valid, props.valid];
    if (
      !this.valid.includes(false) &&
      isEmpty(
        Object.values(this.errors[panel])
          .map(item => item.status)
          .filter(item => item)
      ) &&
      !isEmpty(this.submitGroup) &&
      Object.keys(fields).length === Object.keys(this.results).length
    ) {
      getResultsBilling(this.results["billingForm"]);
      this.results["shippingForm"] &&
        getResultsShipping(this.results["shippingForm"]);
      this.props.onChangePage(1);
    }
  };

  _handleClick = () => {
    const { fields } = this.props;

    Object.keys(fields).forEach(panel => {
      this.submitGroup[panel]();
    });
    this.errors = {};
    this.results = {};
    this.valid = [];
  };

  _handleOpenAddForm = async () => {
    const { getShippingForm, auth } = this.props;
    await this.setState({
      isLoading: true,
      type: "add"
    });
    await getShippingForm(true, auth.token);
    const { fields } = this.props;
    const defaultResult = getDefaultResult(fields);
    this.results = {
      ...this.results,
      shippingForm: defaultResult["shippingForm"]
    };
    await this.setState({
      isVisible: true,
      checked: true,
      formPanel: "shippingForm",
      isLoading: false
    });
  };

  _handleActionSheet = item => index => {
    switch (index) {
      case 1:
        return this._handleOpenEdit();
      case 2:
        return this._handleDelete(item);
    }
  };

  _handleDelete = item => {
    if (item === "billingForm") {
      Platform.OS === "android" &&
        ToastAndroid.show(
          "You can not delete billing address",
          ToastAndroid.CENTER
        );
    }
    console.log(this.results);
  };

  _handleOpenEdit = () => {
    this.setState({
      isVisible: true,
      type: "edit"
    });
  };

  _handleEdit = (result, visible) => {
    this.results = {
      ...this.results,
      [this.state.formPanel]: result
    };
    this.setState({
      isVisible: visible
    });
  };

  _closeModal = async () => {
    const { getShippingForm, auth } = this.props;
    const { type } = this.state;
    if (type === "edit") {
      this.setState({
        isVisible: false
      });
      return;
    }
    await getShippingForm(false, auth.token);

    await this.setState({
      formPanel: "billingForm"
    });
    this.results = omit(this.results, "shippingForm");
    await this.setState({
      isVisible: false,
      checked: false
    });
  };

  _renderForm = () => {
    const { fields } = this.props;
    return Object.keys(fields).map(this._renderValidator);
  };

  _renderValidator = (panel, index) => {
    const { fields } = this.props;
    return (
      <Validator
        key={panel}
        fields={fields[panel]}
        validateData={validateData}
        onSubmit={this._handleSubmit(panel)}
        renderTextInput={this._renderTextInput(panel)}
        renderCheckbox={this._renderCheckBox(panel)}
        customSubmit={this._handleCustomSubmit(panel)}
        defaultResult={this.results[panel]}
      />
    );
  };

  _renderTextInput = panel => props => {
    return (
      <View style={{ paddingVertical: 5 }} key={props.name}>
        <InputMaterial
          placeholder={props.label}
          required={props.required}
          name={props.name}
          value={this.state[`${props.name}_${panel}`]}
          onFocus={() => props.onFocus(this.state[`${props.name}_${panel}`])}
          onChangeText={this._handleChangeText(props, panel)}
          onClearText={this._handleClearText(props, panel)}
          defaultValue={props.defaultValue}
        />
        <Text style={styles.validate}>{props.error.message}</Text>
      </View>
    );
  };

  _renderCheckBox = panel => props => {
    return (
      <CheckBox
        checked={this.state.checked}
        label={props.label}
        name={props.name}
        reverse
        key={props.name}
        style={{ paddingHorizontal: 10, paddingVertical: 5 }}
        onPress={this._handlePressCheck(panel, props)}
      />
    );
  };

  _keyExtractor = (item, index) => item;

  _renderItem = ({ item, index }) => {
    return (
      <View style={{ paddingVertical: 5, backgroundColor: "#fff" }}>
        <TouchableOpacity style={styles.info}>
          <View style={styles.address}>
            <Text
              style={styles.name}
            >{`${this.results[item].first_name} ${this.results[item].last_name}`}</Text>
            {!this.results[item].phone && (
              <Text style={styles.text2}>
                {" "}
                {`${this.results[item].phone}`}{" "}
              </Text>
            )}
            <Text style={styles.text2}>
              {`${this.results[item].address_1}`}
            </Text>
          </View>
          <ActionSheet
            options={["Cancel", "Edit", "Delete"]}
            cancelButtonIndex={0}
            onAction={this._handleActionSheet(item)}
            renderButtonItem={() => (
              <View style={{ paddingHorizontal: 10 }}>
                <Feather name="edit" size={24} color="#333" />
              </View>
            )}
          />
        </TouchableOpacity>
      </View>
    );
  };

  _renderAddressInfo = () => {
    const { fields } = this.props;
    const data = Object.keys(fields).map(item => item);
    return (
      <View style={{ flex: 1, marginTop: 10 }}>
        <FlatList
          data={data}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
        />
        {Object.keys(this.results).length < 2 && (
          <View style={{ paddingVertical: 5 }}>
            <TouchableOpacity
              style={[styles.info, { backgroundColor: "#fff" }]}
              onPress={this._handleOpenAddForm}
            >
              <Text style={styles.name}>Add Shipping Address</Text>
            </TouchableOpacity>
          </View>
        )}
        <Modal
          visible={this.state.isVisible}
          onRequestClose={() => console.log("close")}
          transparent={false}
          animationType="slide"
        >
          <View style={styles.modalContent}>
            {this._renderForm2(this.state.formPanel)}
          </View>
        </Modal>
      </View>
    );
  };

  _renderForm2 = panel => {
    const { fields } = this.props;
    const { type } = this.state;
    return (
      <View style={{}}>
        <FormBilling
          data={fields[panel]}
          panel={panel}
          defaultResult={this.results[panel]}
          onSubmit={this._handleEdit}
          title={type === "edit" ? "Update" : "Add New Address"}
          onCloseModal={this._closeModal}
          type={type}
        />
      </View>
    );
  };

  render() {
    const { isLoading, isComplete } = this.state;
    const { isPaymentTimeout, translations } = this.props;

    return (
      <RequestTimeoutWrapped
        isTimeout={isPaymentTimeout}
        onPress={this._getBillingForm}
        text={translations.networkError}
        buttonText={translations.retry}
      >
        {isLoading ? (
          <Loader />
        ) : (
          <ScrollView style={{ flex: 1, backgroundColor: colorGray1 }}>
            {(!isComplete && this._renderForm()) || this._renderAddressInfo()}
            <TouchableOpacity style={styles.button} onPress={this._handleClick}>
              <Text style={styles.text}>Go to payment gateways</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </RequestTimeoutWrapped>
    );
  }
}
const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colorPrimary,
    borderRadius: 3,
    marginHorizontal: 10,
    marginVertical: 25,
    paddingVertical: 7
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    paddingVertical: 7
  },
  validate: {
    color: "red",
    fontSize: 11
  },
  info: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10
  },
  address: {
    paddingHorizontal: 10
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    paddingVertical: 5
  },
  text2: {
    fontSize: 12,
    paddingVertical: 3
  },
  modalContent: {},
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
    padding: 13
  }
});

const mapStateToProps = state => ({
  fields: state.paymentReducer.fields,
  billingResults: state.paymentReducer.billingResult,
  shippingResults: state.paymentReducer.shippingResults,
  isPaymentTimeout: state.isPaymentTimeout,
  translations: state.translations,
  auth: state.auth
});

const mapDispatchToProps = {
  getBillingForm,
  getShippingForm,
  getResultsBilling,
  getResultsShipping
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormPayment);
