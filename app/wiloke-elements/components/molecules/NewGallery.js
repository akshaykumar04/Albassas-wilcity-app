// import React, { Component } from "react";
// import PropTypes from "prop-types";
// import {
//   View,
//   Dimensions,
//   FlatList,
//   Modal,
//   TouchableOpacity,
//   StatusBar,
//   Animated,
//   PanResponder,
//   Text,
//   Image,
//   StyleSheet
// } from "react-native";
// import Constants from "expo-constants";;

// const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
// const ANIMATION_MAX = 100;
// const ANIMATION_DURATION = 200;
// const SWIPE_THRESHOLD = 120;
// const ANIMATED = {
//   duration: ANIMATION_DURATION,
//   userNativeDriver: true
// };

// export default class NewGallery extends Component {
//   static propTypes = {
//     gridColumn: PropTypes.number,
//     gridGap: PropTypes.number,
//     onClose: PropTypes.func,
//     onOpen: PropTypes.func,
//     onShow: PropTypes.func
//   };
//   static defaultProps = {
//     gridColumn: 3,
//     gridGap: 10,
//     onClose: () => {},
//     onOpen: () => {},
//     onShow: () => {}
//   };

//   constructor(props) {
//     super(props);
//     this.state = {
//       modalVisible: false,
//       sliderVisible: false,
//       sliderDrag: false,
//       imageAnimationLoading: true,
//       currentIndex: -1,
//       measure: {},
//       getSizeCurrentImage: null,
//       position: new Animated.ValueXY(),
//       animation: new Animated.Value(0)
//     };
//     this._panResponder = PanResponder.create({
//       onStartShouldSetPanResponder: (evt, gestureState) => true,
//       onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
//       onMoveShouldSetPanResponder: (evt, gestureState) => true,
//       onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
//       // onPanResponderMove: this._onPanResponderMove,
//       onPanResponderTerminationRequest: (evt, gestureState) => false
//       // onPanResponderRelease: this._onPanResponderRelease
//     });
//   }

//   _onPanResponderMove = (event, gestureState) => {
//     const { position, sliderDrag } = this.state;
//     const { dx, dy } = gestureState;
//     position.setValue({
//       x: 0,
//       y: sliderDrag ? 0 : dy
//     });
//   };

//   _onPanResponderRelease = (event, gestureState) => {
//     const { position, sliderDrag } = this.state;
//     const { dx, dy } = gestureState;
//     if (!sliderDrag) {
//       if (dy > SWIPE_THRESHOLD) {
//         this._onCloseLightBox();
//       } else if (dy < -SWIPE_THRESHOLD) {
//         this._onCloseLightBox();
//       } else {
//         this._resetPosition();
//       }
//     }
//   };

//   _resetPosition = () => {
//     const { position } = this.state;
//     Animated.timing(position, {
//       ...ANIMATED,
//       toValue: {
//         x: 0,
//         y: 0
//       }
//     }).start(() => {
//       position.setValue({
//         x: 0,
//         y: 0
//       });
//     });
//   };

//   _openLightBox = index => {
//     const { lightBoxImages } = this.props;
//     setTimeout(() => {
//       this[`_gridItem_${index}`].measure((fx, fy, width, height, px, py) => {
//         this.setState({
//           modalVisible: true,
//           currentIndex: index,
//           measure: { width, height, px, py }
//         });
//       });
//       Image.getSize(lightBoxImages[index].src, (width, height) => {
//         this.setState({
//           getSizeCurrentImage: { width, height }
//         });
//       });
//     }, 0);
//     StatusBar.setHidden(true, "fade");
//     this.props.onOpen();
//   };

//   _sliderHidden = () => {
//     this.setState({
//       sliderVisible: false
//     });
//   };
//   _sliderVisible = () => {
//     this.setState({
//       sliderVisible: true
//     });
//   };

