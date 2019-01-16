import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StackActions, NavigationActions } from 'react-navigation';
import { AsyncStorage, StyleSheet, TouchableOpacity, View, KeyboardAvoidingView } from 'react-native';
import { Content, Icon, Text } from "native-base";
import Picker from 'react-native-picker';

import i18n from '../../i18n';
import * as actions from '../../stores/actions';
import { InputField, Button, TextInput, PickerSelect } from '../../components/common';
import { backgroundColor, brandPrimary, brandWarning, textColor } from '../../config/variables';
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

  inputChangeHandler = (value, key) => {
    const form = { ...this.state.form };
    form[key].value = value;
    if (this.state.formTouched) {
      const validation = form[key].validation;
      form[key].inValid = !checkValidity(value, validation, form);
    }
    this.setState({ form });
  }
  _createDateData() {
    // const data = this.props.
    let date = ['HCM', 'Ha Noi'];
    return date;
  }
  _showDatePicker() {
    Picker.init({
      pickerData: this._createDateData(),
      // pickerFontColor: [255, 0, 0, 1],
      // pickerBg: [246, 248, 250, 1],
      onPickerConfirm: (pickedValue, pickedIndex) => {
        console.log('date', pickedValue, pickedIndex);
      },
      // onPickerCancel: (pickedValue, pickedIndex) => {
      //   console.log('date', pickedValue, pickedIndex);
      // },
      onPickerSelect: (pickedValue, pickedIndex) => {
        console.log('date', pickedValue, pickedIndex);
      }
    });
    Picker.show();
  }
  _toggle() {
    Picker.toggle();
  }

  _isPickerShow() {
    Picker.isPickerShow(status => {
      alert(status);
    });
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
              <PickerSelect
                label={i18n.t('account.province')}
                onChange={province_id => this.inputChangeHandler(province_id, 'province_id')}
                data={this.props.provinceList}
                keyName={'province_name'}
                keyId='province_id'
                value={this.state.form.province_id.value}
              />
              {/* <View>
                <TextInput
                  // value={this.state.form.mobile_phone.value}
                  // value={}
                  // onChangeText={mobile_phone => this.inputChangeHandler(mobile_phone, 'mobile_phone')}
                  label={i18n.t('account.province')}
                  disabled
                />
                <View style={{ position: 'absolute', right: 20, bottom: 0 }}>
                  <Picker
                    mode="dropdown"
                    style={{ height: 46, marginBottom: 0, marginVertical: 0, }}
                    iosIcon={<Icon name="angle-down" type='FontAwesome' style={{ color: textColor, fontSize: 14, marginRight: 0 }} />}
                    placeholder="Chọn"
                    placeholderStyle={{ color: textColor, fontSize: 16, paddingLeft: 0 }}
                    textStyle={{ color: textColor, fontSize: 16, paddingLeft: 0, paddingRight: 0, padding: 0 }}
                    headerBackButtonText="Quay lại"
                  // renderHeader={(backAction) => this._renderPickerHeader(backAction, titleHeader = 'Chọn Tỉnh / Thành')}
                  // selectedValue={provinceSelected}
                  // onValueChange={this._onProvinceChange.bind(this)}
                  >
                    {this.props.provinceList && this.props.provinceList.map((item, index) => <Picker.Item key={index} label={item.province_name} value={item} />)}
                  </Picker>
                </View>
              </View>
              <TouchableOpacity style={{ marginTop: 40, marginLeft: 20 }} onPress={this._showDatePicker.bind(this)}>
                <Text>DatePicker</Text>
              </TouchableOpacity> */}
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