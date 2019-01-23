import React from 'react';
import { connect } from 'react-redux';
import axios from '../../config/axios';
import { StyleSheet, TouchableOpacity, View, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Content, Icon, Text, } from "native-base";
import { BookingDateTime } from '../../components/booking/';
import { backgroundColor, textDarkColor, brandLight } from '../../config/variables';
import { _dispatchStackActions, isEmpty } from '../../util/utility';

class Booking extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isBookingUpdate: false,
      isFetching: true,
      bookingDetail: {
        customer_id: null,
        customer_name: null,
        email: null,
        mobile_phone: null,
        building_id: null,
        office_id: null,
        schedule_date: null,
        schedule_time: null,
        notes: '',
      }
    }
  }
  componentDidMount() {
    if (this.props.isAuth) {
      this._onFetching()
    }
    else {
      const dataProps = this.props.navigation.getParam('dataProps')
      this.props.navigation.navigate('SignIn', { dataProps, routeNameProps: 'Booking' })
    }
  }
  componentWillReceiveProps(nextProps) {
    const dataProps = this.props.navigation.getParam('dataProps')
    const nextDataProps = nextProps.navigation.getParam('dataProps')
    if (nextDataProps !== dataProps) {
      this._onFetching(nextDataProps)
    }
    else {
      console.log('nextDataProps == dataProps', nextDataProps == dataProps)
    }
  }
  _onFetching = (nextProps) => {
    const dataProps = nextProps ? nextProps : this.props.navigation.getParam('dataProps')
    if (!isEmpty(dataProps.bookingDetail)) {
      this.setState({ bookingDetail: dataProps.bookingDetail, isBookingUpdate: true }, () => {
        this.setState({ isFetching: false })
      })
    }
    else if (!isEmpty(dataProps.officeDetail)) {
      this.setState({ bookingDetail: dataProps.officeDetail, isBookingUpdate: false }, () => {
        this.setState({ isFetching: false })
      })
    }
    else {
      console.log('dataProps:', dataProps)
    }
  }
  onSignUpSubmit = async (dataDatetime) => {
    this.setState({ isFetching: true })
    const { bookingDetail, isBookingUpdate } = this.state
    const { customer_id, first_name, last_name, email, mobile_phone } = this.props.user
    const bookingData = {
      customer_id,
      customer_name: `${first_name} ${last_name}`,
      email: email,
      mobile_phone: mobile_phone,
      office_id: bookingDetail.office_id ? bookingDetail.office_id : 127,
      schedule_date: dataDatetime.schedule_date,
      schedule_time: dataDatetime.schedule_time,
      notes: dataDatetime.notes,
    }
    if (isBookingUpdate) {
      bookingData.appointment_id = bookingDetail.appointment_id
      this._updateAppointment(bookingData)
    }
    else {
      bookingData.building_id = bookingDetail.building_id
      this._createAppointment(bookingData)
    }
  }

  _updateAppointment = async (bookingData) => {
    await axios.post('appointment/update', bookingData).catch(error => {
      if (error && error.status === '1') {
        Alert.alert(
          'Cập nhật không thành công!', error.message,
          [{ text: 'Ok', onPress: () => { this.setState({ isFetching: false }) } }]
        )
      }
    }).then((response) => {
      if (response && response.status == '0') {
        Alert.alert(
          'Cập nhật thành công!', 'Cảm ơn bạn đã đặt hẹn. Chuyên viên tư vấn sẽ sớm liên lạc với bạn.',
          [{ text: 'Ok', onPress: () => _dispatchStackActions(this.props.navigation, 'navigate', 'Main', 'Appointment') }]
        )
        this.setState({ isFetching: false })
      }
    })
  }
  _createAppointment = async (bookingData) => {
    await axios.post('appointment/create', bookingData)
      .catch(error => {
        if (error && error.status === '1') {
          Alert.alert(
            'Đặt hẹn thất bại!',
            error.message,
            [{ text: 'Ok', onPress: () => { this.setState({ isFetching: false }) } }]
          )
        }
      })
      .then((response) => {
        if (response && response.status == '0') {
          Alert.alert(
            'Đặt hẹn thành công!',
            'Cảm ơn bạn đã đặt hẹn. Chuyên viên tư vấn sẽ sớm liên lạc với bạn.',
            [{ text: 'Ok', onPress: () => _dispatchStackActions(this.props.navigation, 'navigate', 'Main', 'Appointment') }]
          )
          this.setState({ isFetching: false })
        }
      })
  }
  render() {
    const { bookingDetail, isFetching, isBookingUpdate } = this.state
    let ContentBooking = <ActivityIndicator />
    console.log(this.props.user)
    if (!isFetching && this.props.user) {
      const { first_name, last_name, email, mobile_phone } = this.props.user
      ContentBooking = (
        <Content style={styles.container}>
          <View style={styles.paragraph}>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.textHeadline}>{bookingDetail.building_name}</Text>
            </View>
          </View>
          <View style={styles.paragraph}>
            <View style={styles.line} >
              <Text style={styles.textTitle}>{'Văn phòng :'}</Text>
              <Text style={[styles.textContent, { flex: 0.7 }]}>{`${bookingDetail.office_name}`}</Text>
            </View>
            <View style={styles.line} >
              <Text style={styles.textTitle}>{'Khách hàng :'}</Text>
              <Text style={[styles.textContent, { flex: 0.7 }]}>{`${first_name} ${last_name}`}</Text>
            </View>
            <View style={styles.line} >
              <Text style={styles.textTitle}>{'Điện thoại :'}</Text>
              <Text style={[styles.textContent, { flex: 0.7 }]}>{mobile_phone}</Text>
            </View>
            <View style={styles.line} >
              <Text style={styles.textTitle}>{'Email :'}</Text>
              <Text style={[styles.textContent, { flex: 0.7 }]} numberOfLines={1}>{email}</Text>
            </View>
            {isBookingUpdate &&
              <View>
                <View style={styles.line} >
                  <Text style={styles.textTitle}>{'Tình trạng :'}</Text>
                  <Text style={[styles.textContent, { flex: 0.7, fontWeight: '500', color: bookingDetail.status.color }]}>{bookingDetail.status.text}</Text>
                </View>
                {bookingDetail.sale_person_name && bookingDetail.sale_person_name !== '' &&
                  <View style={styles.line} >
                    <Text style={styles.textTitle}>{'Tư vấn viên :'}</Text>
                    <Text style={[styles.textContent, { flex: 0.7 }]}>{bookingDetail.sale_person_name}</Text>
                  </View>}
              </View>
            }
          </View>
          <BookingDateTime
            date_schedule={isBookingUpdate ? bookingDetail.date_schedule : null}
            notes={isBookingUpdate ? bookingDetail.notes : null}
            onSignUpSubmit={(bookingDetail) => { this.onSignUpSubmit(bookingDetail) }}
          />
        </Content>
      )
    }
    return (
      <View style={styles.container}>
        {ContentBooking}
      </View >
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor
  },
  paragraph: {
    backgroundColor: brandLight,
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderBottomColor: '#AAAAAA',
    borderBottomWidth: 0.5,
  },
  line: {
    marginVertical: 5,
    marginHorizontal: 10,
    flexDirection: 'row'
  },
  textHeadline: {
    fontSize: 24,
    lineHeight: 40,
    fontWeight: '700',
    color: '#0D3D74',
  },
  textTitle: {
    color: textDarkColor,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 30,
    flex: 0.3
  },
  textContent: {
    color: textDarkColor,
    fontSize: 18,
    fontWeight: '300',
    lineHeight: 30,
  },
});

const mapStateToProps = state => {
  return {
    isAuth: state.auth.token,
    user: state.auth.user,
  }
}

export default connect(mapStateToProps, null)(Booking)



