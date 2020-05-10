import React from "react";
import PropTypes from "prop-types";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Consts from "../../constants/styleConstants";
import { Row, Col, IconTextMedium } from "../../wiloke-elements";
import he from "he";

const ListingCatList = props => {
  const { data } = props;
  return (
    <Row gap={15}>
      {data.length > 0 &&
        data.map((item, index) => (
          <Col key={index.toString()} column={2} gap={15}>
            <IconTextMedium
              iconName={item.icon}
              iconSize={30}
              iconColor={item.color ? "#fff" : Consts.colorDark2}
              iconBackgroundColor={item.color ? item.color : Consts.colorGray2}
              text={he.decode(item.name)}
              texNumberOfLines={1}
            />
          </Col>
        ))}
    </Row>
  );
};
ListingCatList.propTypes = {
  data: PropTypes.array
};

export default ListingCatList;
