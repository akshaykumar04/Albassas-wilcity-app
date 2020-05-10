import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import { isEmpty } from "lodash";
import ContentLoader from "../molecules/ContentLoader";
import Loader from "./Loader";
import { Row, Col } from "../molecules/Grid";

const ContentLoaded = (
  type,
  contentSquareWidth,
  contentSquareLength,
  featureRatioWithPadding,
  contentHeight,
  avatarSquare,
  avatarSize
) => {
  switch (type) {
    case "header":
      return (
        <ContentLoader
          featureRatioWithPadding={featureRatioWithPadding}
          header={true}
        />
      );
    case "headerAvatar":
      return (
        <ContentLoader
          featureRatioWithPadding={featureRatioWithPadding}
          headerAvatar={true}
          avatarSize={avatarSize}
          avatarSquare={avatarSquare}
        />
      );
    case "content":
      return (
        <ContentLoader
          featureRatioWithPadding={featureRatioWithPadding}
          contentHeight={contentHeight}
          content={true}
        />
      );
    case "contentSquare":
      return (
        <ContentLoader
          featureRatioWithPadding={featureRatioWithPadding}
          contentHeight={contentHeight}
          contentSquare={true}
          contentSquareWidth={contentSquareWidth}
          contentSquareLength={contentSquareLength}
        />
      );
    case "contentHeader":
      return (
        <ContentLoader
          featureRatioWithPadding={featureRatioWithPadding}
          contentHeight={contentHeight}
          header={true}
          content={true}
        />
      );
    case "contentSquareHeader":
      return (
        <ContentLoader
          featureRatioWithPadding={featureRatioWithPadding}
          contentHeight={contentHeight}
          header={true}
          contentSquare={true}
          contentSquareWidth={contentSquareWidth}
          contentSquareLength={contentSquareLength}
        />
      );
    case "contentHeaderAvatar":
      return (
        <ContentLoader
          featureRatioWithPadding={featureRatioWithPadding}
          contentHeight={contentHeight}
          headerAvatar={true}
          content={true}
        />
      );
    case "contentSquareHeaderAvatar":
      return (
        <ContentLoader
          contentHeight={contentHeight}
          featureRatioWithPadding={featureRatioWithPadding}
          headerAvatar={true}
          contentSquare={true}
          contentSquareWidth={contentSquareWidth}
          contentSquareLength={contentSquareLength}
        />
      );
    default:
      return false;
  }
};

const propTypesGeneral = {
  isLoading: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
  contentLoader: PropTypes.oneOf([
    "header",
    "headerAvatar",
    "content",
    "contentSquare",
    "contentHeader",
    "contentHeaderAvatar",
    "contentSquareHeader",
    "contentSquareHeaderAvatar"
  ]),
  avatarSquare: PropTypes.bool,
  avatarSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  contentLoaderItemLength: PropTypes.number,
  contentSquareLength: PropTypes.number,
  contentSquareWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  column: PropTypes.number,
  gap: PropTypes.number,
  featureRatioWithPadding: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  contentHeight: PropTypes.number,
  containerPadding: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

const defaultPropsGeneral = {
  contentLoaderItemLength: 1,
  contentSquareLength: 3,
  featureRatioWithPadding: 0,
  column: 1,
  gap: 10,
  containerPadding: 0,
  avatarSquare: false,
  avatarSize: 40
};

const WithLoading = WrappedComponent => {
  return class extends PureComponent {
    static propTypes = propTypesGeneral;
    static defaultProps = defaultPropsGeneral;
    render() {
      const {
        isLoading,
        children,
        contentLoader,
        avatarSquare,
        avatarSize,
        column,
        gap,
        contentLoaderItemLength,
        contentSquareWidth,
        contentSquareLength,
        featureRatioWithPadding,
        contentHeight,
        containerPadding
      } = this.props;
      const condition =
        typeof isLoading === "boolean" ? isLoading : isEmpty(isLoading);
      const contentLoaded = ContentLoaded(
        contentLoader,
        contentSquareWidth,
        contentSquareLength,
        featureRatioWithPadding,
        contentHeight,
        avatarSquare,
        avatarSize
      );
      return condition ? (
        contentLoader ? (
          <View style={{ padding: containerPadding }}>
            <Row gap={gap}>
              {Array(contentLoaderItemLength)
                .fill(null)
                .map((_, index) => {
                  return (
                    <Col
                      key={index.toString()}
                      column={column}
                      gap={gap}
                      style={{
                        marginBottom: contentLoaderItemLength === 1 ? gap : 0
                      }}
                    >
                      {contentLoaded}
                    </Col>
                  );
                })}
            </Row>
          </View>
        ) : (
          <Loader size="small" height={150} />
        )
      ) : (
        <WrappedComponent {...this.props}>{children}</WrappedComponent>
      );
    }
  };
};

const ViewWithLoading = props => {
  const {
    isLoading,
    children,
    contentLoader,
    avatarSize,
    avatarSquare,
    column,
    gap,
    contentLoaderItemLength,
    contentSquareWidth,
    contentSquareLength,
    featureRatioWithPadding,
    contentHeight,
    containerPadding
  } = props;
  const condition =
    typeof isLoading === "boolean" ? isLoading : isEmpty(isLoading);
  const contentLoaded = ContentLoaded(
    contentLoader,
    contentSquareWidth,
    contentSquareLength,
    featureRatioWithPadding,
    contentHeight,
    avatarSquare,
    avatarSize
  );
  return condition ? (
    !!contentLoader ? (
      <View style={{ padding: containerPadding }}>
        <Row gap={gap}>
          {Array(contentLoaderItemLength)
            .fill(null)
            .map((_, index) => {
              return (
                <Col
                  key={index.toString()}
                  column={column}
                  gap={gap}
                  style={{
                    marginBottom: contentLoaderItemLength === 1 ? gap : 0
                  }}
                >
                  {contentLoaded}
                </Col>
              );
            })}
        </Row>
      </View>
    ) : (
      <Loader size="small" height={150} />
    )
  ) : (
    children
  );
};
ViewWithLoading.propTypes = propTypesGeneral;
ViewWithLoading.defaultProps = defaultPropsGeneral;

export { WithLoading, ViewWithLoading };
