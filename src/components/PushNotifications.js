import { Alert, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { deviceLanguage } from '../utils/i18n';

import store from '../store';
import * as authActions from '../actions/authActions';
// import config from '../config';

// function RegisterPushListener() {
//   return firebase.notifications().onNotification((notif) => {
//     let notification = new firebase.notifications.Notification();
//     notification = notification
//       .setNotificationId(notif.notificationId)
//       .setTitle(notif.title)
//       .setBody(notif.body)
//       .setSound(notif.sound || 'bell.mp3')
//       .setData({
//         ...notif.data
//       });

//     if (Platform.OS === 'android') {
//       notification.android.setAutoCancel(true);
//       notification.android.setColor(config.pushNotificationsColor);
//       notification.android.setColorized(true);
//       notification.android.setPriority(firebase.notifications.Android.Priority.High);
//       notification.android.setSmallIcon('ic_notification');
//       notification.android.setVibrate([300]);
//       notification.android.setOngoing(true);
//       notification.android.setClickAction('open');
//       notification.android.setChannelId(config.pushNotificationChannelId);
//     }

//     firebase.notifications().displayNotification(notification);
//   });
// }

// function RegisterOpenListener(navigator) {
//   return firebase.notifications().onNotificationOpened((notificationOpen) => {
//     const notif = notificationOpen.notification;
//     if (notif.data && notif.data.targetScreen) {
//       navigator.handleDeepLink({
//         link: notif.data.targetScreen,
//         payload: notif.data.payload,
//       });
//     }
//   });
// }

const getFcmToken = async () => {
  const fcmToken = await messaging().getToken();
  if (fcmToken) {
    console.log('TOKEN (getFCMToken): ', fcmToken);

    const { auth } = store.getState();
    if (auth.deviceToken !== fcmToken) {
      store.dispatch(
        authActions.deviceInfo({
          token: fcmToken,
          platform: Platform.OS,
          locale: deviceLanguage,
          device_id: auth.uuid,
        }),
      );
    }
  } else {
    console.log('Failed', 'No token received');
  }
};

async function Init() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    getFcmToken();
  }

  messaging().onMessage(async (remoteMessage) => {
    Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
  });

  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Message handled in the background!', remoteMessage);
  });
}

export default {
  Init,
  // RegisterPushListener,
  // RegisterOpenListener,
};
