import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import ActionSheet from 'react-native-actionsheet'
import DatePicker from 'react-native-datepicker';

import i18n from '../../../i18n';
import { capitalize } from '../../../util/utility';
import { FormInput } from '../../common';
import { inputFontSize, fontSize, textColor, brandDark, textDarkColor } from '../../../config/variables';

class ProfileEdit extends Component {
  state = {
    inputHeight: 40
  }
  showActionSheet = () => {
    this.ActionSheet.show();
  }
  render() {
    return (
      <View style={{ marginHorizontal: 20, paddingTop: 20 }}>
        <FormInput
          onLayout={(event) => this.setState({ inputHeight: event.nativeEvent.layout.height })}
          value={this.props.form.fullname.value}
          inValid={this.props.form.fullname.inValid}
          placeholder={i18n.t('register.name')}
          label={i18n.t('register.name')}
          autoCapitalize="none"
          returnKeyType="next"
          errorMessage={i18n.t('account.valid.fullname')}
          onChangeText={(value) => this.props.inputChangeHandler(value, 'fullname')}
        />
        {!this.props.loginWithFbAccountKit ?
          <TouchableOpacity onPress={() => this.props.editModal('phoneModal')}>
            <View pointerEvents="none">
              <FormInput
                value={this.props.form.phoneNumber.value}
                placeholder={i18n.t('register.phone')}
                label={i18n.t('register.phone')}
              />
            </View>
          </TouchableOpacity>
          :
          <FormInput
            value={this.props.form.phoneNumber.value}
            placeholder={i18n.t('register.phone')}
            editable={this.props.loginWithFbAccountKit !== 2}
            label={i18n.t('register.phone')}
            autoCapitalize="none"
            keyboardType="phone-pad"
            returnKeyType="next"
            inValid={this.props.form.phoneNumber.inValid}
            errorMessage={i18n.t('account.valid.phone')}
            onChangeText={(value) => this.props.inputChangeHandler(value, 'phoneNumber')}
          />
        }
        {!this.props.loginWithFbAccountKit ?
          <TouchableOpacity onPress={() => this.props.editModal('emailModal')}>
            <View pointerEvents="none">
              <FormInput
                value={this.props.form.email.value}
                placeholder={i18n.t('register.email')}
                label={i18n.t('register.email')}
              />
            </View>
          </TouchableOpacity>
          :
          <FormInput
            value={this.props.form.email.value}
            placeholder={i18n.t('register.email')}
            editable={this.props.loginWithFbAccountKit === 2}
            label={i18n.t('register.email')}
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="next"
            inValid={this.props.form.email.inValid}
            errorMessage={i18n.t('account.valid.email')}
            onChangeText={(value) => this.props.inputChangeHandler(value, 'email')}
          />
        }
        <TouchableOpacity onPress={this.showActionSheet}>
          <View pointerEvents="none">
            <FormInput
              value={
                this.props.form.gender.value === 0 || this.props.form.gender.value === 1 ?
                  capitalize((this.props.form.gender.value === 0 ? i18n.t('register.male') : i18n.t('register.female')))
                  : ''
              }
              placeholder={i18n.t('register.gender')}
              label={i18n.t('register.gender')}
            />
          </View>
        </TouchableOpacity>
        <ActionSheet
          ref={o => this.ActionSheet = o}
          title={i18n.t('register.yourGender')}
          options={[i18n.t('register.male'), i18n.t('register.female'), i18n.t('register.other'), i18n.t('global.cancel')]}
          cancelButtonIndex={3}
          destructiveButtonIndex={2}
          onPress={gender => this.props.inputChangeHandler(gender, 'gender')}
        />
        <View style={[styles.genderContainer]}>
          <Text style={{ marginBottom: 10 }}>
            {i18n.t('register.birthday')}
          </Text>
          <DatePicker
            date={this.props.form.dateOfBirth.value}
            showIcon={false}
            placeholder={i18n.t('register.birthday')}
            format="DD/MM/YYYY"
            confirmBtnText={i18n.t('booking.bookATable.confirm')}
            cancelBtnText={i18n.t('booking.bookATable.cancel')}
            androidMode={'spinner'}
            style={[styles.pickerInput, {
              height: this.state.inputHeight,
            }]}
            customStyles={{
              dateInput: {
                borderWidth: 0,
                borderRadius: 2,
                paddingHorizontal: 10,
                alignItems: 'flex-start'
              },
              placeholderText: {
                position: 'absolute',
                left: 10,
                color: textDarkColor,
                fontSize: fontSize + 2
              },
              dateText: styles.textDatePicker
            }}
            onDateChange={(dateOfBirth) => this.props.inputChangeHandler(dateOfBirth, 'dateOfBirth')}
          />
        </View>
        {!this.props.loginWithFbAccountKit ?
          <TouchableOpacity onPress={() => this.props.editModal('passwordModal')}>
            <View pointerEvents="none">
              <FormInput
                value="******"
                label={i18n.t('account.changePassword')}
              />
            </View>
          </TouchableOpacity>
          : null
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  genderContainer: {
    marginBottom: 20,
    justifyContent: 'space-between'
  },
  textDatePicker: {
    color: textColor,
    width: '100%',
    fontSize: inputFontSize
  },
  textInput: {
    width: '100%',
    // maxWidth: 400,
    backgroundColor: brandDark,
    marginTop: 10,
    paddingHorizontal: 15,
    color: textColor,
    paddingVertical: 12,
    borderRadius: 2,
    fontSize: fontSize + 1
  },
  pickerInput: {
    width: '100%',
    paddingLeft: 5,
    backgroundColor: brandDark,
    alignItems: 'center',
    justifyContent: 'center'
  },
});

export default ProfileEdit;
