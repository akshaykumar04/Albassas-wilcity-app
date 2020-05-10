import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, Dimensions, FlatList, StyleSheet } from "react-native";
import he from "he";
import ListingCat from "./ListingCat";

export default class ListingLayoutCat extends PureComponent {
  static propTypes = {
    renderItem: PropTypes.func
  };

  static defaultProps = {
    renderItem: () => {}
  };

  renderItemLoader = () => (
    <View style={styles.grid}>
      <ListingCat contentLoader={true} />
    </View>
  );

  render() {
    const { data } = this.props;
    return (
      <View style={styles.container}>
        {data.length > 0 ? (
          <FlatList
            data={data}
            renderItem={this.props.renderItem}
            keyExtractor={item => item.oTerm.term_id.toString()}
            numColumns={this.props.layout === "horizontal" ? 1 : 2}
            horizontal={this.props.layout === "horizontal" ? true : false}
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          <FlatList
            data={[{ id: "1" }, { id: "2" }, { id: "3" }]}
            renderItem={this.renderItemLoader}
            keyExtractor={item => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    padding: 5
  },
  grid: {
    margin: 5
  }
});
