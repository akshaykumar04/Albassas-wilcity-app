import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Modal,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Platform
} from "react-native";
import _ from "lodash";
import {
  Button,
  InputMaterial,
  CheckBox,
  ModalPicker,
  RangeSlider,
  bottomBarHeight,
  DatePicker
} from "../../wiloke-elements";
import { connect } from "react-redux";
import * as Consts from "../../constants/styleConstants";
import { Layout } from "../dumbs";
import {
  getListingFilters,
  getListingSearchResults,
  putNewTagListingFilters
} from "../../actions";
import { Loader } from "../../wiloke-elements";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Feather from "../../../node_modules/@expo/vector-icons/Feather";
import Constants from "expo-constants";
import NavigationSuspense from "../smarts/NavigationSuspense";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const HEADER_HEIGHT = 52 + Constants.statusBarHeight;
const CONTENT_HEIGHT = SCREEN_HEIGHT - HEADER_HEIGHT - 50 - bottomBarHeight;

class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      isScrollEnabled: true,
      results: {},
      isModalVisible: false,
      location: null,
      dateFrom: "",
      dateTo: ""
    };
    this.googlePlaceText = "";
  }

  _checkValueDefault = item => {
    switch (item.type) {
      case "select":
        if (!item.options) {
          return {};
        }
        const selected = item.options.filter(item => item.selected);
        return {
          [item.key]:
            item.multiple === "no"
              ? selected[0].id
              : selected.map(item => item.id).join(",")
        };
      case "input":
        return { [item.key]: item.value };
      case "google_auto_complete":
        return {
          unit: item.unit,
          radius: item.defaultRadius
        };
      case "checkbox":
        return { [item.key]: item.value === "" ? "no" : "yes" };
      case "date_range":
        return {
          [item.key]: {
            from: "",
            to: ""
          }
        };
      default:
        return {};
    }
  };

  _setDefaultResults = async () => {
    const { listingFilters } = this.props;
    await this.setState({
      results: listingFilters.reduce((acc, cur) => {
        return { ...acc, ...this._checkValueDefault(cur) };
      }, {})
    });
    this.googlePlaceText = "";
  };

  _getListingFilters = async () => {
    await this.props.getListingFilters({}, null);
    this._setDefaultResults();
  };

  componentDidMount() {
    this._getListingFilters();
  }

  _handleRangeSliderBeginChangeValue = () => {
    this.setState({
      isScrollEnabled: false
    });
  };

  _handleRangeSliderEndChangeValue = (radius, unit) => {
    this.setState({
      isScrollEnabled: true,
      results: {
        ...this.state.results,
        radius,
        unit
      }
    });
  };

  _handleSearch = async () => {
    const { navigation } = this.props;
    const { results, location } = this.state;
    const _results =
      location === null
        ? { ...results, radius: "", unit: "" }
        : { ...results, lat: location.lat, lng: location.lng };
    const screen =
      results.postType === "event"
        ? "EventSearchResultScreen"
        : "ListingSearchResultScreen";
    navigation.navigate(screen, { _results });
  };

  _handleInput = key => text => {
    this.setState({
      results: {
        ...this.state.results,
        [key]: text
      },
      isModalVisible: key === "google_place" && text.length > 1 ? true : false
    });
  };

  _handleTouchableInput = () => {
    this.setState({
      isModalVisible: true
    });
  };

  _handleClearText = key => () => {
    this.setState({
      results: {
        ...this.state.results,
        [key]: ""
      }
    });
  };

  _handleCheckBox = key => (name, checked) => {
    this.setState({
      results: {
        ...this.state.results,
        [key]: checked ? "yes" : "no"
      }
    });
  };

  _handleModalPicker = item => async (options, selected) => {
    if (item.key === "postType") {
      await Promise.all([
        this.props.getListingFilters(
          item,
          selected.length > 0 ? selected[0].id : null
        ),
        this._setDefaultResults()
      ]);
      this.setState({
        dateFrom: new Date(),
        dateTo: new Date()
      });
    }
    if (item.key === "listing_cat" && selected.length > 0) {
      const catID = selected[0].id;
      this.props.putNewTagListingFilters(catID);
    }
    this.setState({
      results: {
        ...this.state.results,
        [item.key]:
          item.multiple === "no" && selected.length > 0
            ? selected[0].id
            : selected.map(_item => _item.id).join(",")
      }
    });
  };

  _handleCloseModal = () => {
    this.setState({
      isModalVisible: false
    });
    this.googlePlaceText = "";
    this.forceUpdate();
    StatusBar.setBarStyle("light-content", true);
  };

  renderModalGooglePlaces() {
    const { isModalVisible } = this.state;
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onShow={this._handleShowModal}
        onRequestClose={this._handleCloseModal}
        style={styles.modalGooglePlaces}
      >
        <View style={styles.modalGooglePlacesInner}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={this._handleCloseModal}
            style={{
              position: "absolute",
              top: Platform.OS === "ios" ? Constants.statusBarHeight + 15 : 15,
              left: 8,
              zIndex: 9
            }}
          >
            <Feather name="chevron-down" size={30} color="#fff" />
          </TouchableOpacity>
          {this.renderGooglePlageAutocomplete()}
        </View>
      </Modal>
    );
  }

  renderGooglePlageAutocomplete() {
    const { settings, listingFilters } = this.props;
    return (
      <GooglePlacesAutocomplete
        placeholder={
          listingFilters.length > 0
            ? listingFilters.filter(item => item.key === "google_place")[0].name
            : ""
        }
        minLength={2} // minimum length of text to search
        autoFocus={true}
        fetchDetails={true}
        onPress={(data, details = null) => {
          if (details !== null) {
            const { location } = details.geometry;
            const { lat, lng } = location;
            this.setState({
              location: {
                lat,
                lng
              },
              isModalVisible: false
            });
          }
          this.googlePlaceText = data.description;
          this.forceUpdate();
          StatusBar.setBarStyle("light-content", true);
        }}
        getDefaultValue={() => {
          return ""; // text input default value
        }}
        query={settings.oGoogleMapAPI}
        styles={{
          container: {
            padding: 0
          },
          textInputContainer: {
            backgroundColor: settings.colorPrimary,
            height: "auto",
            padding: 10,
            paddingLeft: 50,
            paddingTop:
              Platform.OS === "ios" ? Constants.statusBarHeight + 10 : 10,
            borderTopWidth: 0,
            borderBottomWidth: 0
          },
          poweredContainer: {
            display: "none"
          },
          description: {
            fontWeight: "400",
            fontSize: 14
          },
          predefinedPlacesDescription: {
            color: Consts.colorDark2
          }
        }}
        currentLocation={false}
        nearbyPlacesAPI="GooglePlacesSearch"
        GoogleReverseGeocodingQuery={
          {
            // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
          }
        }
        GooglePlacesSearchQuery={{
          // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
          rankby: "distance",
          types: "food"
        }}
        filterReverseGeocodingByTypes={[
          "locality",
          "administrative_area_level_3"
        ]}
        predefinedPlacesAlwaysVisible={true}
        textInputProps={{
          autoCorrect: false,
          style: {
            paddingHorizontal: 10,
            backgroundColor: "#fff",
            width: "100%",
            height: 40,
            borderRadius: 5,
            fontSize: 14,
            color: Consts.colorDark2
          }
        }}
      />
    );
  }

  renderInput(item, index) {
    const { settings } = this.props;
    return (
      <InputMaterial
        key={item.key}
        placeholder={item.name}
        onChangeText={this._handleInput(item.key)}
        value={this.state.results[item.key]}
        onClearText={this._handleClearText(item.key)}
        iconName="search"
        colorPrimary={settings.colorPrimary}
      />
    );
  }

  renderInputAutoComplete(item, index) {
    const { settings } = this.props;
    return (
      <View key={item.key} style={{ position: "relative", zIndex: 999 }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={this._handleTouchableInput}
        >
          <InputMaterial
            key={item.key}
            placeholder={item.name}
            returnKeyType="next"
            onClearText={() => {
              this.setState({
                location: null
              });
              this.googlePlaceText = "";
              this.forceUpdate();
            }}
            iconName="search"
            colorPrimary={settings.colorPrimary}
            editable={false}
            pointerEvents="none"
            value={this.googlePlaceText}
          />
        </TouchableOpacity>
        {this.googlePlaceText.length > 1 && (
          <RangeSlider
            label="Radius"
            defaultValue={item.defaultRadius}
            minValue={0}
            maxValue={item.maxRadius}
            onBeginChangeValue={this._handleRangeSliderBeginChangeValue}
            onEndChangeValue={(event, radius) =>
              this.state.location !== null
                ? this._handleRangeSliderEndChangeValue(radius, item.unit)
                : {}
            }
            thumbTintColor={settings.colorPrimary}
            fillLowerTintColor={settings.colorPrimary}
          />
        )}
      </View>
    );
  }

  renderCheckBox(item, index) {
    const { settings } = this.props;
    return (
      <CheckBox
        key={item.key}
        label={item.name}
        name={item.key}
        style={styles.checkBox}
        onPress={this._handleCheckBox(item.key)}
        circleAnimatedColor={[Consts.colorDark4, settings.colorPrimary]}
        iconBackgroundColor={settings.colorPrimary}
      />
    );
  }

  _handleDateFromChange = key => date => {
    const { results } = this.state;
    const to = _.get(results[key], `${to}`, date);
    console.log(date);
    this.setState({
      dateFrom: date,
      results: {
        ...results,
        [key]: {
          from: date,
          to
        }
      }
    });
  };

  _handleDateToChange = key => date => {
    this.setState({
      dateTo: date,
      results: {
        ...this.state.results,
        [key]: {
          from: this.state.results[key].from,
          to: date
        }
      }
    });
  };

  renderDatePicker(item, index) {
    const { translations } = this.props;
    const { dateFrom, dateTo } = this.state;
    return (
      <View key={item.key}>
        <DatePicker
          date={dateFrom}
          // {...(!!dateTo && { maxDate: dateTo })}
          mode="date"
          placeholder={item.fromLabel}
          format="MM/DD/YYYY"
          confirmBtnText={translations.ok}
          cancelBtnText={translations.cancel}
          onDateChange={this._handleDateFromChange(item.key)}
        />
        <DatePicker
          date={dateTo}
          {...(!!dateFrom && { minDate: dateFrom })}
          mode="date"
          placeholder={item.toLabel}
          format="MM/DD/YYYY"
          confirmBtnText={translations.ok}
          cancelBtnText={translations.cancel}
          onDateChange={this._handleDateToChange(item.key)}
        />
      </View>
    );
  }

  renderModalPicker(item, index) {
    const { settings, translations } = this.props;
    return (
      <ModalPicker
        key={item.key}
        label={item.name}
        options={item.options ?? []}
        cancelText={translations.cancel}
        doneText={translations.ok}
        matterial={true}
        multiple={item.isMultiple === "no" ? false : true}
        onChangeOptions={this._handleModalPicker(item)}
        colorPrimary={settings.colorPrimary}
      />
    );
  }

  renderContent = () => {
    const { listingFilters } = this.props;
    return (
      <View style={{ padding: 10, width: Consts.screenWidth }}>
        <NavigationSuspense fallback={<Loader size={30} height={150} />}>
          {listingFilters.length > 0 ? (
            listingFilters.map((item, index) => {
              if (item.isDefault) {
                switch (item.type) {
                  case "input":
                    return this.renderInput(item, index);
                  case "google_auto_complete":
                    return this.renderInputAutoComplete(item, index);
                  case "checkbox":
                    return this.renderCheckBox(item, index);
                  case "select":
                    return this.renderModalPicker(item, index);
                  case "date_range":
                    return this.renderDatePicker(item, index);
                  default:
                    return false;
                }
              }
            })
          ) : (
            <Loader size={30} height={150} />
          )}
          {listingFilters.filter(item => item.type === "google_auto_complete")
            .length > 0 && this.renderModalGooglePlaces()}
        </NavigationSuspense>
      </View>
    );
  };
  renderAfterContent = () => (
    <Button
      size="lg"
      block={true}
      backgroundColor="secondary"
      style={{
        paddingVertical: 0,
        height: 50,
        justifyContent: "center"
      }}
      onPress={this._handleSearch}
    >
      {this.props.translations.searchNow}
    </Button>
  );

  render() {
    const { navigation, settings, translations } = this.props;
    return (
      <Layout
        navigation={navigation}
        headerType="headerHasBack"
        title={translations.search}
        goBack={() => navigation.goBack()}
        goBackIconName="chevron-left"
        keyboardDismiss={true}
        renderContent={this.renderContent}
        renderAfterContent={this.renderAfterContent}
        scrollEnabled={this.state.isScrollEnabled}
        colorPrimary={settings.colorPrimary}
        contentHeight={CONTENT_HEIGHT}
      />
    );
  }
}

const styles = StyleSheet.create({
  checkBox: {
    marginBottom: 10,
    paddingTop: 12,
    paddingBottom: 6,
    borderBottomWidth: 2,
    borderBottomColor: Consts.colorDark5
  },
  modalGooglePlacesInner: {
    position: "relative",
    backgroundColor: "#fff",
    height: SCREEN_HEIGHT
  }
});

const mapStateToProps = state => ({
  listingFilters: state.listingFilters,
  translations: state.translations,
  settings: state.settings
});

const mapDispatchToProps = {
  getListingFilters,
  getListingSearchResults,
  putNewTagListingFilters
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen);
