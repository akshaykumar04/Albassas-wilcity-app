import getSlideFromRightTransition from "react-navigation-slide-from-right-transition";
import * as Consts from "../constants/styleConstants";

const RootTabNavOpts = colorPrimary => ({
  tabBarPosition: "bottom",
  animationEnabled: false,
  swipeEnabled: false,
  backBehavior: "history",
  tabBarOptions: {
    showIcon: true,
    showLabel: true,
    upperCaseLabel: false,
    lazy: true,
    activeTintColor: colorPrimary,
    inactiveTintColor: Consts.colorDark3,
    style: {
      backgroundColor: "#fff",
      borderTopWidth: 0,
      borderTopColor: colorPrimary
    },
    labelStyle: {
      borderRadius: 100,
      fontSize: Consts.screenWidth < 500 ? 9 : 10,
      fontWeight: "500",
      padding: 0,
      paddingLeft: 3,
      paddingRight: 3,
      paddingBottom: 2,
      margin: 0
    },
    indicatorStyle: {
      backgroundColor: "transparent"
    }
  }
});
export default RootTabNavOpts;
