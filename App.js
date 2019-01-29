import React, { Component } from 'react';
import { StatusBar, View, UIManager, YellowBox, AppState } from 'react-native';
import { Root } from "native-base"
import SplashScreen from 'react-native-splash-screen'
import FCM from "react-native-fcm";
import DeviceInfo from 'react-native-device-info';
import { connect } from 'react-redux';

import AppContainer from './navigators';
import PushNotification from './src/services/notifications-service';
import NavigationService from './src/services/navigation-service';
import { brandPrimary, platform } from './src/config/variables';
import * as actions from './src/stores/actions';

YellowBox.ignoreWarnings(['Setting a timer', 'Remote debugger'])

class App extends Component {
  state = {
    appState: AppState.currentState
  }
  componentDidMount() {
    SplashScreen.hide();
    FCM.requestPermissions({ badge: true, sound: true, alert: true });
    if (platform === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    if (this.props.isAuth) {
      this.props.findLastAppointmentDone(this.props.user.customer_id).then((result) => {
        if (result.count > 0) {
          NavigationService.navigate('Rating', { itemRating: result.appointment });
        }
      })
      this.updateNotificationToken();
      this.props.fetchNotificationCount(this.props.user.customer_id);
      this.props.getUser(this.props.user.customer_id);
    }
    AppState.addEventListener('change', this._handleAppStateChange);
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }
  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      // if the App has come to the foreground, call refresh the promotion
      if (this.props.isAuth) {
        this.props.fetchNotificationCount(this.props.user.customer_id);
        this.props.getUser(this.props.user.customer_id);
      }
    }
    this.setState({ appState: nextAppState });
  }
  updateNotificationToken = async () => {
    try {
      await FCM.requestPermissions({ badge: true, sound: true, alert: true });
    } catch (e) { }
    const token = await FCM.getFCMToken().then(token => {
      return token;
    });
    if (token && this.props.isAuth) {
      const uniqueId = DeviceInfo.getUniqueID();
      this.props.updateFCMToken(this.props.user.customer_id, token, uniqueId);
    }
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          backgroundColor={'#2079ae'}
          barStyle="light-content"
        />
        <Root>
          <AppContainer ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }} />
        </Root>
        <PushNotification />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuth: state.auth.token,
    user: state.auth.user
  }
};

const mapDispatchToProps = dispatch => {
  return {
    fetchNotificationCount: (customer_id) => dispatch(actions.fetchNotificationCount(customer_id)),
    findLastAppointmentDone: (customer_id) => dispatch(actions.findLastAppointmentDone(customer_id)),
    updateFCMToken: (customer_id, token, uniqueId) => dispatch(actions.updateNotificationToken(customer_id, token, uniqueId)),
    getUser: (customer_id) => dispatch(actions.getProfile(customer_id))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);