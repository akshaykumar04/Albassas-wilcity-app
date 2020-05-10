import React from "react";
import PropTypes from "prop-types";
import { View, TouchableOpacity } from "react-native";
import { WebItem } from "./WebItem";
import { PhoneItem } from "./PhoneItem";
import AddressItem from "./AddressItem";
import Icon from "./Icon";
import { DeepLinkingSocial, getSocialColor } from "../../wiloke-elements";

// const PhoneItem = phone => (
//   <TouchableOpacity
//     activeOpacity={0.5}
//     onPress={() => Communications.phonecall(phone, true)}
//     style={{ marginBottom: 14 }}
//   >
//     <IconTextMedium
//       iconName="phone-call"
//       iconSize={30}
//       iconColor="#fff"
//       iconBackgroundColor={Consts.colorTertiary}
//       text={phone}
//     />
//   </TouchableOpacity>
// );

// const WebItem = (url, navigation) => (
//   <TouchableOpacity
//     activeOpacity={0.5}
//     onPress={() => navigation.navigate("WebViewScreen", { url })}
//     style={{ marginBottom: 14 }}
//   >
//     <IconTextMedium
//       iconName="globe"
//       iconSize={30}
//       iconColor="#fff"
//       iconBackgroundColor={Consts.colorQuaternary}
//       text={url}
//     />
//   </TouchableOpacity>
// );

// const AddressItem = (address, navigation) => (
//   <TouchableOpacity
//     activeOpacity={0.5}
//     onPress={() =>
//       navigation.navigate("WebViewScreen", {
//         url: `https://www.google.com/maps/place/${address.address.replace(
//           /\s+/g,
//           "+"
//         )}/@${address.lat},${address.lng},6z`
//       })
//     }
//     style={{ marginBottom: 14 }}
//   >
//     <IconTextMedium
//       iconName="map-pin"
//       iconSize={30}
//       iconColor="#fff"
//       iconBackgroundColor={Consts.colorSecondary}
//       text={address.address}
//     />
//   </TouchableOpacity>
// );

const ListingBusinessInfo = props => {
  const { data, navigation } = props;
  console.log(data.oSocialNetworks);
  return (
    <View>
      {data.oAddress && (
        <AddressItem
          address={data.oAddress}
          navigation={navigation}
          style={{ marginBottom: 14 }}
        />
      )}
      {(data.phone || data.phone !== "") && (
        <PhoneItem phone={data.phone} style={{ marginBottom: 14 }} />
      )}
      {(data.website || data.website !== "") && (
        <WebItem
          url={data.website}
          navigation={navigation}
          style={{ marginBottom: 14 }}
        />
      )}
      {data.oSocialNetworks && data.oSocialNetworks.length > 0 && (
        <View style={{ flexDirection: "row" }}>
          {data.oSocialNetworks.map((social, index) => {
            return (
              <TouchableOpacity
                key={index.toString()}
                activeOpacity={0.5}
                onPress={() => DeepLinkingSocial(social.link)}
                style={{ marginRight: 5, marginBottom: 5 }}
              >
                <Icon
                  name={
                    social.icon === "youtube" ? "youtube-play" : social.icon
                  }
                  color="#fff"
                  backgroundColor={getSocialColor(
                    social.icon.replace(/(fa\s+|)fa-/g, "")
                  )}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
};

ListingBusinessInfo.propTypes = {
  data: PropTypes.object
};

export default ListingBusinessInfo;
