import React, { Component } from 'react';
import { AsyncStorage, StyleSheet, TouchableOpacity, View, KeyboardAvoidingView, Alert } from 'react-native';
import { Content, Text, Icon, ActionSheet } from 'native-base';
import { connect } from 'react-redux';
import FCM from 'react-native-fcm';
import DeviceInfo from 'react-native-device-info';
import { StackActions, NavigationActions } from 'react-navigation';

import { TextInput, Button } from '../../components/common';
import * as actions from '../../stores/actions';
import { _dispatchStackActions, isEmpty, validateForm, checkValidity, capitalize } from '../../util/utility';
import { backgroundColor, brandPrimary } from '../../config/variables';
import i18n from '../../i18n';

class SignUp extends Component {
  state = {
    formTouched: false,
    form: {
      first_name: {
        value: '',
        validation: {
          required: true
        }
      },
      last_name: {
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
      mobile_phone: {
        value: '',
        validation: {
          required: true,
          isPhone: true
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
      gender: { value: '' }
    },
    submiting: false,
    formIsValid: true,
  }
  onSubmit = async () => {
    this.setState({ formTouched: true });
    const { formIsValid, data } = validateForm({ ...this.state.form });
    if (formIsValid) {
      try {
        this.setState({ submiting: true });
        data.provider = this.props.provider;
        data.provider_user_id = this.props.provider_user_id;
        await this.props.onSignUp(data);
        this.setState({ submiting: false });
        AsyncStorage.setItem('token', this.props.isAuth);
        this.onSignUpSuccess();
      } catch (e) {
        console.log(e)
        this.setState({ submiting: false });
        this.onSignUpFailed(e);
      }
    }
  }
  onSignUpSuccess = () => {
    this.updateNotificationToken();
    this.props.navigation.dispatch(StackActions.reset({
      index: 0, key: null,
      actions: [NavigationActions.navigate({
        routeName: 'Main',
        action: NavigationActions.navigate({ routeName: 'Account' })
      })]
    }));
  }
  onSignUpFailed = (error) => {
    if (error.message === 'Email address already exists') {
      error.message = i18n.t('account.valid.emailExisted');
    }
    if (error.message === 'Mobile phone already exists') {
      error.message = i18n.t('account.valid.phoneExisted');
    }
    Alert.alert(
      i18n.t('global.error'),
      error.message,
      [{ text: i18n.t('global.ok') }],
      { cancelable: false }
    );
  }
  updateNotificationToken = async () => {
    const token = await FCM.getFCMToken().then(token => {
      return token;
    });
    if (token && this.props.isAuth) {
      const uniqueId = DeviceInfo.getUniqueID();
      this.props.updateFCMToken(this.props.user.customer_id, token, uniqueId);
    }
  }
  _onSignUpFailed = (error) => {
    Alert.alert(
      i18n.t('account.loginFail'),
      error.message,
      [{ text: i18n.t('global.ok') }],
      { cancelable: false }
    );
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
  showActionSheet = () => {
    this.ActionSheet._root.showActionSheet({
      options: [i18n.t('account.male'), i18n.t('account.female'), i18n.t('account.other'), i18n.t('global.cancel')],
      cancelButtonIndex: 3,
      destructiveButtonIndex: 2,
      title: i18n.t('account.yourGender')
    },
      gender => this.inputChangeHandler(gender, 'gender')
    );
  }
  render() {
    const { isFetching, dataRegister, alertModal, provinceSelected, districtSelected } = this.state
    return (
      <View style={{ flex: 1, backgroundColor }}>
        <Content padder>
          <KeyboardAvoidingView>
            <View style={{ paddingHorizontal: 15 }}>
              <TextInput
                value={this.state.form.last_name.value}
                onChangeText={last_name => this.inputChangeHandler(last_name, 'last_name')}
                label={i18n.t('account.lastName')}
                returnKeyType="next"
                icon={{ name: 'user', type: 'EvilIcons', size: 28 }}
                inValid={this.state.form.last_name.inValid}
                errorMessage={i18n.t('account.valid.lastName')}
              />
              <TextInput
                value={this.state.form.first_name.value}
                onChangeText={first_name => this.inputChangeHandler(first_name, 'first_name')}
                label={i18n.t('account.firstName')}
                returnKeyType="next"
                icon={{ name: 'user', type: 'EvilIcons', size: 28 }}
                inValid={this.state.form.first_name.inValid}
                errorMessage={i18n.t('account.valid.firstName')}
              />
              <TextInput
                value={this.state.form.email.value}
                onChangeText={email => this.inputChangeHandler(email, 'email')}
                label={i18n.t('account.email')}
                autoCapitalize="none"
                returnKeyType="next"
                icon={{ name: 'envelope', type: 'EvilIcons', size: 28 }}
                keyboardType="email-address"
                inValid={this.state.form.email.inValid}
                errorMessage={i18n.t('account.valid.email')}
              />
              <TextInput
                value={this.state.form.mobile_phone.value}
                onChangeText={mobile_phone => this.inputChangeHandler(mobile_phone, 'mobile_phone')}
                label={i18n.t('account.phoneNumber')}
                autoCapitalize="none"
                returnKeyType="next"
                icon={{ name: 'phone', type: 'SimpleLineIcons', size: 22 }}
                keyboardType="phone-pad"
                inValid={this.state.form.mobile_phone.inValid}
                errorMessage={i18n.t('account.valid.phone')}
              />
              <TextInput
                label={i18n.t('account.profile.password')}
                returnKeyType="next"
                value={this.state.form.password.value}
                secureTextEntry
                inValid={this.state.form.password.inValid}
                errorMessage={i18n.t('account.valid.password')}
                icon={{ name: 'lock', type: 'SimpleLineIcons', size: 22 }}
                onChangeText={(value) => this.inputChangeHandler(value, 'password')} />
              <TextInput
                label={i18n.t('account.confirmPassword')}
                returnKeyType="next"
                secureTextEntry
                value={this.state.form.confirmPassword.value}
                inValid={this.state.form.confirmPassword.inValid}
                errorMessage={i18n.t('account.valid.confirmPassword')}
                icon={{ name: 'lock', type: 'SimpleLineIcons', size: 22 }}
                onChangeText={(value) => this.inputChangeHandler(value, 'confirmPassword')} />
              <TouchableOpacity onPress={this.showActionSheet}>
                <View pointerEvents="none">
                  <TextInput
                    value={
                      this.state.form.gender.value === 0 || this.state.form.gender.value === 1 ?
                        capitalize((this.state.form.gender.value === 0 ? i18n.t('account.male') : i18n.t('account.female')))
                        : null
                    }
                    icon={{ name: 'human-male-female', type: 'MaterialCommunityIcons' }}
                    label={i18n.t('account.gender')}
                  />
                </View>
              </TouchableOpacity>
              <ActionSheet ref={o => this.ActionSheet = o} />
              <View style={{ alignContent: 'center', alignItems: 'center', justifyContent: 'center', paddingVertical: 10 }}>
                <Button
                  onPress={this.onSubmit}
                  loading={this.state.submiting}
                  buttonStyle={{ minWidth: 200 }}
                  title={i18n.t('account.signUp')}
                />
                <TouchableOpacity style={{ margin: 10 }} activeOpacity={0.6}
                  onPress={() => { this.props.navigation.push('SignIn') }}>
                  <Text style={{ color: brandPrimary }}>{i18n.t('account.goToSignIn')}</Text>
                </TouchableOpacity>
              </View>
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
  },
  buttonText: {
    color: brandPrimary,
    textAlign: 'center'
  },
  button: {
    backgroundColor: brandPrimary,
    justifyContent: 'center',
    alignSelf: "center",
    // marginVertical: 20,
    // width: winW(100),
  },
  email: {
    //marginBottom: h(4.5),
  },
  headerContainer: {
    borderBottomColor: '#f2f2f2',
    borderBottomWidth: 1,
    margin: 0,
    paddingBottom: 5,
    flexDirection: 'row',
    // justifyContent: 'center',
  },
  headerIcon: {
    flex: 0.2,
    justifyContent: 'center',
    // alignItems: 'flex-start',
  },
  left: {
    paddingLeft: 20,
  },
  right: {
    paddingRight: 20,
    alignItems: 'flex-end',
  },
  headerTitle: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  title: {
    color: "#FFF",
    fontSize: 18,
    lineHeight: 40,
    fontWeight: "500",
  },
  icon: {
    color: "#fff",
    fontSize: 30,
    // lineHeight: 30,
  },
})



const mapStateToProps = state => ({
  isAuth: state.auth.token,
  user: state.auth.user
});

const mapDispatchToProps = dispatch => ({
  onSignUp: (dataRegister) => dispatch(actions.authSignUp(dataRegister)),
  updateFCMToken: (customer_id, token, uniqueId) => dispatch(actions.updateNotificationToken(customer_id, token, uniqueId))
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);