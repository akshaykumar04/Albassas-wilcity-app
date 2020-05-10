import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import ContentBox from "./ContentBox";
import Button from "../atoms/Button";
import * as Consts from "../../../constants/styleConstants";

export default class MyModal extends PureComponent {
  static propTypes = {
    isVisible: PropTypes.bool,
    footerEnabled: PropTypes.bool,
    renderButtonTextToggle: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.bool
    ]),
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.element),
      PropTypes.element,
      PropTypes.bool
    ]),
    renderFooter: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    colorPrimary: PropTypes.string,
    withButtonToggle: PropTypes.bool,
    cancelText: PropTypes.string,
    submitText: PropTypes.string,
    onBackdropPress: PropTypes.func,
    onSubmitAsync: PropTypes.func,
    onButtonTextToggle: PropTypes.func
  };

  static defaultProps = {
    renderButtonTextToggle: () => {},
    renderFooter: () => {},
    onBackdropPress: () => {},
    onButtonTextToggle: () => {},
    footerEnabled: true,
    colorPrimary: Consts.colorPrimary,
    withButtonToggle: true,
    cancelText: "Cancel",
    submitText: "Submit",
    onSubmitAsync: () => {}
  };

  state = {
    isModalVisible: false,
    isLoading: false
  };

  componentDidMount() {
    const { isVisible } = this.props;
    this.setState({
      isModalVisible: isVisible
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { isVisible } = this.props;
    if (isVisible !== prevProps.isVisible) {
      this.setState({
        isModalVisible: isVisible
      });
    }
  }

  _toggleModal = () => {
    this.setState({
      isModalVisible: !this.state.isModalVisible
    });
    this.props.onButtonTextToggle();
  };

  handleBackdropPress = () => {
    this.setState({
      isModalVisible: false
    });
    this.props.onBackdropPress();
  };

  handleSubmit = async () => {
    const { onSubmitAsync } = this.props;
    this.setState({
      isLoading: true
    });
    await (typeof onSubmitAsync === "function" && onSubmitAsync());
    this.setState({
      isModalVisible: false,
      isLoading: false
    });
  };

  renderFooter() {
    const { onSubmitAsync, cancelText, submitText } = this.props;
    const { isLoading } = this.state;
    return (
      <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
        <Button
          backgroundColor="gray"
          color="dark"
          size="sm"
          radius="round"
          onPress={this.handleBackdropPress}
        >
          {cancelText}
        </Button>
        <View style={{ width: 5 }} />
        {typeof onSubmitAsync === "function" && (
          <Button
            backgroundColor="primary"
            colorPrimary={this.props.colorPrimary}
            size="sm"
            radius="round"
            onPress={this.handleSubmit}
            isLoading={isLoading}
          >
            {submitText}
          </Button>
        )}
      </View>
    );
  }

  render() {
    const {
      children,
      renderButtonTextToggle,
      footerEnabled,
      withButtonToggle,
      isVisible,
      ...modalProps
    } = this.props;
    const { isModalVisible } = this.state;
    return (
      <View style={styles.container}>
        {withButtonToggle && (
          <TouchableOpacity onPress={this._toggleModal}>
            <View>{renderButtonTextToggle()}</View>
          </TouchableOpacity>
        )}
        <Modal
          {...modalProps}
          isVisible={withButtonToggle ? isModalVisible : isVisible}
          onBackdropPress={this.handleBackdropPress}
          hideModalContentWhileAnimating={true}
          useNativeDriver={true}
        >
          <ContentBox
            {...this.props}
            renderFooter={footerEnabled && (() => this.renderFooter())}
            style={{ borderRadius: 5 }}
            headerStyle={{ paddingVertical: 8 }}
            footerStyle={{ paddingVertical: 8 }}
            colorPrimary={this.props.colorPrimary}
          >
            {children}
          </ContentBox>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 15
  }
});
