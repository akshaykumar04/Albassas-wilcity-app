import { createStackNavigator } from "react-navigation-stack";
import { Dimensions } from "react-native";
import stackOpts from "./stackOpts";
import SearchScreen from "../components/screens/SearchScreen";
import ListingSearchResultScreen from "../components/screens/ListingSearchResultScreen";
const { width } = Dimensions.get("window");
const searchStack = createStackNavigator(
  {
    SearchScreen: {
      screen: SearchScreen,
      navigationOptions: {
        gesturesEnabled: true
      }
    },
    ListingSearchResultScreen: {
      screen: ListingSearchResultScreen,
      navigationOptions: {
        gesturesEnabled: true
      }
    }
  },
  stackOpts
);

export default searchStack;
