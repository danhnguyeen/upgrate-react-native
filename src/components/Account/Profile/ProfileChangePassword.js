import React, { Component } from 'react';
import { View, Alert, LayoutAnimation } from 'react-native';
import { connect } from 'react-redux';

import i18n from '../../../i18n';
import { FormInput, KeyboardScrollView, OutlineButton, Modal } from '../../common';
import { brandDark, brandLight } from '../../../config/variables';
import axios from '../../../config/axios-mylife';
import { validateForm, checkValidity } from '../../../util/utility';

const formType = 'passwordModal';

class ProfileChangePassword extends Component {
  state = {
    formTouched: false,
    saving: false,
    form: {
      currentPassword: {
        value: '',
        validation: {
          required: true
        }
      },
      newPassword: {
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
          isEqualTo: 'newPassword'
        }
      }
    }
  }
  onSubmit = async () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
    this.setState({ formTouched: true });
    const { form, formIsValid } = validateForm({ ...this.state.form });
    if (formIsValid) {
      try {
        this.setState({ saving: true });
        const data = {
          userId: this.props.user.id
        };
        for (var key in form) {
          if (form.hasOwnProperty(key)) {
            data[key] = form[key].value;
          }
        }
        await axios.post('auth/changePassword', data);
        this.onUpdatedSuccess();
      } catch (error) {
        this.setState({ saving: false });
        if (error.msg === "Wrong password") {
          error.msg = i18n.t('account.profile.currentPasswordIsIncorrect')
        }
        Alert.alert(i18n.t('global.error'), error.msg);
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
        text: i18n.t('register.signUpSuccessBtn'),
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
        <KeyboardScrollView style={{ backgroundColor: brandDark }}>
          <View style={{ paddingHorizontal: 20, paddingTop: 20, marginTop: 10, backgroundColor: brandLight }}>
            <FormInput
              label={i18n.t('account.profile.currentPassword')}
              returnKeyType="next"
              value={this.state.form.currentPassword.value}
              secureTextEntry
              inValid={this.state.form.currentPassword.inValid}
              errorMessage={i18n.t('account.valid.currentPassword')}
              onChangeText={(value) => this.inputChangeHandler(value, 'currentPassword')} />
            <FormInput
              label={i18n.t('account.profile.newPassword')}
              returnKeyType="next"
              value={this.state.form.newPassword.value}
              secureTextEntry
              inValid={this.state.form.newPassword.inValid}
              errorMessage={i18n.t('account.valid.newPassword')}
              onChangeText={(value) => this.inputChangeHandler(value, 'newPassword')} />
            <FormInput
              label={i18n.t('account.profile.confirmPassword')}
              returnKeyType="next"
              secureTextEntry
              value={this.state.form.confirmPassword.value}
              inValid={this.state.form.confirmPassword.inValid}
              errorMessage={i18n.t('account.valid.confirmPassword')}
              onChangeText={(value) => this.inputChangeHandler(value, 'confirmPassword')} />
            <View style={{ flex: 1, alignItems: 'center' }}>
              <OutlineButton
                loading={this.state.saving}
                buttonStyle={{ minWidth: 200, marginTop: 0 }}
                onPress={this.onSubmit}
                title={i18n.t('global.submit')} />
            </View>
          </View>
        </KeyboardScrollView>
      </Modal>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth.user
  };
}
export default connect(mapStateToProps)(ProfileChangePassword);
