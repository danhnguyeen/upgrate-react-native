import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, KeyboardAvoidingView, Alert } from 'react-native';
import { Content, ActionSheet } from "native-base";
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import ImagePicker from 'react-native-image-picker';
import moment from 'moment';

import { textDarkColor, textTitleColor } from '../../config/variables';
import { ProfileHeader, ChangePassword, ChangeEmail, ChangePhone } from '../../components/account';
import i18n from '../../i18n';
import { validateForm, checkValidity, gender } from '../../util/utility';
import { Button, TextInput, SpinnerOverlay } from '../../components/common';
import * as actions from './auth-actions';
import axios from '../../config/axios';

const imagePickerOptions = {
  title: i18n.t('account.selectAvatar'),
  cancelButtonTitle: i18n.t('global.cancel'),
  takePhotoButtonTitle: i18n.t('account.takePhoto'),
  chooseFromLibraryButtonTitle: i18n.t('account.chooseFromLibrary'),
  cameraType: 'front',
  mediaType: 'photo',
  maxWidth: 1024,
  maxHeight: 1024,
  noData: true,
  quality: 0.8
};
let _this = null;

class Profile extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: <ProfileHeader navigation={navigation} editAvatar={() => _this.editAvatarHandler()} />,
      headerTintColor: '#fff',
      headerBackground: (
        <LinearGradient
          colors={['#2079ae', '#54ace0']}
          style={{ flex: 1 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      ),
      headerStyle: {
        borderBottomWidth: 0,
        height: 100
      }
    };
  };

  static defaultProps = {
    isAuth: '',
    user: {},
    navigation: {},
    callToLogout: () => { },
  }
  state = {
    passwordModal: false,
    emailModal: false,
    formTouched: false,
    phoneModal: false,
    form: {
      customer_id: { value: this.props.user.customer_id },
      first_name: {
        value: this.props.user.first_name,
        validation: {
          required: true
        }
      },
      last_name: {
        value: this.props.user.last_name,
        validation: {
          required: true
        }
      },
      email: {
        value: this.props.user.email,
        validation: {
          required: true,
          isEmail: true
        }
      },
      mobile_phone: {
        value: this.props.user.mobile_phone,
        validation: {
          required: true,
          isPhone: true
        }
      },
      gender: { value: this.props.user.gender }
    },
    submiting: false,
    formIsValid: true
  }
  componentDidMount() {
    _this = this;
  }
  onInitForm = () => {
    const form = {
      customer_id: { value: this.props.user.customer_id },
      first_name: {
        value: this.props.user.first_name,
        validation: {
          required: true
        }
      },
      last_name: {
        value: this.props.user.last_name,
        validation: {
          required: true
        }
      },
      email: {
        value: this.props.user.email,
        validation: {
          required: true,
          isEmail: true
        }
      },
      mobile_phone: {
        value: this.props.user.mobile_phone,
        validation: {
          required: true,
          isPhone: true
        }
      },
      gender: { value: this.props.user.gender }
    };
    this.setState({ form, formTouched: false, submiting: false });
  }
  onSubmit = async () => {
    this.setState({ formTouched: true });
    const { formIsValid, data } = validateForm({ ...this.state.form });

    if (formIsValid) {
      try {
        this.setState({ submiting: true });
        if (data.dateOfBirth) {
          data.dateOfBirth = moment(data.dateOfBirth, 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        const { customer } = await axios.post('customer/update', data);
        this.props.onUpdateProfile(customer);
        this.onInitForm();
        this.onUpdatedSuccess();
      } catch (error) {
        this.setState({ submiting: false });
        Alert.alert(i18n.t('global.error'), error.message);
      }
    }
  }
  editAvatarHandler = () => {
    ImagePicker.showImagePicker(imagePickerOptions, async (response) => {
      if (response.didCancel) {
        // User cancelled image picker'
      } else if (response.error) {
        // ImagePicker Error: ', response.error
      } else if (response.customButton) {
        // User tapped custom button: ', response.customButton
      } else {
        try {
          this.setState({ spinner: true });
          if (response.fileName) {
            response.fileName = response.fileName.replace(".heic", ".jpg");
            response.fileName = response.fileName.replace(".HEIC", ".jpg");
          }
          const data = new FormData();
          data.append('customer_id', this.props.user.customer_id);
          data.append('profile_image', {
            uri: response.uri,
            type: response.type,
            name: response.fileName ? response.fileName : `avatar${moment().format('x')}.jpg`
          });
          const res = await axios.post('customer/update-profile-image', data, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            }
          });
          this.props.onUpdateProfile(res.customer);
          this.props.navigation.setParams({ updatedTime: new Date() });
          this.setState({ spinner: false });
        } catch (error) {
          Alert.alert(i18n.t('global.error'), error.message,
            [{
              text: i18n.t('global.ok'),
              onPress: () => this.setState({ spinner: false })
            }]
          );
        }
      }
    });
  }
  onUpdatedSuccess = () => {
    Alert.alert(i18n.t('global.notification'),
      i18n.t('global.updatedSuccessfully'),
      [{
        text: i18n.t('global.ok')
      }]
    );
  }
  updateProfileHandler = (data, key) => {
    const form = { ...this.state.form };
    form[key].value = data[key];
    this.setState({ form });
  }
  inputChangeHandler = (value, key) => {
    const form = { ...this.state.form };
    if (key === 'gender' && value === 3) {
      return;
    }
    form[key].value = value;
    if (this.state.formTouched) {
      const validation = form[key].validation;
      form[key].inValid = !checkValidity(value, validation, form);
    }
    this.setState({ form });
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
  showModalHandler = (modalType) => {
    // reinit form when the user open the profile modal
    if (!this.state[modalType]) {
      if (modalType === 'profileModal') {
        this.onInitForm();
      }
    }
    this.setState(prevState => {
      return {
        [modalType]: !prevState[modalType]
      }
    });
  }
  render() {
    return (
      <Content style={{ paddingHorizontal: 15 }}>
        {this.state.passwordModal ?
          <ChangePassword
            modalVisible={this.state.passwordModal}
            setModalVisible={this.showModalHandler}
          /> : null
        }
        {this.state.emailModal ?
          <ChangeEmail
            modalVisible={this.state.emailModal}
            setModalVisible={this.showModalHandler}
            updateLocalProfile={this.updateProfileHandler}
            user={this.props.user}
            onUpdateProfile={this.props.onUpdateProfile}
          /> : null
        }
        {this.state.phoneModal ?
          <ChangePhone
            modalVisible={this.state.phoneModal}
            setModalVisible={this.showModalHandler}
            updateLocalProfile={this.updateProfileHandler}
            user={this.props.user}
            onUpdateProfile={this.props.onUpdateProfile}
          /> : null
        }
        <SpinnerOverlay visible={this.state.spinner} />
        <KeyboardAvoidingView>
          <View style={{ padding: 15, paddingBottom: 0 }}>
            <TextInput
              value={this.state.form.last_name.value}
              onChangeText={last_name => this.inputChangeHandler(last_name, 'last_name')}
              label={i18n.t('account.lastName')}
              returnKeyType="next"
              icon={{ name: 'user', type: 'EvilIcons', size: 28 }}
              inValid={this.state.form.last_name.inValid}
              errorMessage={i18n.t('account.valid.lastName')}
            />
            <TextInput
              value={this.state.form.first_name.value}
              onChangeText={first_name => this.inputChangeHandler(first_name, 'first_name')}
              label={i18n.t('account.firstName')}
              returnKeyType="next"
              icon={{ name: 'user', type: 'EvilIcons', size: 28 }}
              inValid={this.state.form.first_name.inValid}
              errorMessage={i18n.t('account.valid.firstName')}
            />
            {!this.props.provider ?
              <TouchableOpacity onPress={() => this.showModalHandler('emailModal')}>
                <View pointerEvents="none">
                  <TextInput
                    value={this.state.form.email.value}
                    label={i18n.t('account.email')}
                    editable={false}
                    autoCapitalize="none"
                    returnKeyType="next"
                    icon={{ name: 'envelope', type: 'EvilIcons', size: 28 }}
                    keyboardType="email-address"
                    inValid={this.state.form.email.inValid}
                    errorMessage={i18n.t('account.valid.email')}
                  />
                </View>
              </TouchableOpacity>
              :
              <TextInput
                value={this.state.form.email.value}
                label={i18n.t('account.email')}
                editable={this.props.provider === 'phone'}
                autoCapitalize="none"
                returnKeyType="next"
                icon={{ name: 'envelope', type: 'EvilIcons', size: 28 }}
                keyboardType="email-address"
                inValid={this.state.form.email.inValid}
                errorMessage={i18n.t('account.valid.email')}
              />
            }
            {!this.props.provider ?
              <TouchableOpacity onPress={() => this.showModalHandler('phoneModal')}>
                <View pointerEvents="none">
                  <TextInput
                    value={this.state.form.mobile_phone.value}
                    label={i18n.t('account.phoneNumber')}
                    editable={false}
                    autoCapitalize="none"
                    returnKeyType="next"
                    icon={{ name: 'phone', type: 'SimpleLineIcons', size: 22 }}
                    keyboardType="phone-pad"
                    inValid={this.state.form.mobile_phone.inValid}
                    errorMessage={i18n.t('account.valid.phone')}
                  />
                </View>
              </TouchableOpacity>
              :
              <TextInput
                value={this.state.form.mobile_phone.value}
                label={i18n.t('account.phoneNumber')}
                editable={this.props.provider === 'facebook'}
                autoCapitalize="none"
                returnKeyType="next"
                icon={{ name: 'phone', type: 'SimpleLineIcons', size: 22 }}
                keyboardType="phone-pad"
                inValid={this.state.form.mobile_phone.inValid}
                errorMessage={i18n.t('account.valid.phone')}
              />
            }
            <TouchableOpacity onPress={this.showActionSheet}>
              <View pointerEvents="none">
                <TextInput
                  value={gender(this.state.form.gender.value)}
                  icon={{ name: 'human-male-female', type: 'MaterialCommunityIcons' }}
                  label={i18n.t('account.gender')}
                />
              </View>
            </TouchableOpacity>
            <ActionSheet ref={o => this.ActionSheet = o} />
            {!this.props.provider ?
              <TouchableOpacity onPress={() => this.showModalHandler('passwordModal')}>
                <View pointerEvents="none">
                  <TextInput
                    value={'******'}
                    label={i18n.t('account.password')}
                    editable={false}
                    secureTextEntry
                    autoCapitalize="none"
                    returnKeyType="next"
                    icon={{ name: 'lock', type: 'SimpleLineIcons', size: 22 }}
                    keyboardType="phone-pad"
                  />
                </View>
              </TouchableOpacity>
              : null}
          </View>
          <View style={{ flex: 1, alignItems: 'center', paddingVertical: 10 }}>
            <Button
              onPress={this.onSubmit}
              loading={this.state.submiting}
              buttonStyle={{ minWidth: 200 }}
              title={i18n.t('global.update')}
            />
          </View>
        </KeyboardAvoidingView>
      </Content >
    )
  }
}
const mapStateToProps = state => {
  return {
    user: state.auth.user,
    provider: state.auth.provider
  }
};
const mapDispatchToProps = dispatch => {
  return {
    onUpdateProfile: (profile) => dispatch(actions.updateProfile(profile))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Profile);

