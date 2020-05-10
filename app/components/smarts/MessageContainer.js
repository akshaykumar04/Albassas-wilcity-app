import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import {
  View,
  Platform,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert
} from "react-native";
import _ from "lodash";
import he from "he";
import { connect } from "react-redux";
import { getMessageList } from "../../actions";
import {
  MessageError,
  RequestTimeoutWrapped,
  ViewWithLoading,
  ContentLoader,
  Row,
  Col,
  ImageCircleAndText
} from "../../wiloke-elements";
import * as Consts from "../../constants/styleConstants";
import Swipeout from "react-native-swipeout";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const END_REACHED_THRESHOLD = Platform.OS === "ios" ? 0 : 1;

class MessageContainer extends Component {
  state = {
    isScrollEnabled: true
  };

  componentDidMount() {
    this.props.getMessageList();
  }
  _handleListItem = () => {
    const { navigation } = this.props;
    navigation.navigate("SendMessageScreen");
  };
  _deleteListItem = () => {
    console.log("Ok");
  };
  renderListItem = ({ item }) => {
    return (
      <Swipeout
        right={[
          {
            text: "Delete",
            type: "delete",
            onPress: () => {
              Alert.alert(
                "Delete",
                "message test",
                [
                  {
                    text: "Cancel",
                    style: "cancel"
                  },
                  {
                    text: "OK",
                    onPress: this._deleteListItem
                  }
                ],
                { cancelable: false }
              );
            }
          }
        ]}
        autoClose={true}
        scroll={event => this.setState({ isScrollEnabled: event })}
        style={{
          borderBottomWidth: 1,
          borderColor: Consts.colorGray1,
          backgroundColor: "#fff"
        }}
      >
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={this._handleListItem}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 10
          }}
        >
          <ImageCircleAndText
            image={item.image}
            title={item.name}
            message={item.message}
            time={item.time}
            horizontal={true}
            messageNumberOfLines={1}
            imageSize={44}
          />
        </TouchableOpacity>
      </Swipeout>
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={[
            {
              image: "https://uinames.com/api/photos/male/16.jpg",
              name: "Arthur Soto",
              message: "It is a long established fact",
              time: "06:00"
            },
            {
              image: "https://uinames.com/api/photos/female/23.jpg",
              name: "Brenda Daniels",
              message: "That it has a more-or-less",
              time: "06:00"
            },
            {
              image: "https://uinames.com/api/photos/male/2.jpg",
              name: "Wayne Russell",
              message: "Various versions have evolved",
              time: "06:00"
            },
            {
              image: "https://uinames.com/api/photos/female/16.jpg",
              name: "Patricia Peterson",
              message: "It is a long established fact",
              time: "06:00"
            },
            {
              image: "https://uinames.com/api/photos/male/13.jpg",
              name: "Joe Mitchell",
              message: "That it has a more-or-less",
              time: "06:00"
            }
          ]}
          renderItem={this.renderListItem}
          keyExtractor={(item, index) => index.toString()}
          scrollEnabled={this.state.isScrollEnabled}
          ListFooterComponent={() => <View />}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row"
  }
});

const mapStateToProps = state => ({
  listingByCat: state.listingByCat,
  loading: state.loading,
  settings: state.settings
});
const mapDispatchToProps = {
  getMessageList
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessageContainer);
