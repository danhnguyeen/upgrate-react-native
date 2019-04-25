import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Alert,
  Animated,
  Easing,
  TextInput,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { Button } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import DatePicker from 'react-native-datepicker';
import ActionSheet from 'react-native-actionsheet'
import moment from 'moment';
import { StackActions, NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';

import { checkValidity, capitalize, validateForm } from '../../util/utility';
import background from '../../assets/background.jpg';
import logo from '../../assets/logo.png';
import i18n from '../../i18n';
import axios from '../../config/axios-mylife';
import { OutlineButton, KeyboardScrollView } from '../../components/common';
import {
  brandDark,
  brandLight,
  textColor,
  textDarkColor,
  DEVICE_WIDTH,
  DEVICE_HEIGTH,
  fontSize,
  brandDanger,
  isIphoneX,
  inputFontSize
} from '../../config/variables';

class Register extends Component {
  state = {
    pictureAnim: new Animated.Value(0),
    formAnim: new Animated.Value(0),
    form: {
      fullname: {
        value: '',
        validation: {
          required: true
        }
      },
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
          required: true,
          isEqualTo: 'confirmPassword'
        }
      },
      confirmPassword: {
        value: '',
        validation: {
          required: true,
          isEqualTo: 'password'
        }
      },
      gender: {
        value: '',
      },
      dateOfBirth: {
        value: '',
      },
      phone: {
        value: '',
        validation: {
          required: true,
          isPhone: true
        }
      }
    },
    inputHeight: 40,
    formTouched: false,
    isAuthenticated: false,
    saving: false,
    loading: false
  };

  componentDidMount() {
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
  inputChangeHandler = (value, key) => {
    const form = { ...this.state.form };
    if (key === 'gender' && value === 3) {
      return;
    }
    if (key === 'gender' && value === 2) {
      value = null;
    }
    form[key].value = value;
    if (this.state.formTouched) {
      const validation = form[key].validation;
      if (validation && validation.isEqualTo) {
        const equalToObj = form[validation.isEqualTo];
        form[validation.isEqualTo].inValid = !checkValidity(equalToObj.value, equalToObj.validation, form);
      }
      form[key].inValid = !checkValidity(value, validation, form);
    }
    this.setState({ form });
  }

  goToSignIn = () => {
    // const resetAction = StackActions.reset({
    //   index: 0,
    //   key: null,
    //   actions: [NavigationActions.navigate({ routeName: 'login' })],
    // });
    // this.props.navigation.dispatch(resetAction);
    this.props.navigation.goBack(null);
  }

  submitSignUp = async () => {
    this.setState({ formTouched: true });
    const { form, formIsValid } = validateForm({ ...this.state.form });
    if (formIsValid) {
      try {
        this.setState({ saving: true });
        const data = {};
        for (var key in form) {
          if (form.hasOwnProperty(key)) {
            data[key] = form[key].value;
          }
        }
        if (data.dateOfBirth) {
          data.dateOfBirth = moment(data.dateOfBirth, 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        await axios.post('auth/signUp', data);
        this.setState({ saving: false });
        this.onSignUpSuccess();

      } catch (error) {
        this.onSignUpError(error);
      }
    }
  }

  showActionSheet = () => {
    this.ActionSheet.show();
  }
  onSignUpSuccess = () => {
    Alert.alert(
      i18n.t('global.notification'),
      i18n.t('register.signUpSuccess'),
      [
        {
          text: i18n.t('register.signUpSuccessBtn'),
          onPress: () => this.goToSignIn()
        }
      ],
      { cancelable: false }
    );
  }
  onSignUpError = (error) => {
    let message = error.msg;
    if (message && message.includes('Existed')) {
      message = i18n.t('register.accountExisted');
    }
    this.setState({ saving: false });
    Alert.alert(
      i18n.t('register.signUpFail'),
      message,
      [
        {
          text: i18n.t('global.ok'),
          onPress: () => { }
        }
      ],
      { cancelable: false }
    );
  }
  render() {
    const linearGradientColors = [
      'transparent',
      'rgba(33, 43, 52, 0.4)',
      'rgba(33, 43, 52, 0.7)',
      'rgba(33, 43, 52, 0.9)',
      'rgba(33, 43, 52, 0.95)',
      brandLight,
      brandLight,
      brandLight,
      brandLight
    ];
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
                    <View style={{ width: '100%', alignItems: 'center', paddingHorizontal: 25, paddingBottom: 10 }}>
                      <TextInput
                        onLayout={(event) => this.setState({ inputHeight: event.nativeEvent.layout.height })}
                        value={this.state.form.fullname.value}
                        onChangeText={fullname => this.inputChangeHandler(fullname, 'fullname')}
                        placeholder={i18n.t('register.name')}
                        returnKeyType="next"
                        style={[styles.textInput, this.state.form.fullname.inValid ? { borderBottomColor: brandDanger, borderBottomWidth: 0.5 } : {}]}
                        placeholderTextColor={textDarkColor}
                        underlineColorAndroid='transparent' />
                      <TextInput
                        value={this.state.form.email.value}
                        onChangeText={email => this.inputChangeHandler(email, 'email')}
                        placeholder={i18n.t('register.email')}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        returnKeyType="next"
                        style={[styles.textInput, this.state.form.email.inValid ? { borderBottomColor: brandDanger, borderBottomWidth: 0.5 } : {}]}
                        placeholderTextColor={textDarkColor}
                        underlineColorAndroid='transparent' />
                      <TextInput
                        value={this.state.form.phone.value}
                        onChangeText={phone => this.inputChangeHandler(phone, 'phone')}
                        placeholder={i18n.t('register.phone')}
                        autoCapitalize="none"
                        keyboardType="phone-pad"
                        returnKeyType="next"
                        style={[styles.textInput, this.state.form.phone.inValid ? { borderBottomColor: brandDanger, borderBottomWidth: 0.5 } : {}]}
                        placeholderTextColor={textDarkColor}
                        underlineColorAndroid='transparent' />
                      <TextInput
                        value={this.state.form.password.value}
                        onChangeText={password => this.inputChangeHandler(password, 'password')}
                        placeholder={i18n.t('register.password')}
                        autoCapitalize="none"
                        secureTextEntry
                        returnKeyType="next"
                        style={[styles.textInput, this.state.form.password.inValid ? { borderBottomColor: brandDanger, borderBottomWidth: 0.5 } : {}]}
                        placeholderTextColor={textDarkColor}
                        underlineColorAndroid='transparent' />
                      <TextInput
                        value={this.state.form.confirmPassword.value}
                        onChangeText={confirmPassword => this.inputChangeHandler(confirmPassword, 'confirmPassword')}
                        placeholder={i18n.t('register.confirmPassword')}
                        autoCapitalize="none"
                        secureTextEntry
                        returnKeyType="next"
                        style={[styles.textInput, this.state.form.confirmPassword.inValid ? { borderBottomColor: brandDanger, borderBottomWidth: 0.5 } : {}]}
                        placeholderTextColor={textDarkColor}
                        underlineColorAndroid='transparent' />
                      <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                        <TouchableOpacity onPress={this.showActionSheet} style={{ flex: 1, paddingRight: 5 }}>
                          <TextInput
                            value={
                              this.state.form.gender.value === 0 || this.state.form.gender.value === 1 ?
                                capitalize((this.state.form.gender.value === 0 ? i18n.t('register.female') : i18n.t('register.male')))
                                : ''
                            }
                            onTouchStart={() => this.showActionSheet()}
                            editable={false}
                            placeholder={i18n.t('register.gender')}
                            autoCapitalize="none"
                            keyboardType="phone-pad"
                            returnKeyType="next"
                            style={[styles.textInput, { width: '100%', paddingRight: 5 }]}
                            placeholderTextColor={textDarkColor}
                            underlineColorAndroid='transparent' />
                          <ActionSheet
                            ref={o => this.ActionSheet = o}
                            title={i18n.t('register.yourGender')}
                            options={[i18n.t('register.female'), i18n.t('register.male'), i18n.t('register.other'), i18n.t('global.cancel')]}
                            cancelButtonIndex={3}
                            destructiveButtonIndex={2}
                            onPress={gender => this.inputChangeHandler(gender, 'gender')}
                          />
                        </TouchableOpacity>
                        <DatePicker
                          date={this.state.form.dateOfBirth.value}
                          showIcon={false}
                          placeholder={i18n.t('register.birthday')}
                          format="DD/MM/YYYY"
                          confirmBtnText={i18n.t('booking.bookATable.confirm')}
                          cancelBtnText={i18n.t('booking.bookATable.cancel')}
                          androidMode={'spinner'}
                          style={[styles.pickerInput, {
                            height: this.state.inputHeight,
                          }]}
                          customStyles={{
                            dateInput: {
                              borderWidth: 0,
                              borderRadius: 2,
                              paddingHorizontal: 10,
                              alignItems: 'flex-start'
                            },
                            dateText: styles.textDatePicker,
                            placeholderText: {
                              color: textDarkColor,
                              fontSize: fontSize + 1
                            }
                          }}
                          onDateChange={(dateOfBirth) => this.inputChangeHandler(dateOfBirth, 'dateOfBirth')}
                        />
                      </View>
                      <OutlineButton
                        loading={this.state.saving}
                        containerStyle={{ minWidth: 200 }}
                        buttonStyle={{ marginBottom: 10, marginTop: 5 }}
                        onPress={() => this.submitSignUp()}
                        title={i18n.t('register.signUp')} />
                      <View style={styles.helpContainer}>
                        <Button
                          clear
                          title={i18n.t('register.signIn')}
                          titleStyle={styles.helperText}
                          onPress={() => this.goToSignIn()}
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
    backgroundColor: brandLight
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
    marginBottom: 30
  },
  textInput: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: brandDark,
    marginBottom: 8,
    paddingHorizontal: 15,
    color: textColor,
    paddingVertical: 12,
    borderRadius: 2,
    fontSize: fontSize + 1
  },
  pickerInput: {
    width: '50%',
    paddingLeft: 5,
    maxWidth: 200,
    backgroundColor: brandDark,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textDatePicker: {
    color: textColor,
    width: '100%',
    fontSize,
    alignItems: 'center'
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

export default Register;
