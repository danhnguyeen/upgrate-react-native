import React from 'react';
import moment from 'moment';
import { StyleSheet, TouchableOpacity, View, Alert, Linking, Text } from 'react-native';
import { ActionSheet } from "native-base";
import StarRating from 'react-native-star-rating';

import { brandPrimary, fontSize, shadow, statusColors, brandSuccess, brandDanger, brandWarning, brandLight, inverseTextColor } from '../../config/variables';
import i18n from '../../i18n';
import { inverse } from 'ansi-colors';

var BUTTONS = [
  { text: i18n.t('global.cancel'), url: '' },
  { text: i18n.t('contact.call'), url: 'tel:+84911072299' },
  { text: i18n.t('contact.zalo'), url: 'https://zalo.me/1732464775151258581' },
  { text: i18n.t('contact.messenger'), url: 'https://m.me/paxskydotvn' },
  { text: "Email", url: 'mailto:paxsky.vn' },
];
var CANCEL_INDEX = 0;


class AppointmentItem extends React.Component {
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
      i18n.t('appointment.cancelConfirm'),
      i18n.t('appointment.cancelContent'),
      [
        { text: i18n.t('global.cancel'), style: 'cancel' },
        { text: i18n.t('global.confirm'), onPress: this.props.onCancelSubmit },
      ],
      { cancelable: false }
    );
  }

  contactFunction = () => {
    ActionSheet.show({
      options: BUTTONS,
      cancelButtonIndex: CANCEL_INDEX,
      title: i18n.t('contact.paxsky')
    },
      buttonIndex => {
        if (buttonIndex !== CANCEL_INDEX) {
          Linking.openURL(BUTTONS[buttonIndex].url)
        }
      }
    )
  }
  render() {
    const booking = this.props.booking
    booking.status = {
      color: statusColors.yellow,
      icon: 'circle',
      text: i18n.t('appointment.pending')
    }
    let btnFuncText = i18n.t('appointment.btContact')
    let onPressFunction = this.contactFunction
    switch (booking.status_name) {
      case 'Pending':
        booking.status.color = brandWarning
        booking.status.icon = 'circle'
        booking.status.text = i18n.t('appointment.pending')
        btnFuncText = i18n.t('appointment.btUpdate')
        onPressFunction = () => this.props.navigation.navigate('ModalBooking', { dataProps: { bookingDetail: booking } })
        break
      case 'Schedule':
        booking.status.color = brandPrimary
        booking.status.icon = 'check-circle'
        booking.status.text = i18n.t('appointment.scheduled')
        btnFuncText = i18n.t('appointment.btUpdate')
        onPressFunction = () => this.props.navigation.navigate('ModalBooking', { dataProps: { bookingDetail: booking } })
        break
      case 'Done':
        booking.status.color = brandSuccess
        booking.status.icon = 'checkbox-multiple-marked-circle'
        booking.status.text = i18n.t('appointment.done')
        btnFuncText = i18n.t('appointment.btRating')
        onPressFunction = this.props.onRatingPress
        break
      case 'Cancel':
        booking.status.color = brandDanger
        booking.status.icon = 'close-circle'
        booking.status.text = i18n.t('appointment.cancelled')
        btnFuncText = i18n.t('appointment.btReport')
        onPressFunction = this.props.onRatingPress
        break
    }
    const rated = booking.status_code === 3 && booking.rate_number;
    return (
      <View style={[styles.paragraph, shadow, { paddingVertical: 0, paddingHorizontal: 0, borderRadius: 0, flexDirection: 'row' }]}>
        <View style={{ backgroundColor: '#072f6a', justifyContent: 'center', alignItems: 'center', padding: 10, }}>
          <Text style={{ color: 'white', fontSize: 17, lineHeight: 26 }}>{moment(booking.date_schedule, 'DD/MM/YYYY HH:mm').format('DD/MM')}</Text>
          <View style={[styles.spectators, { backgroundColor: '#5092E3', width: '90%' }]} />
          <Text style={{ color: 'white', fontSize: 17, lineHeight: 26 }}>{moment(booking.date_schedule, 'DD/MM/YYYY HH:mm').format('HH:mm')}</Text>
        </View>
        <View style={{ flex: 1, paddingVertical: 10 }}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#0D3D74', fontSize: 17, lineHeight: 30, fontWeight: '700', textAlign: 'center' }}>{booking.building_name}</Text>
            <View style={{ flexDirection: 'row', marginHorizontal: 5 }} >
              <Text numberOfLines={1} allowFontScaling style={{ flex: 0.3, lineHeight: 23, fontWeight: '500', textAlign: 'right', marginRight: 5 }}  >{`${i18n.t('appointment.office')}:`}</Text>
              <Text numberOfLines={1} allowFontScaling style={{ flex: 0.6, lineHeight: 23 }} >{booking.office_name}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginHorizontal: 5 }} >
              <Text numberOfLines={1} allowFontScaling style={{ flex: 0.3, lineHeight: 23, fontWeight: '500', textAlign: 'right', marginRight: 5 }}>{`${i18n.t('appointment.saler')}:`}</Text>
              <Text numberOfLines={1} allowFontScaling style={{ flex: 0.6, lineHeight: 23 }}>{`${booking.sale_person_name ? booking.sale_person_name : '--'}`}</Text>
            </View>
          </View>
          <View style={styles.spectators} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 10 }}>
            <View style={{ backgroundColor: booking.status.color, flexBasis: '40%', marginVertical: 2 }}>
              <Text style={{ lineHeight: 26, color: inverseTextColor, fontWeight: '600', textAlign: 'center' }}>{booking.status.text}</Text>
            </View>
            {booking.status_name == 'Pending' &&
              <TouchableOpacity onPress={() => { this.clickedCancel() }}
                style={{ color: statusColors.red, paddingHorizontal: 10, margin: 5, }}>
                <Text style={[styles.buttonText, { color: statusColors.red }]}>{i18n.t('global.cancel')}</Text>
              </TouchableOpacity>
            }
            {rated ?
              <StarRating
                disabled
                emptyStar={'ios-star-outline'}
                fullStar={'ios-star'}
                halfStar={'ios-star-half'}
                iconSet={'Ionicons'}
                maxStars={5}
                starSize={fontSize}
                starStyle={{ paddingHorizontal: 1 }}
                rating={booking.rate_number}
                fullStarColor={brandWarning}
              />
              :
              <TouchableOpacity onPress={onPressFunction}
                style={{ color: statusColors.orange, paddingHorizontal: 10, margin: 5, }}>
                <Text style={[styles.buttonText, { color: brandPrimary, fontSize: 16, fontWeight: '500' }]}>{btnFuncText}</Text>
              </TouchableOpacity>
            }
          </View>
        </View>
      </View>
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
  spectators: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#6a88a9',
    height: 1,
    width: '100%',
    marginVertical: 10,
  }
});

export default AppointmentItem;
