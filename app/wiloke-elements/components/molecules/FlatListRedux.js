import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Text, FlatList } from "react-native";

export default class FlatListRedux extends Component {
  static propsTypes = {
    ...FlatList.propTypes,
    asyncActions: PropTypes.func
  };

  static defaultProps = {
    asyncActions: () => {}
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    };
  }

  componentDidMount() {
    this.props.componentDidMount();
  }

  _getData = async () => {
    try {
      const { asyncActions } = this.props;
      this.setState({ isLoading: true });
      await asyncActions();
      this.setState({ isLoading: false });
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const { ...flatListProps } = this.props;
    return <FlatList {...flatListProps} />;
  }
}
