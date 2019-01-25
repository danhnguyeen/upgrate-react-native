import React, { Component } from 'react';
import { View, Alert, LayoutAnimation, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
import { Content } from 'native-base';

import i18n from '../../i18n';
import { TextInput, Modal, Button } from '../common';
import { brandDark, brandLight } from '../../config/variables';
import axios from '../../config/axios';
import { validateForm, checkValidity } from '../../util/utility';

const formType = 'passwordModal';

class ChangePassword extends Component {
  state = {
    formTouched: false,
    saving: false,
    form: {
      password_old: {
        value: '',
        validation: {
          required: true
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
      }
    }
  }
  onSubmit = async () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
    this.setState({ formTouched: true });
    const { formIsValid, data } = validateForm({ ...this.state.form });
    if (formIsValid) {
      try {
        this.setState({ saving: true });
        data.customer_id = this.props.user.customer_id;
        await axios.post('customer/update-password', data);
        this.setState({ saving: false });
        this.onUpdatedSuccess();
      } catch (error) {
        this.setState({ saving: false });
        if (error.message === "Password incorrect") {
          error.message = i18n.t('account.profile.currentPasswordIsIncorrect')
        }
        Alert.alert(i18n.t('global.error'), error.message);
      }
    }
  }
  inputChangeHandler = (value, key) => {
    const form = { ...this.state.form };
    form[key].value = value;
    if (this.state.formTouched) {
      const validation = form[key].validation;
      if (validation && validation.isEqualTo) {
        const equalToObj = form[validation.isEqualTo];
        form[validation.isEqualTo].inValid = !checkValidity(equalToObj.value, equalToObj.validation, form);
      }
      form[key].inValid = !checkValidity(value, validation, form);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
    }
    this.setState({ form });
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
  render() {
    return (
      <Modal
        visible={this.props.modalVisible}
        onRequestClose={() => this.props.setModalVisible(formType)}
        title={i18n.t('account.changePassword')}
      >
        <Content style={{ paddingHorizontal: 25, backgroundColor: brandLight }}>
          <KeyboardAvoidingView>
            <View style={{ paddingTop: 20 }}>
              <TextInput
                label={i18n.t('account.profile.currentPassword')}
                returnKeyType="next"
                value={this.state.form.password_old.value}
                secureTextEntry
                inValid={this.state.form.password_old.inValid}
                errorMessage={i18n.t('account.valid.currentPassword')}
                icon={{ name: 'ios-lock' }}
                onChangeText={(value) => this.inputChangeHandler(value, 'password_old')} />
              <TextInput
                label={i18n.t('account.profile.newPassword')}
                returnKeyType="next"
                value={this.state.form.password.value}
                secureTextEntry
                inValid={this.state.form.password.inValid}
                errorMessage={i18n.t('account.valid.newPassword')}
                icon={{ name: 'ios-lock' }}
                onChangeText={(value) => this.inputChangeHandler(value, 'password')} />
              <TextInput
                label={i18n.t('account.profile.confirmPassword')}
                returnKeyType="next"
                secureTextEntry
                value={this.state.form.confirmPassword.value}
                inValid={this.state.form.confirmPassword.inValid}
                errorMessage={i18n.t('account.valid.confirmPassword')}
                icon={{ name: 'ios-lock' }}
                onChangeText={(value) => this.inputChangeHandler(value, 'confirmPassword')} />
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

const mapStateToProps = state => {
  return {
    user: state.auth.user
  };
}
export default connect(mapStateToProps)(ChangePassword);
