import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  TouchableOpacity,
  ViewPropTypes,
  Alert,
  Linking,
  Platform
} from "react-native";
import { IconTextMedium } from "../../wiloke-elements";
import * as Consts from "../../constants/styleConstants";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import * as IntentLauncher from "expo-intent-launcher";
import MapView from "react-native-maps";
import { connect } from "react-redux";
import { getLocations } from "../../actions";

class AddressItem extends PureComponent {
  state = {
    location: null
  };

  _getLocationAsync = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({
          enableHighAccuracy: true
        });
        await this.props.getLocations(location);
        this._handleNavigateMap();
      } else {
        throw new Error("Location permission not granted");
      }
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

  _handleOpenMap = () => {
    const { address, navigation } = this.props;
    const { name } = navigation.state.params;

    const lat = Number(address.lat);
    const lng = Number(address.lng);
    const url = Platform.select({
      ios: "maps:" + lat + "," + lng + "?q=" + address.address,
      android: "geo:" + lat + "," + lng + "?q=" + address.address
    });

    Alert.alert(
      "External URL",
      "Do you want to open GoogleMaps in your app?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: () => Linking.openURL(url)
        }
      ],
      { cancelable: false }
    );
  };

  _renderMap = () => {
    const { address, navigation } = this.props;
    const { name } = navigation.state.params;
    const lat = Number(address.lat);
    const lng = Number(address.lng);
    return (
      <MapView
        style={{
          width: "100%",
          height: "100%"
        }}
        initialRegion={{
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        }}
        pointerEvents="none"
      >
        <MapView.Marker
          coordinate={{
            latitude: lat,
            longitude: lng
          }}
          title={name}
          description={address.address}
        />
      </MapView>
    );
  };

  _handleNavigateMap = _ => {
    const { address, navigation, locations } = this.props;
    const { name } = navigation.state.params;
    const lat = Number(address.lat);
    const lng = Number(address.lng);
    const { latitude: myLat, longitude: myLng } = locations.location.coords;
    navigation.navigate("WebViewScreen", {
      url: {
        title: name,
        description: address.address,
        lat,
        lng,
        myLat: "",
        myLng: ""
      }
    });
  };

  render() {
    const {
      address,
      style,
      iconColor,
      iconBackgroundColor,
      locations
    } = this.props;
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        // onPress={
        //   !locations.location.coords.latitude &&
        //   !locations.location.coords.longitude
        //     ? this._getLocationAsync
        //     : this._handleNavigateMap
        // }
        onPress={this._handleOpenMap}
        style={style}
      >
        <IconTextMedium
          iconName="map-pin"
          iconSize={30}
          iconColor={iconColor}
          iconBackgroundColor={iconBackgroundColor}
          text={address.address}
          renderBoxLastText={this._renderMap}
          textStyle={{ textAlign: "left" }}
        />
      </TouchableOpacity>
    );
  }
}
AddressItem.propTypes = {
  address: PropTypes.object,
  style: ViewPropTypes.style
};
AddressItem.defaultProps = {
  iconColor: "#fff",
  iconBackgroundColor: Consts.colorSecondary
};

const mapStateToProps = ({ locations, translations }) => ({
  locations,
  translations
});

const mapDispatchToProps = {
  getLocations
};

export default connect(mapStateToProps, mapDispatchToProps)(AddressItem);
