import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ViewPropTypes,
  Dimensions,
  StatusBar
} from "react-native";
import ImageCover from "../atoms/ImageCover";
import CameraRollHOC from "../molecules/CameraRollHOC";
import { bottomBarHeight } from "../../functions/bottomBarHeight";
import { Feather } from "@expo/vector-icons";
import _ from "lodash";
import Constants from "expo-constants";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const STATUS_BAR_HEIGHT = Constants.statusBarHeight;
const IMAGE_BG_COLOR = "#f0f0f3";
const BORDER_BOTTOM_COLOR = "#e7e7ed";
const HEADER_HEIGHT = 52 + STATUS_BAR_HEIGHT;
const CONTENT_HEIGHT = SCREEN_HEIGHT - HEADER_HEIGHT;
const TEXT_COLOR = "#70778b";

class CameraRollSelect extends Component {
  static propTypes = {
    ...FlatList.propTypes, // lấy lại propTypes của Flatlist
    numGap: PropTypes.number, // khoảng cách giữa các item
    data: PropTypes.array, // mảng dữ liệu truyền vào
    customIconSelected: PropTypes.func, // tạo lại icon khi check
    iconColorSelected: PropTypes.string, // màu icon
    containerStyle: ViewPropTypes.style, // style cho container
    itemSelectedMaximum: PropTypes.number, // select được nhiều nhất là bao nhiêu item,
    itemWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    itemHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    buttonHeaderLeft: PropTypes.shape({
      color: PropTypes.string, // set color cho nút bên trái của header
      text: PropTypes.string, // set text cho nút bên trái của header
      onPress: PropTypes.func // có tham số là mảng kết quả
    }),
    buttonHeaderRight: PropTypes.shape({
      color: PropTypes.string, // set color cho nút bên phải của header
      text: PropTypes.string, // set text cho nút bên phải của header
      onPress: PropTypes.func // có tham số là mảng kết quả
    }),
    selectedText: PropTypes.func, // có tham số là count và return ra string
    onSelectPhotos: PropTypes.func, // có tham số là mảng kết quả
    statusBarStyle: PropTypes.string, // style cho status bar
    headerEnabled: PropTypes.bool, // bật / tắt header,
    headerStyle: ViewPropTypes.style, // style cho header
    contentStyle: ViewPropTypes.style, // style cho content
    selectedPhotos: PropTypes.array // ảnh đc chọn lúc đầu
  };

  static defaultProps = {
    numColumns: 1,
    numGap: 6,
    horizontal: false,
    onEndReached: () => {},
    onSelectPhotos: () => {},
    renderHeaderCenter: count => (
      <View>
        <Text style={styles.headerCenterText}>{count} selected</Text>
      </View>
    ),
    iconColorSelected: "red",
    itemSelectedMaximum: Infinity,
    buttonHeaderLeft: {
      color: "#666",
      text: "Button left",
      onPress: () => {}
    },
    buttonHeaderRight: {
      color: "#666",
      text: "Button right",
      onPress: () => {}
    },
    statusBarStyle: "dark-content",
    headerEnabled: true,
    selectedPhotos: []
  };

  state = {
    results: this.props.selectedPhotos
  };

  _handleItemPress = item => async () => {
    await this.setState(prevState => ({
      results: _.some(prevState.results, item) // nếu mảng có chứa item này rồi
        ? prevState.results.filter(_item => !_.isEqual(_item, item)) // thì bấm vào sẽ xoá nó
        : prevState.results.length < this.props.itemSelectedMaximum // còn không nếu mà số item nhỏ hơn max
        ? [...prevState.results, item] // thì thêm item này vào
        : prevState.results // còn không thì không thêm item nữa
    }));

    // tạo props onSelectPhotos và truyền tham số là kết quả mảng đã selected
    this.props.onSelectPhotos(this.state.results);
  };

  // bấm vào button 2 bên của header
  _handleHeaderPress = type => () => {
    const { buttonHeaderLeft, buttonHeaderRight } = this.props;
    const { results } = this.state;
    if (type === "left") {
      buttonHeaderLeft.onPress && buttonHeaderLeft.onPress(results);
    } else {
      buttonHeaderRight.onPress && buttonHeaderRight.onPress(results);
    }
  };

