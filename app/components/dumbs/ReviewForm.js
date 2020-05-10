import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  View,
  TouchableOpacity,
  Modal,
  ViewPropTypes,
  StyleSheet,
  KeyboardAvoidingView
} from "react-native";
import {
  P,
  InputMaterial,
  RangeSlider,
  CameraRollSelect,
  ImageCover,
  FontIcon,
  Row,
  Col,
  bottomBarHeight
} from "../../wiloke-elements";
import {
  colorDark3,
  colorDark1,
  screenHeight
} from "../../constants/styleConstants";
import Icon from "../dumbs/Icon";
import _ from "lodash";
import Constants from "expo-constants";

export default class ReviewForm extends PureComponent {
  static propTypes = {
    style: ViewPropTypes.style,
    data: PropTypes.object,
    onRangeSliderBeginChangeValue: PropTypes.func,
    onResults: PropTypes.func,
    translations: PropTypes.object,
    defaultResults: PropTypes.object
  };
  static defaultProps = {
    onRangeSliderBeginChangeValue: () => {},
    onResults: () => {},
    defaultResults: {}
  };
  state = {
    isVisible: false,
    isScrollEnabled: true,
    selectedPhotos: [],
    gallery: [],
    results: {}
  };

  async componentDidMount() {
    const { data, mode, defaultResults } = this.props;
    await this.setState({
      results: !_.isEmpty(defaultResults)
        ? defaultResults
        : Object.keys(data).reduce(
            (obj, key) => ({
              ...obj,
              ...(data[key].type === "inputRange"
                ? { [key]: Math.floor(mode / 2) }
                : {})
            }),
            {}
          ),
      gallery: defaultResults.gallery ? defaultResults.gallery : []
    });
    console.log(this.state.results);
    this.props.onResults(this.state.results);
  }

  _handleCameraRollCancel = () => {
    this.setState({ isVisible: false });
  };

  _handleCameraRollOk = async gallery => {
    const galleryUri = gallery.map(item => ({ url: item.uri }));
    // const galleryResults = gallery.map(item => ({
    //   uri: item.node.image.uri,
    //   name: item.node.image.filename,
    //   type: `image/${item.node.image.filename
    //     .replace(/^.*\./g, "")
    //     .toLowerCase()}`
    // }));
    await this.setState(prevState => ({
      selectedPhotos: gallery,
      gallery: [...prevState.gallery, ...galleryUri],
      results: {
        ...prevState.results,
        gallery: [...prevState.gallery, ...galleryUri]
      },
      isVisible: false
    }));
    this.props.onResults(this.state.results);
  };

  _renderModalCameralRoll = () => {
    const { translations, settings } = this.props;
    return (
      <Modal
        visible={this.state.isVisible}
        animationType="slide"
        onRequestClose={this._handleCameraRollCancel}
      >
        <CameraRollSelect
          selectedPhotos={this.state.selectedPhotos}
          iconColorSelected={settings.colorPrimary}
          itemSelectedMaximum={5}
          horizontal={false}
          numColumns={3}
          buttonHeaderLeft={{
            color: colorDark3,
            text: translations.cancel,
            onPress: this._handleCameraRollCancel
          }}
          buttonHeaderRight={{
            color: settings.colorPrimary,
            text: translations.ok,
            onPress: this._handleCameraRollOk
          }}
        />
      </Modal>
    );
  };

  _handleOpenCameraRoll = () => {
    this.setState({ isVisible: true });
  };

  _getRangeSliderColor = (key, mode) => {
    const { results } = this.state;
    const ratePoint = results[key];
    if (ratePoint >= 0 && ratePoint < mode / 5) {
      return "#e03d3d";
    } else if (ratePoint >= mode / 5 && ratePoint < mode / 2.5) {
      return "#e68145";
    } else if (ratePoint >= mode / 2.5 && ratePoint < mode / 1.66666667) {
      return "#f4b34d";
    } else if (ratePoint >= mode / 1.66666667 && ratePoint < mode / 1.25) {
      return "#8dda62";
    } else if (ratePoint >= mode / 1.25 && ratePoint <= mode) {
      return "#3ece7e";
    }
  };

  _handleRangeSliderChange = key => async value => {
    await this.setState(prevState => ({
      results: {
        ...prevState.results,
        [key]: value
      }
    }));
    this.props.onResults(this.state.results);
  };

  _handleChangeInputText = key => async value => {
    await this.setState(prevState => ({
      results: {
        ...prevState.results,
        [key]: value
      }
    }));
    this.props.onResults(this.state.results);
  };

  _renderHeaderRangeSlider = label => value => {
    return (
      <View style={styles.rangeSliderHeader}>
        <P>{label}</P>
        <P>{value}</P>
      </View>
    );
  };

  _removeImgFromGallery = uri => async __ => {
    const newGallery = this.state.gallery.filter(item => item.url !== uri);
    await this.setState(prevState => ({
      selectedPhotos: prevState.selectedPhotos.filter(item => item.uri !== uri),
      gallery: newGallery,
      results: {
        ...prevState.results,
        gallery: newGallery
      }
    }));
    this.props.onResults(this.state.results);
  };

  _renderGalleryItem = (uri, index) => {
    return (
      <Col key={index.toString()} column={6} gap={5}>
        <View style={styles.galleryItem}>
          <ImageCover useImageDefault src={uri} width={56} />
          <TouchableOpacity
            onPress={this._removeImgFromGallery(uri)}
            style={styles.removeImg}
          >
            <FontIcon name="x" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </Col>
    );
  };

  _renderItem = data => key => {
    const { results } = this.state;
    const { mode, settings } = this.props;
    const item = data[key];
    const color = this._getRangeSliderColor(key, mode)
      ? this._getRangeSliderColor(key, mode)
      : "#f4b34d";
    switch (item.type) {
      case "inputRange":
        return (
          <RangeSlider
            label={item.name}
            defaultValue={results[key]}
            minValue={1}
            maxValue={mode}
            onBeginChangeValue={this.props.onRangeSliderBeginChangeValue}
            onChangeValue={this._handleRangeSliderChange(key)}
            thumbTintColor={color}
            fillLowerTintColor={color}
            customHeader={this._renderHeaderRangeSlider(item.name)}
          />
        );
      case "inputText":
        return (
          <InputMaterial
            placeholder={item.placeholder}
            multiline={item.multiline}
            required={item.required}
            value={results[key]}
            onChangeText={this._handleChangeInputText(key)}
            clearTextEnabled={false}
            colorPrimary={settings.colorPrimary}
          />
        );
      case "gallery":
        return (
          <Row gap={5}>
            {this.state.gallery
              .map(item => item.url)
              .map(this._renderGalleryItem)}
            <Col column={6} gap={5}>
              <TouchableOpacity onPress={this._handleOpenCameraRoll}>
                <Icon name="image" fontSize={26} size={56} />
              </TouchableOpacity>
            </Col>
          </Row>
        );
    }
  };
  render() {
    const { data, style } = this.props;
    return (
      <View
        style={[styles.container, style]}
        // behavior="position"
      >
        <View>{this._renderModalCameralRoll()}</View>
        {!_.isEmpty(data) &&
          Object.keys(data).map(key => (
            <View key={key}>{this._renderItem(data)(key)}</View>
          ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // paddingBottom: 100
    // minHeight: screenHeight - 50 - Constants.statusBarHeight - bottomBarHeight
  },
  rangeSliderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5
  },
  galleryItem: {
    position: "relative"
  },
  removeImg: {
    position: "absolute",
    top: 2,
    right: 2,
    zIndex: 9,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colorDark1
  }
});
