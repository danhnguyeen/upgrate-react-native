import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import RNAccountKit from 'react-native-facebook-account-kit'

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
        <Text>Home</Text>
        <Button onPress={this.loginWithPhone} title="Login With Phone" />
      </View>
    );
  }
}

export default Home;
