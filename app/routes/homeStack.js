import { createStackNavigator } from "react-navigation-stack";
import { Dimensions } from "react-native";
import stackOpts from "./stackOpts";
import HomeScreen from "../components/screens/HomeScreen";
import ListingScreen from "../components/screens/ListingScreen";
import EventScreen from "../components/screens/EventScreen";
import ListingCategories from "../components/screens/ListingCategories";
const { width } = Dimensions.get("window");
const homeStack = createStackNavigator(
  {
    HomeScreen: {
      screen: HomeScreen
    },
    ListingCategories: {
      screen: ListingCategories,
      navigationOptions: ({ navigation }) => ({
        gesturesEnabled: true,
        gestureResponseDistance: {
          horizontal: width
        }
      })
    },
    ListingScreenStack: {
      screen: ListingScreen
    },
    EventScreenStack: {
      screen: EventScreen
    }
  },
  stackOpts
);

export default homeStack;
