import React from 'react'
import { StyleSheet, TouchableOpacity, View, ImageBackground, Image } from 'react-native'
import { Icon, Text } from "native-base"
import { LANGUAGE, winW, winH } from '../constants/'

const ROURTER = [
  { routeName: 'News', icon: 'newspaper-o' },
  { routeName: 'Appointment', icon: 'calendar' },
  { routeName: 'Saved', icon: 'heart-o' },
  { routeName: 'Account', icon: 'user-o' },
]

class Welcome extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground style={[StyleSheet.absoluteFill]} source={require('../assets/images/homescreen2.jpg')} />
        <View style={styles.contentContainer}>
          <View style={{ alignItems: 'center' }}>
            <Image source={require('../assets/images/logo-text.png')} style={styles.logoImage} />
          </View>
          <TouchableOpacity
            onPress={() => { this.props.navigation.navigate('Paxsky') }}
            style={styles.searchBar} activeOpacity={1}>
            <Icon style={{ color: '#FFF', lineHeight: 30, marginRight: 10, }} name='office-building' type="MaterialCommunityIcons" />
            <Text uppercase style={[styles.buttonText, { textAlign: 'center' }]}>{LANGUAGE('Buildings')}</Text>
          </TouchableOpacity>

          {[2, 4].map((line) =>
            <View style={styles.buttonsContainer} key={line}>
              {[2, 1].map((index) => {
                const router = (line.valueOf() - index.valueOf())
                const routeName = ROURTER[router].routeName
                return (
                  <TouchableOpacity key={index}
                    onPress={() => { this.props.navigation.navigate(routeName) }}
                    style={[styles.buttonsBlock]} >
                    <Icon style={styles.buttonIcon} name={ROURTER[router].icon} type="FontAwesome" />
                    <Text style={styles.buttonText} >{LANGUAGE(routeName)}</Text>
                  </TouchableOpacity>
                )
              }
              )}
            </View>
          )}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
  },
  contentContainer: {
    // backgroundColor: 'rgba(0,0,0,0.3)',
    // alignItems: 'center',
    padding: winW(10),
    // width: winW(90),
    // alignContent: 'center',
    // alignItems: 'center',
  },
  logoImage: {
    resizeMode: 'contain',
    width: winW(40),
    height: winW(40),
    marginBottom: winW(5),
  },
  searchBar: {
    backgroundColor: "rgba(52,139,205, 0.8)",
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    // marginHorizontal: winW(4),
    marginBottom: winW(5),
    marginHorizontal: 5,
    padding: 10,
  },
  buttonsContainer: {
    // backgroundColor: 'rgba(255,255,255,0.3)',
    flexDirection: 'row',
    justifyContent: 'center',
    // flexWrap: 'wrap',
    // alignContent:'center',
    alignItems: 'center',
  },
  buttonsBlock: {
    backgroundColor: "rgba(52,139,205, 0.8)",
    borderRadius: 5,
    flex: 0.5,
    flexDirection: 'row',
    // justifyContent:'center',
    alignItems: 'center',
    // alignContent: 'center',
    // marginHorizontal: winW(2),
    // marginHorizontal: 5,
    margin: 5,
    paddingHorizontal: 15,
    // paddingVertical: 20,
    height: 60,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
  },
  buttonIcon: {
    color: '#FFF',
    fontSize: 20,
    marginRight: 10
  },
});

export default Welcome;
