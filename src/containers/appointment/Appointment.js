import React from 'react';
import moment from 'moment';
import { StyleSheet, TouchableOpacity, View, ActivityIndicator, Alert, Linking } from 'react-native';
import { Content, Icon, Text, } from "native-base";
import { connect } from 'react-redux';

import axios from '../../config/axios';
import { brandPrimary, textDarkColor, shadow, brandLight, backgroundColor } from '../../config/variables';
import { _dispatchStackActions } from '../../util/utility';

class BookingItem extends React.Component {
  static defaultProps = {
    booking: {
      "appointment_id": 3,
      "building_name": "PAXSKY 144 Lê Lai",
      "customer_id": 33,
      "date_schedule": "28-12-2018 09:30",
      "full_name": "Phượng Huỳnh",
      "notes": null,
      "office_name": null,
      "rate_comment": null,
      "rate_number": 0,
      "status_code": 0,
      "status_name": "Pending",
    }
  }

  clickedCancel = () => {
    Alert.alert(
      'Xác nhận hủy',
      'Bạn có muốn hủy cuộc hẹn này ?',
      [
        { text: 'Không', onPress: () => { }, style: 'cancel' },
        { text: 'Hủy', onPress: () => this.props.cancelFunc(this.props.booking.appointment_id) },
      ],
      { cancelable: false }
    );
  }

  render() {
    const booking = this.props.booking
    booking.status = {
      color: '#debb3d',
      text: 'Pending'
    }

    switch (booking.status_name) {
      case 'Pending':
        booking.status.color = '#debb3d'
        booking.status.text = 'Chờ xác nhận'
        break
      case 'Schedule':
        booking.status.color = '#28871c'
        booking.status.text = 'Đã xác nhận'
        break
      case 'Done':
        booking.status.color = textDarkColor
        booking.status.text = 'Đã xong'
        break
      case 'Cancel':
        booking.status.color = '#e12d2d'
        booking.status.text = 'Đã hủy'
        break
    }

    return (
      <View style={[styles.paragraph, shadow, { paddingVertical: 0, paddingHorizontal: 0, borderRadius: 0, flexDirection: 'row' }]}>
        <View style={{ backgroundColor: '#072f6a', justifyContent: 'center', alignItems: 'center', padding: 10, }}>
          <Text style={{ color: 'white', fontSize: 17, lineHeight: 26 }}>{moment(booking.date_schedule, 'DD/MM/YYYY HH:mm').format('DD. MMM')}</Text>
          <View style={{
            backgroundColor: '#5092E3',
            height: 1,
            width: '90%',
            marginVertical: 10,
            flexDirection: 'row',
            justifyContent: 'center'
          }} />
          <Text style={{ color: 'white', fontSize: 17, lineHeight: 26 }}>{moment(booking.date_schedule, 'DD/MM/YYYY HH:mm').format('HH:mm')}</Text>
        </View>
        <View style={{ flex: 1, paddingVertical: 10 }}>
          <View style={{ paddingHorizontal: 10, }}>
            <Text style={{ color: '#0D3D74', fontSize: 17, lineHeight: 30, fontWeight: '700', textAlign: 'center' }}>{booking.building_name}</Text>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', }}>
              <Text style={{ color: textDarkColor, lineHeight: 30 }}>Ms. Phương Linh</Text>
              <TouchableOpacity onPress={() => Linking.openURL(`tel:+84911072299`)}>
                <Icon style={{ color: '#debb3d', lineHeight: 30, fontSize: 20, }} name='phone-square' type='FontAwesome' />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL(`mailto:paxsky.vn`)}>
                <Icon style={{ color: '#debb3d', lineHeight: 30, fontSize: 20, }} name='md-mail' type='Ionicons' />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{
            backgroundColor: '#6a88a9',
            height: 1,
            width: '100%',
            marginVertical: 5,
            flexDirection: 'row',
            justifyContent: 'center'
          }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: booking.status.color, paddingHorizontal: 10, margin: 5, }}>
              <Text style={{ color: 'white', lineHeight: 30 }}>{booking.status.text}</Text>
            </View>
            <TouchableOpacity onPress={() => { this.clickedCancel() }}
              style={{ color: '#e12d2d', paddingHorizontal: 10, margin: 5, }}>
              <Text style={[styles.buttonText, { color: '#e12d2d' }]}>Cancel</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={() => { }}
              onPress={() => { this.props.navigation.navigate('AppointmentUpdate', { bookingDetail: booking }) }}
              style={{ color: Colors.orange, paddingHorizontal: 10, margin: 5, }}>
              <Text style={[Common.buttonText, { color: Colors.brandPrimary }]}>Update</Text>
            </TouchableOpacity> */}
          </View>

        </View>

      </View>
    )
  }
}

