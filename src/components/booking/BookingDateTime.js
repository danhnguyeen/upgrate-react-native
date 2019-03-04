import React from 'react';
import moment from 'moment';
import DatePicker from 'react-native-datepicker';
import { StyleSheet, TouchableOpacity, View, TextInput, Alert, ActivityIndicator, Text } from 'react-native';
import { Icon } from "native-base";
import { backgroundColor, textDarkColor, textColor, inverseTextColor, brandPrimary, brandLight, winH, inputFontSize, fontSize } from '../../config/variables';
import i18n from "../../i18n";
import { Button } from '../common';

const OPENTIME = '10:00'
const CLOSETIME = '17:00'
const PRETIME = 90

export default class BookingDateTime extends React.Component {
  state = {
    data: {
      ReserDescription: '',
      date: moment().format('DD/MM/YYYY'),
      time: moment().minute(Math.ceil(moment().minute() / PRETIME) * PRETIME).second(0).format('HH:mm'),
    },
    isChecking: false
  }
  componentDidMount() {
    this.initBooking()
  }

  componentWillReceiveProps(nextProps) {
    const dataProps = this.props
    const nextDataProps = nextProps
    if (nextDataProps !== dataProps) {
      this.initBooking()
    }
  }
  initBooking = () => {
    let data = { ...this.state.data }
    const date_schedule = this.props.date_schedule
    if (date_schedule) {
      data = {
        ReserDescription: this.props.notes,
        date: moment(date_schedule, 'DD-MM-YYYY HH:mm').format('DD/MM/YYYY'),
        time: moment(date_schedule, 'DD-MM-YYYY HH:mm').format('HH:mm'),
      }
    }
    let bookingTime = data.time
    let bookingDate = data.date
    const currentDate = moment().format('DD/MM/YYYY')
    if (bookingDate <= currentDate) {
      if (bookingDate < currentDate) {
        bookingDate = currentDate
      }
      if (OPENTIME > bookingTime) {
        bookingTime = OPENTIME
      }
      else if (bookingTime > CLOSETIME) {
        bookingTime = OPENTIME
        bookingDate = moment(bookingDate, "DD/MM/YYYY").add(1, 'days')
      }
    }
    else {
      bookingTime = OPENTIME
    }
    data.date = bookingDate
    data.time = bookingTime
    this.setState({ data })
  }

  collectBooking = async () => {
    if (!this.state.isChecking) {
      this.setState({ isChecking: true })
      const data = { ...this.state.data }
      let bookingTime = data.time
      let bookingDate = data.date
      const currentTime = moment().format('HH:mm')
      const currentDate = moment().format('DD/MM/YYYY')
      if (bookingDate < currentDate) {
        Alert.alert(i18n.t('appointment.timeError'), null)
        this.setState({ isChecking: false })
      }
      else if (bookingDate > currentDate && (bookingTime < OPENTIME || bookingTime > CLOSETIME)) {
        Alert.alert(i18n.t('appointment.timeError'), null)
        this.setState({ isChecking: false })
      }
      else if (bookingDate == currentDate && (bookingTime < currentTime || bookingTime < OPENTIME || bookingTime > CLOSETIME)) {
        Alert.alert(i18n.t('appointment.timeError'), null)
        this.setState({ isChecking: false })
      }
      else {
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
            <Icon type='SimpleLineIcons' name='calendar' style={styles.iconStyle} />
            <DatePicker
              date={this.state.data.date}
              minDate={currentDate}
              mode="date"
              showIcon={false}
              format="DD/MM/YYYY"
              placeholder={i18n.t('appointment.selectDate')}
              confirmBtnText={i18n.t('global.confirm')}
              cancelBtnText={i18n.t('global.cancel')}
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
            <Icon type='SimpleLineIcons' name='clock' style={styles.iconStyle} />
            <DatePicker
              date={this.state.data.time}
              minDate={minTime}
              maxDate={maxTime}
              mode="time"
              showIcon={false}
              format="HH:mm"
              placeholder={i18n.t('appointment.selectTime')}
              confirmBtnText={i18n.t('global.confirm')}
              cancelBtnText={i18n.t('global.cancel')}
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
        </View>
        <View style={[styles.paragraph, { borderRadius: 0, borderBottomColor: '#AAAAAA', borderBottomWidth: 1 }]}>
          <Text style={{ color: textDarkColor, fontSize: 16, fontWeight: '500', lineHeight: 30, }}>{i18n.t('appointment.note')}</Text>
          <TextInput
            multiline
            style={{ color: textDarkColor, minHeight: 100 }}
            numberOfLines={5}
            textAlignVertical={'top'}
            value={this.state.data.ReserDescription}
            onChangeText={(value) => this.onChangeHandler(value, 'ReserDescription')}
            underlineColorAndroid='transparent'
          />
        </View>
        <View style={styles.paragraph}>
            <Button onPress={this.collectBooking} 
              loading={this.props.loading}
              loadingWithBg
              title={i18n.t('global.confirm').toUpperCase()}
            />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor
  },
  paragraph: {
    // backgroundColor: brandLight,
    // borderRadius: 3,
    // marginBottom: 20,
    // paddingVertical: 10,
    // paddingHorizontal: 20,
    justifyContent: 'center',
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
  },
  bookingCard: {
    flex: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  textStyle: {
    color: brandPrimary,
    fontSize: fontSize + 4,
    fontWeight: 'bold'
  },
  iconStyle: {
    color: textColor, 
    fontSize: fontSize + 10
  }
});

