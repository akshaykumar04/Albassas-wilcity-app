import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import he from "he";
import PropTypes from "prop-types";
import { ImageCover, FontIcon, HtmlViewer } from "../../../wiloke-elements";
import AppleStyleSwipeableRow from "../../../wiloke-elements/components/atoms/SwiperApple/AppleSwipeable";

export default class CartItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      animation: new Animated.Value(0)
    };
  }

  static propTypes = {
    srcProduct: PropTypes.string,
    name: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    customStyle: PropTypes.object,
    onRemove: PropTypes.func,
    quantity: PropTypes.number,
    increase: PropTypes.func,
    decrease: PropTypes.func,
    onChangeValueQuantity: PropTypes.func
  };
  static defaultProps = {
    customStyle: {},
    onRemove: () => {},
    onPayment: () => {},
    increase: () => {},
    decrease: () => {},
    onChangeValueQuantity: () => {},
    srcProduct:
      "http://demo.wilcityapp.com/wp-content/plugins/kingcomposer/assets/images/get_start.jpg"
  };

  _startAnimation = () => {
    const { animation } = this.state;
    Animated.timing(animation, {
      duration: 150,
      toValue: 100,
      useNativeDriver: true
    }).start();
  };

  _handleSubmitEditing = () => {
    const { onChangeValueQuantity } = this.props;
    onChangeValueQuantity && onChangeValueQuantity();
  };

  _handleRemove = () => {
    const { onRemove } = this.props;
    this._startAnimation();
    setTimeout(() => {
      onRemove && onRemove();
    }, 350);
  };

  _renderContent = () => {
    const { srcProduct, name, price, onRemove } = this.props;
    return (
      <View style={styles.content}>
        <View style={styles.image}>
          <ImageCover src={srcProduct} width="100%" borderRadius={5} />
        </View>
        <View style={styles.contentRight}>
          <Text style={styles.productName} numberOfLines={2}>
            {he.decode(name)}
          </Text>
          <HtmlViewer
            html={price}
            htmlWrapCssString={`textAlign:left;`}
            containerStyle={{ padding: 5 }}
          />
          {this._renderQuantity()}
        </View>
      </View>
    );
  };

  _renderQuantity = () => {
    const { quantity, increase, decrease } = this.props;
    return (
      <View style={styles.quantity}>
        <TouchableOpacity style={styles.add} onPress={decrease}>
          <Text> - </Text>
        </TouchableOpacity>
        <TextInput
          {...this.props}
          value={quantity + ""}
          defaultValue={quantity + ""}
          style={styles.input}
          underlineColorAndroid="transparent"
          keyboardType="numeric"
          onSubmitEditing={this._handleSubmitEditing}
        />
        <TouchableOpacity style={styles.sub} onPress={increase}>
          <Text> + </Text>
        </TouchableOpacity>
      </View>
    );
  };

  _getOpacity = () => {
    const { animation } = this.state;
    return animation.interpolate({
      inputRange: [0, 50, 100],
      outputRange: [1, 0.5, 0],
      extrapolate: "clamp"
    });
  };

  render() {
    const { customStyle, onRemove, translations } = this.props;
    return (
      <Animated.View
        style={[styles.container, customStyle, { opacity: this._getOpacity() }]}
      >
        <AppleStyleSwipeableRow
          onPressRight={onRemove}
          translations={translations}
        >
          {this._renderContent()}
        </AppleStyleSwipeableRow>
      </Animated.View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    elevation: 4,
    backgroundColor: "#fff",
    position: "relative"
  },
  content: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 10
  },
  image: {
    width: 80,
    flexShrink: 0,
    borderRadius: 5
  },
  contentRight: {
    paddingLeft: 15,
    flexGrow: 1
  },
  productName: {
    fontSize: 15,
    paddingHorizontal: 5,
    fontWeight: "bold",
    flexWrap: "wrap",
    width: 200,
    textAlign: "left"
  },
  price: {
    fontSize: 13,
    padding: 5
  },
  quantity: {
    flexDirection: "row"
  },
  add: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e9e9e9"
  },
  sub: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e9e9e9"
  },
  icon: {
    position: "absolute",
    right: 0,
    top: 0,
    padding: 10
  },
  input: {
    fontSize: 13,
    padding: 5,
    paddingHorizontal: 10,
    textAlign: "center",
    width: 100
  }
});