//   _onShowLightBox = () => {
//     const { currentIndex, animation } = this.state;
//     Animated.timing(animation, {
//       ...ANIMATED,
//       toValue: ANIMATION_MAX
//     }).start(() => {
//       this._lightBoxSlider.scrollToIndex({
//         animated: false,
//         index: currentIndex
//       });
//       this.setState({
//         sliderVisible: true
//       });
//     });
//     this.props.onShow();
//   };

//   _onCloseLightBox = () => {
//     const { animation, position } = this.state;
//     StatusBar.setHidden(false, "fade");
//     this.setState(
//       {
//         sliderVisible: false
//       },
//       () => {
//         Animated.timing(animation, {
//           ...ANIMATED,
//           toValue: 0
//         }).start(() => {
//           this.setState({
//             currentIndex: -1,
//             modalVisible: false
//           });
//           position.setValue({
//             x: 0,
//             y: 0
//           });
//         });
//       }
//     );
//     this.props.onClose();
//   };

//   _setAnimatedMove = () => {
//     const { animation, measure, getSizeCurrentImage } = this.state;

//     const WIDTH = animation.interpolate({
//       inputRange: [0, ANIMATION_MAX],
//       outputRange: [measure.width, SCREEN_WIDTH],
//       extrapolate: "clamp"
//     });

//     const HEIGHT = animation.interpolate({
//       inputRange: [0, ANIMATION_MAX],
//       outputRange: [
//         measure.height,
//         getSizeCurrentImage.height * SCREEN_WIDTH / getSizeCurrentImage.width
//       ],
//       extrapolate: "clamp"
//     });

//     const TRANSLATE_X = animation.interpolate({
//       inputRange: [0, ANIMATION_MAX],
//       outputRange: [measure.px, 0],
//       extrapolate: "clamp"
//     });

//     const TRANSLATE_Y = animation.interpolate({
//       inputRange: [0, ANIMATION_MAX],
//       outputRange: [
//         measure.py,
//         this.state.position.y._value +
//           (SCREEN_HEIGHT -
//             getSizeCurrentImage.height *
//               SCREEN_WIDTH /
//               getSizeCurrentImage.width) /
//             2
//       ],
//       extrapolate: "clamp"
//     });

//     return {
//       width: WIDTH,
//       height: HEIGHT,
//       transform: [
//         {
//           translateX: TRANSLATE_X
//         },
//         {
//           translateY: TRANSLATE_Y
//         }
//       ]
//     };
//   };

