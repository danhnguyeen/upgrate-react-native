import React from 'react';
import moment from 'moment';
import { StyleSheet, TouchableOpacity, View, Alert, Linking, RefreshControl } from 'react-native';
import { Content, Text, ActionSheet } from "native-base";
import { connect } from 'react-redux';
import axios from '../../config/axios';

import { ModalPopup } from '../../components/common';
import { BookingRating } from '../../components/booking/';
import { brandPrimary, textDarkColor, shadow, brandLight, backgroundColor, statusColors } from '../../config/variables';
import { _dispatchStackActions } from '../../util/utility';
import i18n from '../../i18n';

var BUTTONS = [
  { text: i18n.t('global.cancel'), url: '' },
  { text: i18n.t('contact.call'), url: 'tel:+84911072299' },
  { text: i18n.t('contact.zalo'), url: 'https://zalo.me/1732464775151258581' },
  { text: i18n.t('contact.messenger'), url: 'https://m.me/paxskydotvn' },
  { text: "Email", url: 'mailto:paxsky.vn' },
];
var CANCEL_INDEX = 0;

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
  componentDidMount() {
    this.props.navigation.addListener('willFocus', () => {
      setTimeout(() => {
        this.props.navigation.setParams({ updatedTime: new Date() });
      }, 1000);
    });
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
        booking.status.color = statusColors.yellow
        booking.status.icon = 'circle'
        booking.status.text = i18n.t('appointment.pending')
        btnFuncText = i18n.t('appointment.btUpdate')
        onPressFunction = () => this.props.navigation.navigate('ModalBooking', { dataProps: { bookingDetail: booking } })
        break
      case 'Schedule':
        booking.status.color = statusColors.green
        booking.status.icon = 'check-circle'
        booking.status.text = i18n.t('appointment.scheduled')
        btnFuncText = i18n.t('appointment.btUpdate')
        onPressFunction = () => this.props.navigation.navigate('ModalBooking', { dataProps: { bookingDetail: booking } })
        break
      case 'Done':
        booking.status.color = statusColors.grey
        booking.status.icon = 'checkbox-multiple-marked-circle'
        booking.status.text = i18n.t('appointment.done')
        btnFuncText = i18n.t('appointment.btRating')
        onPressFunction = this.props.onRatingPress
        break
      case 'Cancel':
        booking.status.color = statusColors.red
        booking.status.icon = 'close-circle'
        booking.status.text = i18n.t('appointment.cancelled')
        btnFuncText = i18n.t('appointment.btReport')
        onPressFunction = this.props.onRatingPress
        break
    }
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
              <Text numberOfLines={1} allowFontScaling style={{ flex: 0.3, color: textDarkColor, fontSize: 15, lineHeight: 23, fontWeight: '500', textAlign: 'right', marginRight: 5 }}  >{`${i18n.t('appointment.office')}:`}</Text>
              <Text numberOfLines={1} allowFontScaling style={{ flex: 0.6, color: textDarkColor, fontSize: 15, lineHeight: 23, fontWeight: '300' }} >{booking.office_name}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginHorizontal: 5 }} >
              <Text numberOfLines={1} allowFontScaling style={{ flex: 0.3, color: textDarkColor, fontSize: 15, lineHeight: 23, fontWeight: '500', textAlign: 'right', marginRight: 5 }}>{`${i18n.t('appointment.saler')}`}</Text>
              <Text numberOfLines={1} allowFontScaling style={{ flex: 0.6, color: textDarkColor, fontSize: 15, lineHeight: 23, fontWeight: '300' }}>{`${booking.sale_person_name ? booking.sale_person_name : '--'}`}</Text>
            </View>
          </View>
          <View style={styles.spectators} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 10 }}>
            <View style={{ backgroundColor: booking.status.color, flexBasis: '40%', marginVertical: 2 }}>
              <Text style={{ lineHeight: 26, color: '#FFF', fontSize: 15, fontWeight: '600', textAlign: 'center' }}>{booking.status.text}</Text>
            </View>
            {booking.status_name == 'Pending' &&
              <TouchableOpacity onPress={() => { this.clickedCancel() }}
                style={{ color: statusColors.red, paddingHorizontal: 10, margin: 5, }}>
                <Text style={[styles.buttonText, { color: statusColors.red }]}>{i18n.t('appointment.btCancel')}</Text>
              </TouchableOpacity>
            }
            <TouchableOpacity onPress={onPressFunction}
              style={{ color: statusColors.orange, paddingHorizontal: 10, margin: 5, }}>
              <Text style={[styles.buttonText, { color: brandPrimary, fontSize: 16, fontWeight: '500' }]}>{btnFuncText}</Text>
            </TouchableOpacity>
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
      isFetching: true,
      modalVisible: false,
      itemRating: null,
      refreshing: false
    }
  }
  componentWillUnmount() {
    this.didFocusListener.remove()
  }
  componentDidMount() {
    this.didFocusListener = this.props.navigation.addListener('didFocus', () => {
      if (this.props.isAuth) {
        this._onFetching()
      }
    })
  }
  _onFetching = async () => {
    this.setState({ refreshing: true })
    const customer_id = this.props.user.customer_id
    await axios.get(`appointment/list?customer_id=${customer_id}`).catch(error => {
      this.setState({ isFetching: false })
      Alert.alert(null, error.message, [{ text: 'Ok', onPress: () => { this.setState({ isFetching: false, refreshing: false }) } }])
    }).then((response) => {
      const appointmentList = response.sort((fisrt, next) => {
        const aDate = moment(fisrt.date_schedule, 'DD/MM/YYYY HH:mm').format('YYYYMMDDHH')
        const bDate = moment(next.date_schedule, 'DD/MM/YYYY HH:mm').format('YYYYMMDDHH')
        return aDate > bDate ? -1 : aDate < bDate ? 1 : 0;
      })
      this.setState({ appointmentList, isFetching: false, refreshing: false })
    })
  }
  _onCancelSubmit = async (appointment_id) => {
    this.setState({ refreshing: true })
    await axios.post(`appointment/delete?appointment_id=${appointment_id}`).catch(error => {
      Alert.alert(null, error.message[{ text: 'Ok', onPress: () => this.setState({ isFetching: false }) }])
    }).then((response) => {
      this._onFetching()
    })
  }
  _onRatingSubmit = async (ratingData) => {
    await axios.post(`appointment/rating?appointment_id=${ratingData.appointment_id}`, ratingData).catch(error => {
      if (error && error.status === '1') {
        Alert.alert(null, error.message, [{ text: 'Ok', onPress: () => { this.setState({ isFetching: false, modalVisible: false }) } }])
      }
    }).then((response) => {
      if (response && response.status == '0') {
        this.setState({ isFetching: false, modalVisible: false, itemRating: null })
      }
    })
  }
  _modalHandler = () => {
    this.setState({ modalVisible: false, itemRating: null })
  }
  render() {
    const { appointmentList, isFetching } = this.state
    return (
      <View style={{ flex: 1, backgroundColor }}>
        {!this.props.isAuth ?
          <Content padder style={{ flex: 1, backgroundColor }}>
            <View style={styles.paragraph}>
              <TouchableOpacity onPress={() => {
                _dispatchStackActions(this.props.navigation, 'navigate', 'Account', 'SignIn', { routeNameProps: this.props.navigation.state.routeName })
              }}>
                <Text style={{ color: brandPrimary }}>{i18n.t('account.goToSignIn')}</Text>
              </TouchableOpacity>
            </View>
          </Content>
          :
          <Content padder style={{ flex: 1, backgroundColor }} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._onFetching} />}>
            {appointmentList ?
              appointmentList.length > 0 ?
                appointmentList.map((item, index) => (
                  <BookingItem booking={item} key={index}
                    navigation={this.props.navigation}
                    onCancelSubmit={() => { this._onCancelSubmit(item.appointment_id) }}
                    onRatingPress={() => { this.setState({ modalVisible: true, itemRating: item }) }}
                  />))
                :
                <TouchableOpacity onPress={() => { this.props.navigation.navigate('Buildings') }}>
                  <Text style={{ color: brandPrimary, textAlign: 'center' }}>{i18n.t('appointment.appointmentEmpty')}</Text>
                </TouchableOpacity>
              :
              <Text style={{ color: brandPrimary, textAlign: 'center' }}>{i18n.t('global.updating')}</Text>
            }
          </Content>
        }
        {this.state.modalVisible ?
          <BookingRating
            visible={this.state.modalVisible}
            onRequestClose={this._modalHandler}
            onRatingSubmit={this._onRatingSubmit}
            itemRating={this.state.itemRating} />
          : null}
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
  spectators: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#6a88a9',
    height: 1,
    width: '100%',
    marginVertical: 10,
  }
});

const mapStateToProps = state => ({
  isAuth: state.auth.token,
  user: state.auth.user,
  buildings: state.buildings.buildings,
});


export default connect(mapStateToProps, null)(Appointment);