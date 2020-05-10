import { createStackNavigator } from "react-navigation-stack";
import stackOpts from "./stackOpts";
import PageScreen from "../components/screens/PageScreen";

const pageStack = createStackNavigator(
  {
    PageScreen: {
      screen: PageScreen
    }
  },
  stackOpts
);

export default pageStack;
