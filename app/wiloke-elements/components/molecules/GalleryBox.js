import React, { PureComponent } from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import PropTypes from "prop-types";
import Constants from "expo-constants";
import Swiper from "react-native-swiper";
import Loader from "../atoms/Loader";

const { width, height } = Dimensions.get("window");
const STATUS_BAR_HEIGHT = Constants.statusBarHeight;

const Slide = props => {
  return (
    <View style={styles.slide}>
      <Image
        onLoad={props.loadHandle.bind(null, props.i)}
        style={styles.image}
        source={{ uri: props.uri }}
      />
      {/* {!!props.loaded && (
        <View style={styles.loadingView}>
          <Loader />
        </View>
      )} */}
    </View>
  );
};

export default class GalleryBox extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loadQueue: [0, 0, 0, 0],
      imageList: [
        "http://demo.wilcityapp.com/wp-content/plugins/kingcomposer/assets/images/get_start.jpg"
      ]
    };
    this.loadHandle = this.loadHandle.bind(this);
  }
  static propTypes = {
    gallery: PropTypes.array,
    colorPrimary: PropTypes.string,
    renderHeaderLeft: PropTypes.func,
    renderHeaderRight: PropTypes.func,
    renderHeaderCenter: PropTypes.func
  };

  static defaultProps = {
    colorPrimary: "#fff"
  };
  loadHandle(i) {
    let loadQueue = this.state.loadQueue;
    loadQueue[i] = 1;
    this.setState({
      loadQueue
    });
  }

  _renderHeader = () => {
    const {
      renderHeaderCenter,
      renderHeaderLeft,
      renderHeaderRight
    } = this.props;
    return (
      <View style={styles.header}>
        {renderHeaderLeft && renderHeaderLeft()}
        {renderHeaderCenter ? renderHeaderCenter() : <Text />}
        {renderHeaderRight && renderHeaderRight()}
      </View>
    );
  };

  render() {
    const { gallery } = this.props;
    const newGallery =
      gallery && gallery.length > 0 ? gallery : this.state.imageList;
    return (
      <View>
        <Swiper
          loadMinimal
          loadMinimalSize={1}
          style={styles.wrapper}
          loop={false}
          dotColor="rgba(0,0,0, 0.3)"
          activeDotColor={this.props.colorPrimary}
          index={0}
        >
          {newGallery.map((item, i) => {
            return (
              <Slide
                loadHandle={this.loadHandle}
                loaded={!!this.state.loadQueue[i]}
                uri={item}
                i={i}
                key={i}
              />
            );
          })}
        </Swiper>
        {this._renderHeader()}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    height: height / 2 - 40,
    position: "relative"
  },

  slide: {
    flex: 1,
    justifyContent: "center"
  },
  image: {
    width: width,
    height: "100%"
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
  },

  loadingImage: {
    width: 60,
    height: 60
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    paddingTop: STATUS_BAR_HEIGHT - 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%"
  }
});
