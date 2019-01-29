import React, { Component } from 'react';
import { View, Alert, LayoutAnimation, KeyboardAvoidingView } from 'react-native';
import { Content } from 'native-base';

import i18n from '../../i18n';
import { TextInput, Modal, Button } from '../common';
import { brandDark, brandLight } from '../../config/variables';
import axios from '../../config/axios';
import { validateForm, checkValidity } from '../../util/utility';

const formType = 'emailModal';

class ChangeEmail extends Component {
  state = {
    formTouched: false,
    saving: false,
    form: {
      password: {
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
      }
    },
  }
  onSubmit = async () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
    this.setState({ formTouched: true });
    const { formIsValid, data } = validateForm({ ...this.state.form });
    if (formIsValid) {
      try {
        this.setState({ saving: true });
        data.customer_id = this.props.user.customer_id;
        const { customer } = await axios.post('customer/update-email', data);
        this.setState({ saving: false });
        this.props.onUpdateProfile(customer);
        this.props.updateLocalProfile(customer, 'email');
        this.onUpdatedSuccess();
      } catch (error) {
        this.setState({ saving: false });
        if (error.message === "Password incorrect") {
          error.message = i18n.t('account.profile.currentPasswordIsIncorrect')
        }
        if (error.message === "Email address already exists") {
          error.message = i18n.t('account.valid.emailExisted')
        }
        Alert.alert(i18n.t('global.error'), error.message);
      }
    }
  }
  onUpdatedSuccess = () => {
    Alert.alert(i18n.t('global.notification'),
      i18n.t('global.updatedSuccessfully'),
      [{
        text: i18n.t('global.ok'),
        onPress: () => this.props.setModalVisible(formType)
      }]
    );
  }
  inputChangeHandler = (value, key) => {
    const form = { ...this.state.form };
    form[key].value = value;
    if (this.state.formTouched) {
      const validation = form[key].validation;
      form[key].inValid = !checkValidity(value, validation, form);
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
    this.setState({ form });
  }
  render() {
    return (
      <Modal
        visible={this.props.modalVisible}
        onRequestClose={() => this.props.setModalVisible(formType)}
        title={i18n.t('account.changeEmail')}
      >
        <Content style={{ paddingHorizontal: 25, backgroundColor: brandLight }}>
          <KeyboardAvoidingView>
            <View style={{ paddingTop: 20 }}>
              <TextInput
                label={i18n.t('account.profile.currentPassword')}
                returnKeyType="next"
                value={this.state.form.password.value}
                secureTextEntry
                inValid={this.state.form.password.inValid}
                errorMessage={i18n.t('account.valid.passwordRequired')}
                icon={{ name: 'ios-lock' }}
                onChangeText={(value) => this.inputChangeHandler(value, 'password')} />
              <TextInput
                value={this.state.form.email.value}
                onChangeText={email => this.inputChangeHandler(email, 'email')}
                label={i18n.t('account.profile.newEmailAddress')}
                autoCapitalize="none"
                returnKeyType="next"
                icon={{ name: 'ios-mail' }}
                keyboardType="email-address"
                inValid={this.state.form.email.inValid}
                errorMessage={i18n.t('account.valid.email')}
              />
              <View style={{ flex: 1, alignItems: 'center', marginTop: 25 }}>
                <Button
                  loading={this.state.saving}
                  buttonStyle={{ minWidth: 200, marginTop: 0 }}
                  onPress={this.onSubmit}
                  title={i18n.t('global.submit')} />
              </View>
            </View>
          </KeyboardAvoidingView>
        </Content>
      </Modal>
    );
  }
}

export default ChangeEmail;
