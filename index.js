import React from "react";
import "expo/build/Expo.fx";
import { registerRootComponent, Logs } from "expo";
import { activateKeepAwake } from "expo-keep-awake";

if (__DEV__) {
  const isRemoteDebuggingEnabled = typeof atob !== "undefined";
  if (isRemoteDebuggingEnabled) {
    Logs.disableExpoCliLogging();
  } else {
    Logs.enableExpoCliLogging();
  }
  activateKeepAwake();
  const AppEntry = () => {
    const App = require("./App").default;
    return <App />;
  };
  registerRootComponent(AppEntry);
} else {
  const App = require("./App").default;
  registerRootComponent(App);
}

// if (__DEV__) {
//   global.XMLHttpRequest = global.originalXMLHttpRequest
//     ? global.originalXMLHttpRequest
//     : global.XMLHttpRequest;
//   global.FormData = global.originalFormData
//     ? global.originalFormData
//     : global.FormData;

//   fetch; // Ensure to get the lazy property

//   if (window.__FETCH_SUPPORT__) {
//     // it's RNDebugger only to have
//     window.__FETCH_SUPPORT__.blob = false;
//   } else {
//     /*
//      * Set __FETCH_SUPPORT__ to false is just work for `fetch`.
//      * If you're using another way you can just use the native Blob and remove the `else` statement
//      */
//     global.Blob = global.originalBlob ? global.originalBlob : global.Blob;
//     global.FileReader = global.originalFileReader
//       ? global.originalFileReader
//       : global.FileReader;
//   }
// }
