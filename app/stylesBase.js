import * as Consts from "./constants/styleConstants";
import { StyleSheet } from "react-native";

const stylesBase = StyleSheet.create({
  text: {
    fontSize: 13,
    color: Consts.colorDark2,
    lineHeight: 19
  },
  h1: {
    fontSize: 30,
    fontWeight: "bold",
    color: Consts.colorDark1
  },
  h2: {
    fontSize: 26,
    fontWeight: "bold",
    color: Consts.colorDark1
  },
  h3: {
    fontSize: 22,
    fontWeight: "bold",
    color: Consts.colorDark1
  },
  h4: {
    fontSize: 18,
    fontWeight: "bold",
    color: Consts.colorDark1
  },
  h5: {
    fontSize: 15,
    fontWeight: "bold",
    color: Consts.colorDark1
  },
  h6: {
    fontSize: 13,
    fontWeight: "bold",
    color: Consts.colorDark1
  },
  mb5: {
    marginBottom: 5
  },
  mb10: {
    marginBottom: 10
  },
  mb20: {
    marginBottom: 20
  },
  mb30: {
    marginBottom: 30
  },
  mt5: {
    marginTop: 5
  },
  pd5: {
    padding: 10
  },
  pd10: {
    padding: 10
  },
  pd15: {
    padding: 10
  },
  pv10: {
    paddingVertical: 10
  },
  pv20: {
    paddingVertical: 20
  },
  pv30: {
    paddingVertical: 30
  },
  pv40: {
    paddingVertical: 40
  },
  bgLight: {
    backgroundColor: "#fff"
  },
  bgGray: {
    backgroundColor: Consts.colorGray2
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: Consts.colorGray2
  },
  absFull: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    zIndex: 1
  },

  colorPrimary: {
    color: Consts.colorPrimary
  },
  colorSecondary: {
    color: Consts.colorSecondary
  },
  colorTertiary: {
    color: Consts.colorTertiary
  },
  colorQuaternary: {
    color: Consts.colorQuaternary
  }
});
export default stylesBase;
