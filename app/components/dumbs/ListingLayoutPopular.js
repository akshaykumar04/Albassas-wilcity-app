import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, FlatList, StyleSheet, Dimensions } from "react-native";
import _ from "lodash";
import he from "he";
import * as Consts from "../../constants/styleConstants";
import ListingPopItem from "./ListingPopItem";
import { getDistance } from "../../utils/getDistance";
import { adMobModal } from "../../wiloke-elements";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default class ListingLayoutPopular extends PureComponent {
  static propTypes = {
    colorPrimary: PropTypes.string
  };
  static defaultProps = {
    colorPrimary: Consts.colorPrimary
  };
  renderItem = ({ item }) => {
    const { navigation, myCoords, unit, admob } = this.props;
    const { lat, lng } = item.oAddress;
    const { latitude, longitude } = myCoords;
    const isAdmob = _.get(admob, "oFullWidth", false);
    const distance = getDistance(latitude, longitude, lat, lng, unit);
    return (
      <View style={styles.grid}>
        <ListingPopItem
          image={item.oFeaturedImg.medium}
          name={he.decode(item.postTitle)}
          tagline={item.tagLine ? he.decode(item.tagLine) : null}
          logo={item.logo !== "" ? item.logo : item.oFeaturedImg.thumbnail}
          location={he.decode(item.oAddress.address)}
          phone={item.phone}
          colorPrimary={this.props.colorPrimary}
          onPress={() => {
            !!isAdmob && adMobModal({ variant: admob.oFullWidth.variant });
            navigation.navigate("ListingDetailScreen", {
              id: item.ID,
              name: he.decode(item.postTitle),
              tagline: !!item.tagLine ? he.decode(item.tagLine) : null,
              link: item.postLink,
              author: item.oAuthor,
              image:
                SCREEN_WIDTH > 420
                  ? item.oFeaturedImg.large
                  : item.oFeaturedImg.medium,
              logo: item.logo !== "" ? item.logo : item.oFeaturedImg.thumbnail
            });
          }}
          mapDistance={distance}
        />
      </View>
    );
  };

  renderItemLoader = () => (
    <View style={styles.grid}>
      <ListingPopItem contentLoader={true} />
    </View>
  );

  render() {
    const { data } = this.props;
    return (
      <View style={styles.container}>
        {data.length > 0 ? (
          <FlatList
            data={data}
            renderItem={this.renderItem}
            keyExtractor={item => item.ID.toString()}
            horizontal={true}
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
    margin: 5,
    flex: 50
  }
});
