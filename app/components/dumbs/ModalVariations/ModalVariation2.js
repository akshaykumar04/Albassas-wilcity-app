import React, { PureComponent } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  SectionList,
  ScrollView,
  Alert
} from "react-native";
import Modalize from "react-native-modalize";
import { colorPrimary } from "../../../constants/styleConstants";

const mapVariations = variants => {
  const aVariationGroups = Object.values(variants).reduce(
    (aVariations, oVariation) => {
      return [
        ...aVariations,
        {
          ...oVariation.oAttributes,
          id: oVariation.id,
          price: oVariation.price
        }
      ];
    },
    []
  );
  const oFirstVariationGroup = aVariationGroups[0];
  const aFirstKeys = Object.keys(oFirstVariationGroup)[0];
  return {
    aVariationGroups,
    aFirstKeys,
    aFirstvalue: oFirstVariationGroup[aFirstKeys],
    aFirstID: oFirstVariationGroup.id,
    aFirstPrice: oFirstVariationGroup.price
  };
};

export default class ModalVariation extends PureComponent {
  constructor(props) {
    super(props);
    const { product } = props;
    const {
      aVariationGroups,
      aFirstKeys,
      aFirstvalue,
      aFirstID,
      aFirstPrice
    } = mapVariations(product.variations.oVariations);
    this.state = {
      oAttributes: !!aFirstvalue
        ? this.transform(product.variations.oVariations, aFirstKeys)
        : this._transformAny(),
      result: {
        [aFirstKeys]: aFirstvalue,
        id: aFirstID,
        price: aFirstPrice
      }
    };
  }

