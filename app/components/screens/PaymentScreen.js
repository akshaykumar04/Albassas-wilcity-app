import React, { Component } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
  Keyboard
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { connect } from "react-redux";
import Constants from "expo-constants";
import ViewPager from "@react-native-community/viewpager";
import { StepIndicator, AnimatedView } from "../dumbs";
import { KeyboardSpacer, FontIcon, RTL } from "../../wiloke-elements";
import * as Consts from "../../constants/styleConstants";
import { MethodPayment, OrderPayment, FormPayment2 } from "../smarts";

const customStyle = colorPrimary => {
  return {
    labelColor: colorPrimary,
    currentStepLabelColor: colorPrimary,
    stepIndicatorLabelCurrentColor: "#fff",
    stepIndicatorLabelFinishedColor: "#fff",
    stepIndicatorLabelUnFinishedColor: "#333",
    stepIndicatorCurrentColor: colorPrimary,
    stepIndicatorFinishedColor: colorPrimary,
    stepIndicatorUnFinishedColor: "#fff",
    borderColorStepCurrent: colorPrimary,
    borderColorStepFinished: colorPrimary,
    borderColorStepUnfinised: "#e9e9e9",
    borderWidthStep: 2,
    backgroundProgressUnfinished: "#e9e9e9",
    separatorFinishedColor: colorPrimary
  };
};

const PAGES = ["page 1", "page 2", "page 3"];

class PaymentScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 0,
      disable: false
    };
  }

  _handleGoBack = () => {
    const { order } = this.props;
    if (order.statusPayment === "on-hold") {
      this.props.navigation.navigate("CartScreen");
      return;
    }
    this.props.navigation.goBack();
  };

  _handleStepPressed = async position => {
    if (position > this.state.currentPage) {
      return false;
    }
    await this.setState({
      currentPage: position,
      disable: false
    });
    this.viewPager.setPage(this.state.currentPage);
  };

  _handleNextPage = async page => {
    await this.setState({
      currentPage: page
    });
    this.viewPager.setPage(this.state.currentPage);
  };

  _renderStepIndicator = params => {
    return <Feather {...this._getIconStepIndicator(params)} />;
  };

  _getIconStepIndicator = ({ position, stepStatus }) => {
    const { settings } = this.props;
    const icon = {
      name: "home",
      color: stepStatus === "unfinished" ? settings.colorPrimary : "#fff",
      size: 20
    };
    switch (position) {
      case 0:
        icon.name = "map-pin";
        break;
      case 1:
        icon.name = "credit-card";
        break;
      case 2:
        icon.name = "check-square";
        break;
    }
    return icon;
  };

  _renderStep = () => {
    const { currentPage } = this.state;
    const { translations, settings } = this.props;
    return (
      <View style={styles.stepIndicator}>
        <StepIndicator
          stepCount={3}
          customStyles={customStyle(settings.colorPrimary)}
          currentPosition={currentPage}
          labels={[
            translations.shipment,
            translations.payment,
            translations.verify
          ]}
          renderStepIndicator={this._renderStepIndicator}
          onPress={this._handleStepPressed}
        />
      </View>
    );
  };

  renderViewPagerPage = data => {
    switch (data) {
      case "page 1":
        return this._renderForm(data);
      case "page 2":
        return this._renderMethod(data);
      case "page 3":
        return this._renderOrder(data);
    }
  };

  _renderForm = data => {
    return (
      <View key={data}>
        {/* <FormPayment onChangePage={this._handleNextPage} /> */}
        <FormPayment2
          onGoBack={this._handleGoBack}
          onChangePage={this._handleNextPage}
        />
      </View>
    );
  };

  _renderMethod = data => {
    return (
      <View key={data}>
        <MethodPayment
          onChangePage={this._handleNextPage}
          navigation={this.props.navigation}
        />
      </View>
    );
  };

  _renderOrder = data => {
    return (
      <View key={data}>
        <OrderPayment onChangePage={this._handleNextPage} />
      </View>
    );
  };

  _renderHeader = () => {
    const { translations, settings } = this.props;
    const rtl = RTL();
    return (
      <View style={[styles.header, { backgroundColor: settings.colorPrimary }]}>
        <TouchableOpacity style={styles.icon} onPress={this._handleGoBack}>
          <FontIcon
            name={rtl ? "chevron-right" : "fa-angle-left"}
            size={30}
            color="#fff"
          />
        </TouchableOpacity>
        <View style={styles.center}>
          <Text style={styles.title}>{translations.payment}</Text>
        </View>
        <Text style={{ width: "20%" }} />
      </View>
    );
  };

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <AnimatedView>
          {this._renderHeader()}
          {this._renderStep()}
          <View style={{ flex: 1 }}>
            <ViewPager
              style={{ flex: 1, flexGrow: 1 }}
              ref={viewPager => {
                this.viewPager = viewPager;
              }}
              scrollEnabled={false}
              orientation="horizontal"
              transitionStyle="scroll"
            >
              {PAGES.map(page => this.renderViewPagerPage(page))}
            </ViewPager>
          </View>
          <KeyboardSpacer />
        </AnimatedView>
      </TouchableWithoutFeedback>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  stepIndicator: {
    paddingTop: 10
  },
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  header: {
    paddingTop: Constants.statusBarHeight,
    height: 52 + Constants.statusBarHeight,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textTransform: "uppercase",
    paddingRight: 10
  },
  center: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center"
  },
  icon: {
    width: "20%",
    paddingLeft: 10,
    alignItems: "flex-start"
  }
});
const mapStateToProps = state => ({
  order: state.orderReducer,
  translations: state.translations,
  settings: state.settings
});
export default connect(mapStateToProps)(PaymentScreen);
