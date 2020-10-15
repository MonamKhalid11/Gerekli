import { Platform } from 'react-native';
import { get } from 'lodash';
import messaging from '@react-native-firebase/messaging';
import { Notifications } from 'react-native-notifications';
import { deviceLanguage } from '../utils/i18n';
import { registerDrawerDeepLinks } from '../utils/deepLinks';

import store from '../store';
import * as authActions from '../actions/authActions';

function RegisterPushListener(componentId) {
  Notifications.registerRemoteNotifications();

  Notifications.events().registerNotificationReceivedForeground(
    (notification, completion) => {
      completion({ alert: true, sound: true, badge: true });
    },
  );

  Notifications.events().registerNotificationOpened(
    (notification, completion) => {
      const targetScreen = get(
        notification,
        'payload.data.targetScreen',
        false,
      );
      if (targetScreen) {
        registerDrawerDeepLinks(
          {
            link: targetScreen,
            payload: notification.payload,
          },
          componentId,
        );
      }
      completion();
    },
  );

  const unsubscribe = messaging().onMessage(async (remoteMessage) => {
    Notifications.postLocalNotification({
      ...remoteMessage.notification,
      data: remoteMessage.data,
    });
  });

  return unsubscribe;
}

async function Init() {
  await messaging().requestPermission({
    badge: true,
    sound: true,
    alert: true,
  });

  const token = await messaging().getToken();
  console.log('TOKEN (getFCMToken)', token);

  const { auth } = store.getState();
  if (auth.deviceToken !== token) {
    store.dispatch(
      authActions.deviceInfo({
        token,
        platform: Platform.OS,
        locale: deviceLanguage,
        device_id: auth.uuid,
      }),
    );
  }
}

export default {
  Init,
  RegisterPushListener,
};
