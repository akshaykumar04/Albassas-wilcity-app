import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Animated,
  ScrollView,
  StatusBar,
  Image,
  Dimensions,
  Platform,
  StyleSheet
} from "react-native";
import { Overlay, ImageCover } from "../../wiloke-elements";
import Constants from "expo-constants";

import stylesBase from "../../stylesBase";
import * as Consts from "../../constants/styleConstants";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const IOS = Platform.OS === "ios";

const HEADER_MAX_HEIGHT = SCREEN_HEIGHT / 2.5;
const HEADER_MIN_HEIGHT = 52 + Constants.statusBarHeight;
const HEADER_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
const SCROLL_EVENT_THROTTLE = 16;
const LOGO_MG_TOP = -40;
const WAVE_SIZE = 168;
const WAVE_MG_TOP = -84;
const TAB_NAVIGATOR_HEIGHT = 48;

function transformOrigin(matrix, origin) {
  const { x, y, z } = origin;

  const translate = MatrixMath.createIdentityMatrix();
  MatrixMath.reuseTranslate3dCommand(translate, x, y, z);
  MatrixMath.multiplyInto(matrix, translate, matrix);

  const untranslate = MatrixMath.createIdentityMatrix();
  MatrixMath.reuseTranslate3dCommand(untranslate, -x, -y, -z);
  MatrixMath.multiplyInto(matrix, matrix, untranslate);
}

export default class LayoutHeaderParallax extends Component {
  state = {
    scrollY: new Animated.Value(IOS ? -HEADER_MAX_HEIGHT : 0),
    logoWrapperHeight: 0,
    tabItemCurrent: 0
  };

  animatedHeaderTranslate = (scrollY, logoWrapperHeight) => {
    return scrollY.interpolate({
      inputRange: [
        0,
        HEADER_DISTANCE + logoWrapperHeight + (logoWrapperHeight > 0 ? 30 : 0)
      ],
      outputRange: [0, -HEADER_DISTANCE],
      extrapolate: "clamp"
    });
  };

  animatedImageTranslate = (scrollY, logoWrapperHeight) => {
    return scrollY.interpolate({
      inputRange: [
        0,
        HEADER_DISTANCE + logoWrapperHeight + (logoWrapperHeight > 0 ? 30 : 0)
      ],
      outputRange: [0, 100],
      extrapolate: "clamp"
    });
  };

  animatedImageScale = scrollY => {
    return scrollY.interpolate({
      inputRange: [-300, 0],
      outputRange: [1.5, 1],
      extrapolate: "clamp"
    });
  };

  animatedTitle = (scrollY, logoWrapperHeight, outputRange) => {
    return scrollY.interpolate({
      inputRange: [
        0,
        HEADER_DISTANCE / 2 +
          logoWrapperHeight +
          (logoWrapperHeight > 0 ? 30 : 0),
        HEADER_DISTANCE + logoWrapperHeight + (logoWrapperHeight > 0 ? 30 : 0)
      ],
      outputRange,
      extrapolate: "clamp"
    });
  };
  animatedOverlayOpacity = (scrollY, logoWrapperHeight, outputRange) => {
    return scrollY.interpolate({
      inputRange: [
        0,
        HEADER_DISTANCE + logoWrapperHeight + (logoWrapperHeight > 0 ? 30 : 0)
      ],
      outputRange,
      extrapolate: "clamp"
    });
  };

  animatedGeneral = (scrollY, outputRange) => {
    return scrollY.interpolate({
      inputRange: [0, HEADER_DISTANCE / 2, HEADER_DISTANCE],
      outputRange,
      extrapolate: "clamp"
    });
  };

