import { createStackNavigator } from "react-navigation-stack";
import stackOpts from "./stackOpts";
import ListingScreen from "../components/screens/ListingScreen";

const listingStack = createStackNavigator(
  {
    ListingScreen: {
      screen: ListingScreen,
      navigationOptions: ({ navigation }) => {
        // navigation.setParams({ otherParam: "Updated!" });
        // return {
        //   title: navigation.getParam('otherParam', 'A Nested Details Screen'),
        // };
      }
      // navigationOptions: {
      // 	title: 'Wilcity',
      // 	headerStyle: {
      // 		backgroundColor: Consts.colorDark,
      // 	},
      //     headerTintColor: Consts.colorPrimary,
      //     headerTitleStyle: {
      //         fontWeight: '400',
      //         fontSize: 14,
      //     },
      // }
    }
    // LISTING_DETAIL: {
    // 	screen: ListingDetail
    // },
  },
  stackOpts
);

export default listingStack;
