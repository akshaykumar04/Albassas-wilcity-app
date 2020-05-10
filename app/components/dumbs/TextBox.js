import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet } from "react-native";
import * as Consts from "../../constants/styleConstants";

export default class TextBox extends Component {
    static defaultProps = {
        titleStyles: {
            fontSize: 13,
            color: Consts.colorDark1
        },
        textStyles: {
            fontSize: 11,
            color: Consts.colorDark3
        }
    };
    static propTypes = {
        titleStyles: PropTypes.any,
        textStyles: PropTypes.any,
        align: PropTypes.string,
        title: PropTypes.string,
        text: PropTypes.string
    };
    render() {
        return (
            <View
                style={{
                    flex: 1,
                    marginBottom: 5,
                    alignItems: this.props.align
                }}
            >
                <Text style={this.props.titleStyles}>{this.props.title}</Text>
                <Text style={this.props.textStyles}>{this.props.text}</Text>
            </View>
        );
    }
}