  renderHeader = (scrollY, logoWrapperHeight) => (
    <Fragment>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.header,
          {
            transform: [
              {
                translateY: this.animatedHeaderTranslate(
                  scrollY,
                  logoWrapperHeight
                )
              }
            ]
          }
        ]}
      >
        <Animated.Image
          source={{ uri: this.props.backgroundImage }}
          style={[
            styles.backgroundImage,
            {
              transform: [
                {
                  translateY: this.animatedImageTranslate(
                    scrollY,
                    logoWrapperHeight
                  )
                },
                {
                  scaleX: this.animatedImageScale(scrollY)
                },
                {
                  scaleY: this.animatedImageScale(scrollY)
                }
              ],
              opacity: this.animatedOverlayOpacity(scrollY, logoWrapperHeight, [
                1,
                0
              ])
            }
          ]}
        />
        <Overlay
          animated={true}
          opacity={this.animatedOverlayOpacity(scrollY, logoWrapperHeight, [
            0.4,
            0
          ])}
          zIndex={1}
        />
        <Overlay
          animated={true}
          opacity={this.animatedOverlayOpacity(scrollY, logoWrapperHeight, [
            0,
            1
          ])}
          zIndex={2}
          backgroundColor={this.props.colorPrimary}
        />
      </Animated.View>
      <View style={styles.headerHead}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            height: HEADER_MIN_HEIGHT,
            paddingHorizontal: 10,
            paddingTop: Constants.statusBarHeight
          }}
        >
          <TouchableOpacity activeOpacity={0.8} onPress={this.props.goBack}>
            {this.props.renderBackButton()}
          </TouchableOpacity>
          <Animated.View
            style={{
              transform: [
                {
                  translateY: this.animatedTitle(scrollY, logoWrapperHeight, [
                    50,
                    50,
                    0
                  ])
                }
              ],
              opacity: this.animatedTitle(scrollY, logoWrapperHeight, [0, 0, 1])
            }}
          >
            <Text
              style={[
                stylesBase.h5,
                {
                  color: "#fff"
                }
              ]}
              numberLines={1}
            >
              {this.props.name}
            </Text>
          </Animated.View>
          {this.props.renderRightButton()}
        </View>
      </View>
      <Animated.View
        style={{
          position: "absolute",
          top: SCREEN_HEIGHT - TAB_NAVIGATOR_HEIGHT,
          left: 0,
          right: 0
        }}
      >
        {this.renderTabNavigator()}
      </Animated.View>
    </Fragment>
  );

  randerAfterHeader = (scrollY, logoWrapperHeight) => {
    return (
      <Animated.View
        pointerEvents="none"
        style={[
          styles.logoWrapper,
          {
            top: HEADER_MAX_HEIGHT,
            opacity: this.animatedGeneral(scrollY, [1, 1, 0]),
            transform: [
              {
                translateY: this.animatedGeneral(scrollY, [
                  0,
                  (-HEADER_DISTANCE + 50) / 2,
                  -HEADER_DISTANCE + 50
                ])
              },
              {
                scaleX: this.animatedGeneral(scrollY, [1, 0.6, 0.1])
              },
              {
                scaleY: this.animatedGeneral(scrollY, [1, 0.6, 0.1])
              }
            ]
          }
        ]}
      >
        <View
          onLayout={event => {
            this.setState({
              logoWrapperHeight: event.nativeEvent.layout.width + WAVE_MG_TOP
            });
          }}
          style={styles.logoInner}
        >
          <ImageCover
            src={this.props.logo}
            width={80}
            borderRadius={40}
            styles={styles.logo}
          />
          <Image
            source={require("../../../assets/wave.png")}
            style={styles.wave}
          />
          <View
            style={{
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={[stylesBase.h4, styles.title]}>{this.props.name}</Text>
            <Text style={[stylesBase.text, styles.tagline]}>
              {this.props.tagline}
            </Text>
          </View>
        </View>
      </Animated.View>
    );
  };

  _handlePressTabItem = index => {
    this.setState({ tabItemCurrent: index });
  };

  renderTabNavigator() {
    const { tabNavigator } = this.props;
    const { tabItemCurrent, tabScrollX } = this.state;
    return (
      <ScrollView
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{
          height: TAB_NAVIGATOR_HEIGHT,
          borderTopWidth: 1,
          borderTopColor: Consts.colorGray1,
          backgroundColor: "#fff"
        }}
      >
        {tabNavigator.map((item, index) => (
          <TouchableOpacity
            activeOpacity={1}
            style={{
              height: TAB_NAVIGATOR_HEIGHT,
              justifyContent: "center",
              paddingHorizontal: 22
            }}
            key={index.toString()}
            onPress={() => this._handlePressTabItem(index)}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center"
              }}
            >
              <View style={{ marginRight: 4 }}>
                {item.icon &&
                  item.icon(
                    tabItemCurrent === index
                      ? this.props.colorPrimary
                      : Consts.colorDark3
                  )}
              </View>
              <Text
                style={{
                  fontSize: 12,
                  color:
                    tabItemCurrent === index
                      ? this.props.colorPrimary
                      : Consts.colorDark3
                }}
              >
                {item.label}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  render() {
    const { logoWrapperHeight } = this.state;
    const scrollY = Animated.add(
      this.state.scrollY,
      IOS ? HEADER_MAX_HEIGHT : 0
    );
    return (
      <View style={styles.container}>
        <Animated.ScrollView
          scrollEventThrottle={SCROLL_EVENT_THROTTLE}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: { y: this.state.scrollY }
                }
              }
            ],
            { useNativeDriver: true }
          )}
          contentInset={{
            top: HEADER_MAX_HEIGHT
          }}
          contentOffset={{
            y: -HEADER_MAX_HEIGHT
          }}
        >
          {IOS && (
            <Animated.View
              style={{
                backgroundColor: "#fff",
                height: logoWrapperHeight + (logoWrapperHeight > 0 ? 30 : 0),
                position: "relative",
                top: -15,
                transform: [
                  {
                    translateY: this.animatedGeneral(scrollY, [
                      0,
                      logoWrapperHeight + (logoWrapperHeight > 0 ? 15 : 0),
                      logoWrapperHeight + (logoWrapperHeight > 0 ? 15 : 0)
                    ])
                  }
                ]
              }}
            />
          )}
          {IOS && (
            <View style={{ backgroundColor: "#fff" }}>
              <View>{this.props.renderTopContent()}</View>
            </View>
          )}
          <View
            style={{
              paddingTop: !IOS ? HEADER_MAX_HEIGHT + 15 : 0,
              backgroundColor: Consts.colorGray2
            }}
          >
            {!IOS && (
              <Animated.View
                style={{
                  backgroundColor: "#fff",
                  height:
                    logoWrapperHeight + (logoWrapperHeight > 0 ? 30 : 0) + 80,
                  position: "relative",
                  top: 0,
                  transform: [
                    {
                      translateY: this.animatedHeaderTranslate(
                        scrollY,
                        logoWrapperHeight + 100
                      )
                    }
                  ]
                }}
              />
            )}
            {!IOS && (
              <View
                style={{
                  backgroundColor: "#fff",
                  marginTop: -80
                }}
              >
                <View>{this.props.renderTopContent()}</View>
              </View>
            )}
            <View style={{ marginBottom: 15 }} />
            {this.props.renderContent()}
          </View>
        </Animated.ScrollView>
        {this.renderHeader(scrollY, logoWrapperHeight)}
        {this.props.enableAfterHeader &&
          this.randerAfterHeader(scrollY, logoWrapperHeight)}
      </View>
    );
  }
}

