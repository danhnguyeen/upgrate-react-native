import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StackActions, NavigationActions } from 'react-navigation';
import { AsyncStorage, StyleSheet, TouchableOpacity, View, KeyboardAvoidingView } from 'react-native';
import { Content, Icon, Text } from "native-base";

import i18n from '../../i18n';
import * as actions from './auth-actions';
import { InputField, Button, TextInput } from '../../components/common';
import { backgroundColor, brandPrimary, brandWarning } from '../../config/variables';
import { validateForm, checkValidity } from '../../util/utility';

class SignUpWithPhoneAndFacebook extends Component {
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
      gender: { value: '' },
      address: { value: '' },
      province_id: { value: '' },
      address: { value: '' }
    },
    checkLogin: false,
    submiting: false,
    formIsValid: true
  }
  componentDidMount() {

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
                value={this.state.form.last_name.value}
                onChangeText={last_name => this.inputChangeHandler(last_name, 'last_name')}
                label={i18n.t('account.lastName')}
                returnKeyType="next"
                inValid={this.state.form.last_name.inValid}
                errorMessage={i18n.t('account.valid.lastName')}
              />
              <TextInput
                value={this.state.form.first_name.value}
                onChangeText={first_name => this.inputChangeHandler(first_name, 'first_name')}
                label={i18n.t('account.firstName')}
                returnKeyType="next"
                inValid={this.state.form.first_name.inValid}
                errorMessage={i18n.t('account.valid.firstName')}
              />
              <TextInput
                value={this.state.form.email.value}
                onChangeText={email => this.inputChangeHandler(email, 'email')}
                label={i18n.t('account.email')}
                autoCapitalize="none"
                returnKeyType="next"
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
                keyboardType="phone-pad"
                inValid={this.state.form.mobile_phone.inValid}
                errorMessage={i18n.t('account.valid.phone')}
              />
            </View>
            <View style={{ flex: 1, alignItems: 'center', paddingVertical: 10 }}>
              <Button
                onPress={this.onLoginWithEmail}
                buttonStyle={{ minWidth: 200 }}
                title={i18n.t('account.signUp')}
              />
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

export default connect(mapStateToProps, mapDispatchToProps)(SignUpWithPhoneAndFacebook);