import { Component } from "react";

import FCM, {
  FCMEvent,
  RemoteNotificationResult,
  WillPresentNotificationResult,
  NotificationType
} from "react-native-fcm";

class PushNotification extends Component {

  async componentDidMount() {
    //FCM.createNotificationChannel is mandatory for Android targeting >=8. Otherwise you won't see any notification
    FCM.createNotificationChannel({
      id: 'mylife_company_chanel',
      name: 'Mylife Company',
      priority: 'max'
    });
    // await FCM.requestPermissions({ badge: true, sound: true, alert: true });
    FCM.getInitialNotification().then(notif => {
      // android
      if (notif) {
        if (notif.opened_from_tray && notif.from) {
          // this.props.callNavigate('Notification');
        }
      }
    });

    this.notificationListner = FCM.on(FCMEvent.Notification, async (notif) => {
      console.log(notif);
      // open from tray iOS
      if (notif.opened_from_tray) {
        return;
      }
      this.showLocalNotification(notif);
    });

    this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, token => {
      console.log("TOKEN (refreshUnsubscribe)", token);
    });
  }

  showLocalNotification(notif) {
    console.log(notif)
      // FCM.presentLocalNotification({
      //   body: notif.content,
      //   priority: "high",
      //   title: notif.title,
      //   click_action: "fcm.ACTION.HELLO",
      //   channel: "mylife_company_chanel",
      //   show_in_foreground: true, /* notification when app is in foreground (local & remote)*/
      // });
  }

  componentWillUnmount() {
    if (this.notificationListner) {
      this.notificationListner.remove();
    }
    if (this.refreshTokenListener) {
      this.refreshTokenListener.remove();
    }
  }

  render() {
    return null;
  }
}

export default PushNotification;