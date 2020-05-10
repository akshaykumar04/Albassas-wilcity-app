import React, { Fragment, Component } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, Platform } from "react-native";
import { connect } from "react-redux";
import {
  getListings,
  getEvents,
  getLocationList,
  getCategoryList,
  changeLocationList,
  changeCategoryList
} from "../../actions";
import { ModalPicker } from "../../wiloke-elements";

const RADIUS = 10;
class LocationModalPickerContainer extends Component {
  static propTypes = {
    postType: PropTypes.string
  };
  state = {
    categorySelectedId: "wilokeListingCategory",
    locationSelectedId: "wilokeListingLocation"
  };
  _getData = () => {
    const {
      postType,
      translations,
      getLocationList,
      getCategoryList
    } = this.props;
    getLocationList(postType, translations.allRegions);
    getCategoryList(postType, translations.allCategories);
  };
  componentDidMount() {
    this._getData();
  }

  _handleChangeOptions = modify => (options, selected) => {
    const { postType } = this.props;
    this.setState({
      categorySelectedId:
        modify === "category" && selected.length > 0
          ? selected[0].id
          : this.state.categorySelectedId,
      locationSelectedId:
        modify === "location" && selected.length > 0
          ? selected[0].id
          : this.state.locationSelectedId
    });
    modify === "location" && this.props.changeLocationList(options, postType);
    modify === "category" && this.props.changeCategoryList(options, postType);
  };

  componentDidUpdate(prevProps, prevState) {
    const { locations, postType, nearByFocus, settings } = this.props;
    const { coords } = locations.location;
    const nearby = {
      lat: coords.latitude,
      lng: coords.longitude,
      unit: settings.unit,
      radius: RADIUS
    };
    if (
      prevState.categorySelectedId !== this.state.categorySelectedId ||
      prevState.locationSelectedId !== this.state.locationSelectedId
    ) {
      if (postType === "event") {
        this.props.getEvents(
          this.state.categorySelectedId !== "wilokeListingCategory"
            ? this.state.categorySelectedId
            : null,
          this.state.locationSelectedId !== "wilokeListingLocation"
            ? this.state.locationSelectedId
            : null,
          postType,
          nearByFocus ? nearby : null
        );
      } else {
        this.props.getListings(
          this.state.categorySelectedId !== "wilokeListingCategory"
            ? this.state.categorySelectedId
            : null,
          this.state.locationSelectedId !== "wilokeListingLocation"
            ? this.state.locationSelectedId
            : null,
          postType,
          nearByFocus ? nearby : null
        );
      }
    }
  }

  renderItemPicker(options, onChangeOptions, modify) {
    const { settings, translations } = this.props;
    return (
      <View style={styles.headerCenterWrapper}>
        {options.length > 0 ? (
          <ModalPicker
            options={options}
            onChangeOptions={onChangeOptions}
            cancelText={translations.cancel}
            underlayBorder={false}
            textResultStyle={{
              color: "#fff",
              fontSize: 12,
              marginRight: 4,
              width: 84
            }}
            textResultNumberOfLines={1}
            iconResultColor="#fff"
            clearSelectEnabled={false}
            colorPrimary={settings.colorPrimary}
          />
        ) : (
          <View style={{ height: 46, width: 84, justifyContent: "center" }}>
            <Text style={{ color: "#fff" }}>...</Text>
          </View>
        )}
        {modify === "category" && <View style={styles.lineVertical} />}
        <View
          style={[
            styles.headerCenterBorder,
            {
              borderTopRightRadius: modify === "location" ? 0 : 5,
              borderBottomRightRadius: modify === "location" ? 0 : 5,
              borderTopLeftRadius: modify === "category" ? 0 : 5,
              borderBottomLeftRadius: modify === "category" ? 0 : 5,
              borderRightWidth: modify === "location" ? 0 : 1,
              borderLeftWidth: modify === "category" ? 0 : 1
            }
          ]}
        />
      </View>
    );
  }

  renderNearByText() {
    const { translations } = this.props;
    return (
      <View
        style={{
          height: Platform.OS === "ios" ? 22 : 23,
          width: 124,
          justifyContent: "center",
          borderTopLeftRadius: 5,
          borderBottomLeftRadius: 5,
          borderWidth: 1,
          borderColor: "#fff",
          borderRightWidth: 0,
          marginTop: 12,
          paddingHorizontal: 4
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 12
          }}
          numberOfLines={1}
        >
          {translations.nearby}
        </Text>
      </View>
    );
  }

  render() {
    const { locationList, categoryList, postType, nearByFocus } = this.props;
    return (
      <View style={styles.container}>
        {nearByFocus
          ? this.renderNearByText()
          : this.renderItemPicker(
              typeof locationList[postType] !== "undefined" &&
                locationList[postType].length > 0 &&
                locationList[postType],
              this._handleChangeOptions("location"),
              "location"
            )}
        {this.renderItemPicker(
          typeof categoryList[postType] !== "undefined" &&
            categoryList[postType].length > 0 &&
            categoryList[postType],
          this._handleChangeOptions("category"),
          "category"
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerCenterWrapper: {
    position: "relative",
    paddingLeft: 8,
    paddingRight: 5,
    zIndex: 9
  },
  headerCenterBorder: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 12,
    bottom: 12,
    borderWidth: 1,
    borderColor: "#fff",
    opacity: 0.8,
    borderRadius: 5,
    zIndex: -1
  },
  container: {
    flexDirection: "row"
  },
  lineVertical: {
    position: "absolute",
    top: 12,
    bottom: 12,
    left: 0,
    width: 1,
    backgroundColor: "#fff"
  }
});

const mapStateToProps = state => ({
  locationList: state.locationList,
  categoryList: state.categoryList,
  translations: state.translations,
  nearByFocus: state.nearByFocus,
  locations: state.locations,
  settings: state.settings
});

export default connect(mapStateToProps, {
  getListings,
  getEvents,
  getLocationList,
  getCategoryList,
  changeLocationList,
  changeCategoryList
})(LocationModalPickerContainer);
