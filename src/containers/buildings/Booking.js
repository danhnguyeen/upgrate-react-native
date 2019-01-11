import React from 'react';
import { connect } from 'react-redux';
import axios from '../../config/axios';
import { StyleSheet, TouchableOpacity, View, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Content, Icon, Text, } from "native-base";

import BookingForm from '../../components/booking/BookingForm';
import { backgroundColor, textDarkColor, brandLight } from '../../config/variables';
import { isEmpty } from '../../util/utility';

class Booking extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isFetching: true,
      officeDetail: null,
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
    this._isMounted = false
  }

  componentWillUnmount() {
    this._isMounted = false
  }
  componentDidMount() {
    this._isMounted = true
    if (this._isMounted == true) {
      this._onFetching()
    }
  }
  _onFetching = () => {
    const dataProps = this.props.navigation.getParam('dataProps')
    if (!isEmpty(dataProps) && !isEmpty(dataProps.officeDetail)) {
      if (this.props.isAuth) {
        this.setState({ officeDetail: dataProps.officeDetail }, () => {
          this.setState({ isFetching: false })
        })
      }
      else {
        this.props.navigation.navigate('SignIn', { dataProps: dataProps, routeNameProps: 'Booking' })
      }
    }
    else {
      this.props.navigation.navigate('Buildings')
    }
  }


  onSignUpSubmit = async (dataDatetime) => {
    this.setState({ isFetching: true })

    const { building_id, office_id } = this.state.officeDetail
    const { customer, customer_id } = this.props.user
    const { first_name, last_name, email, mobile_phone } = customer
    const bookingDetail = {
      customer_id: customer_id,
      customer_name: `${first_name} ${last_name}`,
      email: email,
      mobile_phone: mobile_phone,
      building_id: building_id,
      office_id: office_id,
      schedule_date: dataDatetime.schedule_date,
      schedule_time: dataDatetime.schedule_time,
      notes: dataDatetime.notes,
    }
    await axios.post('appointment/create', bookingDetail).catch(error => {
      if (error && error.status === '1') {
        Alert.alert(
          'Đặt hẹn thất bại!',
          'Vui lòng thử lại.',
          [{ text: 'Ok', onPress: () => { console.log('ok') } }]
        )

      }
    }).then((response) => {
      if (response && response.status == '0') {
        Alert.alert(
          'Đặt hẹn thành công!',
          'Cảm ơn bạn đã đặt hẹn. Chuyên viên tư vấn sẽ sớm liên lạc với bạn.',
          [{ text: 'Ok', onPress: () => this.props.navigation.navigate('Appointment') }]
        )
        this.setState({ isFetching: false })
      }
    })
  }
  render() {
    const { officeDetail, isFetching } = this.state;

    return (
      <View style={styles.container}>
        {isFetching ? <ActivityIndicator /> :
          <Content style={styles.container}>
            <View style={[styles.paragraph, { borderRadius: 0, borderBottomColor: '#AAAAAA', borderBottomWidth: 1 }]}>
              <View style={{ alignItems: 'center', marginBottom: 5 }}>
                <Text style={{ color: '#0D3D74', fontSize: 24, lineHeight: 40, fontWeight: '700', }}>{officeDetail.office_name}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <View style={{ flexDirection: 'row' }}>
                  <Icon style={{ color: textDarkColor, lineHeight: 30, fontSize: 20, marginRight: 10 }} name='building' type='FontAwesome' />
                  <Text style={{ color: textDarkColor, lineHeight: 30 }}>{officeDetail.floor_name}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Icon style={{ color: textDarkColor, lineHeight: 30, fontSize: 20, marginRight: 10 }} name='ios-expand' type='Ionicons' />
                  <Text style={{ color: textDarkColor, lineHeight: 30 }}>Diện tích {officeDetail.acreage_rent}m2</Text>
                </View>
              </View>
            </View>
            <BookingForm onSignUpSubmit={(bookingDetail) => { this.onSignUpSubmit(bookingDetail) }} />
          </Content>
        }
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
    borderRadius: 3,
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
},
});

const mapStateToProps = state => {
  return {
    isAuth: state.auth.token,
    user: state.auth.user,
  }
}

export default connect(mapStateToProps, null)(Booking)



