import React, { Component } from "react";
import PropTypes from "prop-types";
import { Platform } from "react-native";
// import CameraRoll from "@react-native-community/cameraroll";
import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";

import _ from "lodash";

const CameraRollHOC = WrappedComponent => {
  return class extends Component {
    static propTypes = {
      firstItems: PropTypes.number, // số lượng ảnh hiển thị lúc đầu
      nextItems: PropTypes.number // số lượng ảnh thêm vào khi loadmore
    };

    static defaultProps = {
      firstItems: 20,
      nextItems: 20
    };

    state = {
      photos: [],
      has_next_page: true,
      after: null,
      startLoadmore: false
    };

    componentDidMount() {
      this._getPhotos();
    }

    shouldComponentUpdate(nextState) {
      if (!_.isEqual(nextState.photos, this.state.photos)) {
        return true;
      }
      return false;
    }

    _handlePermissionCameraRoll = async () => {
      try {
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
      } catch (err) {
        console.log(err);
      }
    };

    // lấy ảnh lúc bắt đầu
    _getPhotos = async () => {
      try {
        const { firstItems } = this.props;
        const params = {
          first: firstItems,
          assetType: "Photos",
          groupTypes: "All"
        };
        await this._handlePermissionCameraRoll();
        const r = await MediaLibrary.getAssetsAsync({
          first: 50,
          mediaType: MediaLibrary.MediaType.photo,
          sortBy: MediaLibrary.SortBy.creationTime
        });
        const photos = r.assets;
        const { hasNextPage, endCursor } = r;
        this.setState({
          photos,
          has_next_page: hasNextPage,
          after: endCursor,
          startLoadmore: true
        });
      } catch (err) {
        console.log(err);
      }
    };

    // lúc kéo xuống cuối và load thêm ảnh
    _handleEndReached = async () => {
      const { after, startLoadmore } = this.state;
      const { nextItems } = this.props;
      if (startLoadmore) {
        const params = {
          first: nextItems,
          mediaType: MediaLibrary.MediaType.photo,
          ...(!!after ? { after } : {})
        };
        if (!this.state.has_next_page) return;
        const r = await MediaLibrary.getAssetsAsync(params);
        const { hasNextPage, endCursor } = r;
        this.setState(prevState => ({
          photos: [...prevState.photos, ...r.assets],
          has_next_page: hasNextPage,
          after: endCursor
        }));
      }
    };

    render() {
      const { photos } = this.state;
      return (
        <WrappedComponent
          data={photos}
          onEndReached={this._handleEndReached}
          {...this.props}
        />
      );
    }
  };
};

export default CameraRollHOC;
