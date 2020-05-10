import React, { PureComponent } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Modalize } from "react-native-modalize";
import {
  FontIcon,
  ImageCover,
  HtmlViewer,
  isEmpty,
  Loader,
  AnimatedRunning,
  Row,
  Col,
} from "../../../wiloke-elements";
import * as Consts from "../../../constants/styleConstants";

const mapVariations = (variants) => {
  const aVariationGroups = Object.values(variants).reduce(
    (aVariations, oVariation) => {
      return [
        ...aVariations,
        {
          ...oVariation.oAttributes,
          id: oVariation.id,
          price: oVariation.priceHtml,
          image: oVariation.oFeaturedImg.medium,
        },
      ];
    },
    []
  );
  const oFirstVariationGroup = aVariationGroups[0];
  return {
    aVariationGroups,
    oFirstVariationGroup,
  };
};

function capitalize(s) {
  return s[0].toUpperCase() + s.slice(1);
}

export default class Variantions extends PureComponent {
  constructor(props) {
    super(props);
    const { product, productID } = props;
    const { oVariations, oAttributes } = product[productID].variationsAPI;
    const { aVariationGroups, oFirstVariationGroup } = mapVariations(
      oVariations
    );
    this.aFirstKeys = Object.keys(oFirstVariationGroup)[0];
    this.aFirstvalue = oFirstVariationGroup[this.aFirstKeys];
    this.aFirstPrice = oFirstVariationGroup.price;
    this.aFirstID = oFirstVariationGroup.id;
    this.oFeatureImage = oFirstVariationGroup.image;
    this.state = {
      oAttributes: !!this.aFirstvalue
        ? this.transform(oVariations)
        : this._transformAny(),
      result: {
        [this.aFirstKeys]: this.aFirstvalue,
        id: this.aFirstID,
        price: this.aFirstPrice,
        image: this.oFeatureImage,
      },
      title: Object.keys(oAttributes).reduce((obj, key) => {
        return { ...obj, [key]: oAttributes[key].name };
      }, {}),
      loading: false,
      disable: false,
    };
  }

  componentDidMount() {
    const { product, productID } = this.props;
    if (isEmpty(product[productID].details.variations)) {
      this.setState({
        disable: false,
      });
    }
    this.props.onSelected(this.state.result);
  }

  _transformAny = (activeIndex = 0) => {
    const { product, productID } = this.props;
    const { oAttributes, oVariations } = product[productID].variationsAPI;
    return oAttributes[this.aFirstKeys].slugs.reduce((obj, item, index) => {
      const isActive = activeIndex === index;
      return {
        ...obj,
        [item]: Object.keys(oAttributes).reduce((obj2, key, _index) => {
          return {
            ...obj2,
            data: {
              ...obj2.data,
              ...(_index !== 0
                ? {
                    [key]: oAttributes[key].options.map((slug) => ({
                      name: slug,
                      isActive: false,
                    })),
                  }
                : {}),
            },
            isActive,
          };
        }, {}),
      };
    }, {});
  };

  transform = (source, activeIndex = 0) => {
    const { product, productID } = this.props;
    const { oVariations } = product[productID].variationsAPI;
    return Object.values(source).reduce((obj, item, index) => {
      const isActive = activeIndex === index;
      return {
        ...obj,
        [item.oAttributes[this.aFirstKeys]]: Object.keys(
          item.oAttributes
        ).reduce((obj2, key, _index) => {
          return {
            ...obj2,
            data: {
              ...obj2.data,
              ...(_index !== 0
                ? {
                    [key]: !item.oAttributes[key]
                      ? product[productID].variationsAPI.oAttributes[
                          key
                        ].options.map((option) => ({
                          name: option,
                          isActive: false,
                        }))
                      : [{ name: item.oAttributes[key], isActive: false }],
                  }
                : {}),
            },
            isActive,
          };
        }, {}),
      };
    }, {});
  };
  _handlePressColor = (color) => async () => {
    const { oAttributes } = this.state;
    const { product, productID } = this.props;
    const { aVariationGroups } = mapVariations(
      product[productID].variationsAPI.oVariations
    );

    const { id, price, image } = aVariationGroups.reduce((obj, item) => {
      if (item[this.aFirstKeys] === color) {
        obj = {
          ...obj,
          id: item.id,
          price: item.price,
          image: item.image,
        };
      }
      return obj;
    }, {});

    await this.setState({
      oAttributes: Object.keys(oAttributes).reduce((obj, _color) => {
        return {
          ...obj,
          [_color]: {
            data: Object.keys(oAttributes[_color].data).reduce((obj2, item) => {
              return {
                ...obj2,
                [item]: oAttributes[_color].data[item].map((o) => ({
                  ...o,
                  isActive: false,
                })),
              };
            }, {}),
            isActive: color === _color,
          },
        };
      }, {}),
    });
    if (!!this.aFirstvalue) {
      await this.setState((prevState) => ({
        result: {
          [this.aFirstKeys]: color,
          id,
          price,
          image,
        },
      }));
      this.props.onSelected(this.state.result);
      return;
    }
    this.setState((prevState) => ({
      result: {
        ...prevState.result,
        [this.aFirstKeys]: color,
        id,
        price,
        image,
      },
    }));
    this.props.onSelected(this.state.result);
  };

