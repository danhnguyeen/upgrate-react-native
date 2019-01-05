/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StatusBar, View } from 'react-native';
import SplashScreen from 'react-native-splash-screen'
import { NavigationActions } from 'react-navigation';
import FCM from "react-native-fcm";

import AppContainer from './navigators';
import PushNotification from './notifications';

export default class App extends Component {
  componentDidMount() {
    SplashScreen.hide();
    FCM.requestPermissions({ badge: true, sound: true, alert: true });
  }
  render() {
    const callNavigate = (routeName, params) => {
      this.navigator.dispatch({
        type: NavigationActions.NAVIGATE,
        routeName: routeName,
        params: params
      })
    };
    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          backgroundColor={'#2488c4'}
          barStyle="light-content"
        />
        <AppContainer />
        <PushNotification callNavigate={callNavigate}></PushNotification>
      </View>
    );
  }
}

