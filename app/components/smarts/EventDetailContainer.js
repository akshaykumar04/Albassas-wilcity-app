import React, { PureComponent } from "react";
import { Text, View, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { getEventDetail, resetEventDiscussion } from "../../actions";
import { WebItem, PhoneItem, AddressItem } from "../dumbs";
import {
  isEmpty,
  ViewWithLoading,
  IconTextMedium,
  ContentBox,
  Admob,
  wait
} from "../../wiloke-elements";
import * as Consts from "../../constants/styleConstants";
import stylesBase from "../../stylesBase";
import _ from "lodash";
import he from "he";

class EventDetailContainer extends PureComponent {
  state = {
    isLoading: true
  };

  _getEventDetail = async () => {
    try {
      const { navigation } = this.props;
      const { params } = navigation.state;
      await this.props.getEventDetail(params.id);
      this.setState({ isLoading: false });
    } catch (err) {
      console.log(err);
    }
  };

  async componentDidMount() {
    await this._getEventDetail();
  }

  componentWillUnmount() {
    this.props.resetEventDiscussion();
  }

  renderMetaMap = (item, index) => {
    const { navigation } = this.props;
    return (
      <View key={index.toString()} style={styles.item}>
        <AddressItem
          address={item.value}
          navigation={navigation}
          iconColor={Consts.colorDark2}
          iconBackgroundColor={Consts.colorGray2}
        />
      </View>
    );
  };

  renderMetaTerm = (item, index) => {
    return (
      <View
        key={index.toString()}
        style={[
          styles.item,
          {
            paddingVertical: 4
          }
        ]}
      >
        {item.value.map(cat => {
          return (
            <View
              key={cat.slug}
              style={{
                flexDirection: "row",
                marginVertical: 4,
                marginRight: 15
              }}
            >
              <IconTextMedium iconName="folder" iconSize={30} text={cat.name} />
            </View>
          );
        })}
      </View>
    );
  };

  renderMetaWebsite = (item, index) => {
    const { navigation } = this.props;
    return (
      <View key={index.toString()} style={styles.item}>
        <WebItem
          url={item.link}
          navigation={navigation}
          iconColor={Consts.colorDark2}
          iconBackgroundColor={Consts.colorGray2}
        />
      </View>
    );
  };

  renderMetaPhone = (item, index) => {
    return (
      <View key={index.toString()} style={styles.item}>
        <PhoneItem
          phone={item.name}
          iconColor={Consts.colorDark2}
          iconBackgroundColor={Consts.colorGray2}
        />
      </View>
    );
  };

  renderMetaEmail = (item, index) => {
    console.log("email", item);
    return (
      <View key={index.toString()} style={styles.item}>
        <IconTextMedium iconName="mail" iconSize={30} text={item.name} />
      </View>
    );
  };

  renderMeta = (item, index) => {
    switch (item.type) {
      case "map":
        return this.renderMetaMap(item, index);
      case "term":
        return this.renderMetaTerm(item, index);
      case "website":
        return this.renderMetaWebsite(item, index);
      case "email":
        return this.renderMetaEmail(item, index);
      case "phone":
        return this.renderMetaPhone(item, index);
      default:
        return false;
    }
  };

  renderBoxBorder = (text, hour) => {
    return (
      <View
        style={{
          borderWidth: 1,
          borderColor: Consts.colorGray1,
          paddingVertical: 5,
          paddingHorizontal: 8,
          borderRadius: Consts.round,
          marginTop: 10
        }}
      >
        <Text
          style={{
            fontSize: 12,
            fontWeight: "500",
            color: Consts.colorDark2
          }}
        >
          {text}
        </Text>
        <View style={{ height: 4 }} />
        <Text style={{ fontSize: 11, color: Consts.colorDark3 }}>{hour}</Text>
      </View>
    );
  };

  renderDescription = item => {
    const { settings } = this.props;
    return (
      <ContentBox
        key={item.type}
        headerTitle={item.text}
        headerIcon="file-text"
        style={{ marginBottom: 10 }}
        colorPrimary={settings.colorPrimary}
      >
        <Text style={stylesBase.text}>{he.decode(item.content)}</Text>
      </ContentBox>
      // <View
      //   key={item.type}
      //   style={{
      //     paddingVertical: 13,
      //     marginTop: 10,
      //     borderTopWidth: 1,
      //     borderTopColor: Consts.colorGray1
      //   }}
      // >
      //   <Text style={stylesBase.text}>{item.content}</Text>
      // </View>
    );
  };

  renderTags = item => {
    return (
      <View key={item.type}>
        {item.content.length > 0 &&
          item.content.map(tag => (
            <View key={tag.slug} style={{ marginRight: 15, marginBottom: 10 }}>
              <IconTextMedium iconName="check" iconSize={30} text={tag.name} />
            </View>
          ))}
      </View>
    );
  };

  renderSection = item => {
    switch (item.type) {
      case "listing_content":
        return this.renderDescription(item);
      case "listing_tag":
        return this.renderTags(item);
      default:
        return false;
    }
  };

  _renderAdmob = ({ oBanner }) => {
    return <View>{oBanner && <Admob {...oBanner} />}</View>;
  };

  render() {
    const { eventDetail, translations } = this.props;
    const { isLoading } = this.state;
    const { oAdmob } = eventDetail;
    return (
      <View
        style={{
          marginHorizontal: -10
        }}
      >
        <ViewWithLoading isLoading={isLoading} contentLoader="content">
          {!isEmpty(eventDetail) && (
            <View style={{ width: Consts.screenWidth }}>
              <View
                style={{
                  backgroundColor: "#fff",
                  marginBottom: 10
                }}
              >
                <View style={styles.item}>
                  {eventDetail.oCalendar && (
                    <IconTextMedium
                      iconName="calendar"
                      iconSize={30}
                      text={eventDetail.oCalendar.general}
                    />
                  )}
                  {eventDetail.oCalendar && (
                    <View style={{ flexDirection: "row" }}>
                      {this.renderBoxBorder(
                        translations.openingAt,
                        eventDetail.oCalendar.oStarts.hour
                      )}
                      <View style={{ width: 5 }} />
                      {this.renderBoxBorder(
                        translations.closedAt,
                        eventDetail.oCalendar.oEnds.hour
                      )}
                    </View>
                  )}
                </View>
                {eventDetail.aMetaData.length > 0 &&
                  eventDetail.aMetaData.map(this.renderMeta)}
              </View>
              {!_.isEmpty(oAdmob) && (
                <View style={{ marginBottom: 10 }}>
                  {this._renderAdmob(oAdmob)}
                </View>
              )}
              <View style={{ marginHorizontal: 10 }}>
                {eventDetail.aSections.length > 0 &&
                  eventDetail.aSections.map(this.renderSection)}
              </View>
            </View>
          )}
        </ViewWithLoading>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: Consts.colorGray2
  }
});

const mapStateToProps = state => ({
  eventDetail: state.eventDetail,
  settings: state.settings,
  translations: state.translations
});

export default connect(mapStateToProps, {
  getEventDetail,
  resetEventDiscussion
})(EventDetailContainer);
