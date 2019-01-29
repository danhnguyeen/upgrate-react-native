import React, { Component } from 'react';
import { View, Alert, LayoutAnimation, KeyboardAvoidingView } from 'react-native';
import { Content } from 'native-base';

import i18n from '../../i18n';
import { TextInput, Modal, Button } from '../common';
import { brandLight } from '../../config/variables';
import axios from '../../config/axios';
import { validateForm, checkValidity } from '../../util/utility';

const formType = 'phoneModal';

class ChangePhone extends Component {
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
      mobile_phone: {
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
    const { formIsValid, data } = validateForm({ ...this.state.form });
    if (formIsValid) {
      try {
        this.setState({ saving: true });
        data.customer_id = this.props.user.customer_id;
        const { customer } = await axios.post('customer/update-mobile-phone', data);
        this.setState({ saving: false });
        this.props.onUpdateProfile(customer);
        this.props.updateLocalProfile(customer, 'mobile_phone');
        this.onUpdatedSuccess();
      } catch (error) {
        this.setState({ saving: false });
        if (error.message === "Password incorrect") {
          error.message = i18n.t('account.profile.currentPasswordIsIncorrect')
        }
        if (error.message === "Mobile phone already exists") {
          error.message = i18n.t('account.valid.phoneExisted')
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
        title={i18n.t('account.changePhone')}
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
                value={this.state.form.mobile_phone.value}
                onChangeText={mobile_phone => this.inputChangeHandler(mobile_phone, 'mobile_phone')}
                label={i18n.t('account.profile.newPhoneNumber')}
                autoCapitalize="none"
                returnKeyType="next"
                icon={{ name: 'ios-mail' }}
                keyboardType="phone-pad"
                inValid={this.state.form.mobile_phone.inValid}
                errorMessage={i18n.t('account.valid.phone')}
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

export default ChangePhone;
