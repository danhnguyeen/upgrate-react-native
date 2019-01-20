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

