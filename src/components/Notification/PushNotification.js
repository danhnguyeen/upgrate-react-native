import React, { Component } from "react";
import { connect } from 'react-redux';

import * as actions from '../../stores/actions';
import FCM, {
  FCMEvent,
  RemoteNotificationResult,
  WillPresentNotificationResult,
  NotificationType
} from "react-native-fcm";
import { platform } from "../../config/variables";

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
      if (notif && this.props.isAuth) {
        if (notif.opened_from_tray && notif.from) {
          this.props.callNavigate('Notification');
        }
      }
    });

    this.notificationListner = FCM.on(FCMEvent.Notification, async (notif) => {
      this.props.fetchNotificationCount();
      if (this.props.isAuth) {
        this.props.getProfile().then((res) => {
          this.props.refreshHeader();
        });
      }
      // open from tray iOS
      if (notif.opened_from_tray) {
        if (this.props.isAuth) {
          if ((platform === 'android' && notif.local_notification)
            || notif.from || platform === 'ios') {
            this.props.callNavigate('Notification');
          }
        }
        return;
      }
      if (platform === 'ios') {
        //optional
        //iOS requires developers to call completionHandler to end notification process. If you do not call it your background remote notifications could be throttled, to read more about it see the above documentation link.
        //This library handles it for you automatically with default behavior (for remote notification, finish with NoData; for WillPresent, finish depend on "show_in_foreground"). However if you want to return different result, follow the following code to override
        //notif._notificationType is available for iOS platfrom
        switch (notif._notificationType) {
          case NotificationType.Remote:
            notif.finish(RemoteNotificationResult.NewData) //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
            break;
          case NotificationType.NotificationResponse:
            notif.finish();
            break;
          case NotificationType.WillPresent:
            notif.finish(WillPresentNotificationResult.All) //other types available: WillPresentNotificationResult.None
            break;
        }
      }
      this.showLocalNotification(notif);
    });

    this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, token => {
    });
  }

  showLocalNotification(notif) {
    if (platform === 'android') {
      FCM.presentLocalNotification({
        body: notif.content,
        priority: "high",
        title: notif.title,
        click_action: "fcm.ACTION.HELLO",
        channel: "mylife_company_chanel",
        show_in_foreground: true, /* notification when app is in foreground (local & remote)*/
      });
    }
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

const mapStateToProps = state => {
  return {
    isAuth: state.auth.token
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchNotificationCount: () => dispatch(actions.fetchNotificationCount()),
    getProfile: () => dispatch(actions.getProfile())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PushNotification);