//   renderGridItem = ({ item, index }) => {
//     const { gridGap } = this.props;
//     const { currentIndex } = this.state;
//     return (
//       <TouchableOpacity
//         activeOpacity={1}
//         onPress={() => this._openLightBox(index)}
//         style={styles.grid}
//       >
//         <View
//           style={{
//             position: "relative",
//             opacity: index !== currentIndex ? 1 : 0
//           }}
//         >
//           <Image
//             ref={ref => (this[`_gridItem_${index}`] = ref)}
//             source={{ uri: item.src }}
//             resizeMode="cover"
//             style={{
//               position: "absolute",
//               top: gridGap / 2,
//               right: gridGap / 2,
//               bottom: gridGap / 2,
//               left: gridGap / 2,
//               zIndex: 9
//             }}
//           />
//           <View style={styles.setItemHeight} />
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   renderGrid() {
//     const { thumbnailImages, gridColumn, gridGap } = this.props;
//     return (
//       <FlatList
//         data={thumbnailImages}
//         renderItem={this.renderGridItem}
//         keyExtractor={(item, index) => index.toString()}
//         numColumns={gridColumn}
//         horizontal={false}
//         showsHorizontalScrollIndicator={false}
//         showsVerticalScrollIndicator={false}
//         style={{
//           margin: -gridGap / 2
//         }}
//       />
//     );
//   }

//   renderLightBoxSliderItem = ({ item, index }) => {
//     const { position } = this.state;
//     return (
//       <Animated.View
//         style={{
//           width: SCREEN_WIDTH,
//           height: SCREEN_HEIGHT
//           // transform: [...position.getTranslateTransform()]
//         }}
//         {...this._panResponder.panHandlers}
//       >
//         <Image
//           source={{ uri: item.src }}
//           resizeMode="contain"
//           style={{
//             width: "100%",
//             height: "100%"
//           }}
//         />
//       </Animated.View>
//     );
//   };

//   renderLightBoxSlider() {
//     const { lightBoxImages } = this.props;
//     const { getSizeCurrentImage, sliderVisible } = this.state;
//     if (getSizeCurrentImage !== null) {
//       return (
//         <FlatList
//           ref={ref => (this._lightBoxSlider = ref)}
//           onScrollToIndexFailed={() => {}}
//           data={lightBoxImages}
//           renderItem={this.renderLightBoxSliderItem}
//           keyExtractor={(item, index) => index.toString()}
//           horizontal={true}
//           showsHorizontalScrollIndicator={false}
//           pagingEnabled={true}
//           style={{ opacity: sliderVisible ? 1 : 0 }}
//           scrollEnabled={true}
//           onScrollBeginDrag={event => {
//             this.setState({
//               sliderDrag: true
//             });
//           }}
//           onScrollEndDrag={() => {
//             this.setState({
//               sliderDrag: false
//             });
//           }}
//         />
//       );
//     }
//   }

//   renderLightBoxUnderlay() {
//     const { animation, modalVisible, position, sliderVisible } = this.state;
//     const OPACITY_SLIDER_VISIBLE = position.y.interpolate({
//       inputRange: [-SCREEN_HEIGHT / 2, 0, SCREEN_HEIGHT / 2],
//       outputRange: [0, 1, 0],
//       extrapolate: "clamp"
//     });
//     const OPACITY_SLIDER_HIDDEN = animation.interpolate({
//       inputRange: [0, ANIMATION_MAX],
//       outputRange: [0, 1],
//       extrapolate: "clamp"
//     });
//     return (
//       <Animated.View
//         style={[
//           styles.underlay,
//           {
//             opacity: sliderVisible
//               ? OPACITY_SLIDER_VISIBLE
//               : OPACITY_SLIDER_HIDDEN
//           }
//         ]}
//       />
//     );
//   }

//   renderImageAnimation() {
//     const { lightBoxImages } = this.props;
//     const { currentIndex, getSizeCurrentImage, sliderVisible } = this.state;
//     return (
//       currentIndex !== -1 &&
//       getSizeCurrentImage !== null && (
//         <View
//           style={{
//             position: "absolute",
//             top: 0,
//             left: 0,
//             zIndex: -1,
//             width: SCREEN_WIDTH,
//             height: SCREEN_HEIGHT,
//             opacity: sliderVisible ? 0 : 1
//           }}
//         >
//           <Animated.Image
//             source={{ uri: lightBoxImages[currentIndex].src }}
//             resizeMode="cover"
//             onLoadStart={this._onLoadStartImageAnim}
//             onLoadEnd={this._onLoadEndImageAnim}
//             onLoad={this._onLoadImageAnim}
//             style={this._setAnimatedMove()}
//           />
//         </View>
//       )
//     );
//   }

//   renderLightBox() {
//     const { modalVisible } = this.state;
//     return (
//       <Modal
//         animationType="none"
//         transparent={true}
//         visible={modalVisible}
//         style={styles.modal}
//         onShow={this._onShowLightBox}
//         onRequestClose={this._onCloseLightBox}
//       >
//         <View style={styles.modalHeader}>
//           <TouchableOpacity activeOpacity={0.6} onPress={this._onCloseLightBox}>
//             <Text style={{ color: "red" }}>Close</Text>
//           </TouchableOpacity>
//         </View>
//         {this.renderImageAnimation()}
//         {this.renderLightBoxSlider()}
//         {this.renderLightBoxUnderlay()}
//       </Modal>
//     );
//   }

//   render() {
//     const { style } = this.props;
//     return (
//       <View style={styles.container} style={style}>
//         {this.renderGrid()}
//         {this.renderLightBox()}
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     flexDirection: "row",
//     flexWrap: "wrap"
//   },
//   grid: {
//     flex: 1,
//     position: "relative"
//   },
//   setItemHeight: {
//     paddingTop: "100%"
//   },
//   modal: {
//     position: "relative",
//     zIndex: 9
//   },
//   underlay: {
//     position: "absolute",
//     top: 0,
//     right: 0,
//     bottom: 0,
//     left: 0,
//     zIndex: -5,
//     backgroundColor: "#000"
//   },
//   modalHeader: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     height: 40,
//     paddingHorizontal: 10,
//     alignItems: "center",
//     zIndex: 10
//   }
// });

import React, { Component } from "react";
import { PropTypes } from "prop-types";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  Image
} from "react-native";
import ImageCover from "../atoms/ImageCover";
import { Row, Col } from "./Grid";
import { filterMax } from "../../functions/wilokeFunc";
import Swiper from "react-native-swiper";
import * as Consts from "../../../constants/styleConstants";
import { Feather } from "@expo/vector-icons";
import _ from "lodash";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const Slide = props => {
  return (
    <View style={styles.slide}>
      <Image
        onLoad={props.loadHandle.bind(null, props.i)}
        resizeMode="contain"
        style={styles.image}
        source={{ uri: props.uri }}
      />
      {!props.loaded && (
        <View style={styles.loadingView}>
          <ActivityIndicator size="small" />
        </View>
      )}
    </View>
  );
};