  _transformAny = (activeIndex = 0) => {
    const { product } = this.props;
    const { oAttributes, oVariations } = product.variations;
    const { aFirstKeys } = mapVariations(oVariations);
    return oAttributes[aFirstKeys].slugs.reduce((obj, item, index) => {
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
                    [key]: oAttributes[key].slugs.map(slug => ({
                      name: slug,
                      isActive: false
                    }))
                  }
                : {})
            },
            isActive
          };
        }, {})
      };
    }, {});
  };

  transform = (source, firstKey, activeIndex = 0) => {
    const { product } = this.props;
    const { oVariations } = product.variations;
    return Object.values(source).reduce((obj, item, index) => {
      const isActive = activeIndex === index;
      return {
        ...obj,
        [item.oAttributes[firstKey]]: Object.keys(item.oAttributes).reduce(
          (obj2, key, _index) => {
            return {
              ...obj2,
              data: {
                ...obj2.data,
                ...(_index !== 0
                  ? {
                      [key]: !item.oAttributes[key]
                        ? product.variations.oAttributes[key].slugs.map(
                            slug => ({
                              name: slug,
                              isActive: false
                            })
                          )
                        : [{ name: item.oAttributes[key], isActive: false }]
                    }
                  : {})
              },
              isActive
            };
          },
          {}
        )
      };
    }, {});
  };

  _handlePressColor = color => async () => {
    const { oAttributes } = this.state;
    const { product } = this.props;
    const { aFirstKeys, aVariationGroups, aFirstvalue } = mapVariations(
      product.variations.oVariations
    );

    const id = aVariationGroups.reduce((id, item) => {
      if (item[aFirstKeys] === color) {
        id = item.id;
      }
      return id;
    }, 0);
    const price = aVariationGroups.reduce((price, item) => {
      if (item[aFirstKeys] === color) {
        price = item.price;
      }
      return price;
    }, 0);

    if (!!aFirstvalue) {
      await this.setState({
        oAttributes: Object.keys(oAttributes).reduce((obj, _color) => {
          return {
            ...obj,
            [_color]: {
              data: Object.keys(oAttributes[_color].data).reduce(
                (obj2, item) => {
                  return {
                    ...obj2,
                    [item]: oAttributes[_color].data[item].map(o => ({
                      ...o,
                      isActive: false
                    }))
                  };
                },
                {}
              ),
              isActive: color === _color
            }
          };
        }, {})
      });
      await this.setState(prevState => ({
        result: {
          [aFirstKeys]: color,
          id,
          price
        }
      }));
      return;
    }
    this.setState(prevState => ({
      result: {
        ...prevState.result,
        [aFirstKeys]: color,
        id,
        price
      }
    }));
  };

  _handlePressContent = (item, key) => async () => {
    const { oAttributes } = this.state;
    await this.setState({
      oAttributes: Object.keys(oAttributes).reduce((obj, color) => {
        return {
          ...obj,
          [color]: {
            ...oAttributes[color],
            data: Object.keys(oAttributes[color].data).reduce((obj2, _key) => {
              return {
                ...obj2,
                [_key]: oAttributes[color].data[_key].map(_item => {
                  return {
                    ..._item,
                    isActive:
                      key === _key
                        ? _item.name === item.name
                          ? true
                          : false
                        : _item.name === item.name
                        ? !_item.isActive
                        : _item.isActive
                  };
                })
              };
            }, {})
          }
        };
      }, {})
    });
    await this.setState(prevState => ({
      result: {
        ...prevState.result,
        [key]: item.name
      }
    }));
  };

  _renderNav = color => {
    const { oAttributes } = this.state;
    const isActive = oAttributes[color].isActive;
    return (
      <View style={{ padding: 10 / 2 }} key={color}>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isActive ? colorPrimary : "#fff" }
          ]}
          onPress={this._handlePressColor(color)}
        >
          <Text
            style={[
              styles.text,
              isActive ? { color: "#fff" } : { color: "#333" }
            ]}
          >
            {color}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  _renderPanel = ({ data, isActive }, index) => {
    return (
      isActive && (
        <View style={{ margin: 10 / 2 }} key={index.toString()}>
          {Object.keys(data).map(this._renderContentPanel(data))}
        </View>
      )
    );
  };

  _renderContentPanel = data => key => {
    return (
      <View
        style={{
          flexDirection: "row"
        }}
        key={key}
      >
        {data[key].map((item, index) => (
          <View style={{ padding: 10 / 2 }} key={index.toString()}>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: item.isActive ? colorPrimary : "#fff" }
              ]}
              onPress={this._handlePressContent(item, key)}
            >
              <Text
                style={[
                  styles.txtBtn,
                  { color: item.isActive ? "#fff" : "#333" }
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  _openModal = () => {
    this.modal.open();
  };
  _closeModal = () => {
    this.modal.close();
  };

  _handleSubmit = () => {
    const { result } = this.state;
    console.log(this.state.result);
    const { product } = this.props;
    const { aVariationGroups } = mapVariations(product.variations.oVariations);
    if (
      Object.keys(result).length === Object.keys(aVariationGroups[0]).length
    ) {
      this._closeModal();
    } else {
      Alert.alert("Please choose all option");
    }
  };

  _renderFooter = () => {
    return (
      <View>
        <TouchableOpacity style={styles.btnFooter} onPress={this._handleSubmit}>
          <Text style={{ padding: 5, color: "#fff" }}>OK</Text>
        </TouchableOpacity>
      </View>
    );
  };

  _renderContentModal = () => {
    const { oAttributes } = this.state;

    return (
      <ScrollView>
        <View style={{ flexDirection: "row", padding: 10 / 2 }}>
          {Object.keys(oAttributes).map(this._renderNav)}
        </View>
        {Object.values(oAttributes).map(this._renderPanel)}
        {this._renderPrice()}
      </ScrollView>
    );
  };

  _renderPrice = () => {
    const { result } = this.state;
    const { product } = this.props;
    const { aVariationGroups } = mapVariations(product.variations.oVariations);
    const isPrice =
      Object.keys(result).length === Object.keys(aVariationGroups[0]).length;
    return (
      isPrice && (
        <Text style={{ padding: 10, color: colorPrimary, fontWeight: "bold" }}>
          Price: {result["price"]}$
        </Text>
      )
    );
  };

  render() {
    const { product } = this.props;
    return (
      <Modalize
        ref={ref => (this.modal = ref)}
        {...this.props}
        FooterComponent={this._renderFooter}
      >
        {this._renderContentModal()}
      </Modalize>
    );
  }
}
const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: 80
  },
  txtBtn: {
    fontSize: 15,
    color: "#333",
    padding: 10
  },
  btnFooter: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colorPrimary
  }
});
