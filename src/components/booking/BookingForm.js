import React from 'react';
import moment from 'moment';
import { StyleSheet, TouchableOpacity, View, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Content, Icon, Text, } from "native-base";
import DatePicker from 'react-native-datepicker';

import { winH } from '../../util/utility';
import { platform, brandPrimary, brandWarning, textColor, textDarkColor, inputFontSize, brandLight } from '../../config/variables';

const OPENTIME = '10:00'
const CLOSETIME = '17:00'
export default class BookingForm extends React.Component {
  state = {
    data: {
      ReserDescription: '',
      date: moment().format('DD/MM/YYYY'),
      time: moment().minute(Math.ceil(moment().minute() / 30) * 30).second(0).format('HH:mm'),
    },
    isChecking: false
  }
  componentDidMount() {
    this.initBooking()
  }
  initBooking = () => {
    const data = { ...this.state.data }
    let bookingTime = data.time
    let bookingDate = data.date
    const currentDate = moment().format('DD/MM/YYYY')
    if (bookingDate <= currentDate) {
      if (bookingDate < currentDate) {
        bookingDate = currentDate
      }
      if (OPENTIME > bookingTime) {
        bookingTime = OPENTIME
      } else if (bookingTime > CLOSETIME) {
        bookingTime = OPENTIME
        bookingDate = moment(bookingDate, "DD/MM/YYYY").add(1, 'days')
      }
    } else {
      bookingTime = OPENTIME
    }
    data.date = bookingDate
    data.time = bookingTime
    this.setState({ data })
  }

  collegeBooking = async () => {
    this.setState({ isChecking: true })
    const data = { ...this.state.data }
    let bookingTime = data.time
    let bookingDate = data.date
    const currentTime = moment().format('HH:mm')
    const currentDate = moment().format('DD/MM/YYYY')
    if (bookingDate < currentDate) {
      Alert.alert('Lỗi', 'Ngày đặt hẹn không phù hợp')
      this.setState({ isChecking: false })
    } else if (bookingDate > currentDate && (bookingTime < OPENTIME || bookingTime > CLOSETIME)) {
      Alert.alert('Lỗi', 'Thời gian đặt hẹn không hợp lệ')
      this.setState({ isChecking: false })
    } else if (bookingDate == currentDate && (bookingTime < currentTime || bookingTime < OPENTIME || bookingTime > CLOSETIME)) {
      Alert.alert('Lỗi', 'Thời gian đặt hẹn không hợp lệ')
      this.setState({ isChecking: false })
    } else {
      const schedule_date = moment(bookingDate, 'DD/MM/YYYY').format('YYYY-MM-DD')
      const schedule_time = moment(bookingTime, 'HH:mm').format('HH:mm')
      // console.log(schedule_date, schedule_time)
      const dataBooking = {
        schedule_date: schedule_date,
        schedule_time: schedule_time,
        notes: data.ReserDescription,
      }
      this.props.onSignUpSubmit(dataBooking)
      this.setState({ isChecking: false })
    }

  }

  onChangeHandler = (value, key) => {
    const data = { ...this.state.data }
    data[key] = value
    this.setState({ data })
  }
  render() {
    const currentTime = moment().format('HH:mm')
    const currentDate = moment().format('DD/MM/YYYY')
    const openTime = moment(OPENTIME, 'HH:mm').format('HH:mm')
    const closeTime = moment(CLOSETIME, 'HH:mm').format('HH:mm')
    let minTime = openTime
    let maxTime = closeTime
    if (this.state.data.date == currentDate) {
      minTime = currentTime
      maxTime = closeTime
    }

    return (
      <View >
        <View style={[styles.paragraph, { borderRadius: 0, borderBottomColor: '#AAAAAA', borderBottomWidth: 1, flex: 1, flexDirection: 'row' }]}>
          <View style={[styles.bookingCard, { borderRightWidth: 0.5, borderRightColor: textDarkColor, }]}>
            <Icon type='SimpleLineIcons' name='calendar' color={textColor} />
            <DatePicker
              date={this.state.data.date}
              minDate={currentDate}
              mode="date"
              showIcon={false}
              format="DD/MM/YYYY"
              placeholder={'Chọn Ngày'}
              confirmBtnText={'Xác Nhận'}
              cancelBtnText={'Hủy'}
              androidMode={'spinner'}
              height={winH(50)}
              customStyles={{
                dateInput: { borderWidth: 0 },
                dateText: styles.textStyle
              }}
              onDateChange={(date) => this.onChangeHandler(date, 'date')}
            />
          </View>
          <View style={styles.bookingCard}>
            <Icon type='SimpleLineIcons' name='clock' color={textColor} />
            <DatePicker
              date={this.state.data.time}
              minDate={minTime}
              maxDate={maxTime}
              mode="time"
              showIcon={false}
              format="HH:mm"
              placeholder={'Chọn Giờ'}
              confirmBtnText={'Xác Nhận'}
              cancelBtnText={'Hủy'}
              androidMode={'spinner'}
              style={{ width: 'auto', flex: 0.7 }}
              height={winH(50)}
              customStyles={{
                dateInput: { borderWidth: 0 },
                dateText: styles.textStyle
              }}
              onDateChange={(time) => this.onChangeHandler(time, 'time')}
            />
          </View>
          {/* <BookingDateTime
            data={this.state.data}
            changeDateTime={this.onChangeHandler}
          /> */}
        </View>
        <View style={[styles.paragraph, { borderRadius: 0, borderBottomColor: '#AAAAAA', borderBottomWidth: 1 }]}>
          <TextInput
            multiline
            style={{ color: textDarkColor, minHeight: 100, padding: 15, fontSize: inputFontSize }}
            numberOfLines={5}
            textAlignVertical={'top'}
            value={this.state.data.ReserDescription}
            placeholder={'Ghi chú'}
            placeholderTextColor={textDarkColor}
            returnKeyType='done'
            onChangeText={(value) => this.onChangeHandler(value, 'ReserDescription')}
            underlineColorAndroid='transparent'
          />
        </View>
        <View style={styles.paragraph}>
          <TouchableOpacity onPress={() => { this.collegeBooking() }}
            style={[styles.buttonBg, { padding: 10 }]}>
            {this.state.isChecking ? <ActivityIndicator color={'white'} /> : <Text style={[styles.buttonBgText]}>XÁC NHẬN</Text>}
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  bookingCard: {
    flex: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20
    // marginHorizontal: '5%',
    // padding: 15,
    // paddingVertical: 15,
    // marginBottom: 20,
  },
  iconStyle: {
    // paddingHorizontal: 10
  },
  textStyle: {
    fontSize: platform === 'ios' ? 22 : 24,
    color: brandPrimary,
  },
  selectedData: {
    color: brandWarning,
    fontSize: 18
  },
  paragraph: {
    backgroundColor: brandLight,
    borderRadius: 3,
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonBg: {
    backgroundColor: brandPrimary,
    borderRadius: 2,
    padding: 5,
    paddingHorizontal: 10,
    margin: 5,
  },
  buttonBgText: {
    color: '#FFF',
    textAlign: 'center'
  }
});

