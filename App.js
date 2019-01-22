import React, { Component } from 'react';
import { StatusBar, View, UIManager } from 'react-native';
import SplashScreen from 'react-native-splash-screen'
import FCM from "react-native-fcm";
import DeviceInfo from 'react-native-device-info';
import { YellowBox } from 'react-native';
import { connect } from 'react-redux';

import AppContainer from './navigators';
import PushNotification from './src/services/notifications-service';
import NavigationService from './src/services/navigation-service';
import { brandPrimary, platform } from './src/config/variables';
import * as actions from './src/stores/actions';

YellowBox.ignoreWarnings(['Remote debugger']);

class App extends Component {
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
    const token = await FCM.getFCMToken().then(token => {
      return token;
    });
    if (token && this.props.isAuth) {
      const uniqueId = DeviceInfo.getUniqueID();
      const deviceName = DeviceInfo.getModel();
      this.props.updateFCMToken(token, uniqueId, deviceName);
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

const mapStateToProps = state => {
  return {
    isAuth: state.auth.token
  }
};

const mapDispatchToProps = dispatch => {
  return {
    updateFCMToken: (token, uniqueId, deviceName) => dispatch(actions.updateNotificationToken(token, uniqueId, deviceName))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);