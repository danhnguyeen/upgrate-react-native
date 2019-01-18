import React from 'react';
import { connect } from 'react-redux';
import { AsyncStorage, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Content, Text } from "native-base";

import * as actions from './auth-actions';
import { _dispatchStackActions } from '../../util/utility';
import { brandPrimary, backgroundColor, brandLight } from '../../config/variables';
import Profile from './Profile';

class Account extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this._isMounted = false
  }
  componentWillUnmount() {
    this._isMounted = false
  }
  componentDidMount() {
    this._isMounted = true
    if (this._isMounted == true) {
      if (!this.props.isAuth) {
        _dispatchStackActions(this.props.navigation, 'navigate', 'SignIn')
      }
    }
  }
  // onInitProfile = () => {
  //   if (!this.props.isAuth) {
  //     Alert.alert('Alert Title', 'Bạn chưa đăng nhập, đi đến trang đăng nhập ?', [
  //       { text: 'OK', onPress: () => console.log('OK Pressed!') },
  //     ])
  //     // _dispatchStackActions(this.props.navigation, 'navigate', 'SignIn')
  //   }
  // }

  callToLogout = async () => {
    await AsyncStorage.removeItem('token');
    await this.props.onLogout();
    _dispatchStackActions(this.props.navigation, 'reset', 'Main', 'Account')
  }
  render() {
    return (

      <View style={styles.container}>
        <Content padder >
          {!this.props.isAuth ?
            <View style={styles.paragraph}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('SignIn')} >
                <Text style={{ color: brandPrimary }}>{'Đăng nhập'}</Text>
              </TouchableOpacity>
            </View>
            :
            <Profile
              callToLogout={() => { this.callToLogout() }}
              navigation={this.props.navigation}
              isAuth={this.props.isAuth}
              user={this.props.user}
            />
          }
        </Content>
      </View >

    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor
  },
  paragraph: {
    backgroundColor: brandLight,
    borderRadius: 3,
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
},
})

const mapStateToProps = state => {
  return {
    isAuth: state.auth.token,
    user: state.auth.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (username, password) => dispatch(actions.auth(username, password)),
    onLogout: () => dispatch(actions.logout())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Account)