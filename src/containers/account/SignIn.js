import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StackActions, NavigationActions } from 'react-navigation';
import { AsyncStorage, StyleSheet, TouchableOpacity, View, KeyboardAvoidingView, Alert } from 'react-native';
import { Content, Icon, Text } from "native-base";
import { LoginManager, AccessToken } from "react-native-fbsdk";
import RNAccountKit, { Color } from 'react-native-facebook-account-kit';

import i18n from '../../i18n';
import * as actions from './auth-actions';
import { Button, TextInput } from '../../components/common';
import { backgroundColor, brandPrimary, brandWarning } from '../../config/variables';
import { validateForm, checkValidity } from '../../util/utility';

class SignIn extends Component {
  constructor(props) {
    super(props)
    this.state = {
      formTouched: false,
      form: {
        email: {
          value: '',
          validation: {
            required: true,
            isEmail: true
          }
        },
        password: {
          value: '',
          validation: {
            required: true
          }
        }
      },
      checkLogin: false,
      submiting: false,
      loginingFb: false,
      loginingPhone: false,
      formIsValid: true
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
  onLoginWithEmail = async () => {
    this.setState({ formTouched: true });
    const { formIsValid, data } = validateForm({ ...this.state.form });
    console.log(formIsValid)
    if (formIsValid) {
      try {
        this.setState({ submiting: true });
        await this.props.onAuth(data.email, data.password)
        this.setState({ submiting: false });
        this._onLoginSuccess();
      } catch (e) {
        this.setState({ submiting: false });
        console.log(e);
        if (e.message === 'invalid email or password') {
          e.message = i18n.t('account.loginFailMsg');
        }
        this._onLoginFailed(e);
      }
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
        console.log(token);
        try {
          this.setState({ loginingFb: true });
          const result = await this.props.onAuthWithFacebook(token);
          this.setState({ loginingFb: true });
          if (this.props.isAuth) {
            this._onLoginSuccess();
          } else {
            this.setState({ checkLogin: false, submiting: false });
            this.props.navigation.navigate('SignUpWithPhoneAndFacebook', { name: result.name });
          }
        } catch (err) {
          console.log(err);
          this.setState({ loginingFb: false });
          this._onLoginFailed(err);
        }
      }
    } catch (e) {
      console.log(e)
      this.setState({ loginingFb: false });
    }
  }
  onLoginWithPhone = async () => {
    try {
      const { token } = await RNAccountKit.loginWithPhone();
      console.log(token)
      try {
        this.setState({ loginingPhone: true });
        const result = await this.props.onAuthWithPhone(token);
        this.setState({ loginingPhone: true });
        if (this.props.isAuth) {
          this._onLoginSuccess();
        } else {
          this.setState({ checkLogin: false, submiting: false });
          this.props.navigation.navigate('SignUpWithPhoneAndFacebook', { name: result.name });
        }
      } catch (err) {
        console.log(err);
        this.setState({ loginingPhone: false });
        this._onLoginFailed(err);
      }
    } catch (err) {
      this.setState({ loginingPhone: false });
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
        routeName: 'Main',
        params: { dataProps },
        action: NavigationActions.navigate({ routeName: sub_routeName, params: { dataProps } })
      })]
    }))
  }
  _onLoginFailed = (error) => {
    Alert.alert(
      i18n.t('account.loginFail'),
      error.message,
      [{ text: i18n.t('global.ok') }],
      { cancelable: false }
    );
  }
  inputChangeHandler = (value, key) => {
    const form = { ...this.state.form };
    form[key].value = value;
    if (this.state.formTouched) {
      const validation = form[key].validation;
      form[key].inValid = !checkValidity(value, validation, form);
    }
    this.setState({ form });
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor }}>
        <Content padder >
          <KeyboardAvoidingView>
            <View style={{ padding: 15 }}>
              <TextInput
                value={this.state.form.email.value}
                onChangeText={email => this.inputChangeHandler(email, 'email')}
                label={i18n.t('account.email')}
                autoCapitalize="none"
                returnKeyType="next"
                keyboardType="email-address"
                icon={{ iconName: "ios-mail" }}
                inValid={this.state.form.email.inValid}
                errorMessage={i18n.t('account.valid.email')}
              />
              <TextInput
                value={this.state.form.password.value}
                onChangeText={password => this.inputChangeHandler(password, 'password')}
                label={i18n.t('account.password')}
                secureTextEntry
                autoCapitalize="none"
                returnKeyType='done'
                blurOnSubmit={true}
                icon={{ iconName: 'ios-lock' }}
                inValid={this.state.form.password.inValid}
                errorMessage={i18n.t('account.valid.passwordRequired')}
              />
            </View>
            <View style={{ flex: 1, alignItems: 'center', paddingVertical: 10 }}>
              <Button
                onPress={this.onLoginWithEmail}
                loading={this.state.submiting}
                buttonStyle={{ minWidth: 200 }}
                title={i18n.t('account.signIn')}
              />
              <View style={{ flexDirection: 'row', marginBottom: 10, marginHorizontal: 10 }}>
                <View style={{ flex: 1, marginRight: 5 }}>
                  <Button
                    buttonStyle={{ margin: 0, borderColor: '#4066b4', backgroundColor: '#4066b4' }}
                    loading={this.state.loginingFb}
                    loadingWithBg
                    onPress={this.onLoginFacebook}
                    title='Facebook' />
                </View>
                <View style={{ flex: 1, marginLeft: 5 }}>
                  <Button
                    buttonStyle={{ margin: 0, borderColor: brandWarning, backgroundColor: brandWarning }}
                    loading={this.state.loginingPhone}
                    loadingWithBg
                    onPress={this.onLoginWithPhone}
                    title={i18n.t('account.phoneNumber')} />
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

const mapStateToProps = state => ({
  isAuth: state.auth.token,
});

const mapDispatchToProps = dispatch => ({
  onAuth: (username, password) => dispatch(actions.auth(username, password)),
  onAuthWithFacebook: (token) => dispatch(actions.authWithFacebook(token)),
  onAuthWithPhone: (token) => dispatch(actions.authWithPhone(token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);