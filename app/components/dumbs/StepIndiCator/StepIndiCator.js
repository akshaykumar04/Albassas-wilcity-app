import React, { Component, PureComponent } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback
} from "react-native";

const STEP_STATUS = {
  CURRENT: "current",
  FINISHED: "finished",
  UNFINISHED: "unfinished"
};

export default class StepIndicator extends PureComponent {
  constructor(props) {
    super(props);
    const defaultStyles = {
      stepIndicatorSize: 50,
      currentStepIndicatorSize: 50,
      borderWidthSeparator: 2,
      borderWidthSeparatorUnFinished: 0,
      borderWidthSeparatorFinished: 0,
      borderWidthCurrentStep: 2,
      borderWidthStep: 0,
      borderColorStepCurrent: "#e9e9e9",
      borderColorStepFinished: "#4aae4f",
      borderColorStepUnfinised: "#4aae4f",
      separatorFinishedColor: "#4aae4f",
      backgroundProgressUnfinished: "#a4d4a5",
      stepIndicatorFinishedColor: "#4aae4f",
      stepIndicatorUnFinishedColor: "#a4d4a5",
      stepIndicatorCurrentColor: "#ffffff",
      stepIndicatorLabelFontSize: 15,
      currentStepIndicatorLabelFontSize: 15,
      stepIndicatorLabelCurrentColor: "#000000",
      stepIndicatorLabelFinishedColor: "#ffffff",
      stepIndicatorLabelUnFinishedColor: "rgba(255,255,255,0.5)",
      labelColor: "#000000",
      labelSize: 13,
      labelAlign: "center",
      currentStepLabelColor: "#4aae4f"
    };
    const customStyles = Object.assign(defaultStyles, props.customStyles);

    this.state = {
      width: 0,
      height: 0,
      progressBarSize: 0,
      customStyles
    };

    this.progressAnim = new Animated.Value(0);
    this.sizeAnim = new Animated.Value(
      this.state.customStyles.stepIndicatorSize
    );
    this.borderRadiusAnim = new Animated.Value(
      this.state.customStyles.stepIndicatorSize / 2
    );
  }

  stepPressed(position) {
    if (this.props.onPress) {
      this.props.onPress(position);
    }
  }

  render() {
    const { labels, direction } = this.props;
    return (
      <View
        style={[
          styles.container,
          direction === "vertical"
            ? { flexDirection: "row", flex: 1 }
            : { flexDirection: "column" }
        ]}
      >
        {this.state.width !== 0 && this.renderProgressBarBackground()}
        {this.state.width !== 0 && this.renderProgressBar()}
        {this.renderStepIndicator()}
        {labels && this.renderStepLabels()}
      </View>
    );
  }

  UUNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.customStyles !== this.props.customStyles) {
      this.setState(state => ({
        customStyles: Object.assign(state.customStyles, nextProps.customStyles)
      }));
    }
    if (nextProps.currentPosition !== this.props.currentPosition) {
      this.onCurrentPositionChanged(nextProps.currentPosition);
    }
  }

  renderProgressBarBackground = () => {
    const { stepCount, direction } = this.props;
    const { customStyles } = this.state;
    let progressBarBackgroundStyle;
    if (direction === "vertical") {
      progressBarBackgroundStyle = {
        backgroundColor: customStyles.backgroundProgressUnfinished,
        position: "absolute",
        left: (this.state.width - customStyles.borderWidthSeparator) / 2,
        top: this.state.height / (2 * stepCount),
        bottom: this.state.height / (2 * stepCount),
        width:
          customStyles.borderWidthSeparatorUnFinished == 0
            ? customStyles.borderWidthSeparator
            : customStyles.borderWidthSeparatorUnFinished
      };
    } else {
      progressBarBackgroundStyle = {
        backgroundColor: customStyles.backgroundProgressUnfinished,
        position: "absolute",
        top: (this.state.height - customStyles.borderWidthSeparator) / 2,
        left: this.state.width / (2 * stepCount),
        right: this.state.width / (2 * stepCount),
        height:
          customStyles.borderWidthSeparatorUnFinished == 0
            ? customStyles.borderWidthSeparator
            : customStyles.borderWidthSeparatorUnFinished
      };
    }
    return (
      <View
        onLayout={event => {
          if (direction === "vertical") {
            this.setState(
              { progressBarSize: event.nativeEvent.layout.height },
              () => {
                this.onCurrentPositionChanged(this.props.currentPosition);
              }
            );
          } else {
            this.setState(
              { progressBarSize: event.nativeEvent.layout.width },
              () => {
                this.onCurrentPositionChanged(this.props.currentPosition);
              }
            );
          }
        }}
        style={progressBarBackgroundStyle}
      />
    );
  };

  renderProgressBar = () => {
    const { stepCount, direction } = this.props;
    const { customStyles } = this.state;
    let progressBarStyle;
    if (direction === "vertical") {
      progressBarStyle = {
        backgroundColor: customStyles.separatorFinishedColor,
        position: "absolute",
        left: (this.state.width - customStyles.borderWidthSeparator) / 2,
        top: this.state.height / (2 * stepCount),
        bottom: this.state.height / (2 * stepCount),
        width:
          customStyles.borderWidthSeparatorFinished == 0
            ? customStyles.borderWidthSeparator
            : customStyles.borderWidthSeparatorFinished,
        height: this.progressAnim
      };
    } else {
      progressBarStyle = {
        backgroundColor: customStyles.separatorFinishedColor,
        position: "absolute",
        top: (this.state.height - customStyles.borderWidthSeparator) / 2,
        left: this.state.width / (2 * stepCount),
        right: this.state.width / (2 * stepCount),
        height:
          customStyles.borderWidthSeparatorFinished == 0
            ? customStyles.borderWidthSeparator
            : customStyles.borderWidthSeparatorFinished,
        width: this.progressAnim
      };
    }
    return <Animated.View style={progressBarStyle} />;
  };

  renderStepIndicator = () => {
    const { customStyles } = this.state;
    let steps = [];
    const { labels, stepCount, direction } = this.props;
    for (let position = 0; position < stepCount; position++) {
      steps.push(
        <TouchableWithoutFeedback
          key={position}
          onPress={() => this.stepPressed(position)}
        >
          <View
            style={[
              styles.stepContainer,
              direction === "vertical"
                ? { flexDirection: "column" }
                : { flexDirection: "row" }
            ]}
          >
            {this.renderStep(position)}
          </View>
        </TouchableWithoutFeedback>
      );
    }
    return (
      <View
        onLayout={event =>
          this.setState({
            width: event.nativeEvent.layout.width,
            height: event.nativeEvent.layout.height
          })
        }
        style={[
          styles.stepIndicatorContainer,
          direction === "vertical"
            ? {
                flexDirection: "column",
                width: customStyles.currentStepIndicatorSize
              }
            : {
                flexDirection: "row",
                height: customStyles.currentStepIndicatorSize
              }
        ]}
      >
        {steps}
      </View>
    );
  };

  renderStepLabels = () => {
    const { labels, direction, currentPosition, renderLabel } = this.props;
    var labelViews = labels.map((label, index) => {
      const selectedStepLabelStyle =
        index === currentPosition
          ? { color: this.state.customStyles.currentStepLabelColor }
          : { color: this.state.customStyles.labelColor };
      return (
        <TouchableWithoutFeedback
          style={styles.stepLabelItem}
          key={index}
          onPress={() => this.stepPressed(index)}
        >
          <View style={styles.stepLabelItem}>
            {renderLabel ? (
              renderLabel({
                position: index,
                stepStatus: this.getStepStatus(index),
                label,
                currentPosition
              })
            ) : (
              <Text
                style={[
                  styles.stepLabel,
                  selectedStepLabelStyle,
                  {
                    fontSize: this.state.customStyles.labelSize,
                    fontFamily: this.state.customStyles.labelFontFamily
                  }
                ]}
              >
                {label}
              </Text>
            )}
          </View>
        </TouchableWithoutFeedback>
      );
    });

    return (
      <View
        style={[
          styles.stepLabelsContainer,
          direction === "vertical"
            ? { flexDirection: "column", paddingHorizontal: 4 }
            : { flexDirection: "row", paddingVertical: 4 },
          { alignItems: this.state.customStyles.labelAlign }
        ]}
      >
        {labelViews}
      </View>
    );
  };

  renderStep = position => {
    const {
      currentPosition,
      stepCount,
      direction,
      renderStepIndicator
    } = this.props;
    const { customStyles } = this.state;
    let stepStyle;
    let indicatorLabelStyle;
    const separatorStyle =
      direction === "vertical"
        ? { width: customStyles.borderWidthSeparator, zIndex: 10 }
        : { height: customStyles.borderWidthSeparator };
    switch (this.getStepStatus(position)) {
      case STEP_STATUS.CURRENT: {
        stepStyle = {
          backgroundColor: customStyles.stepIndicatorCurrentColor,
          borderWidth: customStyles.borderWidthCurrentStep,
          borderColor: customStyles.borderColorStepCurrent,
          height: this.sizeAnim,
          width: this.sizeAnim,
          borderRadius: customStyles.stepIndicatorSize
        };
        indicatorLabelStyle = {
          fontSize: customStyles.currentStepIndicatorLabelFontSize,
          color: customStyles.stepIndicatorLabelCurrentColor
        };

        break;
      }
      case STEP_STATUS.FINISHED: {
        stepStyle = {
          backgroundColor: customStyles.stepIndicatorFinishedColor,
          borderWidth: customStyles.borderWidthStep,
          borderColor: customStyles.borderColorStepFinished,
          height: customStyles.stepIndicatorSize,
          width: customStyles.stepIndicatorSize,
          borderRadius: customStyles.stepIndicatorSize / 2
        };
        indicatorLabelStyle = {
          fontSize: customStyles.stepIndicatorLabelFontSize,
          color: customStyles.stepIndicatorLabelFinishedColor
        };
        break;
      }

      case STEP_STATUS.UNFINISHED: {
        stepStyle = {
          backgroundColor: customStyles.stepIndicatorUnFinishedColor,
          borderWidth: customStyles.borderWidthStep,
          borderColor: customStyles.borderColorStepUnfinised,
          height: customStyles.stepIndicatorSize,
          width: customStyles.stepIndicatorSize,
          borderRadius: customStyles.stepIndicatorSize / 2
        };
        indicatorLabelStyle = {
          overflow: "hidden",
          fontSize: customStyles.stepIndicatorLabelFontSize,
          color: customStyles.stepIndicatorLabelUnFinishedColor
        };
        break;
      }
      default:
    }

    return (
      <Animated.View key={"step-indicator"} style={[styles.step, stepStyle]}>
        {renderStepIndicator ? (
          renderStepIndicator({
            position,
            stepStatus: this.getStepStatus(position)
          })
        ) : (
          <Text style={indicatorLabelStyle}>{`${position + 1}`}</Text>
        )}
      </Animated.View>
    );
  };

  getStepStatus = stepPosition => {
    const { currentPosition } = this.props;
    if (stepPosition === currentPosition) {
      return STEP_STATUS.CURRENT;
    } else if (stepPosition < currentPosition) {
      return STEP_STATUS.FINISHED;
    } else {
      return STEP_STATUS.UNFINISHED;
    }
  };

  onCurrentPositionChanged = position => {
    let { stepCount } = this.props;
    if (position > stepCount - 1) {
      position = stepCount - 1;
    }
    const animateToPosition =
      (this.state.progressBarSize / (stepCount - 1)) * position;
    this.sizeAnim.setValue(this.state.customStyles.stepIndicatorSize);
    this.borderRadiusAnim.setValue(
      this.state.customStyles.stepIndicatorSize / 2
    );
    Animated.sequence([
      Animated.timing(this.progressAnim, {
        toValue: animateToPosition,
        duration: 200
      }),
      Animated.parallel([
        Animated.timing(this.sizeAnim, {
          toValue: this.state.customStyles.currentStepIndicatorSize,
          duration: 100
        }),
        Animated.timing(this.borderRadiusAnim, {
          toValue: this.state.customStyles.currentStepIndicatorSize / 2,
          duration: 100
        })
      ])
    ]).start();
  };
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent"
  },
  stepIndicatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "transparent"
  },
  stepLabelsContainer: {
    justifyContent: "space-around"
  },
  step: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2
  },
  stepContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  stepLabel: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "500"
  },
  stepLabelItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});

StepIndicator.propTypes = {
  currentPosition: PropTypes.number,
  stepCount: PropTypes.number,
  customStyles: PropTypes.object,
  direction: PropTypes.oneOf(["vertical", "horizontal"]),
  labels: PropTypes.array,
  onPress: PropTypes.func,
  renderStepIndicator: PropTypes.func,
  renderLabel: PropTypes.func
};

StepIndicator.defaultProps = {
  currentPosition: 0,
  stepCount: 5,
  customStyles: {},
  direction: "horizontal"
};
