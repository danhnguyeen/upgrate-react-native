import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import moment from 'moment';
import * as Animatable from 'react-native-animatable';

import i18n from '../../../../i18n';
import {
  titleFontSize,
  fontSize,
  textColor,
  brandDanger,
  brandInfo,
  brandSuccess,
  brandWarning,
  brandPrimary,
  textH3,
  brandLight
} from '../../../../config/variables';

const bookingInfo = (props) => (
  <Animatable.View animation="fadeIn" style={styles.container}>
    <Text style={styles.titleStyle}>
      {props.booking.BranchName}
    </Text>
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <View style={styles.groupContainer}>
        <Text style={styles.subTitle}>
          {moment(props.booking.BookingFromDate).format('DD MMM YYYY')}
        </Text>
        <Text style={styles.primaryInfo}>
          {moment(props.booking.BookingFromDate, 'YYYY-MM-DDTHH:mm:ss').format('HH:mm')}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
          <Icon
            name='primitive-dot'
            type='octicon'
            iconStyle={[styles[`status${props.booking.ReserStatusByNumber}`], styles.iconStyle]}
          />
          <Text style={[styles.actionStyle, styles[`status${props.booking.ReserStatusByNumber}`]]}>
            {i18n.t(`booking.bookHistory.status${props.booking.ReserStatusByNumber}`)}
          </Text>
        </View>
      </View>
      <View style={styles.groupContainer}>
        <Text style={styles.subTitle}>{i18n.t('booking.bookATable.seats')}</Text>
        <Text style={styles.primaryInfo}>{props.booking.NumberOfAdult || 0}</Text>
        {props.booking.ReserStatusByNumber === 1 && !props.hideAction ?
          <TouchableOpacity onPress={() => props.cancelBooking(props.booking)}
            style={{ padding: 10 }}>
            <View style={{ borderBottomWidth: 1, borderBottomColor: brandDanger }}>
              <Text style={styles.cancelLink}>{i18n.t('global.cancel')}</Text>
            </View>
          </TouchableOpacity> : null
        }
      </View>
      <View style={styles.groupContainer}>
        <Text style={styles.subTitle}>{i18n.t('booking.bookATable.babySeats')}</Text>
        <Text style={styles.primaryInfo}>{props.booking.NumberOfChildren || 0}</Text>
        {props.booking.ReserStatusByNumber === 1 && !props.hideAction ?
          <TouchableOpacity onPress={() => props.updateBooking(props.booking)}
            style={{ padding: 10 }}>
            <View style={{ borderBottomWidth: 1, borderBottomColor: brandInfo }}>
              <Text style={styles.updateLink}>{i18n.t('global.update')}</Text>
            </View>
          </TouchableOpacity> : null
        }
      </View>
    </View>
  </Animatable.View>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: brandLight,
    marginBottom: 10,
    padding: 10,
    paddingBottom: 0
  },
  titleStyle: {
    paddingBottom: 10,
    paddingHorizontal: 5,
    color: textColor
  },
  groupContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
  },
  actionStyle: {
    color: textColor,
    fontSize: titleFontSize - 2,
  },
  primaryInfo: {
    ...textH3,
    color: brandPrimary
  },
  subTitle: {
    fontSize: titleFontSize,
    color: brandWarning
  },
  status1: {
    color: brandWarning
  },
  status2: {
    color: brandInfo
  },
  status3: {
    color: brandSuccess
  },
  status4: {
    color: brandSuccess
  },
  status5: {
    color: brandDanger
  },
  iconStyle: {
    fontSize: titleFontSize * 1.3,
    paddingHorizontal: 5
  },
  cancelLink: {
    color: brandDanger,
    fontSize: fontSize,
  },
  updateLink: {
    color: brandInfo,
    fontSize: fontSize
  }
});

export default bookingInfo;