LayoutHeaderParallax.defaultProps = {
  renderBackButton: () => <Text style={styles.back}>Back</Text>,
  renderRightButton: () => <Text />,
  renderTopContent: () => {},
  isLoading: false,
  enableAfterHeader: true,
  colorPrimary: Consts.colorPrimary
};
LayoutHeaderParallax.propTypes = {
  renderBackButton: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  renderContent: PropTypes.func.isRequired,
  backgroundImage: PropTypes.string,
  logo: PropTypes.string,
  enableAfterHeader: PropTypes.bool,
  tabNavigator: PropTypes.array,
  colorPrimary: PropTypes.string
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingBottom: TAB_NAVIGATOR_HEIGHT
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    height: HEADER_MAX_HEIGHT,
    overflow: "hidden"
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width: null,
    height: HEADER_MAX_HEIGHT,
    resizeMode: "cover"
  },
  headerHead: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9
  },
  back: {
    color: "#fff"
  },
  logoWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: "center",
    overflow: "hidden",
    marginTop: LOGO_MG_TOP,
    paddingBottom: 15
  },
  logoInner: {
    position: "relative",
    alignItems: "center"
  },
  logo: {
    marginTop: 4
  },
  title: {
    marginBottom: 3
  },
  wave: {
    marginTop: WAVE_MG_TOP,
    marginBottom: 20,
    tintColor: "#fff",
    width: WAVE_SIZE,
    height: (WAVE_SIZE * 131) / 317
  }
});
