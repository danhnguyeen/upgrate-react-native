import React, { Component } from 'react';
import { View, Alert, Text, StyleSheet, TouchableWithoutFeedback, Keyboard, LayoutAnimation } from 'react-native';
import { connect } from 'react-redux';
import { Divider } from 'react-native-elements';
import moment from 'moment';
import ImagePicker from 'react-native-image-picker';

import { SpinnerOverlay, OutlineButton, KeyboardScrollView } from '../../../components/common';
import * as actions from '../../Login/auth-actions';
import axios from '../../../config/axios-mylife';
import { validateForm, checkValidity } from '../../../util/utility';
import i18n from '../../../i18n';
import { 
  ProfileEdit, 
  ProfileHeader, 
  ProfileChangePassword, 
  ProfileChangeEmail,
  ProfileChangePhone
} from '../../../components/Account';
import { brandPrimary, fontSize, brandDark, brandLight } from '../../../config/variables';

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

class Profile extends Component {
  state = {
    profileModal: false,
    emailModal: false,
    phoneModal: false,
    passwordModal: false,
    formTouched: false,
    saving: false,
    spinner: false,
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
        value: typeof this.props.user.gender === 'string' ? parseInt(this.props.user.gender) : this.props.user.gender
      },
      dateOfBirth: {
        value: this.props.user.dateOfBirth ? moment(this.props.user.dateOfBirth).format('DD/MM/YYYY') : ''
      }
    },
    passwordForm: {}
  }
  onInitForm = () => {
    const form = {
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
        value: typeof this.props.user.gender === 'string' ? parseInt(this.props.user.gender) : this.props.user.gender
      },
      dateOfBirth: {
        value: this.props.user.dateOfBirth ? moment(this.props.user.dateOfBirth).format('DD/MM/YYYY') : ''
      }
    };
    this.setState({ form, formTouched: false, saving: false });
  }
  onSubmit = async () => {
    this.setState({ formTouched: true });
    const { form, formIsValid } = validateForm({ ...this.state.form });

    if (formIsValid) {
      try {
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
        const { result } = await axios.post('user/profile/update', data);
        this.props.onUpdateProfile(result[0]);
        this.onInitForm();
        this.onUpdatedSuccess('profileModal');
      } catch (error) {
        Alert.alert(i18n.t('global.error'), error.msg);
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
            timeout: 15000,
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
          Alert.alert(i18n.t('global.error'), error.msg,
            [{
              text: i18n.t('global.ok'),
              onPress: () => this.setState({ spinner: false })
            }]
          );
        }
      }
    });
  }
  inputChangeHandler = (value, key) => {
    const form = { ...this.state.form };
    // if gender, only update value if the response value is 0 or 1
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
      LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
    }
    this.setState({ form });
  }
  onUpdatedSuccess = (modalType) => {
    Alert.alert(i18n.t('global.notification'),
      i18n.t('global.updatedSuccessfully'),
      [{
        text: i18n.t('register.signUpSuccessBtn'),
        onPress: () => this.showModalHandler(modalType)
      }]
    );
  }
  updateProfileHandler = (data, key) => {
    const form = {...this.state.form};
    form[key].value = data[key];
    this.setState({ form });
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
    const currentLvl = this.props.user.profile.currentLvl ? this.props.user.profile.currentLvl : {};
    return (
      <View style={{ flex: 1, backgroundColor: brandDark }}>
        {this.state.passwordModal ?
          <ProfileChangePassword
            modalVisible={this.state.passwordModal}
            setModalVisible={this.showModalHandler}
          /> : null
        }
        {this.state.emailModal ?
          <ProfileChangeEmail
            modalVisible={this.state.emailModal}
            setModalVisible={this.showModalHandler}
            updateLocalProfile={this.updateProfileHandler}
          /> : null
        }
        {this.state.phoneModal ?
          <ProfileChangePhone
            modalVisible={this.state.phoneModal}
            setModalVisible={this.showModalHandler}
            updateLocalProfile={this.updateProfileHandler}
          /> : null
        }
        {this.state.spinner ? <SpinnerOverlay visible={this.state.spinner} /> : null}
        <ProfileHeader
          iconType="back"
          setModalVisible={() => this.props.navigation.goBack()}
          user={this.props.user}
          editAvatar={this.editAvatarHandler} />
        <KeyboardScrollView style={{ marginTop: 10 }}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.infoContainer}>
              <View style={styles.infoGroup}>
                <Text style={styles.textStyle}>{i18n.t('account.totalPoint')}</Text>
                <Text style={styles.pointStyle}>{this.props.user.profile.currentPoint}</Text>
              </View>
              <Divider style={{ backgroundColor: '#cfd5d9' }} />
              <View style={styles.infoGroup}>
                <Text style={styles.textStyle}>{i18n.t('account.currentLevel')}</Text>
                <Text style={styles.textStyle}>{currentLvl.name}</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
          <View style={{ backgroundColor: brandLight, marginBottom: 15 }}>
            <ProfileEdit
              inputChangeHandler={this.inputChangeHandler}
              user={this.props.user}
              form={this.state.form}
              loginWithFbAccountKit={this.props.loginWithFbAccountKit}
              editModal={this.showModalHandler}
            />
            <View style={{ flex: 1, marginBottom: 20, alignItems: 'center' }}>
              <OutlineButton
                loading={this.state.saving}
                buttonStyle={{ margin: 0, minWidth: 200 }}
                onPress={() => this.onSubmit('profileModal')}
                title={i18n.t('account.profile.updateProfile')} />
            </View>
          </View>
        </KeyboardScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  infoContainer: {
    // minHeight: 100,
    borderWidth: 0,
    backgroundColor: brandLight,
    margin: 15,
    marginTop: 5,
    borderRadius: 5,
    paddingHorizontal: 10
  },
  infoGroup: {
    flex: 1,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textStyle: {
    flex: 1,
    // color: inverseTextColor,
    textAlign: 'center'
  },
  pointStyle: {
    flex: 1,
    textAlign: 'center',
    fontSize: fontSize + 6,
    fontWeight: 'bold',
    color: brandPrimary
  }
});

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    loginWithFbAccountKit: state.auth.loginWithFbAccountKit
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onUpdateProfile: (profile) => dispatch(actions.updateProfile(profile))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
