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
import { isEmpty, isEqual, omit } from "lodash";
import PickColors from "../../dumbs/PickColors/PickColors";
import { colorPrimary } from "../../../constants/styleConstants";

export default class ModalVariations extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      firstSelected: "",
      oAttributes: []
    };
  }

  componentDidMount() {
    this._getAttributesRender();
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.product.results, this.props.product.results)) {
      this.setState({
        firstSelected: this.props.product.results
      });
    }
  }

  _mapAttributes = obj => {
    return Object.keys(obj).map(item => {
      return {
        title: item,
        options: obj[item]
      };
    });
  };

  _getAttributesRender = () => {
    const { product, onSelected } = this.props;
    const { variations, results } = product;
    const oAttributes = variations.oAttributes;

    const aVariationGroups = Object.values(variations.oVariations).reduce(
      (aVariations, oVariation) => {
        return [...aVariations, { ...oVariation.oAttributes }];
      },
      []
    );

    const oFirstVariationGroup = aVariationGroups[0];

    const aFirstVariationGroupKeys = Object.keys(oFirstVariationGroup);
    const newAttributes = Object.keys(oFirstVariationGroup).reduce(
      (obj, key) => {
        if (oFirstVariationGroup[key] === "") {
          return { ...obj, [key]: oAttributes[key].slugs };
        } else {
          return {
            ...obj,
            [key]: [oFirstVariationGroup[key]],
            [aFirstVariationGroupKeys[0]]:
              oAttributes[aFirstVariationGroupKeys[0]].slugs
          };
        }
      },
      {}
    );

    const oAttributes2 = this._mapAttributes(newAttributes);

    this.setState(
      {
        firstSelected: oFirstVariationGroup,
        oAttributes: oAttributes2,
        aVariationGroups,
        oFirstVariationGroup,
        aFirstVariationGroupKeys
      },
      () => onSelected(this.state.firstSelected)
    );
  };

  _handleSelectedItem = item => {
    const { onSelected, product, onReset } = this.props;
    const { variations } = product;
    const oAttributes = variations.oAttributes;
    const { aVariationGroups, aFirstVariationGroupKeys } = this.state;
    const firtsKey = aFirstVariationGroupKeys[0];
    if (item.index === 0) {
      const selectAttributes = aVariationGroups.reduce((obj, variant) => {
        if (variant[firtsKey] === item[firtsKey]) {
          aFirstVariationGroupKeys.forEach(key => {
            if (variant[key] === "") {
              obj = { ...obj, [key]: oAttributes[key].slugs };
            } else {
              obj = {
                ...obj,
                [key]: [variant[key]],
                [firtsKey]: oAttributes[firtsKey].slugs
              };
            }
          });
        } else if (variant[firtsKey] === "") {
          aFirstVariationGroupKeys.forEach(key => {
            if (variant[key] === "") {
              obj = { ...obj, [key]: oAttributes[key].slugs };
            } else {
              obj = {
                ...obj,
                [key]: [variant[key]],
                [firtsKey]: oAttributes[firtsKey].slugs
              };
            }
          });
        }
        return obj;
      }, {});
      this.setState({
        oAttributes: this._mapAttributes(selectAttributes)
      });
    }
  };

  _keyExtractor = (item, index) => item.title;

  _renderContentModal = () => {
    const { oAttributes, firstSelected } = this.state;
    return (
      <ScrollView>
        {oAttributes.map((item, index) => {
          return (
            <PickColors
              data={item.options}
              key={item.title}
              id={item.title}
              number={index}
              firstSelected={firstSelected}
              onPress={this._handleSelectedItem}
            />
          );
        })}
      </ScrollView>
    );
  };

  _handleSubmit = () => {
    const { product } = this.props;
    const { results } = product;
    Object.keys(results).map(key => {
      if (results[key] === "") {
        Alert.alert("Please choose all variant");
        return;
      }
    });
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

  _openModal = () => {
    this.modal.open();
  };
  _closeModal = () => {
    this.modal.close();
  };

  render() {
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
  container: {},
  button: {
    width: 70,
    height: 70,
    borderWidth: 1,
    backgroundColor: "#fff"
  },
  txtBtn: {
    fontSize: 15,
    color: "#333",
    padding: 7
  },
  btnFooter: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colorPrimary
  }
});
