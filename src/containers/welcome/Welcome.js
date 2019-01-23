import React from 'react';
import { StyleSheet, TouchableOpacity, View, ImageBackground, Image, Text } from 'react-native';
import { Icon } from "native-base";
import { connect } from 'react-redux';

import * as actions from '../../stores/actions';
import Logo from '../../assets/images/logo-text.png';
import Background from '../../assets/images/homescreen2.jpg';
import i18n from '../../i18n';

const ROURTER = [
  { routeName: 'News', title: 'news', icon: 'newspaper-o', type: 'FontAwesome' },
  { routeName: 'Appointment', title: 'appointment', icon: 'calendar', type: 'FontAwesome' },
  { routeName: 'Locations', title: 'locations', icon: 'map-marker-multiple', type: 'MaterialCommunityIcons' },
  { routeName: 'Account', title: 'account', icon: 'user-o', type: 'FontAwesome' }
];

class Welcome extends React.Component {
  componentDidMount() {
    this.props._onfetchBuidlings()
    this.props._onfetchDistrictList()
  }
  render() {
    return (
      <View style={styles.container}>
        <ImageBackground style={[StyleSheet.absoluteFill]} source={Background} />
        <View style={styles.contentContainer}>
          <View style={{ alignItems: 'center' }}>
            <Image source={Logo} style={styles.logoImage} />
          </View>
          <TouchableOpacity
            onPress={() => { this.props.navigation.navigate('Buildings') }}
            style={styles.searchBar} activeOpacity={0.8}>
            <Icon style={{ color: '#FFF', lineHeight: 30, marginRight: 10, }} name='building-o' type="FontAwesome" />
            <Text uppercase style={[styles.buttonText, { textAlign: 'center' }]}>{i18n.t('tabs.buildingList')}</Text>
          </TouchableOpacity>

          {[2, 4].map((line) =>
            <View style={styles.buttonsContainer} key={line}>
              {[2, 1].map((index) => {
                const router = (line.valueOf() - index.valueOf())
                const routeName = ROURTER[router].routeName
                return (
                  <TouchableOpacity key={index}
                    onPress={() => { this.props.navigation.navigate(routeName) }}
                    activeOpacity={0.8}
                    style={styles.buttonsBlock} >
                    <Icon style={styles.buttonIcon} name={ROURTER[router].icon} type={ROURTER[router].type} />
                    <Text style={styles.buttonText} >{i18n.t(`tabs.${ROURTER[router].title}`)}</Text>
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
    padding: 15
  },
  logoImage: {
    width: 180,
    height: 180,
    marginBottom: 50
  },
  searchBar: {
    backgroundColor: "rgba(52,139,205, 0.8)",
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginHorizontal: 5,
    padding: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonsBlock: {
    backgroundColor: "rgba(52,139,205, 0.8)",
    borderRadius: 5,
    flex: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
    paddingHorizontal: 15,
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

const mapDispatchToProps = dispatch => {
  return {
    _onfetchBuidlings: (district_id) => dispatch(actions.fetchBuidlings(district_id)),
    _onfetchDistrictList: (provinceId) => dispatch(actions.fetchDistrictList(provinceId)),
  }
};

export default connect(null, mapDispatchToProps)(Welcome);
