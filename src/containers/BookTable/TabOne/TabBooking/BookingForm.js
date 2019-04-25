import React, { Component } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, Alert, Linking } from 'react-native';
import { Header } from 'react-native-elements';
import { Icon } from 'react-native-elements';

import { BookingData, BookingSeats } from '../../../../components/BookTable/TabBooking/BookingForm';
import { OutlineButton, KeyboardScrollView, Modal } from '../../../../components/common';
import i18n from '../../../../i18n';
import {
  platform,
  textColor,
  brandLight,
  textDarkColor,
  brandDark,
  fontSize,
  navHeight,
  brandDanger,
  brandPrimary,
  DEVICE_WIDTH,
  fontFamilyBold
} from '../../../../config/variables';
import moment from 'moment';
import axios from '../../../../config/axios-mylife';

class BookingForm extends Component {
  state = {
    data: this.props.data ? this.props.data : {
      NumberOfAdult: 1,
      NumberOfChildren: 0,
      date: moment().format('DD MMM YYYY'),
      time: moment().minute(Math.ceil(moment().minute() / 15) * 15).second(0).format('HH:mm'),
      CurrentVersion: 0,
      ReserDescription: ''
    },
    loadingButton: false,
    times: []
  };
  componentDidMount() {
    this.initBooking();
  }
  getCurrentBookingtime = () => {
    return moment().minute(Math.ceil(moment().minute() / 15) * 15).second(0).format('HH:mm');
  }
  initBooking = () => {
    const times = [];
    if (this.props.selectedShop) {
      const open = this.props.selectedShop.OpenTime;
      const close = this.props.selectedShop.CloseTime;
      if (open && close) {
        let start = moment(open, 'HH:mm').set({ second: 0 });
        const end = moment(close, 'HH:mm').set({ second: 0 });
        if (end === '24:00' || end < start) {
          end.add(1, 'day');
        }
        while (start.diff(end) < 0) {
          times.push(start.format('HH:mm'));
          start = start.add(15, 'minute');
        }
      }
    }
    this.setState({ times });
  }
  changePerson = (type, persionType) => {
    const data = { ...this.state.data };
    if (type === 'plus') {
      data[persionType]++;
    } else if (type === 'minus') {
      if (persionType === 'NumberOfAdult' && data[persionType] > 1
        || persionType === 'NumberOfChildren' && data[persionType] > 0) {
        data[persionType]--;
      }
    }
    this.setState({ data });
  }
  onChangeHandler = (value, key) => {
    const data = { ...this.state.data };
    data[key] = value;
    this.setState({ data });
  }
  submitBooking = async () => {
    const data = { ...this.state.data };
    data.Booking = moment(`${data.date} ${data.time}:00`, 'DD MMM YYYY HH:mm:ss');
    // const openClosingTime = this.props.selectedShop.bdes ? ('10:00;14:00;17:00;02:00').split(';') : [];
    const openClosingTime = this.props.selectedShop.bdes ? this.props.selectedShop.bdes.split(';') : [];

    if (data.Booking.format('YYYY-MM-DD HH:mm:ss') < moment().format('YYYY-MM-DD HH:mm:00')) {
      return Alert.alert(i18n.t('global.error'), i18n.t('booking.bookingTimeInvail'));
    }
    // check if the user select out off the open/closing time
    const firstOpen = data.Booking.format(`YYYY-MM-DD ${openClosingTime[0]}:00`);
    const firstClose = data.Booking.format(`YYYY-MM-DD ${openClosingTime[1]}:00`);
    let secondOpen = null;
    let secondClose = null;
    if (openClosingTime.length === 4) {
      secondOpen = data.Booking.format(`YYYY-MM-DD ${openClosingTime[2]}:00`);
      secondClose = data.Booking.format(`YYYY-MM-DD ${openClosingTime[3]}:00`);
    }
    if ((
      openClosingTime.length === 2 &&
      (
        (openClosingTime[0] < openClosingTime[1] && !(data.Booking.isBetween(firstOpen, firstClose, null, '[)')))
        || (
          openClosingTime[0] > openClosingTime[1]
          && !(data.Booking.isBetween(firstOpen, moment(data.Booking.format('YYYY-MM-DD 23:59:59')), null, '[]'))
          && !(data.Booking.isBetween(moment(data.Booking.format('YYYY-MM-DD 00:00:00')), firstClose, null, '[)'))
        )
      )
    )
      ||
      (
        openClosingTime.length === 4 &&
        ((
          openClosingTime[0] < openClosingTime[3]
          && !(data.Booking.isBetween(firstOpen, firstClose, null, '[)'))
          && !(data.Booking.isBetween(secondOpen, secondClose, null, '[)'))
        )
          || (
            openClosingTime[0] > openClosingTime[3]
            && !(data.Booking.isBetween(firstOpen, firstClose, null, '[)'))
            && !(data.Booking.isBetween(secondOpen, moment(data.Booking.format('YYYY-MM-DD 23:59:59')), null, '[]'))
            && !(data.Booking.isBetween(moment(data.Booking.format('YYYY-MM-DD 00:00:00')), secondClose, null, '[)'))
          ))
      )) {
      return Alert.alert(
        i18n.t('global.error'),
        i18n.t('booking.timeError'),
        [
          { text: i18n.t('global.cancel'), style: 'cancel' },
          { text: i18n.t('global.call'), onPress: () => Linking.openURL(`tel:1900066890`) }
        ],
        { cancelable: false }
      );
    }
    // check if the user select in the Last Order time
    let checkLastOrderTime = null;
    const bookingDate = (data.Booking).format('YYYY-MM-DD');
    let firstCloseTime = moment(`${bookingDate} ${openClosingTime[1] === '00:00' ? '23:59' : openClosingTime[1]}`, 'YYYY-MM-DD HH:mm');
    if (firstCloseTime.diff(data.Booking) < 4500000
      && firstCloseTime.diff(data.Booking) >= 0) {
      checkLastOrderTime = openClosingTime[1];
    }
    if (openClosingTime.length === 4) {
      let secondCloseTime = moment(`${bookingDate} ${openClosingTime[3] === '00:00' ? '23:59' : openClosingTime[3]}`, 'YYYY-MM-DD HH:mm');
      if (secondCloseTime.diff(data.Booking) < 4500000
        && secondCloseTime.diff(data.Booking) >= 0) {
        checkLastOrderTime = openClosingTime[3];
      }
    }
    if (checkLastOrderTime) {
      return Alert.alert(
        i18n.t('global.error'),
        `${i18n.t('booking.theLastOrderTime')} ${moment(checkLastOrderTime, 'HH:mm').subtract(75, 'minutes').format('HH:mm')}. ${i18n.t('booking.callHotLine')}`,
        [
          { text: i18n.t('global.cancel'), style: 'cancel' },
          { text: i18n.t('global.call'), onPress: () => Linking.openURL(`tel:1900066890`) }
        ],
      );
    }
    data.BranchId = this.props.selectedShop.bid;
    data.Booking = data.Booking.format('YYYY-MM-DD HH:mm:ss');
    try {
      this.setState({ loadingButton: true });
      if (data.RID) {
        /* update */
        let encodeURI = Object.entries(data).map(([key, val]) => `${key}=${val}`).join('&');
        await axios.post(`reservation/update?${encodeURI}`);
      } else {
        /* create */
        await axios.post('reservation/create', data);
      }
      this.setState({ loadingButton: false });
      Alert.alert(
        i18n.t('global.success'),
        data.RID ? i18n.t('global.updatedSuccessfully') : i18n.t('booking.bookingSuccess'),
        [
          { text: i18n.t('global.ok'), onPress: () => this.props.submited() },
        ],
        { cancelable: false }
      );
    } catch (error) {
      this.setState({ loadingButton: false });
      Alert.alert(i18n.t('global.error'), error.message);
    }
  };
  cancelBooking = async () => {
    const data = { ...this.state.data };
    data.ReserStatusByNumber = 5;
    try {
      let encodeURI = Object.entries(data).map(([key, val]) => `${key}=${val}`).join('&');
      await axios.post(`reservation/update?${encodeURI}`);
      Alert.alert(
        i18n.t('global.notification'),
        i18n.t('booking.bookHistory.cancelledSuccess'),
        [
          { text: i18n.t('global.ok'), onPress: () => this.props.submited() },
        ],
        { cancelable: false }
      );
    } catch (error) {
      Alert.alert(i18n.t('global.error'), error.msg);
    }
  }
  clickedCancel = () => {
    Alert.alert(
      i18n.t('booking.bookHistory.cancelTitle'),
      i18n.t('booking.bookHistory.cancelContent'),
      [
        { text: i18n.t('global.cancel'), onPress: () => { }, style: 'cancel' },
        { text: i18n.t('global.ok'), onPress: () => this.cancelBooking() },
      ],
      { cancelable: false }
    );
  }
  render() {
    return (
      <Modal
        visible={this.props.show}
        centerComponent={
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginLeft: 5, marginRight: 10 }}>
            <Text style={{ fontSize: fontSize + 4, marginBottom: 5, fontFamily: fontFamilyBold }}>{this.props.selectedShop.bname}</Text>
            <View style={{ width: DEVICE_WIDTH - 90, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: fontSize }} numberOfLines={1}>{this.props.selectedShop.badd}</Text>
            </View>
          </View>
        }
        outerContainerStyles={{
          minHeight: navHeight + 20
        }}
        onRequestClose={this.props.handleClose}
      >
        <KeyboardScrollView
          style={{ marginVertical: 10 }}
          contentContainerStyle={styles.content}
        >
          {this.props.selectedShop ?
            <View style={{ flex: 1 }}>
              <View style={{ flex: 1 }}>
                <BookingData
                  data={this.state.data}
                  changePerson={this.changePerson}
                  changeDateTime={this.onChangeHandler}
                  times={this.state.times}
                />
              </View>
              <View style={{ flex: 1, paddingTop: 15 }}>
                <BookingSeats
                  data={this.state.data}
                  changePerson={this.changePerson}
                />
              </View>
              <View style={{ flex: 1, marginTop: 15, paddingTop: 10, backgroundColor: brandLight }}>
                <TextInput
                  multiline
                  style={{ color: textColor, minHeight: 100, padding: 15 }}
                  numberOfLines={5}
                  textAlignVertical={'top'}
                  value={this.state.data.ReserDescription}
                  placeholder={i18n.t('booking.bookATable.note')}
                  placeholderTextColor={textDarkColor}
                  returnKeyType='done'
                  onChangeText={(value) => this.onChangeHandler(value, 'ReserDescription')}
                  underlineColorAndroid='transparent'
                />
              </View>
              <View style={styles.buttonContainer}>
                <OutlineButton
                  loading={this.state.loadingButton}
                  titleStyle={{ fontSize: platform === 'ios' ? 18 : 20 }}
                  buttonStyle={{ width: 200, marginBottom: 5 }}
                  title={this.state.data.RID ? i18n.t('global.update').toUpperCase() : i18n.t('booking.about.btnBooking')}
                  onPress={this.submitBooking}
                />
                {this.state.data.RID ?
                  <TouchableOpacity onPress={() => this.clickedCancel()} style={{ padding: 10 }}>
                    <Text style={styles.cancelLink}>{i18n.t('booking.bookATable.cancelBooking')}</Text>
                  </TouchableOpacity>
                  : null}
              </View>
            </View>
            : null}
        </KeyboardScrollView>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: brandDark
  },
  bookdingData: {
    flexDirection: 'row'
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cancelLink: {
    color: brandDanger,
    fontSize: fontSize + 1,
    marginTop: 10
  },
  phoneTouch: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  phoneNumber: {
    color: brandPrimary,
    bottom: 0,
    paddingLeft: 5
  }
});

export default BookingForm;
