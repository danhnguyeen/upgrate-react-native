import React, { Component } from 'react';
import { StatusBar, View, UIManager } from 'react-native';
import SplashScreen from 'react-native-splash-screen'
import FCM from "react-native-fcm";
import { YellowBox } from 'react-native';

import AppContainer from './navigators';
import PushNotification from './src/services/notifications-service';
import NavigationService from './src/services/navigation-service';
import { brandPrimary, platform } from './src/config/variables';

YellowBox.ignoreWarnings(['Remote debugger']);

export default class App extends Component {
  componentDidMount() {
    SplashScreen.hide();
    FCM.requestPermissions({ badge: true, sound: true, alert: true });
    if (platform === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    this.updateNotificationToken();
  }
  updateNotificationToken = async() => {
    try {
      await FCM.requestPermissions({ badge: true, sound: true, alert: true });
    } catch (e) {}
    FCM.getFCMToken().then(token => {
      // alert(token)
      console.log("TOKEN (getFCMToken)", token);
    });
    const token = await FCM.getFCMToken().then(token => {
      // alert(token)
      return token;
    });
    
    console.log(token)
    // if (token) {
    //   const uniqueId = DeviceInfo.getUniqueID();
    //   const deviceName = DeviceInfo.getModel();
    //   this.props.updateFCMToken(token, uniqueId, deviceName);
    // }
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          backgroundColor={brandPrimary}
          barStyle="light-content"
        />
        <AppContainer ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }} />
        <PushNotification />
      </View>
    );
  }
}

