import React, { PureComponent } from "react";
import { View } from "react-native";
import { isEmpty, isEqual } from "lodash";

export default class Masonry extends PureComponent {
  static defaultProps = {
    keyExtractor: (item, index) => String(index),
    column: 2,
    gapVertical: 5,
    gapHorizontal: 5
  };

  state = {
    data: [],
    clientRect: {},
    masonry: {},
    heightContainer: 0
  };

  componentDidMount() {
    const { data } = this.props;
    this.setState({ data });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!isEqual(nextProps.data, prevState.data)) {
      return {
        data: nextProps.data
      };
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    const { clientRect } = this.state;
    if (!isEqual(prevState.clientRect, clientRect)) {
      this._setMasonry();
    }
  }

  _setMasonry = () => {
    const { column } = this.props;
    const { clientRect } = this.state;
    let columnsCheckerMutate = Array(column).fill(0);
    const widthRatio = 100 / column;
    const masonry = Object.keys(clientRect).reduce((obj, keyIndex) => {
      const height = clientRect[keyIndex];
      const minIndex = this._getMinIndex(columnsCheckerMutate);
      const top = columnsCheckerMutate[minIndex];
      const left = `${widthRatio * minIndex}%`;
      columnsCheckerMutate[minIndex] += height;
      return {
        ...obj,
        [keyIndex]: {
          top,
          left
        }
      };
    }, {});
    const heightContainer = Math.max(...columnsCheckerMutate);
    this.setState({ heightContainer, masonry });
  };

  _getMinIndex = arr => {
    return arr.reduce((minIndex, cur, index) => {
      return arr[index] < arr[minIndex] ? index : minIndex;
    }, 0);
  };

  _setClientRect = index => ({ nativeEvent }) => {
    const { height } = nativeEvent.layout;
    this.setState(state => ({
      clientRect: {
        ...state.clientRect,
        [index]: height
      }
    }));
  };

  _renderItem = (item, index) => {
    const {
      keyExtractor,
      renderItem,
      column,
      gapVertical,
      gapHorizontal
    } = this.props;
    const { masonry } = this.state;
    return (
      <View
        key={keyExtractor(item, index)}
        style={{
          position: "absolute",
          width: `${100 / column}%`,
          paddingVertical: gapVertical / 2,
          paddingHorizontal: gapHorizontal / 2,
          ...(masonry[index]
            ? {
                top: masonry[index].top,
                left: masonry[index].left
              }
            : {})
        }}
        onLayout={this._setClientRect(index)}
      >
        {renderItem({ item, index })}
      </View>
    );
  };

  render() {
    const { gapVertical, gapHorizontal } = this.props;
    const { data, heightContainer } = this.state;
    return (
      <View
        style={{
          position: "relative",
          height: heightContainer,
          marginVertical: -gapVertical / 2,
          marginHorizontal: -gapHorizontal / 2
        }}
      >
        {!isEmpty(data) && data.map(this._renderItem)}
      </View>
    );
  }
}
