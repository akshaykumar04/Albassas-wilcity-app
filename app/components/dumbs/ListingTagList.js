import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Consts from "../../constants/styleConstants";
import { Row, Col, IconTextMedium, P } from "../../wiloke-elements";
import he from "he";

export default class ListingTagList extends PureComponent {
  static propTypes = {
    data: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string
      })
    )
  };

  render() {
    const { data } = this.props;
    return (
      <Row gap={15}>
        {data.length > 0 &&
          data.map((item, index) => (
            <Col key={index.toString()} column={2} gap={15}>
              {!!item.icon ? (
                <IconTextMedium
                  iconName={item.icon}
                  iconSize={30}
                  text={he.decode(item.name)}
                  texNumberOfLines={1}
                  disabled={item.unChecked === "yes"}
                  iconBackgroundColor={
                    !!item.color ? item.color : Consts.colorGray2
                  }
                  iconColor={!!item.color ? "#fff" : Consts.colorDark2}
                  textStyle={{
                    color: !!item.color ? item.color : Consts.colorDark2
                  }}
                />
              ) : (
                <P
                  style={{
                    fontSize: 12,
                    textDecorationLine:
                      item.unChecked === "yes" ? "line-through" : "none",
                    color: !!item.color ? item.color : Consts.colorDark2
                  }}
                >
                  {he.decode(item.name)}
                </P>
              )}
            </Col>
          ))}
      </Row>
    );
  }
}
