import { createStackNavigator } from "react-navigation-stack";
import stackOpts from "./stackOpts";
import * as Consts from "../constants/styleConstants";
import EventScreen from "../components/screens/EventScreen";

const eventStack = createStackNavigator(
  {
    EventScreen: {
      screen: EventScreen
    }
  },
  stackOpts
);

export default eventStack;
