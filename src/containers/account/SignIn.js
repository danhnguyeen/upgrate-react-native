import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StackActions, NavigationActions } from 'react-navigation';
import { AsyncStorage, StyleSheet, TouchableOpacity, View, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { Content, Icon, Text, Input, Button } from "native-base";
import { LoginManager, AccessToken } from "react-native-fbsdk";
import RNAccountKit, { Color } from 'react-native-facebook-account-kit';

import i18n from '../../i18n';
import * as actions from './auth-actions';
import { InputField, CustomButton } from '../../components/common';
import { backgroundColor, brandPrimary, brandWarning } from '../../config/variables';

class SignIn extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isEmailCorrect: false,
      isPasswordCorrect: false,
      isLogin: false,
    }
    this._isMounted = false,
      this.routeNameProps = null,
      this.dataProps = null

  }
  componentDidMount() {
    this._onCheckAuth();
    this.configureAccountKit();
  }
  configureAccountKit() {
    RNAccountKit.configure({
      theme: {
        buttonBackgroundColor: Color.rgba(245, 166, 35, 1),
        buttonBorderColor: Color.rgba(245, 166, 35, 1)
      },
      //countryWhitelist: [ "AR", "BR", "US" ],
      //countryBlacklist: [ "BR" ],
      //defaultCountry: "AR"
      receiveSMS: true, //auto fill SMS code
      readPhoneStateEnabled: true, //auto fill phone number
      initialPhoneCountryPrefix: "+84"
    });
  }
  _onCheckAuth = () => {
    this.routeNameProps = this.props.navigation.getParam('routeNameProps', null)
    this.dataProps = this.props.navigation.getParam('dataProps', null)
    if (this.props.isAuth) {
      this._onLoginSuccess();
    }
  }
  onLoginFacebook = async () => {
    try {
      await LoginManager.logOut();
      const result = await LoginManager.logInWithReadPermissions(['email', 'public_profile']);
      if (result.isCancelled) {
        // alert('Login was cancelled');
      } else {
        const data = await AccessToken.getCurrentAccessToken();
        const token = data.accessToken.toString();
      }
    } catch (e) {
      console.log(e)
      // this.setState({ checkLogin: false });
    }
  }
  getStarted = () => {
    const email = this.email.getInputValue()
    const password = this.password.getInputValue()

    this.setState({
      isEmailCorrect: email === '',
      isPasswordCorrect: password === '',
    }, () => {
      if (email !== '' && password !== '') {
        this.onLoginSubmit(email, password)
      }
      else {
        this.setState({
          alertModal: {
            type: 'error',
            content: 'Vui lòng nhập đúng địa chỉ email hoặc mật khẩu.'
          }
        })
      }
    })
  }
  onLoginSubmit = async (email, password) => {
    // console.log(email, password)
    const dataLogin = {
      email: email,
      password: password,
    }
    this.setState({ isLogin: true })

    await this.props.onAuth(email, password)
      .then(() => {
        this._onLoginSuccess();
      })
      .catch(error => {
        console.log(error)
        this.setState({
          isLogin: false,
          alertModal: {
            type: 'error',
            content: error.message,
          }
        })
      })
  }
  onLoginWithPhone = async () => {
    try {
      RNAccountKit.loginWithPhone()
        .then((token) => {
          if (!token) {
            console.log('Login cancelled')
          } else {
            console.log(`Logged with phone. Token: ${token}`)
          }
        });
    } catch (err) {
      // this.setState({ checkLogin: false });
    }
  }
  _onLoginSuccess = () => {
    this.setState({ isLogin: true })
    AsyncStorage.setItem('token', this.props.isAuth)
    const dataProps = this.dataProps
    const sub_routeName = this.routeNameProps ? this.routeNameProps : 'Account'
    this.props.navigation.dispatch(StackActions.reset({
      index: 0, key: null,
      actions: [NavigationActions.navigate({
        routeName: 'Account',
        params: { dataProps },
        action: NavigationActions.navigate({ routeName: sub_routeName, params: { dataProps } })
      })]
    }))
    // _dispatchStackActions(this.props.navigation, 'reset', 'Main', sub_routeName, dataProps)
  }

  changeInputFocus = name => () => {
    if (name === 'Email') {
      this.setState({ isEmailCorrect: this.email.getInputValue() === '' })
      this.password.input.focus()
    } else {
      this.setState({ isPasswordCorrect: this.password.getInputValue() === '' })
    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor }}>
        <Content padder >
          <KeyboardAvoidingView>
            <View style={{ paddingVertical: 10 }}>
              <InputField
                placeholder={'Email'}
                keyboardType="email-address"
                error={this.state.isEmailCorrect}
                focus={this.changeInputFocus}
                ref={ref => this.email = ref}
                icon="md-mail"
              />
              <InputField
                placeholder={'Mật khẩu'}
                returnKeyType="done"
                secureTextEntry={true}
                blurOnSubmit={true}
                error={this.state.isPasswordCorrect}
                ref={ref => this.password = ref}
                focus={this.changeInputFocus}
                icon='md-lock'
              />
            </View>
            <View style={{ flex: 1, alignItems: 'center', paddingVertical: 10 }}>
              <CustomButton
                onPress={this.getStarted}
                buttonStyle={{ minWidth: 200 }}
                title={i18n.t('login.signIn')}
              />
              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                <View style={{ flex: 1, marginRight: 5 }}>
                  <CustomButton
                    buttonStyle={{ margin: 0, borderColor: '#4066b4', backgroundColor: '#4066b4' }}
                    onPress={this.onLoginFacebook}
                    title='Facebook' />
                </View>
                <View style={{ flex: 1, marginLeft: 5 }}>
                  <CustomButton
                    buttonStyle={{ margin: 0, borderColor: brandWarning, backgroundColor: brandWarning }}
                    onPress={this.onLoginWithPhone}
                    title={i18n.t('login.phoneNumber')} />
                </View>
              </View>
              <TouchableOpacity style={{ margin: 10 }} activeOpacity={0.6}
                onPress={() => { this.props.navigation.push('SignUp') }}>
                <Text style={{ color: '#575757' }}>{'Chưa có tài khoản ? '}<Text style={{ color: brandPrimary }}>{'Đăng ký'}</Text></Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Content>

      </View >
    )
  }
}
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignSelf: "center",
  },
  lineBottom: {
    borderBottomColor: 'rgba(0,0,0,0.5)',
    borderBottomWidth: 0.5,
    marginVertical: 5,
    marginHorizontal: 15,
  }
})



const mapStateToProps = state => ({
  isAuth: state.auth.token,
});

const mapDispatchToProps = dispatch => ({
  onAuth: (username, password) => dispatch(actions.auth(username, password)),
  // resetAuthFailError: () => dispatch(actions.resetAuthFailError())
});

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);