import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Text } from "react-native";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import Button from "./Button";
import { H5, P } from "./Typography";

export default class PermissionsLocation extends Component {
  static propTypes = {
    title: PropTypes.string,
    text: PropTypes.string,
    buttonText: PropTypes.string
  };

  static defaultProps = {
    buttonText: "Turn on location"
  };

  constructor(props) {
    super(props);
    this.state = {
      subscriber: "",
      location: null,
      errorMessage: ""
    };
  }

  componentDidMount() {
    // Location.getProviderStatusAsync()
    //   .then(status => {
    //     console.log("Getting status");
    //     if (!status.locationServicesEnabled) {
    //       throw new Error("Location services disabled");
    //     }
    //   })
    //   .then(_ => Permissions.askAsync(Permissions.LOCATION))
    //   .then(permissions => {
    //     console.log("Getting permissions");
    //     if (permissions.status !== "granted") {
    //       throw new Error("Ask for permissions");
    //     }
    //   })
    //   .then(_ => {
    //     console.log("Have permissions");
    //     const subscriber = Location.watchPositionAsync(
    //       {
    //         timeInterval: 1000
    //       },
    //       location => {
    //         console.log("Location change: ", location);
    //         this.setState({ location });
    //       }
    //     );
    //     this.setState({ subscriber });
    //   })
    //   .catch(error => {
    //     console.log(error);
    //     this.setState({
    //       errorMessage: "Permission to access location was denied"
    //     });
    //   });
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied"
      });
    }
    let location = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true
    });
    this.setState({ location });
  };

  // componentDidUpdate() {
  //   const { location, errorMessage } = this.state;
  //   this.props.onPress(location, errorMessage);
  // }

  render() {
    const { location } = this.state;
    console.log(
      location && location.coords.latitude,
      location && location.coords.longitude
    );
    return (
      <View
        style={{
          paddingHorizontal: 10,
          alignItems: "center"
        }}
      >
        <H5>{this.props.title}</H5>
        <P>{this.props.text}</P>
        <Button size="md" radius="round" onPress={this._getLocationAsync}>
          {this.props.buttonText}
        </Button>
      </View>
    );
  }
}
