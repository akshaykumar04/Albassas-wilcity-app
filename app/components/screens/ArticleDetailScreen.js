import React, { PureComponent } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import * as Consts from "../../constants/styleConstants";
import { ParallaxScreen } from "../../wiloke-elements";
import { Feather } from "@expo/vector-icons";
import { ArticleDetailContainer } from "../smarts";
import { Heading, WilWebView } from "../dumbs";
import { connect } from "react-redux";

class EventDetailScreen extends PureComponent {
  renderHeaderLeft = () => {
    const { navigation } = this.props;
    return (
      <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.goBack()}>
        <View
          style={{
            width: 30,
            height: 30,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Feather name="chevron-left" size={26} color="#fff" />
        </View>
      </TouchableOpacity>
    );
  };

  renderHeaderCenter = () => {
    const { navigation } = this.props;
    const { params } = navigation.state;
    return (
      <Text style={{ color: "#fff" }} numberOfLines={1}>
        {params.name}
      </Text>
    );
  };

  render() {
    const { navigation, settings } = this.props;
    const { params } = navigation.state;
    return (
      <ParallaxScreen
        headerImageSource={params.image}
        overlayRange={[0, 0.9]}
        overlayColor={settings.colorPrimary}
        renderHeaderLeft={this.renderHeaderLeft}
        renderHeaderCenter={this.renderHeaderCenter}
        renderHeaderRight={() => {}}
        renderContent={() => (
          <View style={{ padding: 10 }}>
            <Heading title={params.name} titleSize={18} textSize={12} />
            <View
              style={{
                marginHorizontal: -10,
                paddingHorizontal: 10,
                backgroundColor: Consts.colorGray2
              }}
            >
              <ArticleDetailContainer navigation={navigation} />
              {/* <WilWebView
                source={{
                  uri:
                    "https://wilcity.com/what-to-do-in-wellington-new-zealand"
                }}
                listSelectorRemoved={[
                  "#wilcity-header-section",
                  ".footer_module__1uDav",
                  "#comments-list"
                ]}
                injectCss={`
                  body {
                    font-size: 13px;
                  }
                  body, h1, h2, h3, h4, h5, h6 {
                    font-family: system font;
                  }
                  .post_title__2Jnhn {
                    color: red;
                  }
                `}
              /> */}
            </View>
          </View>
        )}
      />
    );
  }
}

const mapStateToProps = state => ({
  settings: state.settings
});

export default connect(mapStateToProps)(EventDetailScreen);
