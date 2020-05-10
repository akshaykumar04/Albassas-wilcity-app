import React, { PureComponent } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { getBookingDetails } from "../../actions";
import {
  screenWidth,
  colorGray1,
  colorPrimary
} from "../../constants/styleConstants";
import { MessageError, Loader } from "../../wiloke-elements";
import { ContentBoxOrder, Layout, AnimatedView } from "../dumbs";

class BookingDetailScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };
  }

  componentDidMount() {
    this._getBookingDetails();
  }

  _handleOrder = (id, status) => () => {
    const { navigation } = this.props;
    navigation.navigate("OrderDetailsScreen", {
      orderID: id,
      statusOrder: status
    });
  };

  _getBookingDetails = async () => {
    const { getBookingDetails, auth, navigation } = this.props;
    const { bookingID } = navigation.state.params;
    await getBookingDetails(auth.token, bookingID);
    const { myBooking } = this.props;
    const { status, data } = myBooking.bookingDetails;
    if (status === "success") {
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

  _renderBox1 = () => {
    const { myBooking, translations } = this.props;
    const { data } = myBooking.bookingDetails;
    return (
      <View style={styles.border}>
        <View style={styles.row}>
          <Text style={styles.text}>{translations.startDate}</Text>
          <Text style={styles.text}>{data.oBooking.startDate}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.text}>{translations.endDate}</Text>
          <Text style={styles.text}>{data.oBooking.endDate}</Text>
        </View>
      </View>
    );
  };

  _renderOrderBox = () => {
    const { myBooking, translations } = this.props;
    const { data } = myBooking.bookingDetails;
    return (
      <TouchableOpacity
        style={styles.border}
        onPress={this._handleOrder(data.oBooking.orderID, data.oBooking.status)}
      >
        <View style={styles.row}>
          <Text style={styles.text}>{translations.productID}</Text>
          <Text style={styles.text}>{data.oBooking.productID}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.text}>{translations.status}</Text>
          <Text style={(styles.text, { color: colorPrimary })}>
            {data.oBooking.status}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  _renderSpecify = () => {
    const { myBooking } = this.props;
    const { data } = myBooking.bookingDetails;
    const { oSpecification } = data.oBooking;
    return (
      <View style={styles.border}>
        <View style={styles.row}>
          <Text style={styles.text}> {oSpecification.oResource.label}</Text>
          <Text style={styles.text}> {oSpecification.oResource.name}</Text>
        </View>
      </View>
    );
  };

  _renderDetails = () => {
    const { myBooking } = this.props;
    const { data } = myBooking.bookingDetails;
    return (
      <View>
        <ContentBoxOrder
          title={`# ${data.oBooking.id}`}
          renderContent={this._renderBox1}
        />
        <ContentBoxOrder
          title={`Order ID: ${data.oBooking.orderID}`}
          renderContent={this._renderOrderBox}
        />
        {data.oBooking.oSpecification && (
          <ContentBoxOrder
            title={`Specifications`}
            renderContent={this._renderSpecify}
          />
        )}
      </View>
    );
  };

  renderContent = () => {
    const { error, isLoading } = this.state;
    const { myBooking } = this.props;
    return (
      <AnimatedView style={{ width: screenWidth }}>
        {(!isLoading && this._renderDetails()) || <Loader />}
        {error && <MessageError msg={myBooking.msg} />}
      </AnimatedView>
    );
  };

  render() {
    const { navigation, auth, translations, settings } = this.props;
    const { isLoggedIn } = auth;
    return (
      <Layout
        navigation={navigation}
        headerType="headerHasBack"
        title="Booking Details"
        goBack={() => navigation.goBack()}
        renderContent={this.renderContent}
        colorPrimary={settings.colorPrimary}
        isLoggedIn={isLoggedIn}
        scrollEnabled={true}
        // refreshControl={
        //   <RefreshControl
        //     refreshing={this.refreshing}
        //     onRefresh={this._handleRefresh}
        //     tintColor={settings.colorPrimary}
        //     progressBackgroundColor={colorGray1}
        //   />
        // }
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
    fontSize: 16,
    color: "#9D9D9D",
    paddingVertical: 5
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: colorGray1,
    paddingHorizontal: 15,
    borderTopColor: colorGray1,
    borderTopWidth: 1,
    paddingVertical: 5
  }
});

const mapStateToProps = state => ({
  auth: state.auth,
  translations: state.translations,
  settings: state.settings,
  myBooking: state.bookingReducer
});
const mapDispatchToProps = {
  getBookingDetails
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BookingDetailScreen);