  _handlePressContent = (item, key) => async () => {
    const { oAttributes } = this.state;
    const { product, productID } = this.props;
    const { aVariationGroups } = mapVariations(
      product[productID].variationsAPI.oVariations
    );
    await this.setState({
      oAttributes: Object.keys(oAttributes).reduce((obj, color) => {
        return {
          ...obj,
          [color]: {
            ...oAttributes[color],
            data: Object.keys(oAttributes[color].data).reduce((obj2, _key) => {
              return {
                ...obj2,
                [_key]: oAttributes[color].data[_key].map((_item) => {
                  return {
                    ..._item,
                    isActive:
                      key === _key
                        ? _item.name === item.name
                          ? true
                          : false
                        : _item.name === item.name
                        ? !_item.isActive
                        : _item.isActive,
                  };
                }),
              };
            }, {}),
          },
        };
      }, {}),
    });
    await this.setState((prevState) => ({
      result: {
        ...prevState.result,
        [key]: item.name,
      },
    }));
    if (
      Object.keys(this.state.result).length ===
      Object.keys(aVariationGroups[0]).length
    ) {
      this.props.onSelected(this.state.result);
    }
  };

  _renderNav = (color) => {
    const { oAttributes } = this.state;
    const { colorPrimary } = this.props;
    const isActive = oAttributes[color].isActive;
    return (
      <Col gap={10} key={color} column={3}>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isActive ? colorPrimary : Consts.colorGray1 },
          ]}
          onPress={this._handlePressColor(color)}
        >
          <Text
            style={[
              styles.txtBtn,
              isActive ? { color: "#fff" } : { color: "#333" },
            ]}
            numberOfLines={1}
          >
            {capitalize(color)}
          </Text>
        </TouchableOpacity>
      </Col>
    );
  };

  _renderPanel = ({ data, isActive }, index) => {
    return (
      isActive && (
        <View style={{ marginVertical: 5 }} key={index.toString()}>
          {Object.keys(data).map(this._renderContentPanel(data))}
        </View>
      )
    );
  };

  _renderContentPanel = (data) => (key) => {
    const { colorPrimary } = this.props;
    return (
      <View key={key}>
        <Text style={styles.title}>{this.state.title[key]}</Text>
        <Row gap={10}>
          {data[key].map((item, index) => (
            <Col gap={10} key={index.toString()} column={3}>
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor: item.isActive
                      ? colorPrimary
                      : Consts.colorGray1,
                  },
                ]}
                onPress={this._handlePressContent(item, key)}
              >
                <Text
                  style={[
                    styles.txtBtn,
                    {
                      color: item.isActive ? "#fff" : "#333",
                    },
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            </Col>
          ))}
        </Row>
      </View>
    );
  };

  _handleSubmit = async () => {
    const { result } = this.state;
    const { product, onCart, translations, productID } = this.props;
    const { aVariationGroups } = mapVariations(
      product[productID].variationsAPI.oVariations
    );
    if (!isEmpty(product[productID].details.variations)) {
      if (
        Object.keys(result).length === Object.keys(aVariationGroups[0]).length
      ) {
        await onCart(this.state.result);
      } else {
        Alert.alert(translations.pleaseChooseAllOptions);
      }
      return;
    }
    onCart({});
  };

  _renderPrice = () => {
    const { result } = this.state;
    const { product, colorPrimary, productID } = this.props;
    const { aVariationGroups } = mapVariations(
      product[productID].variationsAPI.oVariations
    );
    const isPrice =
      Object.keys(result).length === Object.keys(aVariationGroups[0]).length;
    return (
      isPrice && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}
        >
          <Text style={{ paddingRight: 5, color: colorPrimary }}>Price</Text>
          <HtmlViewer html={result["price"]} />
        </View>
      )
    );
  };
  _renderRight = () => {
    return (
      <TouchableOpacity style={styles.icon} onPress={this._closeModal}>
        <FontIcon name="x" size={25} />
      </TouchableOpacity>
    );
  };

  _renderHeaderModal = () => {
    return (
      <View style={styles.headerModal}>
        <View />
        <View />
        {this._renderRight()}
      </View>
    );
  };

  _renderVariation = () => {
    const { oAttributes } = this.state;
    return (
      <View style={{ marginVertical: 10 }}>
        <View style={{ marginVertical: 10 }}>
          <Text style={styles.title}>{Object.values(this.state.title)[0]}</Text>
          <Row gap={10}>{Object.keys(oAttributes).map(this._renderNav)}</Row>
        </View>
        {Object.values(oAttributes).map(this._renderPanel)}
        {this._renderPrice()}
      </View>
    );
  };

  _openModal = () => {
    this.modal.open();
  };
  _closeModal = () => {
    this.modal.close();
  };

  _renderContentModal = () => {
    const { result } = this.state;
    const { product, productID } = this.props;
    const productDetails = product[productID].details;
    return (
      <ScrollView>
        <View style={{ paddingVertical: 10 }}>
          <View style={styles.modalContent}>
            <View
              style={{ width: 100, borderRadius: 5 }}
              ref={(c) => (this._viewRef = c)}
              collapsable={false}
              renderToHardwareTextureAndroid={true}
            >
              <ImageCover src={result["image"]} width="100%" borderRadius={5} />
            </View>
            <View style={styles.contentTextModal}>
              <Text style={[styles.name, { fontSize: 15 }]}>
                {productDetails.name}
              </Text>
              <HtmlViewer html={productDetails.price_html} />
            </View>
          </View>
          {!isEmpty(productDetails.variations) && this._renderVariation()}
          {this._renderFooterModal()}
        </View>
      </ScrollView>
    );
  };

  _renderFooterModal = () => {
    const { loading, translations, colorPrimary } = this.props;
    const { disable } = this.state;
    const backgroundColor = disable ? "#a4a9ae" : colorPrimary;
    return (
      <View style={{ marginVertical: 10, marginTop: 50 }}>
        <TouchableOpacity
          style={[styles.button2, { backgroundColor }]}
          onPress={this._handleSubmit}
          disabled={disable}
        >
          {loading ? (
            <ActivityIndicator
              size="small"
              color="#fff"
              style={styles.textBtn2}
            />
          ) : (
            <Text style={styles.textBtn2}>{translations.addToCart}</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const { product, productID } = this.props;
    const productDetails = product[productID].details;
    const height = !isEmpty(productDetails.variations)
      ? Consts.screenHeight - 150
      : 250;
    return (
      <Modalize
        {...this.props}
        HeaderComponent={this._renderHeaderModal}
        ref={(ref) => (this.modal = ref)}
        height={height}
        style={{ position: "relative" }}
      >
        {this._renderContentModal()}
      </Modalize>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: Consts.colorGray2,
    borderRadius: 3,
    marginLeft: 10,
    margin: 5,
  },
  title: { paddingHorizontal: 10 },
  txtBtn: {
    fontSize: 14,
    paddingVertical: 5,
  },
  rows: {
    flexDirection: "row",
    padding: 10 / 2,
  },
  headerModal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  view: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  icon: {
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  modalContent: {
    paddingHorizontal: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: Consts.colorGray1,
    flexDirection: "row",
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 10,
  },
  button2: {
    paddingVertical: 7,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginHorizontal: 10,
    marginBottom: 20,
  },
  textBtn2: {
    padding: 5,
    color: "#fff",
    fontWeight: "bold",
  },
});
