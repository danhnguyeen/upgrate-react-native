import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';

// import SelectTime from './SelectTime'
import {
  textDarkColor,
  brandLight,
  brandPrimary,
  brandWarning,
  textColor,
  fontFamily,
  fontFamilyBold,
  platform
} from '../../../../config/variables';
import i18n from '../../../../i18n';

const bookingData = (props) => (
  <View style={styles.container}>
    <View style={{flexDirection: 'row'}}>
      <View style={[styles.bookingCard, { borderRightWidth: 0.5, borderRightColor: textDarkColor }]}>
        <Icon
          name='calendar'
          type='simple-line-icon'
          color={textColor}
        />
        <DatePicker
          date={props.data.date}
          minDate={moment().format('DD MMM YYYY')}
          mode="date"
          showIcon={false}
          placeholder={i18n.t('booking.bookATable.selectDate')}
          format="DD MMM YYYY"
          confirmBtnText={i18n.t('booking.bookATable.confirm')}
          cancelBtnText={i18n.t('booking.bookATable.cancel')}
          androidMode={'spinner'}
          customStyles={{
            dateInput: {
              borderWidth: 0
            },
            dateText: styles.textStyle
          }}
          onDateChange={(date) => props.changeDateTime(date, 'date')}
        />
      </View>
      <View style={[styles.bookingCard, { borderLeftWidth: 0.5, borderLeftColor: textDarkColor }]}>
        <Icon
          name='clock'
          type='simple-line-icon'
          color={textColor}
        />
        <DatePicker
          date={props.data.time}
          mode="time"
          showIcon={false}
          placeholder={i18n.t('booking.bookATable.selectDate')}
          format="HH:mm"
          confirmBtnText={i18n.t('booking.bookATable.confirm')}
          cancelBtnText={i18n.t('booking.bookATable.cancel')}
          is24Hour={true}
          androidMode={'spinner'}
          customStyles={{
            dateInput: {
              borderWidth: 0
            },
            dateText: styles.textStyle
          }}
          onDateChange={(time) => props.changeDateTime(time, 'time')}
        />
        {/* <Text style={[styles.textStyle, { paddingLeft: 20 }]}>{props.data.time}</Text> */}
      </View>
    </View>
    {/* <View>
      <SelectTime
        data={props.data}
        changeDateTime={props.changeDateTime}
        times={props.times}
        focused={props.focused}
      />
    </View> */}
  </View>
);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: brandLight,
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: 100
  },
  bookingCard: {
    backgroundColor: brandLight,
    flexDirection: 'row',
    paddingTop: 15,
    paddingBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    // marginTop: 10,
    width: '50%'
  },
  iconStyle: {
    paddingHorizontal: 10
  },
  textStyle: {
    fontFamily: fontFamilyBold,
    fontSize: platform === 'ios' ? 22 : 22,
    color: brandPrimary,
  },
  selectedData: {
    color: brandWarning,
    fontSize: 18
  }
});

export default bookingData;
