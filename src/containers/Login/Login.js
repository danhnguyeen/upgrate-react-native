import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Alert,
  TextInput,
  Animated,
  Easing,
  ScrollView,
  Keyboard,
  ActivityIndicator,
  AsyncStorage,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { Button } from 'react-native-elements';
import AccountKit, { Color } from "react-native-facebook-account-kit";
import { StackActions, NavigationActions } from 'react-navigation';
import SplashScreen from 'react-native-splash-screen';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import Icon from 'react-native-vector-icons/Ionicons';

import { validateForm, checkValidity } from '../../util/utility';
import background from '../../assets/background.jpg';
import logo from '../../assets/logo.png';
import i18n from '../../i18n';
import * as actions from '../../stores/actions';
import { OutlineButton, KeyboardScrollView } from '../../components/common';
import {
  brandDark,
  brandLight,
  textColor,
  textDarkColor,
  DEVICE_WIDTH,
  brandPrimary,
  DEVICE_HEIGTH,
  fontSize,
  isIphoneX
} from '../../config/variables';

class Login extends Component {
  state = {
    pictureAnim: new Animated.Value(0),
    formAnim: new Animated.Value(0),
    form: {
      email: {
        value: '',
        validation: {
          required: true
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
    formIsValid: true
  };

  componentDidMount() {
    this.configureAccountKit();
    if (this.props.isAuth) {
      this._onLoginSuccess();
    }
    setTimeout(() => {
      SplashScreen.hide();
    }, 300);
    Animated.loop(Animated.timing(this.state.pictureAnim, {
      toValue: 2,
      duration: 60000,
      easing: Easing.easeOutCubic
    })).start();

    Animated.timing(this.state.formAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.easeOutCubic
    }).start();
  }
  configureAccountKit() {
    AccountKit.configure({
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
  onLoginFacebook = async () => {
    try {
      await LoginManager.logOut();
      const result = await LoginManager.logInWithReadPermissions(['email', 'public_profile']);
      if (result.isCancelled) {
        this.setState({ checkLogin: false });
      } else {
        this.setState({ checkLogin: true });
        const data = await AccessToken.getCurrentAccessToken();
        const token = data.accessToken.toString();
        try {
          const result = await this.props.onAuthWithFacebook(token);
          if (this.props.isAuth) {
            this._onLoginSuccess();
          } else {
            this.setState({ checkLogin: false, submiting: false });
            this.props.navigation.navigate('SignUp', { loginType: 'facebook', name: result.username });
          }
        } catch (err) {
          this.setState({ submiting: false, checkLogin: false });
          this.onLoginFailed(err);
        }
      }
    } catch (e) {
      this.setState({ checkLogin: false });
    }
  }
  onLoginWithPhone = async () => {
    try {
      const result = await AccountKit.loginWithPhone();
      this.setState({ checkLogin: true });
      try {
        const res = await this.props.onAuthWithPhone(result.token);
        this.setState({ submiting: false });
        if (this.props.isAuth) {
          this._onLoginSuccess();
        } else {
          this.setState({ checkLogin: false, submiting: false });
          this.props.navigation.navigate('SignUp', { loginType: 'account_kit' });
        }
      } catch (err) {
        this.setState({ submiting: false, checkLogin: false });
        this.onLoginFailed(err);
      }
    } catch (err) {
      this.setState({ checkLogin: false });
    }
  }
  onLoginFailed = (error) => {
    Alert.alert(
      i18n.t('login.loginFail'),
      error.msg,
      [{ text: i18n.t('login.loginFailBtn') }],
      { cancelable: false }
    );
  }
  onSubmitLogin = async () => {
    this.setState({ formTouched: true });
    const { formIsValid } = validateForm({ ...this.state.form });
    if (formIsValid) {
      this.setState({ submiting: true });
      try {
        await this.props.onAuth(this.state.form.email.value, this.state.form.password.value);
        this.setState({ submiting: false });
        this._onLoginSuccess();
      } catch (err) {
        this.setState({ submiting: false });
        if (err.msg === 'incorrect_email_password') {
          err.msg = i18n.t('login.loginFailMsg');
        }
        this.onLoginFailed(err);
      }
    }
  }
  _onLoginSuccess = () => {
    AsyncStorage.setItem('token', this.props.isAuth);
    // const resetAction = StackActions.reset({
    //   index: 0,
    //   key: null,
    //   actions: [NavigationActions.back()],
    // });
    this.props.navigation.dispatch(NavigationActions.back())
    // this.props.navigation.dispatch(resetAction);
  }

  closeLoginFailMsg = () => {
    this.props.resetAuthFailError();
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

  gotoSignup = () => {
    // const resetAction = StackActions.reset({
    //   index: 0,
    //   key: null,
    //   actions: [NavigationActions.navigate({ routeName: 'Register' })],
    // });
    // this.props.navigation.dispatch(resetAction);
    this.props.navigation.navigate('Register');
  }

  render() {
    const linearGradientColors = [
      'transparent',
      'rgba(33, 43, 52, 0.4)',
      'rgba(33, 43, 52, 0.7)',
      'rgba(33, 43, 52, 0.9)',
      'rgba(33, 43, 52, 0.95)',
      // brandLight,
      brandLight,
      brandLight,
      brandLight,
    ];
    let form = (
      <View style={{ width: '100%', minHeight: 245, justifyContent: 'center', alignItems: 'center' }}>
        <TextInput
          value={this.state.form.email.value}
          onChangeText={email => this.inputChangeHandler(email, 'email')}
          placeholder={i18n.t('login.email')}
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="next"
          style={styles.textInput}
          placeholderTextColor={textDarkColor}
          underlineColorAndroid='transparent' />
        <TextInput
          value={this.state.form.password.value}
          onChangeText={password => this.inputChangeHandler(password, 'password')}
          placeholder={i18n.t('login.password')}
          secureTextEntry
          autoCapitalize="none"
          returnKeyType='done'
          onSubmitEditing={Keyboard.dismiss}
          style={styles.textInput}
          placeholderTextColor={textDarkColor}
          underlineColorAndroid='transparent' />
        <OutlineButton
          loading={this.state.submiting}
          containerStyle={{ width: 200 }}
          onPress={this.onSubmitLogin}
          title={i18n.t('login.signIn')} />
        <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 10 }}>
          <View style={{ flex: 1, marginRight: 5 }}>
            <OutlineButton
              titleStyle={{ color: 'white' }}
              buttonStyle={{ margin: 0, borderColor: '#4066b4', backgroundColor: '#4066b4' }}
              onPress={this.onLoginFacebook}
              title='Facebook' />
          </View>
          <View style={{ flex: 1, marginLeft: 5 }}>
            <OutlineButton
              titleStyle={{ color: 'white' }}
              buttonStyle={{ margin: 0, borderColor: brandPrimary, backgroundColor: brandPrimary }}
              onPress={this.onLoginWithPhone}
              title={i18n.t('login.phoneNumber')} />
          </View>
        </View>
      </View>
    );
    if (this.state.checkLogin) {
      form = <ActivityIndicator style={{ height: 245 }} size="large" color={brandPrimary} />
    }
    return (
      <View style={styles.container}>
        <ScrollView scrollEnabled={false}>
          <Animated.View style={{
            opacity: 1,
            top: this.state.pictureAnim.interpolate({
              inputRange: [0, 1, 2],
              outputRange: [0, -350, 0],
            })
          }}>
            <Image source={background}
              style={styles.imageBackground}
              resizeMode="contain"
            />
          </Animated.View>
        </ScrollView>
        <View style={styles.formContainer}>
          <LinearGradient
            colors={linearGradientColors}
            style={{ height: DEVICE_HEIGTH }}
          >
            <KeyboardScrollView>
              <View style={{ flex: 1, justifyContent: 'flex-end', height: DEVICE_HEIGTH }}>
                <Animated.View style={{
                  opacity: this.state.formAnim,
                  bottom: this.state.formAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-80, 0]
                  }),
                  width: '100%',
                  alignItems: 'center'
                }}>
                  <View style={{ width: '100%', alignItems: 'center' }}>
                    <Image
                      source={logo}
                      style={styles.logoStyle}
                    />
                    <View style={{ width: '100%', alignItems: 'center', paddingHorizontal: 25, paddingBottom: 10 }}
                      onLayout={(event) => this.setState({ formHeight: event.nativeEvent.layout.height })}>
                      {form}
                      <View style={styles.helpContainer}>
                        <Button
                          clear
                          title={i18n.t('login.signUp')}
                          titleStyle={styles.helperText}
                          onPress={() => this.gotoSignup()}
                        />
                        <Button
                          clear
                          title={i18n.t('login.forgetPassword')}
                          titleStyle={styles.helperText}
                          onPress={() => this.props.navigation.push('ForgetPassword')}
                        />
                      </View>
                    </View>
                  </View>
                </Animated.View>
              </View>
            </KeyboardScrollView>
          </LinearGradient>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: brandLight,
  },
  formContainer: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    alignSelf: 'flex-end',
    width: '100%',
    height: DEVICE_HEIGTH
  },
  imageBackground: {
    width: DEVICE_WIDTH,
    height: DEVICE_WIDTH * 4186 / 1400
  },
  logoStyle: {
    width: 170,
    height: 170,
    marginBottom: 50
    // marginTop: 180
  },
  textInput: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: brandDark,
    marginTop: 10,
    paddingHorizontal: 15,
    color: textColor,
    paddingVertical: 12,
    borderRadius: 2,
    fontSize: fontSize + 1
  },
  helpContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: isIphoneX ? 25 : 5
  },
  helperText: {
    color: textColor,
    fontWeight: 'normal',
    fontSize
  }
});

const mapStateToProps = state => ({
  user: state.auth.user,
  loading: state.auth.loading,
  isAuth: state.auth.token,
  error: state.auth.error,
  deviceWidth: state.appState.deviceWidth,
  deviceHeight: state.appState.deviceHeight,
});

const mapDispatchToProps = dispatch => ({
  onAuth: (username, password) => dispatch(actions.auth(username, password)),
  onCheckEmail: (email, callback) => dispatch(actions.authCheckEmail(email, callback)),
  onAuthWithFacebook: (token) => dispatch(actions.authWithFacebook(token)),
  onAuthWithPhone: (token) => dispatch(actions.authWithPhone(token)),
  resetAuthFailError: () => dispatch(actions.resetAuthFailError())
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
