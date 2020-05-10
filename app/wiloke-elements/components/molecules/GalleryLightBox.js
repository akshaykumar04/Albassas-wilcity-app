import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  Image,
  Modal,
  FlatList,
  TouchableOpacity,
  PanResponder,
  Animated,
  Easing,
  StatusBar,
  ActivityIndicator,
  Keyboard,
  Dimensions,
  StyleSheet
} from "react-native";
import Constants from "expo-constants";
import { Feather } from "@expo/vector-icons";
import * as Consts from "../../../constants/styleConstants";
import stylesBase from "../../../stylesBase";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default class GalleryLightBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gallery: [],
      modalVisible: false,
      loadingVisible: false,
      showModal: new Animated.Value(0),
      position: new Animated.ValueXY(),
      containerLayout: null,
      itemActiveLayout: {},
      isMoveX: false,
      isMoveY: false,
      isActiveIndex: null,
      isMove: new Animated.Value(false)
    };

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (event, gestureState) => true,
      onStartShouldSetPanResponderCapture: (event, gestureState) => true,
      onMoveShouldSetPanResponder: (event, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (event, gestureState) => true,

      onPanResponderGrant: (event, gestureState) => {
        this.state.position.setOffset({
          x: 0,
          y: this.state.position.y._value
        });
        this.state.position.setValue({
          x: 0,
          y: 0
        });
      },
      onPanResponderMove: (evt, gestureState) => {
        const { position } = this.state;
        position.setValue({
          x: 0,
          y:
            !this.state.isMoveX &&
            Math.abs(gestureState.dx) < Math.abs(gestureState.dy)
              ? gestureState.dy
              : 0
        });
      },
      onPanResponderTerminationRequest: (evt, gestureState) => false,
      onPanResponderRelease: (event, gestureState) => {
        const { position, showModal } = this.state;
        position.flattenOffset();
        this.state.isMove.setValue(false);
        if (
          !this.state.isMoveX &&
          Math.abs(gestureState.dx) < Math.abs(gestureState.dy)
        ) {
          if (gestureState.dy > 150) {
            Animated.spring(position, {
              toValue: {
                x: 0,
                y: screenHeight / 1.5
              },
              duration: 300,
              userNativeDriver: true
            }).start(() => {
              this.setState(
                {
                  modalVisible: false
                },
                () => {
                  position.setValue({
                    x: 0,
                    y: 0
                  });
                }
              );
            });
            Animated.timing(showModal, {
              toValue: 0,
              duration: 500
            }).start();

            StatusBar.setHidden(false, "fade");
          } else if (gestureState.dy < -150) {
            Animated.spring(position, {
              toValue: {
                x: 0,
                y: -screenHeight / 1.5
              },
              duration: 300,
              userNativeDriver: true
            }).start(() => {
              this.setState(
                {
                  modalVisible: false
                },
                () => {
                  position.setValue({
                    x: 0,
                    y: 0
                  });
                }
              );
            });
            Animated.timing(showModal, {
              toValue: 0,
              duration: 500
            }).start();

            StatusBar.setHidden(false, "fade");
          } else {
            Animated.spring(position, {
              toValue: {
                x: 0,
                y: 0
              },
              duration: 300,
              userNativeDriver: true
            }).start(() => {
              position.setValue({
                x: 0,
                y: 0
              });
            });
          }
        }
      },
      onShouldBlockNativeResponder: (evt, gestureState) => true
    });

    this.opacity = this.state.position.y.interpolate({
      inputRange: [-screenHeight / 2, 0, screenHeight / 2],
      outputRange: [0, 1, 0],
      extrapolate: "clamp"
    });
    this.scale = this.state.position.y.interpolate({
      inputRange: [-screenHeight, 0, screenHeight],
      outputRange: [0.3, 1, 0.3],
      extrapolate: "clamp"
    });
  }
  // componentDidUpdate(prevProps, prevState, snapshot) {
  //     console.log("componentDidUpdate");
  // }
  _onOpenModal = index => {
    // this._item.measure((fx, fy, width, height, px, py) => {
    // });
    this.setState({
      modalVisible: true,
      loadingVisible: true,
      isActiveIndex: index
    });
    StatusBar.setHidden(true, "fade");
    Keyboard.dismiss();
  };
  _onCloseModal = () => {
    const { showModal } = this.state;
    Animated.timing(showModal, {
      toValue: 0,
      duration: 500
    }).start(() => {
      this.setState({
        modalVisible: false
      });
      StatusBar.setHidden(false, "fade");
    });
  };
  _onShowModal = () => {
    const { isActiveIndex, showModal } = this.state;
    this._flatListModal.scrollToIndex({
      animated: false,
      index: isActiveIndex
    });
    Animated.timing(showModal, {
      toValue: 300,
      duration: 500
    }).start(() => {
      this.setState({
        loadingVisible: false
      });
    });
  };
  componentDidMount() {
    this.setState({
      gallery: this.props.renderGallery()
    });
  }
  _onLayoutContainer = event => {
    this.setState({
      containerLayout: event.nativeEvent.layout
    });
  };
  renderModal() {
    const { modalVisible, gallery, showModal, itemActiveLayout } = this.state;
    const { renderLightBox, renderThumbnail } = this.props;
    const ITEM_OPACITY = showModal.interpolate({
      inputRange: [0, 300],
      outputRange: [0, 1],
      extrapolate: "clamp"
    });
    // console.log(this.state.isMoveX);
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        style={styles.modal}
        onShow={this._onShowModal}
        onRequestClose={() => {}}
      >
        <View style={styles.modalView}>
          <View style={styles.close}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={this._onCloseModal}
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                height: 40,
                opacity: 0.7
              }}
            >
              <Feather name="x-circle" size={30} color={Consts.colorGray1} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={gallery}
            ref={c => (this._flatListModal = c)}
            renderItem={({ item }) => (
              <View
                style={{
                  position: "relative",
                  width: screenWidth
                }}
              >
                <Animated.View
                  ref={c => (this._imageLightBox = c)}
                  {...this._panResponder.panHandlers}
                  style={{
                    position: "relative",
                    zIndex: 2,
                    overflow: "hidden",
                    opacity: ITEM_OPACITY
                    // transform: this.state.position.getTranslateTransform()
                    // transform: [
                    //     ...this.state.position.getTranslateTransform(),
                    //     {
                    //         scale: this.scale
                    //     }
                    // ]
                  }}
                >
                  <Image
                    source={{
                      uri: item.uri
                    }}
                    resizeMode="contain"
                    style={{
                      width: screenWidth,
                      height: screenHeight
                    }}
                  />
                </Animated.View>
                <View
                  style={{
                    position: "absolute",
                    zIndex: 1,
                    height: 50,
                    top: "50%",
                    left: 0,
                    right: 0,
                    marginTop: -25,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    opacity: this.state.loadingVisible ? 1 : 0
                  }}
                >
                  <ActivityIndicator
                    size="small"
                    color={this.props.activityIndicatorColor}
                  />
                </View>
              </View>
            )}
            pagingEnabled={true}
            keyExtractor={item => item.id}
            numColumns={1}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            // scrollEnabled={this.state.isMoveX ? false : true}
            onScrollBeginDrag={() => {
              this.setState({
                isMoveX: true
              });
            }}
            onScrollEndDrag={() => {
              this.setState({
                isMoveX: false
              });
            }}
          />
        </View>
        <Animated.View
          style={[
            stylesBase.absFull,
            {
              backgroundColor: this.props.underlayColor,
              opacity: this.opacity
            }
          ]}
        />
      </Modal>
    );
  }
  renderThumbnail() {
    const { column, itemGap } = this.props;
    const { gallery, containerLayout } = this.state;
    return containerLayout !== null ? (
      <FlatList
        data={gallery}
        renderItem={({ item, index }) => (
          <View
            ref={c => (this._item = c)}
            style={[
              styles.gridItem,
              {
                padding: itemGap / 2,
                width: containerLayout.width / column,
                height: containerLayout.width / column
              }
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => this._onOpenModal(index)}
            >
              <Image
                source={{
                  uri: item.thumbnail
                }}
                style={{
                  width: containerLayout.width / column - itemGap,
                  height: containerLayout.width / column - itemGap
                }}
              />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={item => item.id}
        numColumns={column}
        showsHorizontalScrollIndicator={false}
      />
    ) : (
      <Text>Loading...</Text>
    );
  }
  render() {
    const { itemGap } = this.props;
    const { modalVisible } = this.state;

    return (
      <View
        style={[
          styles.container,
          {
            margin: -itemGap / 2
          }
        ]}
        onLayout={this._onLayoutContainer}
      >
        {this.renderThumbnail()}
        {this.renderModal()}
      </View>
    );
  }
}

GalleryLightBox.defaultProps = {
  renderThumbnail: () => {},
  renderGallery: () => [],
  underlayColor: "#000",
  column: 3,
  itemGap: 10,
  activityIndicatorColor: Consts.colorPrimary
};

GalleryLightBox.propTypes = {
  renderThumbnail: PropTypes.func,
  renderLightBox: PropTypes.func,
  underlayColor: PropTypes.string
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row"
  },
  gridItem: {
    width: "25%"
  },
  modal: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center"
  },
  modalView: {
    position: "absolute",
    zIndex: 2,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flex: 1,
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight
  },
  close: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    zIndex: 9
  }
});
