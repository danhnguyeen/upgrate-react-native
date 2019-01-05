/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, StatusBar, View } from 'react-native';
import SplashScreen from 'react-native-splash-screen'

import AppContainer from './navigators';

export default class App extends Component {
  componentDidMount() {
    SplashScreen.hide();
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          backgroundColor={'#2488c4'}
          barStyle="light-content"
        />
        <AppContainer />
      </View>
    );
  }
}

