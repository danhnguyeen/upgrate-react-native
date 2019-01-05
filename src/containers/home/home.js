import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import RNAccountKit from 'react-native-facebook-account-kit'
import FCM from "react-native-fcm";

class Home extends Component {
  componentDidMount() {
    this.configureAccountKit();
  }
  loginWithPhone = () => {
    RNAccountKit.loginWithPhone()
      .then((token) => {
        console.log(token)
        if (!token) {
          console.log('Login cancelled')
        } else {
          console.log(`Logged with phone. Token: ${token}`)
        }
      })
  }
  localPushNotification = () => {
    FCM.presentLocalNotification({
      body: 'notif.content',
      priority: "high",
      title: 'notif.title',
      click_action: "fcm.ACTION.HELLO",
      channel: "mylife_company_chanel",
      show_in_foreground: true, /* notification when app is in foreground (local & remote)*/
    });
  }
  configureAccountKit() {
    RNAccountKit.configure({
      // responseType: 'code',
      initialPhoneCountryPrefix: '+84', // autodetected if none is provided
      // viewControllerMode: 'show'|'present' // for iOS only, 'present' by default
    })
  }
  render() {
    return (
      <View>
        <Text>Homefwe</Text>
        <Button onPress={this.loginWithPhone} title="Login With Phone" />
        <Button onPress={this.localPushNotification} title="Local Push" />
      </View>
    );
  }
}

export default Home;
