import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import {
  View,
  ScrollView,
  Dimensions,
  Text,
  TextInput,
  Modal,
  Keyboard,
  TouchableOpacity,
  TouchableHighlight,
  StatusBar,
  StyleSheet,
  ViewPropTypes
} from "react-native";
import Constants from "expo-constants";
import { Feather } from "@expo/vector-icons";
import _ from "lodash";
import he from "he";
import * as Consts from "../../../constants/styleConstants";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const HEADER_HEIGHT = 52;
const BORDER_LIST_COLOR = Consts.colorGray1;
const SEARCH_HEIGHT = 40;
const HEADER_BUTTON_WIDTH = 70;
const HEADER_BUTTON_HEIGHT = 40;
const HEADER_BORDER_BOTTOM_COLOR = Consts.colorGray1;

export default class ModalPicker extends Component {
  static propTypes = {
    label: PropTypes.string,
    iconResultColor: PropTypes.string,
    placeholder: PropTypes.string,
    removeButtonMultipleColor: PropTypes.string,
    searchPlaceholder: PropTypes.string,
    cancelText: PropTypes.string,
    doneText: PropTypes.string,
    onChangeOptions: PropTypes.func,
    enabledSearch: PropTypes.oneOf([true, false, "auto"]),
    enabledSearchWithOptionsLength: PropTypes.number,
    textResultNumberOfLines: PropTypes.number,
    required: PropTypes.bool,
    underlayBorder: PropTypes.bool,
    multiple: PropTypes.bool,
    matterial: PropTypes.bool,
    clearSelectEnabled: PropTypes.bool,
    textResultStyle: Text.propTypes.style,
    cancelButtonStyle: Text.propTypes.style,
    doneButtonStyle: Text.propTypes.style,
    colorPrimary: PropTypes.string,
    containerStyle: ViewPropTypes.style
  };

  static defaultProps = {
    multiple: false,
    placeholder: "Add item...",
    searchPlaceholder: "Search...",
    cancelText: "Cancel",
    doneText: "Done",
    enabledSearch: "auto",
    removeButtonMultipleColor: Consts.colorQuaternary,
    enabledSearchWithOptionsLength: 8,
    required: false,
    underlayBorder: true,
    clearSelectEnabled: true,
    iconResultColor: Consts.colorDark3,
    onChangeOptions: () => {},
    colorPrimary: Consts.colorPrimary
  };

  state = {
    modalVisible: false,
    listOptions: [],
    listOptionsPrev: [],
    searchValue: ""
  };

  _optionsEntities = options => {
    return options.map(item => ({
      ...item,
      name: he.decode(item.name)
    }));
  };