export default class NewGallery extends Component {
  static propTypes = {
    gap: PropTypes.number,
    column: PropTypes.number,
    thumbnailMax: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    thumbnails: PropTypes.array,
    modalSlider: PropTypes.array,
    underlayColor: PropTypes.string,
    colorPrimary: PropTypes.string,
    borderRadius: PropTypes.number,
    isOverlay: PropTypes.bool
  };
  static defaultProps = {
    gap: 5,
    column: 3,
    thumbnails: [],
    modalSlider: [],
    underlayColor: "#000",
    thumbnailMax: 0,
    colorPrimary: Consts.colorPrimary,
    isOverlay: true
  };

  state = {
    modalVisible: false,
    currentIndex: 0,
    thumbnails: [],
    modalSlider: [],
    loadSwiper: false,
    loadQueue: [0, 0, 0, 0]
  };

  componentDidMount() {
    const { modalSlider, thumbnails } = this.props;
    this.setState({ modalSlider, thumbnails });
  }

  componentDidUpdate(prevProps, prevState) {
    const { modalSlider, thumbnails } = this.props;
    if (!_.isEqual(prevProps.modalSlider, modalSlider)) {
      this.setState({ modalSlider });
    }
    if (!_.isEqual(prevProps.thumbnails, thumbnails)) {
      this.setState({ thumbnails });
    }
  }

  // componentWillUnmount() {
  //   this.setState({ modalSlider: [], thumbnails: [] });
  // }

  loadHandle = i => {
    let loadQueue = this.state.loadQueue;
    loadQueue[i] = 1;
    this.setState({
      loadQueue
    });
  };

  _handleOpenModal = index => {
    this.setState({
      modalVisible: true,
      currentIndex: index
    });
    StatusBar.setHidden(true, "fade");
  };

  _handleShowModal = () => {
    this.setState({ loadSwiper: true });
  };

  _handleCloseModal = () => {
    this.setState({
      modalVisible: false,
      loadSwiper: false
    });
    StatusBar.setHidden(false, "fade");
  };

