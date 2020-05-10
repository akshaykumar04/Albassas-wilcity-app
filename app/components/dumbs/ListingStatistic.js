import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Row, Col, IconTextMedium } from "../../wiloke-elements";
import he from "he";

export default class ListingStatistic extends PureComponent {
  static propTypes = {
    data: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        count: PropTypes.number,
        key: PropTypes.string
      })
    )
  };

  _getIcon = key => {
    switch (key) {
      case "views":
        return "eye";
      case "reviews":
        return "star";
      case "favorites":
        return "heart";
      case "shares":
        return "share";
      default:
        return "check";
    }
  };

  render() {
    const { data } = this.props;
    return (
      <Row gap={15}>
        {data.length > 0 &&
          data.map((item, index) => (
            <Col key={index.toString()} column={2} gap={15}>
              <IconTextMedium
                iconName={this._getIcon(item.key)}
                iconSize={30}
                text={`${item.count} ${he.decode(item.name)}`}
                texNumberOfLines={1}
              />
            </Col>
          ))}
      </Row>
    );
  }
}
