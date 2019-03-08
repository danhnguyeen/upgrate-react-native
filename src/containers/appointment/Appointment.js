import React from 'react';
import moment from 'moment';
import { StyleSheet, TouchableOpacity, View, Alert, Linking, RefreshControl, LayoutAnimation, Text } from 'react-native';
import { Content, ActionSheet } from "native-base";
import { connect } from 'react-redux';
import axios from '../../config/axios';

import * as actions from './appointment-actions';
import { BookingRating } from '../../components/booking';
import { AppointmentItem } from '../../components/appointments';
import { brandPrimary, textDarkColor, shadow, brandLight, backgroundColor, statusColors, brandSuccess, brandDanger, brandWarning } from '../../config/variables';
import { _dispatchStackActions } from '../../util/utility';
import i18n from '../../i18n';
import { Spinner } from '../../components/common';

class Appointment extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      firstLoading: true,
      modalVisible: false,
      itemRating: null,
      refreshing: false
    }
  }
  componentWillReceiveProps(nextProps) {
    if (!this.state.firstLoading && this.props.appointments.length !== nextProps.appointments.length) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
    }
  }
  componentWillUnmount() {
    this.didFocusListener.remove()
  }
  async componentDidMount() {
    this.didFocusListener = this.props.navigation.addListener('didFocus', () => {
      this.props.navigation.setParams({ updatedTime: new Date() });
      if (this.props.isAuth) {
        this._onFetching();
      }
    })
  }
  _onFetching = async () => {
    try {
      await this.props.fetchAppointments(this.props.user.customer_id);
      this.setState({ firstLoading: false, refreshing: false });
    } catch (error) {

    }
  }
  _onCancelSubmit = async (appointment_id) => {
    this.setState({ refreshing: true })
    await axios.post(`appointment/delete?appointment_id=${appointment_id}`).catch(error => {
      Alert.alert(null, error.message[{ text: 'Ok', onPress: () => this.setState({ isFetching: false }) }])
    }).then(() => {
      this._onFetching();
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
          (this.state.firstLoading && !this.props.appointments.length ?
            <Spinner />
            :
            <Content padder
              style={{ flex: 1, backgroundColor }}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing && !this.state.firstLoading}
                  onRefresh={this._onFetching}
                />
              }
            >
              {this.props.appointments.length > 0 ?
                this.props.appointments.map((item) => (
                  <AppointmentItem 
                    booking={item} 
                    key={item.appointment_id}
                    navigation={this.props.navigation}
                    onCancelSubmit={() => { this._onCancelSubmit(item.appointment_id) }}
                    onRatingPress={() => { this.props.navigation.navigate('Rating', { itemRating: item }) }}
                    // onRatingPress={() => { this.setState({ modalVisible: true, itemRating: item }) }}
                  />))
                :
                <TouchableOpacity onPress={() => { this.props.navigation.navigate('Buildings') }}>
                  <Text style={{ color: brandPrimary, textAlign: 'center' }}>{i18n.t('appointment.appointmentEmpty')}</Text>
                </TouchableOpacity>
              }
            </Content>
          )
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
  appointments: state.appointments.appointments
});

const mapDispatchToProps = dispatch => ({
  fetchAppointments: (customer_id) => dispatch(actions.fetchAppointments(customer_id))
});

export default connect(mapStateToProps, mapDispatchToProps)(Appointment);