  renderGallery = () => {
    const { gap, column, thumbnailMax, borderRadius, isOverlay } = this.props;
    const { thumbnails } = this.state;
    const _thumbnails =
      thumbnailMax > 0 ? filterMax(thumbnails)(thumbnailMax) : thumbnails;
    return thumbnails.length > 0 ? (
      <Row gap={gap}>
        {_thumbnails.map((item, index) => (
          <Col key={index.toString()} column={column} gap={gap}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => this._handleOpenModal(index)}
              style={{
                position: "relative",
                width: "100%",
                backgroundColor: Consts.colorGray2
              }}
            >
              <View style={{ paddingTop: "100%" }} />
              <View style={styles.abs}>
                <ImageCover src={item} borderRadius={borderRadius} />
                {isOverlay &&
                  thumbnails.length > _thumbnails.length &&
                  _thumbnails.length - 1 === index && (
                    <View
                      style={[
                        styles.abs,
                        {
                          backgroundColor: "rgba(0,0,0,0.5)",
                          justifyContent: "center",
                          alignItems: "center"
                        }
                      ]}
                    >
                      <Text
                        style={{
                          color: "#fff",
                          fontSize: 30,
                          fontWeight: "500"
                        }}
                      >{`+${thumbnails.length - thumbnailMax}`}</Text>
                    </View>
                  )}
              </View>
            </TouchableOpacity>
          </Col>
        ))}
      </Row>
    ) : (
      <Row gap={gap}>
        {Array(3)
          .fill(null)
          .map((_, index) => (
            <Col key={index.toString()} column={column} gap={gap}>
              <View
                style={{
                  position: "relative",
                  width: "100%",
                  backgroundColor: Consts.colorGray2
                }}
              >
                <View style={{ paddingTop: "100%" }} />
              </View>
            </Col>
          ))}
      </Row>
    );
  };

  renderItemSlider = (item, index) => (
    <View
      key={index.toString()}
      style={{
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT
      }}
    >
      <Image
        source={{ uri: item }}
        resizeMode="contain"
        style={{ width: "100%", height: "100%" }}
        onLoad={props.loadHandle.bind(null, props.i)}
      />
    </View>
  );

  renderSlider = () => {
    const { currentIndex, modalSlider, loadSwiper } = this.state;
    return (
      loadSwiper && (
        <Swiper
          loadMinimal
          loadMinimalSize={1}
          loop={false}
          showsButtons={false}
          dotColor="rgba(255,255,255,0.2)"
          activeDotColor={this.props.colorPrimary}
          index={currentIndex}
        >
          {modalSlider.length > 0 &&
            modalSlider.map((item, i) => (
              <Slide
                loadHandle={this.loadHandle}
                loaded={!!this.state.loadQueue[i]}
                uri={item}
                i={i}
                key={i}
              />
            ))}
        </Swiper>
      )
    );
  };

  renderUnderlay = () => (
    <View
      style={[
        styles.abs,
        { zIndex: -1, backgroundColor: this.props.underlayColor }
      ]}
    />
  );

  renderHeader = () => (
    <View style={styles.modalHeader}>
      <TouchableOpacity activeOpacity={0.6} onPress={this._handleCloseModal}>
        <Feather name="x" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  renderModal = () => {
    const { modalVisible } = this.state;
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        style={styles.modal}
        onShow={this._handleShowModal}
        onRequestClose={this._handleCloseModal}
      >
        {this.renderHeader()}
        {this.renderSlider()}
        {this.renderUnderlay()}
      </Modal>
    );
  };

  render() {
    const { currentIndex, modalSlider } = this.state;
    return (
      <View>
        {this.renderGallery()}
        {this.renderModal()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    position: "relative",
    zIndex: 999
  },
  modalHeader: {
    position: "absolute",
    top: 0,
    right: 0,
    height: 50,
    paddingHorizontal: 10,
    justifyContent: "center",
    zIndex: 10
  },
  abs: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "transparent"
  },
  image: {
    width: SCREEN_WIDTH,
    flex: 1,
    backgroundColor: "transparent"
  },

  loadingView: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,.5)"
  }
});
