import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Alert
} from 'react-native';

import { validateForm, checkValidity } from '../../util/utility';
import i18n from '../../i18n';
import { OutlineButton, TextInputUnderline, KeyboardScrollView } from '../../components/common';
import { brandPrimary, lightBackground } from '../../config/variables';
import axios from '../../config/axios-mylife';

class ForgetPassword extends Component {
  static navigationOptions = () => {
    return {
      title: i18n.t('login.forgetPassword')
    };
  };

  state = {
    form: {
      email: {
        value: '',
        validation: {
          required: true,
          isEmail: true
        }
      }
    }
  };

  onSubmit = async () => {
    try {
      this.setState({ formTouched: true });
      const { formIsValid } = validateForm({ ...this.state.form });
      if (formIsValid) {
        this.setState({ saving: true });
        await axios.post('auth/forgotPassword', { email: this.state.form.email.value });
        this.setState({ saving: false });
        this.props.navigation.goBack();
        Alert.alert(i18n.t('login.resetPassSuccess'), i18n.t('login.pleaseCheckEmail'));
      }
    } catch (error) {
      let message = error.msg;
      if (error.msg === 'email_not_found') {
        message = i18n.t('login.emailNotFound')
      }
      this.setState({ saving: false });
      Alert.alert(i18n.t('global.error'), message);
    }
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
      <View style={{ flex: 1, backgroundColor: '#fafbfc' }}>
        <KeyboardScrollView>
          <View style={styles.container}>
            <TextInputUnderline
              label={i18n.t('login.email')}
              autoCapitalize="none"
              keyboardType="email-address"
              value={this.state.form.email.value}
              inValid={this.state.form.email.inValid}
              errorMessage={i18n.t('global.valid.email')}
              onChangeText={(value) => this.inputChangeHandler(value, 'email')} />
            <OutlineButton
              disabled={this.state.saving}
              onPress={this.onSubmit}
              title={i18n.t('global.send')}
              buttonStyle={{ backgroundColor: brandPrimary, margin: 0, marginTop: 20 }}
              titleStyle={{ color: 'white' }} />
          </View>
        </KeyboardScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 30,
    backgroundColor: lightBackground
  }
});


export default ForgetPassword;