import React from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ViewPropTypes
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Consts from "../../../constants/styleConstants";
import { isEmpty } from "lodash";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const RequestTimeout = props => {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={props.onPress}
      style={[
        {
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
          width: "100%"
        },
        props.style
      ]}
    >
      {props.text && (
        <View style={{ marginBottom: 10 }}>
          <Text style={{ color: Consts.colorDark3, fontSize: 16 }}>
            {props.text}
          </Text>
        </View>
      )}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 8,
          paddingHorizontal: 15,
          borderRadius: 3,
          borderWidth: 1,
          borderColor: Consts.colorDark4
        }}
      >
        <Feather name="rotate-cw" size={16} color={Consts.colorDark3} />
        <View style={{ width: 5 }} />
        <Text style={{ color: Consts.colorDark3, fontSize: 13 }}>
          {props.buttonText}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
RequestTimeout.propTypes = {
  text: PropTypes.string,
  onPress: PropTypes.func,
  style: ViewPropTypes.style
};
RequestTimeout.defaultProps = {
  onPress: () => {}
};

const RequestTimeoutWrapped = props => {
  const { ...viewProps } = props;
  return (
    <View style={{ flex: 1 }} {...viewProps}>
      {props.isTimeout ? (
        <RequestTimeout
          text={props.text}
          buttonText={props.buttonText}
          onPress={props.onPress}
          style={{
            minHeight: props.fullScreen ? SCREEN_HEIGHT - 100 : 0,
            marginTop: 50
          }}
        />
      ) : (
        props.children
      )}
    </View>
  );
};

RequestTimeoutWrapped.propTypes = {
  isTimeout: PropTypes.bool,
  fullScreen: PropTypes.bool,
  onPress: PropTypes.func
};
RequestTimeoutWrapped.defaultProps = {
  onPress: () => {}
};

export default RequestTimeoutWrapped;
