import React, { useEffect } from "react";
import { YellowBox } from "react-native";
YellowBox.ignoreWarnings([
  "Warning: componentWillMount is deprecated",
  "Warning: componentWillReceiveProps is deprecated",
  "Remote debugger is in a background tab which",
  "Debugger and device times have drifted",
  "Warning: isMounted(...) is deprecated",
  "Setting a timer",
  "<InputAccessoryView> is not supported on Android yet.",
  "Class EX",
  "Require cycle:"
]);
// console.disableYellowBox = true;

import { AppLoading } from "expo";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import { store, persistor } from "./configureStore";
import configureApp from "./configureApp.json";
import RootStack from "./app/routes";
import axios from "axios";
import { updateFocus } from "./app/wiloke-elements";
import Constants from "expo-constants";
import { Asset } from "expo-asset";

axios.defaults.baseURL = `${configureApp.api.baseUrl.replace(
  /\/$/g,
  ""
)}/wp-json/wiloke/v2`;
axios.defaults.timeout = configureApp.api.timeout;
// axios.defaults.headers["Cache-Control"] = "no-cache";

// enableScreens();
const App = () => {
  const _cacheResourcesAsync = async () => {
    const images = [
      require("./assets/loginCover.png"),
      require("./assets/logo.png")
    ];
    const cacheImages = images.map(image => {
      return Asset.fromModule(image).downloadAsync();
    });
    return Promise.all(cacheImages);
  };

  useEffect(() => {
    _cacheResourcesAsync();
  }, []);

  return (
    <PersistGate loading={null} persistor={persistor}>
      <Provider store={store}>
        <RootStack />
      </Provider>
    </PersistGate>
  );
};
export default App;