  componentDidMount() {
    const { options } = this.props;
    this.setState({
      listOptions: this._optionsEntities(options),
      listOptionsPrev: this._optionsEntities(options)
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { options, onChangeOptions } = this.props;
    const { listOptions } = this.state;
    const selected = listOptions.filter(item => item.selected);
    if (!_.isEqual(prevState.listOptions, listOptions)) {
      selected && onChangeOptions(listOptions, selected);
    }
    if (!_.isEqual(prevProps.options, this.props.options)) {
      this.setState({
        listOptions: this._optionsEntities(options),
        listOptionsPrev: this._optionsEntities(options)
      });
    }
  }

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   const { options: propsOptions } = nextProps;
  //   const { listOptions: stateOptions } = prevState;
  //   if (_.isEqual(propsOptions, stateOptions)) {
  //     return null;
  //   }
  //   return {
  //     listOptions: propsOptions,
  //     listOptionsPrev: propsOptions
  //   };
  // }

  _handleOpenModal = () => {
    this.setState({
      modalVisible: true,
      searchValue: ""
    });
    Keyboard.dismiss();
  };
  _handleCancelModal = () => {
    const { multiple } = this.props;
    this.setState({
      modalVisible: false,
      listOptions: multiple
        ? this.state.listOptionsPrev
        : this.state.listOptions
    });
  };
  _handleDone = () => {
    const { multiple } = this.props;
    this.setState({
      modalVisible: false,
      listOptionsPrev: multiple
        ? this.state.listOptions
        : this.state.listOptionsPrev
    });
  };
  _handleSelected = id => {
    const { listOptions } = this.state;
    const { multiple } = this.props;
    const newListOptions = listOptions.map(item => {
      return item.id === id
        ? { ...item, selected: multiple ? !item.selected : true }
        : multiple
        ? item
        : { ...item, selected: false };
    });
    this.setState({
      modalVisible: multiple ? true : false,
      listOptions: newListOptions
    });
    Keyboard.dismiss();
  };
  _handleRemoveList = id => {
    const { listOptions } = this.state;
    const { multiple } = this.props;
    const newListOptions = listOptions.map(item => {
      return item.id === id
        ? { ...item, selected: !item.selected }
        : multiple
        ? item
        : { ...item, selected: false };
    });
    this.setState({
      listOptions: newListOptions,
      listOptionsPrev: newListOptions
    });
    Keyboard.dismiss();
  };
  _handleSearch = text => {
    this.setState({
      searchValue: text
    });
  };
  _handleSearchClear = () => {
    this.setState({
      searchValue: ""
    });
  };
  renderHeader() {
    return (
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.5} onPress={this._handleCancelModal}>
          <Text
            style={[styles.cancelButton, this.props.cancelButtonStyle]}
            textNumberOfLines={1}
          >
            {this.props.cancelText}
          </Text>
        </TouchableOpacity>
        <Text style={styles.modalTitle} textNumberOfLines={1}>
          {this.props.label}
        </Text>
        {this.props.multiple ? (
          <TouchableOpacity activeOpacity={0.5} onPress={this._handleDone}>
            <Text
              style={[
                styles.doneButton,
                { color: this.props.colorPrimary },
                this.props.doneButtonStyle
              ]}
              textNumberOfLines={1}
            >
              {this.props.doneText}
            </Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.doneButton} />
        )}
      </View>
    );
  }
  renderSearch() {
    const { listOptions, searchValue } = this.state;
    const {
      enabledSearch,
      searchPlaceholder,
      enabledSearchWithOptionsLength
    } = this.props;
    return (
      (enabledSearch === true ||
        (enabledSearch === "auto" &&
          listOptions.length >= enabledSearchWithOptionsLength)) && (
        <View style={styles.search}>
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            selectionColor={this.props.colorPrimary}
            placeholder={searchPlaceholder}
            placeholderTextColor={Consts.colorDark4}
            autoCorrect={false}
            onChangeText={this._handleSearch}
            value={searchValue}
          />
          {searchValue !== "" && (
            <TouchableOpacity
              style={styles.iconSearchClear}
              onPress={this._handleSearchClear}
            >
              <Feather name="x" size={18} color={Consts.colorDark3} />
            </TouchableOpacity>
          )}
        </View>
      )
    );
  }
  renderOptions() {
    const { listOptions, searchValue } = this.state;
    return (
      <ScrollView
        style={styles.options}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
      >
        {listOptions.length > 0 &&
          listOptions.map(
            (item, index) =>
              item.name &&
              item.name.indexOf(searchValue) !== -1 && (
                <TouchableHighlight
                  key={item.id}
                  underlayColor={Consts.colorGray1}
                  onPress={() => this._handleSelected(item.id)}
                >
                  <View style={styles.optionItem}>
                    <Text
                      style={[
                        styles.optionItemText,
                        {
                          color: item.selected
                            ? this.props.colorPrimary
                            : Consts.colorDark3
                        }
                      ]}
                    >
                      {item.name}
                    </Text>
                    <View
                      style={{
                        opacity: item.selected ? 1 : 0
                      }}
                    >
                      <Feather
                        name="check"
                        size={20}
                        color={this.props.colorPrimary}
                      />
                    </View>
                  </View>
                </TouchableHighlight>
              )
          )}
      </ScrollView>
    );
  }
  renderModal() {
    const { modalVisible } = this.state;
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={this._handleCancelModal}
        style={styles.modal}
      >
        <View style={styles.modalView}>
          {this.renderHeader()}
          {this.renderSearch()}
          {this.renderOptions()}
        </View>
      </Modal>
    );
  }
  renderButtonAdd() {
    return (
      <TouchableHighlight
        style={styles.add}
        underlayColor={this.props.colorPrimary}
        onPress={this._handleOpenModal}
      >
        <Feather name="plus" size={18} color={Consts.colorDark1} />
      </TouchableHighlight>
    );
  }
  renderOptionsEmpty() {
    const { placeholder, label, matterial } = this.props;
    return (
      <View style={{ width: "100%" }}>
        <TouchableOpacity activeOpacity={1} onPress={this._handleOpenModal}>
          <View style={styles.item}>
            <Text
              style={{
                color: Consts.colorDark2,
                fontSize: 14
              }}
            >
              {matterial ? label : placeholder}
            </Text>
            <Feather name="chevron-down" size={18} color={Consts.colorDark3} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  renderOptionsItem = item => {
    const {
      multiple,
      textResultStyle,
      iconResultColor,
      textResultNumberOfLines
    } = this.props;
    if (item.selected) {
      return multiple ? (
        <View key={item.id} style={styles.multipleItem}>
          <Text
            style={[
              {
                color: Consts.colorDark3,
                fontSize: 12
              },
              textResultStyle
            ]}
            numberOfLines={textResultNumberOfLines}
          >
            {item.name}
          </Text>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => this._handleRemoveList(item.id)}
          >
            <Feather
              name="x"
              size={18}
              color={this.props.removeButtonMultipleColor}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View key={item.id}>
          <TouchableOpacity activeOpacity={1} onPress={this._handleOpenModal}>
            <View style={styles.item}>
              <Text
                style={[
                  {
                    color: Consts.colorDark2,
                    fontSize: 14
                  },
                  textResultStyle
                ]}
                numberOfLines={textResultNumberOfLines}
              >
                {item.name}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => this._handleRemoveList(item.id)}
                  style={{ marginRight: 6 }}
                >
                  {this.props.clearSelectEnabled && (
                    <Feather
                      name="x"
                      size={18}
                      color={this.props.removeButtonMultipleColor}
                    />
                  )}
                </TouchableOpacity>
                <Feather
                  name="chevron-down"
                  size={18}
                  color={iconResultColor}
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
  };

  renderOptionsResult() {
    const { multiple } = this.props;
    const { listOptions } = this.state;
    return (
      <Fragment>
        {listOptions.map(this.renderOptionsItem)}
        {multiple && this.renderButtonAdd()}
      </Fragment>
    );
  }
  renderResult() {
    const { multiple, label, required, underlayBorder, matterial } = this.props;
    const { listOptions } = this.state;
    return (
      <View>
        <TouchableOpacity activeOpacity={1} onPress={this._handleOpenModal}>
          <View
            style={{
              flexDirection: "row"
            }}
          >
            {label && (
              <Text style={styles.labelText}>
                {matterial &&
                listOptions.filter(item => item.selected === true).length > 0 &&
                label
                  ? label
                  : ""}
              </Text>
            )}
            {required && (
              <Text
                style={{
                  color: "#f00",
                  fontSize: 12,
                  marginLeft: 4
                }}
              >
                *
              </Text>
            )}
          </View>
        </TouchableOpacity>
        <View
          style={[
            styles.content,
            multiple
              ? {
                  flexWrap: "wrap",
                  alignItems: "flex-start",
                  flexDirection: "row"
                }
              : {},
            underlayBorder ? { borderBottomWidth: 2 } : { borderBottomWidth: 0 }
          ]}
        >
          {listOptions.filter(item => item.selected === true).length > 0
            ? this.renderOptionsResult()
            : this.renderOptionsEmpty()}
        </View>
      </View>
    );
  }
  render() {
    const { containerStyle } = this.props;
    return (
      <View style={[styles.container, containerStyle]}>
        {this.state.modalVisible && (
          <StatusBar animated={true} barStyle="dark-content" />
        )}
        {this.renderResult()}
        {this.renderModal()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: HEADER_HEIGHT,
    borderBottomWidth: 1,
    borderBottomColor: HEADER_BORDER_BOTTOM_COLOR,
    paddingHorizontal: 10
  },
  doneButton: {
    fontWeight: "bold",
    width: HEADER_BUTTON_WIDTH,
    height: HEADER_BUTTON_HEIGHT,
    lineHeight: HEADER_BUTTON_HEIGHT,
    textAlign: "right"
  },
  modalTitle: {
    fontSize: 13,
    color: Consts.colorDark3
  },
  cancelButton: {
    fontWeight: "bold",
    color: Consts.colorDark1,
    width: HEADER_BUTTON_WIDTH,
    height: HEADER_BUTTON_HEIGHT,
    lineHeight: HEADER_BUTTON_HEIGHT,
    textAlign: "left"
  },
  search: {
    position: "relative",
    borderWidth: 1,
    borderColor: Consts.colorGray1,
    height: SEARCH_HEIGHT,
    paddingHorizontal: 10,
    borderRadius: SEARCH_HEIGHT / 2,
    marginHorizontal: 10,
    marginTop: 15,
    marginBottom: 5
  },
  input: {
    borderBottomWidth: 0,
    color: Consts.colorDark2,
    height: SEARCH_HEIGHT
  },
  iconSearchClear: {
    position: "absolute",
    height: SEARCH_HEIGHT,
    width: SEARCH_HEIGHT,
    top: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center"
  },
  modal: {
    position: "relative",
    justifyContent: "center",
    alignItems: "flex-end"
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 1
  },
  modalView: {
    position: "absolute",
    zIndex: 2,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#fff"
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: BORDER_LIST_COLOR,
    paddingVertical: 16,
    paddingHorizontal: 10,
    backgroundColor: "#fff"
  },
  optionItemText: {
    fontSize: 15
  },
  content: {
    borderBottomWidth: 2,
    borderBottomColor: Consts.colorDark5,
    paddingTop: 6
  },
  multipleItem: {
    borderWidth: 1,
    borderColor: Consts.colorGray1,
    height: 26,
    borderRadius: 13,
    paddingLeft: 5,
    paddingRight: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
    marginBottom: 6
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 6
  },
  add: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Consts.colorGray2,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 6
  },
  labelText: {
    fontSize: 12,
    color: Consts.colorDark3
  }
});
