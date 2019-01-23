import React, { Component } from 'react';
import { AsyncStorage, StyleSheet, TouchableOpacity, View, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { Content, Button, Text, Icon, ActionSheet, Picker } from 'native-base';
import { connect } from 'react-redux';
import FCM from 'react-native-fcm';
import DeviceInfo from 'react-native-device-info';

import { InputField } from '../../components/common';
import * as actions from '../../stores/actions';
import { _dispatchStackActions, isEmpty } from '../../util/utility';
import { backgroundColor, brandPrimary } from '../../config/variables';
import i18n from '../../i18n';

const TEXTCOLOR = '#575757'
const dataReg = {
  first_name: 'Thúy Phượng',
  last_name: 'Huỳnh',
  email: 'fdsfcxffffffffefsdfdsfdsf@gmail.com',
  password: '123456',
  mobile_phone: 84906589850,
  gender: 'famele',
  province_id: '4',
  district_id: '54',
  address: '50 Văn Cao, Phú Thọ Hòa',
  note: '',
}
const genderList = ['Nam', 'Nữ', 'Khác']
class SignUp extends Component {
  constructor(props) {
    super(props)
    this.state = {
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
        password: {
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
            isEqualTo: 'password'
          }
        },
        gender: { value: '' }
      },
      submiting: false,
      formIsValid: true,


      isFirstNameCorrect: false,
      isLastNameCorrect: false,
      isEmailCorrect: false,
      isPasswordCorrect: false,
      isRepeatCorrect: false,
      isPhoneCorrect: false,
      isAddressCorrect: false,
      isLogin: false,
      isFetching: true,
      provinceList: [],
      districtList: [],
      provinceSelected: {
        "province_id": null,
        "province_name": '',
      },
      districtSelected: {
        "district_id": null,
        "district_name": '',
      },
      dataRegister: {
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        gender: '',
        address: '',
        mobile_phone: '',
        province_id: '',
        district_id: ''
      }
    }
    // this.routeNameProps = props.navigation.getParam('routeNameProps', null)
  }
  async componentDidMount() {
    if (isEmpty(this.props.provinceList)) {
      await this.props._onfetchProvinceList()
        .catch(error => {
          console.log(error.message)
          this.setState({
            isFetching: false,
            alertModal: {
              type: 'error',
              content: error.message,
            }
          })
        })
    }
    this.setState({ isFetching: false })
  }


  collegeDataRegister = () => {
    const { dataRegister, provinceSelected, districtSelected } = this.state
    const first_name = this.first_name.getInputValue()
    const last_name = this.last_name.getInputValue()
    const email = this.email.getInputValue()
    const password = this.password.getInputValue()
    const repeat = this.repeat.getInputValue()
    const mobile_phone = this.mobile_phone.getInputValue()
    const address = this.address.getInputValue()

    this.setState({
      isLastNameCorrect: last_name === '',
      isFirstNameCorrect: first_name === '',
      isEmailCorrect: email === '',
      isPasswordCorrect: password === '',
      isRepeatCorrect: repeat === '' || repeat !== password,
      isPhoneCorrect: mobile_phone === '',
      // isAddressCorrect: address === '',
    }, () => {
      if (last_name !== '' && first_name !== '' &&
        email !== '' && password !== '' &&
        (repeat !== '' && repeat === password) &&
        mobile_phone !== ''
      ) {
        dataRegister.last_name = last_name
        dataRegister.first_name = first_name
        dataRegister.email = email
        dataRegister.password = password
        dataRegister.mobile_phone = mobile_phone
        dataRegister.address = address
        dataRegister.province_id = provinceSelected.province_id
        dataRegister.district_id = districtSelected.district_id
        this.onSignUpSubmit(dataRegister)
      }
      else {
        this.setState({
          alertModal: {
            type: 'error',
            content: 'Vui lòng nhập đầy đủ thông tin.'
          }
        })
      }
    })
  }
  onSignUpSubmit = async (dataRegister) => {
    this.setState({ isLogin: true, dataRegister })
    await this.props._onAuthSignUp(dataRegister)
      .then(result => {
        if (!result.token && result.email && result.password) {
          this.onLoginSubmit(result.email, result.password)
        }
        else {
          this._onSignUpSuccess()
        }
      })
      .catch(error => {
        console.log(error)
        this.setState({
          isLogin: false,
          alertModal: {
            type: 'error',
            content: error.message,
          }
        })
      })
  }
  onLoginSubmit = async (email, password) => {
    await this.props._onAuth(email, password)
      .then((user) => {
        console.log('_onSignUpSuccess', user)
        this._onSignUpSuccess();
      })
      .catch(error => {
        console.log(error)
        this.setState({
          isLogin: false,
          alertModal: {
            type: 'error',
            content: error.message,
          }
        })
      })
  }
  _onSignUpSuccess = () => {
    this.updateNotificationToken();
    AsyncStorage.setItem('token', this.props.isAuth);
    _dispatchStackActions(this.props.navigation, 'reset', 'Account')

  }
  updateNotificationToken = async () => {
    const token = await FCM.getFCMToken().then(token => {
      return token;
    });
    if (token && this.props.isAuth) {
      const uniqueId = DeviceInfo.getUniqueID();
      this.props.updateFCMToken(this.props.user.customer_id, token, uniqueId);
    }
  }
  async _onProvinceChange(province = { "province_id": null, "province_name": '' }) {
    if (!this.props.provinceId || this.props.provinceId !== province.province_id) {
      // console.log(this.props.provinceId, province.province_id)
      await this.props._onfetchDistrictList(province.province_id).catch(error => {
        console.log(error.message)
        this.setState({
          isLogin: false,
          alertModal: {
            type: 'error',
            content: error.message,
          }
        })
      })
    }
    this.setState({ provinceSelected: province })
  }

  _onDistrictChange(district = { "district_id": null, "district_name": '' }) {
    this.setState({ districtSelected: district })
  }

  _onGenderChange(gender = 'Khác') {
    const { dataRegister } = this.state
    dataRegister.gender = gender
    this.setState({ dataRegister })
  }
  changeInputFocus = name => () => {
    switch (name) {
      case 'Họ':
        this.setState({ isLastNameCorrect: this.last_name.getInputValue() === '' })
        this.first_name.input.focus()
        break
      case 'Tên':
        this.setState({ isFirstNameCorrect: this.first_name.getInputValue() === '' })
        this.email.input.focus()
        break
      case 'Email':
        this.setState({ isEmailCorrect: this.email.getInputValue() === '' })
        this.password.input.focus()
        break
      case 'Mật khẩu':
        this.setState({
          isPasswordCorrect: this.password.getInputValue() === '',
          isRepeatCorrect: (this.repeat.getInputValue() !== ''
            && this.repeat.getInputValue() !== this.password.getInputValue())
        })
        this.repeat.input.focus()
        break
      case 'Nhập lại mật khẩu':
        this.setState({
          isRepeatCorrect: (this.repeat.getInputValue() === '' || this.repeat.getInputValue() !== this.password.getInputValue())
        })
        this.mobile_phone.input.focus()
        break
      case 'Điện thoại':
        this.setState({ isPhoneCorrect: this.mobile_phone.getInputValue() === '' })
        this.address.input.focus()
        break
      default:
        this.setState({ isAddressCorrect: this.address.getInputValue() === '' })
    }
  }
  _renderPickerHeader(backAction, titleHeader) {
    return (
      <View style={styles.headerContainer} >
        <TouchableOpacity
          style={[styles.headerIcon, styles.left, { alignItems: 'flex-start' }]}
          onPress={backAction}>
          <Icon style={[styles.icon, styles.buttonText]} name={'angle-left'} type={'FontAwesome'} />
        </TouchableOpacity>
        <View style={[styles.headerTitle]}>
          <Text style={[styles.title, styles.buttonText]}>{titleHeader}</Text>
        </View>
        <View style={styles.headerIcon}></View>
      </View>
    )
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
    const { isFetching, dataRegister, alertModal, provinceSelected, districtSelected } = this.state
    return (
      <View style={{ flex: 1, backgroundColor }}>
        <Content padder>
          <KeyboardAvoidingView>
            {!isFetching ?
              <View style={{ paddingVertical: 10, justifyContent: 'center' }}>
                <InputField placeholder={'Họ'} ref={ref => this.last_name = ref}
                  autoCapitalize="words"
                  returnKeyType="next" icon="ios-contact"
                  style={styles.input}
                  focus={this.changeInputFocus}
                  error={this.state.isLastNameCorrect}
                />
                <InputField placeholder={'Tên'} ref={ref => { this.first_name = ref }}
                  autoCapitalize="words"
                  returnKeyType="next" icon="ios-contact"
                  style={styles.input}
                  focus={this.changeInputFocus}
                  error={this.state.isFirstNameCorrect}
                />
                <InputField placeholder={'Email'} ref={ref => { this.email = ref }}
                  keyboardType="email-address" icon="md-mail"
                  focus={this.changeInputFocus}
                  error={this.state.isEmailCorrect}
                />
                <InputField placeholder={'Mật khẩu'} ref={ref => { this.password = ref }}
                  returnKeyType="next" icon='md-lock'
                  secureTextEntry={true}
                  focus={this.changeInputFocus}
                  error={this.state.isPasswordCorrect}
                />
                <InputField placeholder={'Nhập lại mật khẩu'} ref={ref => { this.repeat = ref }}
                  returnKeyType="next" icon='md-lock'
                  secureTextEntry={true}
                  blurOnSubmit={true}
                  focus={this.changeInputFocus}
                  error={this.state.isRepeatCorrect}
                />
                <InputField placeholder={'Điện thoại'} ref={ref => { this.mobile_phone = ref }}
                  keyboardType="phone-pad"
                  returnKeyType="next"
                  icon="md-call"
                  focus={this.changeInputFocus}
                  error={this.state.isPhoneCorrect}
                />
                <InputField placeholder={'Địa chỉ'} ref={ref => { this.address = ref }}
                  icon="md-pin"
                  // returnKeyType="next"
                  returnKeyType="done"
                  focus={this.changeInputFocus}
                  error={this.state.isAddressCorrect}
                />
                <View style={[styles.lineBottom, { flexDirection: 'row' }]}>
                  <InputField placeholder={'Tỉnh / thành'}
                    styleContainer={{ marginVertical: 0, marginHorizontal: 0, paddingBottom: 0 }}
                    noBorder
                    disabled={true}
                    icon="md-pin"
                  />
                  <Picker
                    mode="dropdown"
                    style={{ height: 46, marginBottom: 0, marginVertical: 0, }}
                    iosIcon={<Icon name="angle-down" type='FontAwesome' style={{ color: TEXTCOLOR, fontSize: 14, marginRight: 0 }} />}
                    placeholder="Chọn"
                    placeholderStyle={{ color: TEXTCOLOR, fontSize: 16, paddingLeft: 0 }}
                    textStyle={{ color: TEXTCOLOR, fontSize: 16, paddingLeft: 0, paddingRight: 0, padding: 0 }}
                    headerBackButtonText="Quay lại"
                    renderHeader={(backAction) => this._renderPickerHeader(backAction, titleHeader = 'Chọn Tỉnh / Thành')}
                    selectedValue={provinceSelected}
                    onValueChange={this._onProvinceChange.bind(this)}
                  >
                    {this.props.provinceList && this.props.provinceList.map((item, index) => <Picker.Item key={index} label={item.province_name} value={item} />)}
                  </Picker>
                </View>
                <View style={[styles.lineBottom, { flexDirection: 'row' }]}>
                  <InputField placeholder={'Quận / Huyện'} icon="md-pin"
                    styleContainer={{ marginVertical: 0, marginHorizontal: 0, paddingBottom: 0 }}
                    noBorder disabled={true} />
                  <Picker
                    mode="dropdown"
                    style={{ height: 46, marginBottom: 0, marginVertical: 0, }}
                    iosIcon={<Icon name="angle-down" type='FontAwesome' style={{ color: TEXTCOLOR, fontSize: 20, marginRight: 0 }} />}
                    placeholder="Chọn"
                    placeholderStyle={{ color: TEXTCOLOR, fontSize: 16, paddingLeft: 0 }}
                    textStyle={{ color: TEXTCOLOR, fontSize: 16, paddingLeft: 0, paddingRight: 0, padding: 0 }}
                    headerBackButtonText="Quay lại"
                    renderHeader={(backAction) => this._renderPickerHeader(backAction, titleHeader = 'Chọn Quận / Huyện')}
                    selectedValue={districtSelected}
                    onValueChange={this._onDistrictChange.bind(this)}
                  >
                    {this.props.districtList && this.props.districtList.map((item, index) => <Picker.Item key={index} label={item.district_name} value={item} />)}
                  </Picker>
                </View>
                <View style={[styles.lineBottom, { flexDirection: 'row' }]}>
                  <InputField placeholder={'Giới tính'} icon="md-person"
                    styleContainer={{ marginVertical: 0, marginHorizontal: 0, paddingBottom: 0 }}
                    noBorder disabled={true}
                  />
                  <Picker
                    mode="dropdown"
                    style={{ height: 46, marginBottom: 0, marginVertical: 0, }}
                    iosIcon={<Icon name="angle-down" type='FontAwesome' style={{ color: TEXTCOLOR, fontSize: 20, marginRight: 0 }} />}
                    placeholder="Chọn"
                    placeholderStyle={{ color: TEXTCOLOR, fontSize: 16, paddingLeft: 0 }}
                    textStyle={{ color: TEXTCOLOR, fontSize: 16, paddingLeft: 0, paddingRight: 0, padding: 0 }}
                    headerBackButtonText="Quay lại"
                    renderHeader={(backAction) => this._renderPickerHeader(backAction, titleHeader = 'Giới tính')}
                    selectedValue={dataRegister.gender}
                    onValueChange={this._onGenderChange.bind(this)} >
                    {genderList.map((item, index) => <Picker.Item key={index} label={item} value={item} />)}
                  </Picker>
                </View>
                <View style={{ alignContent: 'center', alignItems: 'center', justifyContent: 'center', paddingVertical: 10 }}>

                  <Button
                    onPress={() => {
                      this.collegeDataRegister()
                    }}
                    // onPress={this.collegeDataRegister}
                    style={styles.button} noBorder
                  >
                    {this.state.isLogin ?
                      <ActivityIndicator color={'#FFF'} /> : <Text>{'Đăng ký'}</Text>
                    }
                  </Button>
                  <TouchableOpacity style={{ margin: 10 }} activeOpacity={0.6}
                    onPress={() => { this.props.navigation.push('SignIn') }}>
                    <Text style={{ color: brandPrimary }}>{i18n.t('account.goToSignIn')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              : <ActivityIndicator color={'#FFF'} />
            }
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
  },
  buttonText: {
    color: brandPrimary,
    textAlign: 'center'
  },
  button: {
    backgroundColor: brandPrimary,
    justifyContent: 'center',
    alignSelf: "center",
    // marginVertical: 20,
    // width: winW(100),
  },
  email: {
    //marginBottom: h(4.5),
  },
  headerContainer: {
    borderBottomColor: '#f2f2f2',
    borderBottomWidth: 1,
    margin: 0,
    paddingBottom: 5,
    flexDirection: 'row',
    // justifyContent: 'center',
  },
  headerIcon: {
    flex: 0.2,
    justifyContent: 'center',
    // alignItems: 'flex-start',
  },
  left: {
    paddingLeft: 20,
  },
  right: {
    paddingRight: 20,
    alignItems: 'flex-end',
  },
  headerTitle: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  title: {
    color: "#FFF",
    fontSize: 18,
    lineHeight: 40,
    fontWeight: "500",
  },
  icon: {
    color: "#fff",
    fontSize: 30,
    // lineHeight: 30,
  },
})



const mapStateToProps = state => ({
  isAuth: state.auth.token,
  user: state.auth.user,
  districtList: state.buildings.districtList,
  provinceList: state.buildings.provinceList,
  provinceId: state.buildings.provinceId
});

const mapDispatchToProps = dispatch => ({
  _onAuth: (username, password) => dispatch(actions.auth(username, password)),
  _onAuthSignUp: (dataRegister) => dispatch(actions.authSignUp(dataRegister)),
  _onfetchDistrictList: (provinceId) => dispatch(actions.fetchDistrictList(provinceId)),
  _onfetchProvinceList: () => dispatch(actions.fetchProvinceList()),
  updateFCMToken: (customer_id, token, uniqueId) => dispatch(actions.updateNotificationToken(customer_id, token, uniqueId))
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);