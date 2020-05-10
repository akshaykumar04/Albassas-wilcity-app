import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ViewPropTypes,
  Platform,
  Alert,
  Linking,
  ActivityIndicator
} from "react-native";
import { connect } from "react-redux";
import {
  getListings,
  getEvents,
  getNearByFocus,
  getLocations
} from "../../actions";
import { Feather } from "@expo/vector-icons";
import * as Consts from "../../constants/styleConstants";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import * as IntentLauncher from "expo-intent-launcher";
import he from "he";

const RADIUS = 5;

class NearbyContainer extends PureComponent {
  static propTypes = {
    style: ViewPropTypes.style
  };

  state = {
    location: null,
    errorMessage: null,
    isGetLocationLoading: false
  };

  _getLocationAsync = async () => {
    try {
      this.setState({
        isGetLocationLoading: true
      });
      const { status } = await Permissions.askAsync(Permissions.LOCATION);
      // if (status !== "granted") {
      //   await this.setState({
      //     errorMessage: "Permission to access location was denied"
      //   });
      // }
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({
          enableHighAccuracy: true
        });
        console.log({ location });
        await this.props.getLocations(location);
        this.setState({
          isGetLocationLoading: false
        });
        this._handleNearBy();
      } else {
        throw new Error("Location permission not granted");
      }

      // const location = await Location.getCurrentPositionAsync({});
    } catch (err) {
      const { translations } = await this.props;
      console.log(err);
      Platform === "android"
        ? IntentLauncher.startActivityAsync(
            IntentLauncher.ACTION_LOCATION_SOURCE_SETTINGS
          )
        : Alert.alert(
            he.decode(translations.askForAllowAccessingLocationTitle),
            he.decode(translations.askForAllowAccessingLocationDesc),
            [
              {
                text: translations.cancel,
                style: "cancel"
              },
              {
                text: translations.ok,
                onPress: () => Linking.openURL("app-settings:")
              }
            ],
            { cancelable: false }
          );
    }
  };

  componentDidUpdate(prevProps, prevState) {
    const { postType } = this.props;
    if (prevProps.nearByFocus !== this.props.nearByFocus) {
      const { postType, locations, settings } = this.props;
      const { coords } = locations.location;
      const nearby = {
        lat: coords.latitude,
        lng: coords.longitude,
        unit: settings.unit,
        radius: RADIUS
      };
      const { categoryId, locationId } = this._getId(postType);
      if (postType === "event") {
        this.props.getEvents(
          categoryId,
          locationId,
          postType,
          this.props.nearByFocus ? nearby : {}
        );
      } else {
        this.props.getListings(
          categoryId,
          locationId,
          postType,
          this.props.nearByFocus ? nearby : {}
        );
      }
    }
  }

  _getId = postType => {
    const { categoryList, locationList } = this.props;
    const getId = arr => arr.filter(item => item.selected)[0].id;
    const categoryId =
      typeof categoryList[postType] !== "undefined" &&
      categoryList[postType].length > 0 &&
      getId(categoryList[postType]) !== "wilokeListingCategory"
        ? getId(categoryList[postType])
        : null;
    const locationId =
      typeof locationList[postType] !== "undefined" &&
      locationList[postType].length > 0 &&
      getId(locationList[postType]) !== "wilokeListingLocation"
        ? getId(locationList[postType])
        : null;
    return { categoryId, locationId };
  };

  _handleNearBy = async () => {
    try {
      // const { postType, locations, settings } = this.props;
      // const { coords } = locations.location;
      // const nearby = {
      //   lat: coords.latitude,
      //   lng: coords.longitude,
      //   unit: settings.unit,
      //   radius: RADIUS
      // };
      await this.props.getNearByFocus();
      // const { categoryId, locationId } = this._getId(postType);
      // if (postType === "event") {
      //   this.props.getEvents(
      //     categoryId,
      //     locationId,
      //     postType,
      //     this.props.nearByFocus ? nearby : {}
      //   );
      // } else {
      //   this.props.getListings(
      //     categoryId,
      //     locationId,
      //     postType,
      //     this.props.nearByFocus ? nearby : {}
      //   );
      // }
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const { nearByFocus } = this.props;
    const { isGetLocationLoading } = this.state;
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={this._getLocationAsync}
        style={[styles.container, this.props.style]}
      >
        {!isGetLocationLoading ? (
          <Feather name="crosshair" size={20} color="#fff" />
        ) : (
          <ActivityIndicator size="small" color="#fff" />
        )}
        {nearByFocus && (
          <View style={styles.active}>
            <Feather name="check" size={10} color="#fff" />
          </View>
        )}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: 25,
    height: 30,
    justifyContent: "center"
  },
  active: {
    width: 16,
    height: 16,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Consts.colorSecondary,
    position: "absolute",
    top: 0,
    right: 0,
    borderWidth: 2,
    borderColor: "#fff"
  }
});

const mapStateToProps = state => ({
  categoryList: state.categoryList,
  locationList: state.locationList,
  locations: state.locations,
  nearByFocus: state.nearByFocus,
  translations: state.translations,
  settings: state.settings
});

const mapDispatchToProps = {
  getListings,
  getEvents,
  getNearByFocus,
  getLocations
};

export default connect(mapStateToProps, mapDispatchToProps)(NearbyContainer);
