import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, StyleSheet, ViewPropTypes } from "react-native";
import * as Consts from "../../../constants/styleConstants";
import stylesBase from "../../../stylesBase";
import IconTextSmall from "../atoms/IconTextSmall";

export default class ContentBox extends PureComponent {
  static propTypes = {
    headerTitle: PropTypes.string,
    showHeader: PropTypes.bool,
    headerIcon: PropTypes.string,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.element),
      PropTypes.element,
      PropTypes.bool
    ]),
    renderRight: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.element,
      PropTypes.bool
    ]),
    renderFooter: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.element,
      PropTypes.bool
    ]),
    style: ViewPropTypes.style,
    headerStyle: ViewPropTypes.style,
    footerStyle: ViewPropTypes.style,
    colorPrimary: PropTypes.string
  };
  static defaultProps = {
    renderRight: () => {},
    showHeader: true
  };
  render() {
    const { showHeader } = this.props;
    return (
      <View style={[styles.container, this.props.style]}>
        {showHeader && (
          <View style={[styles.header, this.props.headerStyle]}>
            <View style={{ flexDirection: "row" }}>
              <IconTextSmall
                text={this.props.headerTitle.toUpperCase()}
                iconName={this.props.headerIcon}
                iconSize={16}
                iconColor={Consts.colorDark2}
                textStyle={{
                  color: Consts.colorDark1,
                  fontSize: 9,
                  fontWeight: "bold",
                  letterSpacing: 1,
                  marginTop: 2,
                  marginLeft: 5
                }}
                iconColor={this.props.colorPrimary}
              />
            </View>
            <View style={styles.headerRight}>{this.props.renderRight()}</View>
          </View>
        )}
        <View style={styles.content}>{this.props.children}</View>
        {typeof this.props.renderFooter === "function" && (
          <View style={[styles.footer, this.props.footerStyle]}>
            {this.props.renderFooter()}
          </View>
        )}
        {typeof this.props.renderFooter === "object" && (
          <View style={[styles.footer, this.props.footerStyle]}>
            {this.props.renderFooter}
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: Consts.colorGray1
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: Consts.colorGray1,
    paddingHorizontal: 10,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  content: {
    padding: 10
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: Consts.colorGray1,
    paddingHorizontal: 10,
    paddingVertical: 16
  }
});
