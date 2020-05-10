import { createStackNavigator } from "react-navigation-stack";
import stackOpts from "./stackOpts";
import * as Consts from "../constants/styleConstants";
import ArticleScreen from "../components/screens/ArticleScreen";

const articleStack = createStackNavigator(
  {
    ArticleScreen: {
      screen: ArticleScreen
    }
  },
  stackOpts
);

export default articleStack;
