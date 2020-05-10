import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from "react-native";
import ModalPicker from "./ModalPicker";
import FontIcon from "./FontIcon";
import InputMaterial from "../atoms/InputMaterial";
import Button from "../atoms/Button";
import _ from "lodash";
import * as Consts from "../../../constants/styleConstants";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default class SocialField extends Component {
  static propTypes = {
    buttonAddText: PropTypes.string,
    defaultResults: PropTypes.array,
    socials: PropTypes.array,
    modalPickerLabel: PropTypes.string,
    colorPrimary: PropTypes.string
  };

  static defaultProps = {
    buttonAddText: "+ Add social",
    modalPickerLabel: "Social",
    colorPrimary: Consts.colorPrimary
  };

  state = {
    results: []
  };

  componentDidMount() {
    const { defaultResults, onChangeResults } = this.props;
    this.setState({
      results: defaultResults
    });
    onChangeResults(defaultResults);
  }

  _handleAdd = async () => {
    await this.setState({
      results: [
        ...this.state.results,
        {
          url: "",
          id: ""
        }
      ]
    });
  };

  _handleRemoveItem = index => () => {
    const { onChangeResults } = this.props;
    const results = this.state.results.filter(
      (_item, _index) => _index !== index
    );
    this.setState({ results });
    onChangeResults(results.filter(item => item.url !== "" && item.id !== ""));
  };

  _handleModalPickerChange = index => (newOptions, itemSelected) => {
    const { onChangeResults } = this.props;
    const results = this.state.results.map((_item, _index) => {
      return {
        ..._item,
        id:
          _index === index && !_.isEmpty(itemSelected)
            ? itemSelected[0].id
            : _item.id
      };
    });
    this.setState({ results });
    onChangeResults(results.filter(item => item.url !== "" && item.id !== ""));
  };

  _handleChangeUrl = index => text => {
    const { onChangeResults } = this.props;
    const results = this.state.results.map((_item, _index) => {
      return {
        ..._item,
        url: _index === index ? text : _item.url
      };
    });
    this.setState({ results });
    onChangeResults(results.filter(item => item.url !== "" && item.id !== ""));
  };

  _renderItem = (item, index, results) => {
    const { modalPickerLabel, colorPrimary } = this.props;
    return (
      <View key={index.toString()} style={styles.item}>
        <View style={{ width: SCREEN_WIDTH / 2.5 - 30 - 20, marginRight: 15 }}>
          <ModalPicker
            options={item.socials}
            label={modalPickerLabel}
            matterial={true}
            onChangeOptions={this._handleModalPickerChange(index)}
            textResultNumberOfLines={1}
            colorPrimary={colorPrimary}
            clearSelectEnabled={false}
            containerStyle={{
              marginTop: -6
            }}
          />
        </View>
        <View
          style={{
            width: (SCREEN_WIDTH * 1.5) / 2.5 - 30 - 20,
            marginRight: 15
          }}
        >
          <InputMaterial
            value={item.url}
            placeholder={item.id}
            clearTextEnabled={false}
            colorPrimary={colorPrimary}
            onChangeText={this._handleChangeUrl(index)}
          />
        </View>
        {results.length - 1 === index && (
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.remove}
            onPress={this._handleRemoveItem(index)}
          >
            <FontIcon name="x" size={18} color={Consts.colorQuaternary} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  render() {
    const { results } = this.state;
    const { socials, buttonAddText } = this.props;

    const _results = results.map(item => {
      return {
        ...item,
        socials: socials.map(socialItem => {
          return {
            ...socialItem,
            selected: item.id === socialItem.id ? true : false
          };
        })
      };
    });
    return (
      <View>
        {!_.isEmpty(_results) && _results.map(this._renderItem)}
        <Button
          backgroundColor="gray"
          color="dark"
          onPress={this._handleAdd}
          radius="round"
        >
          {buttonAddText}
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center"
  },
  remove: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Consts.colorGray2,
    borderRadius: 3,
    position: "relative",
    top: 4
  }
});
