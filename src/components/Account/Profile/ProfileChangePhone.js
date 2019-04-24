import React, { Component } from 'react';
import { View, Alert, LayoutAnimation } from 'react-native';
import { connect } from "react-redux";
import i18n from '../../../i18n';
import { FormInput, KeyboardScrollView, OutlineButton, Modal } from '../../common';
import { brandDark, brandLight } from '../../../config/variables';
import { validateForm, checkValidity } from '../../../util/utility';
import axios from '../../../config/axios-mylife';
import * as actions from '../../../containers/Login/auth-actions';

const formType = 'phoneModal';

class ProfileChangePhone extends Component {
  state = {
    formTouched: false,
    submiting: false,
    form: {
      password: {
        value: '',
        validation: {
          required: true
        }
      },
      phone: {
        value: '',
        validation: {
          required: true,
          isPhone: true
        }
      }
    },
  }
  onSubmit = async () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
    this.setState({ formTouched: true });
    const { form, formIsValid } = validateForm({ ...this.state.form });
    if (formIsValid) {
      try {
        this.setState({ submiting: true });
        const data = {};
        for (var key in form) {
          if (form.hasOwnProperty(key)) {
            data[key] = form[key].value;
          }
        }
        await axios.post('user/updatePhone', data);
        this.setState({ submiting: false });
        const user = {...this.props.user};
        user.phoneNumber = data.phone;
        this.props.onUpdateProfile(user);
        this.props.updateLocalProfile(user, 'phoneNumber');
        this.onUpdatedSuccess(user);
      } catch (error) {
        this.setState({ submiting: false });
        if (error.msg === "Password not match") {
          error.msg = i18n.t('account.profile.currentPasswordIsIncorrect')
        }
        if (error.msg === "Số điện thoại đã tồn") {
          error.msg = i18n.t('account.valid.phoneExisted')
        }
        Alert.alert(i18n.t('global.error'), error.msg);
      }
    }
  }
  onUpdatedSuccess = (user) => {
    Alert.alert(i18n.t('global.notification'),
      i18n.t('global.updatedSuccessfully'),
      [{
        text: i18n.t('register.signUpSuccessBtn'),
        onPress: () => this.props.setModalVisible(formType, user)
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
        title={i18n.t('account.changePhone')}
      >
        <KeyboardScrollView style={{ backgroundColor: brandDark }}>
          <View style={{ paddingHorizontal: 20, paddingTop: 20, marginTop: 10, backgroundColor: brandLight }}>
            <FormInput
              label={i18n.t('account.profile.currentPassword')}
              returnKeyType="next"
              value={this.state.form.password.value}
              secureTextEntry
              inValid={this.state.form.password.inValid}
              errorMessage={i18n.t('account.valid.currentPassword')}
              onChangeText={(value) => this.inputChangeHandler(value, 'password')} />
            <FormInput
              label={i18n.t('account.profile.newPhoneNumber')}
              returnKeyType="next"
              autoCapitalize="none"
              keyboardType="phone-pad"
              value={this.state.form.phone.value}
              inValid={this.state.form.phone.inValid}
              errorMessage={i18n.t('account.valid.phone')}
              onChangeText={(value) => this.inputChangeHandler(value, 'phone')} />
            <View style={{ flex: 1, alignItems: 'center' }}>
              <OutlineButton
                loading={this.state.submiting}
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
};

const mapDispatchToProps = dispatch => {
  return {
    onUpdateProfile: (profile) => dispatch(actions.updateProfile(profile))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileChangePhone);
