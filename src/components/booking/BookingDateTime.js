import React from 'react';
import moment from 'moment';
import DatePicker from 'react-native-datepicker';
import { StyleSheet, TouchableOpacity, View, Alert, ActivityIndicator, Text } from 'react-native';
import { Icon, Textarea } from "native-base";
import { backgroundColor, textLightColor, brandPrimary, winH, fontSize } from '../../config/variables';
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
    this.initBooking();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.date_schedule !== this.props.date_schedule
      || nextProps.notes !== this.props.notes) {
      this.initBooking(nextProps);
    }
  }
  initBooking = (nextProps) => {
    const dataProps = nextProps ? nextProps : this.props;
    let data = { ...this.state.data }
    const date_schedule = dataProps.date_schedule
    if (date_schedule) {
      data = {
        ReserDescription: dataProps.notes,
        date: moment(date_schedule, 'DD-MM-YYYY HH:mm').format('DD/MM/YYYY'),
        time: moment(date_schedule, 'DD-MM-YYYY HH:mm').format('HH:mm')
      }
    } else {
      let bookingTime = data.time;
      let bookingDate = data.date;
      const currentDate = moment().format('DD/MM/YYYY');
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
      } else {
        bookingTime = OPENTIME
      }
      data.date = bookingDate
      data.time = bookingTime
    }

    this.setState({ data })
  }

  collectBooking = async () => {
    if (!this.state.isChecking) {
      this.setState({ isChecking: true });
      const data = { ...this.state.data };
      let bookingTime = moment(data.time, 'HH:mm').format('HH:mm');
      let bookingDate = moment(data.date, 'DD/MM/YYYY').format('YYYY-MM-DD');
      const currentTime = moment().format('HH:mm');
      const currentDate = moment().format('YYYY-MM-DD');
      if (bookingDate < currentDate
        || (bookingDate > currentDate && (bookingTime < OPENTIME || bookingTime > CLOSETIME))
        || (bookingDate == currentDate && (bookingTime < currentTime || bookingTime < OPENTIME || bookingTime > CLOSETIME))) {
        Alert.alert(i18n.t('global.error'), i18n.t('appointment.timeError'))
        this.setState({ isChecking: false })
      } else {
        const dataBooking = {
          schedule_date: bookingDate,
          schedule_time: bookingTime,
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
        <View style={[styles.paragraph, { borderRadius: 0, flex: 1, flexDirection: 'row', paddingTop: 15 }]}>
          <View style={[styles.bookingCard, { borderRightWidth: 0.5, borderRightColor: '#AAAAAA' }]}>
            <Icon type='SimpleLineIcons' name='calendar' style={styles.iconStyle} />
            <DatePicker
              date={this.state.data.date}
              // minDate={currentDate}
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
        <View style={{ padding: 10 }}>
          <Textarea
            bordered
            placeholder={i18n.t('appointment.note')}
            rowSpan={5}
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
    fontWeight: '500'
  },
  iconStyle: {
    color: textLightColor,
    fontSize: fontSize + 10
  }
});