  _getStyleForIcon = itemSelected => {
    const { iconColorSelected } = this.props;
    return {
      backgroundColor: itemSelected ? iconColorSelected : "transparent",
      borderColor: itemSelected ? iconColorSelected : "rgba(255, 255, 255, 0.7)"
    };
  };

  _renderIconSelected = item => {
    const { customIconSelected } = this.props;
    const { results } = this.state;
    const itemSelected = _.some(results, item);
    return customIconSelected ? ( // nếu set cho custom lại icon
      customIconSelected(itemSelected) // thì gọi hàm và truyền tham số itemSelected trả về true nếu item selected còn k là false
    ) : (
      // nếu k thì sẽ render ra icon selected có sẵn
      <View style={[styles.iconSelected, this._getStyleForIcon(itemSelected)]}>
        {itemSelected && <Feather name="check" color={"#fff"} size={20} />}
      </View>
    );
  };

  _renderItem = ({ item }) => {
    const { numColumns, numGap, itemWidth, itemHeight } = this.props;
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={this._handleItemPress(item)}
        style={[
          styles.itemWrap,
          {
            width: !!itemWidth ? itemWidth : `${100 / numColumns}%`,
            padding: numGap / 2
          }
        ]}
      >
        <View
          style={[
            styles.itemInnerWrap,
            {
              width: "100%",
              height: itemHeight
            }
          ]}
        >
          <ImageCover
            useImageDefault
            src={item.uri}
            {...(!!itemHeight ? { height: itemHeight } : {})}
          />
          {this._renderIconSelected(item)}
        </View>
      </TouchableOpacity>
    );
  };

  _renderHeader = () => {
    const { results } = this.state;
    const {
      renderHeaderCenter,
      buttonHeaderLeft,
      buttonHeaderRight,
      headerStyle
    } = this.props;
    const selectedCount = results.length;
    return (
      <View style={[styles.header, headerStyle]}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={this._handleHeaderPress("left")}
          style={styles.headerLeft}
        >
          <Text
            style={[styles.headerLeftText, { color: buttonHeaderLeft.color }]}
          >
            {buttonHeaderLeft.text}
          </Text>
        </TouchableOpacity>
        {renderHeaderCenter(selectedCount)}
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={this._handleHeaderPress("right")}
          style={styles.headerRight}
        >
          <Text
            style={[styles.headerRightText, { color: buttonHeaderRight.color }]}
          >
            {buttonHeaderRight.text}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const {
      data,
      numGap,
      containerStyle,
      statusBarStyle,
      headerEnabled,
      contentStyle
    } = this.props;
    return (
      <View style={[styles.container, containerStyle]}>
        <StatusBar barStyle={statusBarStyle} />
        {headerEnabled && this._renderHeader()}
        <FlatList
          {...this.props}
          data={data}
          keyExtractor={(_, index) => index.toString()}
          renderItem={this._renderItem}
          onEndReachedThreshold={0.01}
          style={[styles.flatList, contentStyle, { margin: -(numGap / 2) }]}
        />
        <View style={{ height: bottomBarHeight }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff"
  },
  flatList: {
    height: CONTENT_HEIGHT,
    padding: 5
  },
  itemWrap: {
    height: "100%"
  },
  itemInnerWrap: {
    position: "relative",
    zIndex: 9,
    overflow: "hidden",
    backgroundColor: IMAGE_BG_COLOR
  },
  iconSelected: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    position: "absolute",
    top: 4,
    right: 4,
    zIndex: 9,
    alignItems: "center",
    justifyContent: "center"
  },
  header: {
    position: "relative",
    zIndex: 9,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: HEADER_HEIGHT,
    paddingTop: STATUS_BAR_HEIGHT,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_BOTTOM_COLOR,
    backgroundColor: "#f6f6f8"
  },
  headerLeft: {
    width: 100
  },
  headerLeftText: {
    textAlign: "left"
  },
  headerRight: {
    width: 100
  },
  headerRightText: {
    textAlign: "right"
  },
  headerCenterText: {
    fontSize: 12,
    color: TEXT_COLOR
  }
});

export default CameraRollHOC(CameraRollSelect);
