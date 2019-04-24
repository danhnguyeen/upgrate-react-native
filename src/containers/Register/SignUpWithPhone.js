import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StackActions, NavigationActions } from 'react-navigation';
import {
  AsyncStorage,
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Text,
  Keyboard
} from 'react-native';
import ActionSheet from 'react-native-actionsheet'
import DatePicker from 'react-native-datepicker';
import moment from 'moment';

import { checkValidity, validateForm, capitalize } from '../../util/utility';
import i18n from '../../i18n';
import * as actions from '../Login/auth-actions';
import { OutlineButton, TextInputUnderline, KeyboardScrollView } from '../../components/common';
import {
  brandPrimary,
  textDarkColor,
  fontSize,
  lightBackground
} from '../../config/variables';

class SignUpWithPhone extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('name') ? `Welcome ${navigation.getParam('name')}` : 'Welcome to Mylife Company',
    };
  };

  state = {
    inputHeight: 40,
    loginType: this.props.navigation.getParam('loginType', 'account_kit'),
    formTouched: false,
    saving: false,
    form: {
      fullname: {
        value: this.props.user.username,
        validation: {
          required: true
        }
      },
      phoneNumber: {
        value: this.props.user.phoneNumber,
        validation: {
          required: true,
          isPhone: true
        }
      },
      email: {
        value: this.props.user.email,
        validation: {
          required: true,
          isEmail: true
        }
      },
      gender: {
        value: typeof this.props.user.gender === 'string' ? parseInt(this.props.user.gender) : this.props.user.gender,
      },
      dateOfBirth: {
        value: this.props.user.dateOfBirth ? moment(this.props.user.dateOfBirth).format('DD/MM/YYYY') : '',
      }
    }
  };

  onSignUp = async () => {
    try {
      this.setState({ formTouched: true });
      const { form, formIsValid } = validateForm({ ...this.state.form });
      if (formIsValid) {
        this.setState({ saving: true });
        const data = {};
        for (var key in form) {
          if (form.hasOwnProperty(key)) {
            data[key] = form[key].value;
          }
        }
        if (data.dateOfBirth) {
          data.dateOfBirth = moment(data.dateOfBirth, 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        await this.props.onSignUpPhoneAndFacebook(this.props.user.id, data, this.state.loginType === 'facebook' ? 1 : 2);
        this.setState({ saving: false });
        AsyncStorage.setItem('token', this.props.token);
        this.onSignUpSuccess();
      }
    } catch (err) {
      this.setState({ saving: false });
      this.onSignUpFailed(err);
    }
  }
  onSignUpSuccess = () => {
    const resetAction = StackActions.reset({
      index: 0,
      key: null,
      actions: [NavigationActions.navigate({ routeName: 'main' })],
    });
    this.props.navigation.dispatch(resetAction);
  }
  showActionSheet = () => {
    Keyboard.dismiss();
    this.ActionSheet.show();
  }
  onSignUpFailed = (error) => {
    let message = error.msg;
    if (message && message.includes('existed')) {
      message = i18n.t('register.accountExisted');
    }
    Alert.alert(
      i18n.t('register.signUpFail'),
      message,
      [
        { text: i18n.t('login.loginFailBtn') }
      ],
      { cancelable: false }
    );
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
      form[key].inValid = !checkValidity(value, form[key].validation);
    }
    this.setState({ form });
  }
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#fafbfc' }}>
        <KeyboardScrollView>
          <View style={styles.container}>
            <TextInputUnderline
              getLayout={(event) => this.setState({ inputHeight: event.nativeEvent.layout.height })}
              label={i18n.t('register.name')}
              returnKeyType="next"
              value={this.state.form.fullname.value}
              inValid={this.state.form.fullname.inValid}
              errorMessage={i18n.t('account.valid.fullname')}
              onChangeText={(value) => this.inputChangeHandler(value, 'fullname')} />
            <TextInputUnderline
              label={i18n.t('register.phone')}
              editable={this.state.loginType === 'facebook' && !this.props.user.phoneNumber}
              returnKeyType="next"
              keyboardType="phone-pad"
              value={this.state.form.phoneNumber.value}
              inValid={this.state.form.phoneNumber.inValid}
              errorMessage={i18n.t('account.valid.phone')}
              onChangeText={(value) => this.inputChangeHandler(value, 'phoneNumber')} />
            <TextInputUnderline
              label={i18n.t('register.email')}
              editable={this.state.loginType === 'account_kit' || !this.props.user.email}
              returnKeyType="next"
              autoCapitalize="none"
              keyboardType="email-address"
              value={this.state.form.email.value}
              inValid={this.state.form.email.inValid}
              errorMessage={i18n.t('account.valid.email')}
              onChangeText={(value) => this.inputChangeHandler(value, 'email')} />
            <TouchableOpacity onPress={this.showActionSheet}>
              <TextInputUnderline
                label={i18n.t('register.gender')}
                returnKeyType="next"
                autoCapitalize="none"
                value={
                  this.state.form.gender.value === 0 || this.state.form.gender.value === 1 ?
                    capitalize((this.state.form.gender.value === 0 ? i18n.t('register.male') : i18n.t('register.female')))
                    : ''
                }
                editable={false} />
            </TouchableOpacity>
            <ActionSheet
              ref={o => this.ActionSheet = o}
              title={i18n.t('register.yourGender')}
              options={[i18n.t('register.male'), i18n.t('register.female'), i18n.t('register.other'), i18n.t('global.cancel')]}
              cancelButtonIndex={3}
              destructiveButtonIndex={2}
              onPress={gender => this.inputChangeHandler(gender, 'gender')}
            />
            <View style={styles.genderContainer}>
              <Text style={{ color: textDarkColor, fontSize: fontSize - 2 }}>
                {this.state.form.dateOfBirth.value ? i18n.t('register.birthday') : ''}
              </Text>
              <DatePicker
                date={this.state.form.dateOfBirth.value}
                showIcon={false}
                placeholder={i18n.t('register.birthday')}
                format="DD/MM/YYYY"
                confirmBtnText={i18n.t('booking.bookATable.confirm')}
                cancelBtnText={i18n.t('booking.bookATable.cancel')}
                androidMode={'spinner'}
                style={{ width: '100%' }}
                customStyles={{
                  dateInput: {
                    borderWidth: 0,
                    marginVertical: 15
                  },
                  placeholderText: {
                    position: 'absolute',
                    left: 0,
                    color: textDarkColor,
                    fontSize: fontSize + 2
                  },
                  dateText: styles.textDatePicker
                }}
                onDateChange={(dateOfBirth) => this.inputChangeHandler(dateOfBirth, 'dateOfBirth')}
              />
            </View>
            <OutlineButton
              disabled={this.state.saving}
              onPress={this.onSignUp}
              title={i18n.t('global.submit')}
              buttonStyle={{ backgroundColor: brandPrimary }}
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
    backgroundColor: lightBackground
  },
  genderContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#cfd5db',
    marginTop: 15,
    justifyContent: 'space-between'
  },
  textDatePicker: {
    color: 'black',
    width: '100%',
    fontSize
  }
});

const mapStateToProps = state => ({
  token: state.auth.token,
  user: state.auth.user,
  accountKitToken: state.auth.accountKitToken
});

const mapDispatchToProps = dispatch => ({
  onSignUpPhoneAndFacebook: (userId, data, loginType) => dispatch(actions.authSignUpPhoneAndFacebook(userId, data, loginType))
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUpWithPhone);
