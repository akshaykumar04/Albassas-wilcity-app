import React, { PureComponent } from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { isEmpty } from "lodash";
import PropTypes from "prop-types";
import axios from "axios";
import AnimatedView from "../AnimatedView/AnimatedView";
import ListingProductItem from "../ProductItem/ListingProductItem";
import { colorGray1, colorPrimary } from "../../../constants/styleConstants";
import { Button } from "../../../wiloke-elements";

export default class ListingProduct extends PureComponent {
  static propTypes = {
    data: PropTypes.array,
    aSettings: PropTypes.object
  };
  static defaultProps = {
    data: []
  };
  constructor(props) {
    super(props);
    this.state = {
      loading: "none"
    };
  }

  _renderItem = ({ item, index }) => {
    const { colorPrimary } = this.props;
    return (
      <View style={{ padding: 5 }}>
        <ListingProductItem
          minValue={item.minPerson}
          maxValue={item.maxPerson}
          txtButton={item.addBtnText}
          priceHtml={item.cost}
          src={item.avatar}
          productName={item.title}
          isLoading={this.state.loading}
          colorPrimary={colorPrimary}
        />
      </View>
    );
  };

  _keyExtractor = (item, index) => item.personID.toString();

  _handleBooking = async () => {
    const { data } = await axios.get(`/wc/test-booking/7637`);
    if (data.status === "success") {
      WebBrowser.openBrowserAsync(data.productURL);
    }
  };

  render() {
    const { data, aSettings } = this.props;
    return (
      <AnimatedView>
        <FlatList
          data={data}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          ItemSeparatorComponent={() => (
            <View
              style={{
                width: "100%",
                height: 1,
                backgroundColor: colorGray1
              }}
            />
          )}
        />
        {!isEmpty(data) && (
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Button
              block={false}
              backgroundColor="primary"
              colorPrimary={colorPrimary}
              isLoading={this.state.isLoading}
              onPress={this._handleBooking}
              radius="round"
              size="sm"
            >
              Booking Now
            </Button>
          </View>
        )}
      </AnimatedView>
    );
  }
}
const styles = StyleSheet.create({
  container: {}
});
