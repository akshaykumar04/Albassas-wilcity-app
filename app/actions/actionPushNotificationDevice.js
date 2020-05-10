import axios from "axios";
const encodeId = id => `___${id}___`;
const decodeId = id => id.replace(/___/g, "");

export const setDeviceTokenToFirebase = (myID, firebaseID, token) => async (
  __,
  getState
) => {
  try {
    const { db } = getState();
    if (!db || !myID || !firebaseID) return;
    const snapToken = await db
      .ref(`deviceTokens/${encodeId(myID)}/token`)
      .once("value");
    const snapFirebaseID = await db
      .ref(`deviceTokens/${encodeId(myID)}/firebaseID`)
      .once("value");
    const valToken = snapToken.val();
    const valFirebaseID = snapFirebaseID.val();
    if (token !== valToken) {
      await db.ref(`deviceTokens/${encodeId(myID)}/token`).set(token);
    }
    if (firebaseID !== valFirebaseID) {
      await db.ref(`deviceTokens/${encodeId(myID)}/firebaseID`).set(firebaseID);
    }
  } catch (err) {
    console.log("error firebase");
    console.log(err);
  }
};

export const messagePushNotification = (
  userID,
  myDisplayName,
  message,
  myID
) => async (__, getState) => {
  try {
    const { db } = getState();
    if (!db || !userID || !myID) return;
    const snapToken = await db
      .ref(`deviceTokens/${encodeId(userID)}/token`)
      .once("value");
    const snapNotificationMessageSetting = await db
      .ref(
        `deviceTokens/${encodeId(
          userID
        )}/pushNotificationSettings/privateMessages`
      )
      .once("value");
    const snapNotificationAllSetting = await db
      .ref(
        `deviceTokens/${encodeId(userID)}/pushNotificationSettings/toggleAll`
      )
      .once("value");
    const deviceToken = snapToken.val();
    const notificationMessageSettings = snapNotificationMessageSetting.val();
    const notificationAllSettings = snapNotificationAllSetting.val();
    if (
      deviceToken &&
      notificationAllSettings !== false &&
      notificationMessageSettings
    ) {
      const res = await axios.post(
        "https://exp.host/--/api/v2/push/send",
        {
          to: deviceToken,
          title: myDisplayName,
          body: message,
          data: {
            screen: "SendMessageScreen",
            userID: myID,
            displayName: myDisplayName
          },
          sound: "default",
          badge: 1
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        }
      );
      console.log(res);
    }
  } catch (err) {
    console.log(err);
  }
};
