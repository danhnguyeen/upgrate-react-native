import React, { Component } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import RNAccountKit from 'react-native-facebook-account-kit'
import FCM from "react-native-fcm";

import { backgroundColor } from '../../config/variables';

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
      <View style={{ flex: 1, backgroundColor }}>
        <ScrollView contentContainerStyle={{ paddingVertical: 15,  }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={[styles.container, { marginLeft: 15, marginRight: 0, width: 250 }]}></View>
            <View style={[styles.container, { marginLeft: 10, width: 250 }]}></View>
          </ScrollView>
          <View style={styles.container}></View>
          {/* <View style={styles.container}></View> */}
          <Text>Homefwe</Text>
          <Button onPress={this.loginWithPhone} title="Login With Phone" />
          <Button onPress={this.localPushNotification} title="Local Push" />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    backgroundColor: '#fff',
    // width: '100%',
    height: 180,
    borderRadius: 5,
    elevation: 2,
    shadowColor: '#1a1917',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    marginBottom: 15
  }
})
export default Home;
