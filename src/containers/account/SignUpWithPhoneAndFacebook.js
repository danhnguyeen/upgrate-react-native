import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StackActions, NavigationActions } from 'react-navigation';
import { AsyncStorage, StyleSheet, View, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { Content, Icon, ActionSheet } from "native-base";

import i18n from '../../i18n';
import * as actions from '../../stores/actions';
import { Button, TextInput, PickerSelect } from '../../components/common';
import { backgroundColor, brandPrimary, brandWarning, textColor, DEVICE_WIDTH, DEVICE_HEIGTH } from '../../config/variables';
import { validateForm, checkValidity, capitalize } from '../../util/utility';

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
      district_id: { value: '' }
    },
    checkLogin: false,
    submiting: false,
    formIsValid: true
  }
  componentDidMount() {
    if (!this.props.provinceList.length) {
      this.props._onfetchProvinceList()
    }
    console.log(this.props.provinceList)
  }
  onSubmit = () => {

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
      form[key].inValid = !checkValidity(value, validation, form);
    }
    this.setState({ form });
  }
  onProvinceChange = (province_id) => {
    if (this.state.form.province_id.value !== province_id) {
      this.inputChangeHandler('', 'district_id');
    }
    this.inputChangeHandler(province_id, 'province_id');
    this.props._onfetchDistrictList(province_id);
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
              <TouchableOpacity onPress={this.showActionSheet}>
                <View pointerEvents="none">
                  <TextInput
                    value={
                      this.state.form.gender.value === 0 || this.state.form.gender.value === 1 ?
                        capitalize((this.state.form.gender.value === 0 ? i18n.t('account.male') : i18n.t('account.female')))
                        : null
                    }
                    label={i18n.t('account.gender')}
                  />
                </View>
              </TouchableOpacity>
              <ActionSheet ref={o => this.ActionSheet = o} />
              <PickerSelect
                label={i18n.t('account.province')}
                onChange={this.onProvinceChange}
                data={this.props.provinceList}
                keyName={'province_name'}
                keyId='province_id'
                value={this.state.form.province_id.value}
              />
              <PickerSelect
                label={i18n.t('account.district')}
                onChange={district_id => this.inputChangeHandler(district_id, 'district_id')}
                data={this.props.districtList}
                keyName={'district_name'}
                keyId='district_id'
                value={this.state.form.district_id.value}
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
  districtList: state.buildings.districtList,
  provinceList: state.buildings.provinceList,
  provinceId: state.buildings.provinceId

});

const mapDispatchToProps = dispatch => ({

  _onAuth: (username, password) => dispatch(actions.auth(username, password)),
  _onAuthSignUp: (dataRegister) => dispatch(actions.authSignUp(dataRegister)),
  _onfetchDistrictList: (provinceId) => dispatch(actions.fetchDistrictList(provinceId)),
  _onfetchProvinceList: () => dispatch(actions.fetchProvinceList()),

});

export default connect(mapStateToProps, mapDispatchToProps)(SignUpWithPhoneAndFacebook);