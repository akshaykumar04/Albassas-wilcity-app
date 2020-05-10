import React, { PureComponent } from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  Platform,
  FlatList,
  Modal,
  Alert
} from "react-native";
import Constants from "expo-constants";
import { Feather } from "@expo/vector-icons";
import { isEmpty, omit } from "lodash";
import { connect } from "react-redux";
import he from "he";

import {
  RequestTimeoutWrapped,
  Loader,
  ActionSheet,
  FontIcon,
  CheckBox
} from "../../wiloke-elements";
import * as Consts from "../../constants/styleConstants";
import {
  getBillingForm,
  getShippingForm,
  getResultsBilling,
  getResultsShipping,
  saveResultLocal
} from "../../actions";
import FormBilling from "../dumbs/FormPayment/FormBilling";
import { AnimatedView } from "../dumbs";

const IOS = Platform.OS === "ios";
const getDefaultResult = arr => {
  return arr.reduce((obj, item) => {
    return {
      ...obj,
      [item.name]: item.value
    };
  }, {});
};

class FormPayment2 extends PureComponent {
  results = {};

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isComplete: false,
      isVisible: false,
      panel: "billing",
      type: "edit",
      updated: false,
      loadingUpdated: false,
      checked: false
    };
  }
  componentDidMount() {
    this._getForm();
  }

  _handleClick = () => {
    this.props.onChangePage(1);
  };

  _handleOpenEdit = async (item, panel) => {
    await this.setState({
      type: "edit",
      panel
    });
    await this.setState({
      isVisible: true
    });
  };

  // _handleDelete = async (item, index) => {
  //   switch (index) {
  //     case 0:
  //       !IOS &&
  //         ToastAndroid.show(
  //           "Can't not delete billingForm",
  //           ToastAndroid.CENTER
  //         );
  //       break;
  //     case 1:
  //       this.results = {
  //         ...this.results,
  //         shippingResults: {}
  //       };
  //       this.setState({
  //         updated: true
  //       });
  //       break;
  //     default:
  //       return;
  //   }
  // };

  _handleActionSheet = (item, panel) => async index => {
    switch (index) {
      case 1:
        return this._handleOpenEdit(item, panel);
    }
  };

  _handleOpenShippingForm = () => {
    this.setState({
      panel: "shipping",
      isVisible: true,
      type: "adding"
    });
  };

  _handleSubmit = async result => {
    const { getResultsBilling, getResultsShipping, auth } = this.props;
    const { panel } = this.state;
    const isBilling = this.state.panel === "billing";
    await this.setState({
      loadingUpdated: true
    });
    if (isBilling) {
      await getResultsBilling(result, auth.token);
    } else {
      await getResultsShipping(result, auth.token);
    }
    const { payment } = this.props;
    if (
      typeof payment.updateBilling === "boolean" ||
      typeof payment.updateShipping === "boolean"
    ) {
      this.results = {
        ...this.results,
        [`${panel}Results`]: result
      };
      this.setState({
        isVisible: false
      });
    } else {
      Alert.alert(
        isBilling
          ? he.decode(payment.updateBilling)
          : he.decode(payment.updateShipping)
      );
    }
    this.setState({
      loadingUpdated: false
    });
  };

  _handleCloseModal = async () => {
    const { isVisible } = this.state;
    const { billingForm } = this.props;
    const isCompleteBilling =
      billingForm.filter(item => !item.value && item.required).length > 0;
    if (isVisible && isCompleteBilling) {
      await this.setState({
        isVisible: false
      });
      this.props.onGoBack();
      return;
    }
    this.setState({
      isVisible: false
    });
  };

  _getForm = async () => {
    const {
      getBillingForm,
      getShippingForm,
      auth,
      saveResultLocal
    } = this.props;
    await getBillingForm(auth.token);
    await getShippingForm(auth.token);
    const { billingForm, shippingForm } = this.props;
    if (!isEmpty(billingForm) && !isEmpty(shippingForm)) {
      const defaultBillingValue = getDefaultResult(billingForm);
      const defaultShippingValue = getDefaultResult(shippingForm);
      const isCompleteShippingForm =
        shippingForm.filter(item => item.required && !item.value).length > 0;
      this.results = {
        ...this.results,
        billingResults: defaultBillingValue,
        shippingResults: isCompleteShippingForm ? {} : defaultShippingValue
      };
      await saveResultLocal(
        this.results["billingResults"],
        this.results["shippingResults"]
      );
      this.setState({
        isLoading: false,
        isVisible:
          billingForm.filter(
            item => item.type !== "checkbox" && !item.value && item.required
          ).length > 0
      });
    }
  };

  // _renderItem = ({ item, index }) => {
  //   return isEmpty(item) ? null : (
  //     <View style={{ paddingVertical: 5, backgroundColor: "#fff" }}>
  //       <View style={styles.info}>
  //         <View style={styles.address}>
  //           <Text style={styles.name}>
  //             {item.first_name} {item.last_name}
  //           </Text>
  //           {!item.phone && <Text style={styles.text2}>{item.phone}</Text>}
  //           <Text style={styles.text2}>{item.address_1}</Text>
  //           <Text style={[styles.text2, { color: "red" }]}>{item.email}</Text>
  //         </View>
  //         <ActionSheet
  //           options={["Cancel", "Edit", "Delete"]}
  //           cancelButtonIndex={0}
  //           onAction={this._handleActionSheet(item, index)}
  //           renderButtonItem={() => (
  //             <View style={{ paddingHorizontal: 10 }}>
  //               <Feather name="edit" size={24} color="#333" />
  //             </View>
  //           )}
  //         />
  //       </View>
  //     </View>
  //   );
  // };

  _renderViewPanel = panel => {
    const { settings } = this.props;
    const item = this.results[`${panel}Results`];
    const isShipping = panel === "shipping";
    return (
      !isEmpty(item) && (
        <View style={[styles.viewPanel]}>
          <View style={styles.info}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {isShipping ? (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    paddingLeft: 5
                  }}
                >
                  <View style={styles.circle}>
                    {item["shipping_to_different_address"] && (
                      <View
                        style={[
                          styles.circleChecked,
                          { backgroundColor: settings.colorPrimary }
                        ]}
                      />
                    )}
                  </View>
                </View>
              ) : (
                <View style={{ paddingHorizontal: 15 }} />
              )}
              <View style={styles.address}>
                <Text style={styles.name}>
                  {item[`${panel}_first_name`]} {item[`${panel}_last_name`]}
                </Text>
                {item[`${panel}_phone`] ? (
                  <Text style={styles.text2}>{item[`${panel}_phone`]}</Text>
                ) : null}
                <Text style={styles.text2}>{item[`${panel}_address_1`]}</Text>
                <Text style={[styles.text2, { color: "red" }]}>
                  {item[`${panel}_email`]}
                </Text>
              </View>
            </View>
            <ActionSheet
              options={["Cancel", "Edit"]}
              cancelButtonIndex={0}
              onAction={this._handleActionSheet(item, panel)}
              renderButtonItem={() => (
                <View style={{ paddingHorizontal: 10 }}>
                  <Feather name="edit" size={24} color="#333" />
                </View>
              )}
            />
          </View>
        </View>
      )
    );
  };

  _renderAdressInfo = () => {
    const { isVisible } = this.state;
    const { translations } = this.props;
    return (
      <View style={{ flex: 1, marginTop: 10 }}>
        {this._renderViewPanel("billing")}
        <View
          style={{
            width: "100%",
            height: 1,
            backgroundColor: Consts.colorGray1
          }}
        />
        {this._renderViewPanel("shipping")}
        {isEmpty(this.results["shippingResults"]) && (
          <View style={{ paddingVertical: 5 }}>
            <TouchableOpacity
              style={[styles.btnShipping]}
              onPress={this._handleOpenShippingForm}
            >
              <Text style={{ paddingHorizontal: 10, color: "#222" }}>
                {translations.shippingToDifferentAddress}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <Modal
          visible={isVisible}
          onRequestClose={() => console.log("close")}
          transparent={false}
          animationType="fade"
        >
          <View style={styles.modalContent}>{this._renderForm()}</View>
        </Modal>
      </View>
    );
  };

  _renderForm = () => {
    const { billingForm, shippingForm, translations, settings } = this.props;
    const { panel, type, loadingUpdated } = this.state;
    const isBilling = panel === "billing";
    const title =
      type === "edit" ? translations.update : translations.addShippingForm;
    // const defaultBillingValue = getDefaultResult(billingForm);
    // const defaultShippingValue = getDefaultResult(shippingForm);
    return (
      <FormBilling
        data={isBilling ? billingForm : shippingForm}
        defaultResult={
          isBilling
            ? this.results["billingResults"]
            : this.results["shippingResults"]
        }
        onSubmit={this._handleSubmit}
        onCloseModal={this._handleCloseModal}
        title={title}
        translations={translations}
        isLoading={loadingUpdated}
        onChecked={this._handleCheckedShipping}
        colorPrimary={settings.colorPrimary}
      />
    );
  };

  render() {
    const { isLoading } = this.state;
    const { isPaymentTimeout, translations, settings } = this.props;

    return (
      <AnimatedView>
        <RequestTimeoutWrapped
          isTimeout={isPaymentTimeout}
          onPress={this._getForm}
          text={translations.networkError}
          buttonText={translations.retry}
        >
          {isLoading ? (
            <Loader />
          ) : (
            <ScrollView style={{ flex: 1, backgroundColor: Consts.colorGray1 }}>
              {this._renderAdressInfo()}
              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: settings.colorPrimary }
                ]}
                onPress={this._handleClick}
              >
                <Text style={styles.text}>
                  {translations.goToPaymentGateway}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </RequestTimeoutWrapped>
      </AnimatedView>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
    marginHorizontal: 10,
    marginVertical: 25,
    paddingVertical: 7
  },
  viewPanel: {
    paddingVertical: 5,
    backgroundColor: "#fff"
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    paddingVertical: 7
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
  modalContent: {
    // paddingTop: Constants.statusBarHeight
    flex: 1
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
    padding: 13
  },
  btnShipping: {
    backgroundColor: "#fff",
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 5
  },
  title2: {
    color: "#fff",
    fontSize: 16,
    textTransform: "uppercase",
    fontWeight: "bold"
  },
  circle: {
    borderWidth: 2,
    borderColor: Consts.colorGray1,
    width: 25,
    height: 25,
    borderRadius: 100,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center"
  },
  circleChecked: {
    width: 12,
    height: 12,
    borderRadius: 100
  }
});
const mapStateToProps = state => ({
  payment: state.paymentReducer,
  billingForm: state.paymentReducer.billingForm,
  shippingForm: state.paymentReducer.shippingForm,
  billingResults: state.paymentReducer.billingResult,
  shippingResults: state.paymentReducer.shippingResults,
  isPaymentTimeout: state.isPaymentTimeout,
  translations: state.translations,
  auth: state.auth,
  settings: state.settings
});
const mapDispatchToProps = {
  getBillingForm,
  getShippingForm,
  getResultsBilling,
  getResultsShipping,
  saveResultLocal
};
export default connect(mapStateToProps, mapDispatchToProps)(FormPayment2);
