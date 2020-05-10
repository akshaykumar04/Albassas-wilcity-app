import React, { Component } from "react";
import PropTypes from "prop-types";
import { Text, View, StyleSheet } from "react-native";
import { isEmpty } from "../../";

export default class NavList extends Component {
  state = {
    list: []
  };

  componentDidMount() {
    this.setState({
      list: this.props.data
    });
  }

  renderItem = item => {
    return (
      <View>
        <Text>item.text</Text>
      </View>
    );
  };

  renderLoading = () => {
    return (
      <View>
        <Text>item.text</Text>
      </View>
    );
  };

  render() {
    const { list } = this.state;
    return (
      <View style={styles.container}>
        {!isEmpty(list) ? list.map(this.renderItem) : this.renderLoading}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {}
});