class Appointment extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      appointmentList: null,
      isFetching: true
    }
    this._isMounted = false

  }
  componentWillUnmount() {
    this._isMounted = false
  }
  componentDidMount() {
    this._isMounted = true
    if (this._isMounted == true && this.props.isAuth && this.props.user) {
      this._onFetching()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {
      this._onFetching()
    }
  }
  _onFetching = async () => {
    const customer_id = this.props.user.customer_id
    await axios.get(`appointment/list?customer_id=${customer_id}`).catch(error => {
      this.setState({ isFetching: false })
    }).then((response) => {
      const appointmentList = response
      console.log(appointmentList)
      // console.log(' =================================== _onFetching', appointmentList)
      this.setState({ appointmentList, isFetching: false })
    })
  }
  _onCancel = async (appointment_id) => {
    await axios.post(`appointment/delete?appointment_id=${appointment_id}`).catch(error => {
      console.log('error ....', error)
      Alert.alert(
        'Xảy ra lỗi!',
        error
        [{ text: 'Ok', onPress: () => this.setState({ isFetching: false }) }]
      )

    }).then((response) => {
      Alert.alert(
        'Đã hủy lịch đặt hẹn!',
        '',
        [{ text: 'Ok', onPress: () => this._onFetching() }]
      )
      // const appointmentList = response
      // this.setState({ appointmentList, isFetching: false })
    })
  }
  render() {
    const { appointmentList, isFetching } = this.state
    return (
      <View style={{ flex: 1, backgroundColor }}>
        <Content padder >
          {!this.props.isAuth &&
            <View style={[styles.paragraph]}>
              <TouchableOpacity onPress={() => {
                _dispatchStackActions(this.props.navigation, 'navigate', 'Account', 'SignIn', { routeNameProps: this.props.navigation.state.routeName })
              }}>
                <Text style={{ color: '#575757' }}>{'Vui lòng đăng nhập để xem lịch sử đặt hẹn '}<Text style={{ color: brandPrimary }}>{'Đăng nhập'}</Text></Text>
              </TouchableOpacity>
            </View>
          }
          {isFetching ? <ActivityIndicator /> :
            appointmentList ?
              appointmentList.map((item, index) => (
                <BookingItem booking={item} key={index}
                  navigation={this.props.navigation}
                  cancelFunc={(appointment_id) => { this._onCancel(appointment_id) }}
                // cancelFunc={(appointment_id) => { this._onCancel(appointment_id) }}
                />))
              : <Text>Cập nhật danh sách xảy ra lỗi vui lòng thử lại sau.</Text>
          }

        </Content>
      </View >
    )
  }
}

const styles = StyleSheet.create({
  paragraph: {
    backgroundColor: brandLight,
    borderRadius: 3,
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: brandPrimary,
    textAlign: 'center'
},
});

const mapStateToProps = state => ({
  isAuth: state.auth.token,
  user: state.auth.user,
  buildings: state.buildings.buildings,
});


export default connect(mapStateToProps, null)(Appointment);