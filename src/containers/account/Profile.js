import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, KeyboardAvoidingView, Alert } from 'react-native';
import { Content, ActionSheet, Text, } from "native-base";
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import ImagePicker from 'react-native-image-picker';
import moment from 'moment';

import { brandPrimary, textDarkColor, textTitleColor, inverseTextColor } from '../../config/variables';
import { ProfileHeader } from '../../components/account';
import i18n from '../../i18n';
import { validateForm, checkValidity, capitalize, gender } from '../../util/utility';
import { Button, TextInput } from '../../components/common';
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
  static navigationOptions = () => {
    return {
      headerTitle: <ProfileHeader editAvatar={() => _this.editAvatarHandler()} />,
      headerTintColor: '#fff',
      headerBackground: (
        <LinearGradient
          colors={['#072f6a', '#0d59ca']}
          style={{ flex: 1 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      ),
      headerStyle: {
        borderBottomWidth: 0,
        height: 100,
        // alignSelf: 'center'
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
    formTouched: false,
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
    this.setState({ form, formTouched: false, saving: false });
  }
  onSubmit = async () => {
    this.setState({ formTouched: true });
    const { formIsValid, data } = validateForm({ ...this.state.form });

    if (formIsValid) {
      try {
        this.setState({ saving: true });
        if (data.dateOfBirth) {
          data.dateOfBirth = moment(data.dateOfBirth, 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        console.log(data);
        const res = await axios.post('customer/update', data);
        console.log(res)
        this.props.onUpdateProfile(data);
        this.onInitForm();
        this.onUpdatedSuccess();
      } catch (error) {
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
          data.append('postedFile', {
            uri: response.uri,
            type: response.type,
            name: response.fileName ? response.fileName : `avatar${moment().format('x')}.jpg`
          });
          const res = await axios.post('user/profile/uploadPicture', data, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            }
          });
          if (res.msg) {
            const { profilePicture } = JSON.parse(res.msg);
            const user = { ...this.props.user };
            user.profilePicture = profilePicture;
            this.props.onUpdateProfile(user);
          }
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
  inputChangeHandler = (value, key) => {
    const form = { ...this.state.form };
    if (key === 'gender' && value === 3) {
      return;
    }
    // if (key === 'gender' && value === 2) {
    //   value = null;
    // }
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
  render() {
    const profile = this.props.user;
    return (
      <Content style={{ paddingHorizontal: 15 }}>
        <KeyboardAvoidingView>
          <View style={{ padding: 15 }}>
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
            <TextInput
              value={this.state.form.email.value}
              onChangeText={email => this.inputChangeHandler(email, 'email')}
              label={i18n.t('account.email')}
              editable={!this.props.user.email}
              autoCapitalize="none"
              returnKeyType="next"
              icon={{ name: 'envelope', type: 'EvilIcons', size: 28 }}
              keyboardType="email-address"
              inValid={this.state.form.email.inValid}
              errorMessage={i18n.t('account.valid.email')}
            />
            <TextInput
              value={this.state.form.mobile_phone.value}
              onChangeText={mobile_phone => this.inputChangeHandler(mobile_phone, 'mobile_phone')}
              label={i18n.t('account.phoneNumber')}
              editable={!this.props.user.mobile_phone}
              autoCapitalize="none"
              returnKeyType="next"
              icon={{ name: 'phone', type: 'SimpleLineIcons', size: 24 }}
              keyboardType="phone-pad"
              inValid={this.state.form.mobile_phone.inValid}
              errorMessage={i18n.t('account.valid.phone')}
            />
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
            {/* <PickerSelect
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
              /> */}
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
const styles = StyleSheet.create({
  paragraph: {
    paddingVertical: 10,
  },
  lineBottom: {
    borderBottomColor: 'rgba(0,0,0,0.5)',
    borderBottomWidth: 0.3,
    marginVertical: 5,
    paddingBottom: 10,
  },
  textHeadline: {
    color: textTitleColor,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 24 * 1.5
  },
  textTitle: {
    color: textDarkColor,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 30
  },
  textContent: {
    color: textDarkColor,
    fontSize: 18,
    fontWeight: '300',
    lineHeight: 30
  },
});
const mapStateToProps = state => {
  return {
    user: state.auth.user
  }
};
const mapDispatchToProps = dispatch => {
  return {
    onUpdateProfile: (profile) => dispatch(actions.updateProfile(profile))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Profile);

