import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Image
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import * as Consts from "../../../constants/styleConstants";
import FontIcon from "../molecules/FontIcon";

export default class ImageUpload extends PureComponent {
  static propTypes = {
    label: PropTypes.string,
    text: PropTypes.string,
    imageSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onChange: PropTypes.func,
    defaultUri: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    aspect: PropTypes.array,
    uploadPhotoText: PropTypes.string,
    takeAPhotoText: PropTypes.string,
    cancelText: PropTypes.string
  };
  static defaultProps = {
    label: "Image Upload",
    text: "Click to upload image",
    imageSize: 38,
    onChange: () => {},
    defaultUri: null,
    aspect: [1, 1],
    uploadPhotoText: "Upload photo from Library",
    takeAPhotoText: "Take a Photo"
  };

  constructor(props) {
    super(props);
    this.state = {
      image: this.props.defaultUri,
      isModalVisible: false
    };
  }

  _handleOpenModal = () => {
    this.setState({
      isModalVisible: true
    });
  };

  _handleCloseModal = () => {
    this.setState({
      isModalVisible: false
    });
  };

  _handleCameraRoll = async () => {
    try {
      const { status: cameraRollPermission } = await Permissions.askAsync(
        Permissions.CAMERA_ROLL
      );
      if (cameraRollPermission === "granted") {
        const result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: this.props.aspect,
          base64: true
        });

        if (!result.cancelled) {
          await this.setState({ image: result.uri });
          this.state.image &&
            this.setState({
              isModalVisible: false
            });

          this.state.image && this.props.onChange(result);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  _handleCamera = async () => {
    try {
      const { status: cameraPermission } = await Permissions.askAsync(
        Permissions.CAMERA
      );
      const { status: cameraRollPermission } = await Permissions.askAsync(
        Permissions.CAMERA_ROLL
      );
      if (
        cameraPermission === "granted" &&
        cameraRollPermission === "granted"
      ) {
        const result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: this.props.aspect,
          base64: true
        });

        if (!result.cancelled) {
          this.setState({ image: result.uri });
          this.state.image &&
            this.setState({
              isModalVisible: false
            });
          this.state.image && this.props.onChange(result);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  _renderModal = () => {
    const { uploadPhotoText, takeAPhotoText, cancelText } = this.props;
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.isModalVisible}
        onRequestClose={this._handleCloseModal}
      >
        <View style={styles.modalWrapInner}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={this._handleCameraRoll}
            style={[
              styles.button,
              {
                backgroundColor: Consts.colorSecondary
              }
            ]}
          >
            <View style={styles.buttonIcon}>
              <FontIcon name="fa fa-image" color="#fff" fontSize={18} />
            </View>
            <Text style={styles.buttonText}>{uploadPhotoText}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={this._handleCamera}
            style={[
              styles.button,
              {
                backgroundColor: Consts.colorSecondary
              }
            ]}
          >
            <View style={styles.buttonIcon}>
              <FontIcon name="fa fa-camera" color="#fff" fontSize={18} />
            </View>
            <Text style={styles.buttonText}>{takeAPhotoText}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.button}
            onPress={this._handleCloseModal}
          >
            <Text style={[styles.buttonText, { color: "#f00" }]}>
              {cancelText}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };

  render() {
    const { label, text, imageSize } = this.props;
    const { image } = this.state;
    return (
      <View>
        <TouchableOpacity
          style={styles.container}
          activeOpacity={0.8}
          onPress={this._handleOpenModal}
        >
          <View>
            <Text style={styles.label}>{label}</Text>
            <View style={{ height: 6 }} />
            <Text style={styles.text}>{text}</Text>
          </View>
          {image ? (
            <Image
              source={{ uri: image }}
              style={{
                width: imageSize,
                height: imageSize,
                borderRadius: imageSize / 2
              }}
              indicator={ActivityIndicator}
            />
          ) : (
            <View
              style={{
                width: imageSize,
                height: imageSize,
                borderRadius: imageSize / 2,
                backgroundColor: Consts.colorGray2,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <FontIcon name="plus" size={18} color={Consts.colorDark3} />
            </View>
          )}
        </TouchableOpacity>
        {this._renderModal()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 4,
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderBottomColor: Consts.colorGray1
  },
  modalWrapInner: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 10
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    height: 46,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10
  },
  buttonIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginRight: 10
  },
  buttonText: {
    color: "#fff",
    fontSize: 14
  },
  label: {
    color: Consts.colorDark3,
    fontSize: 12
  },
  text: {
    color: Consts.colorDark2,
    fontSize: 14
  }
});
