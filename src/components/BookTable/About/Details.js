import React from 'react';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';
import {
  Button,
  Icon
} from 'react-native-elements';
import moment from 'moment';

import { brandSuccess, brandLight, textColor, textDarkColor, fontSize } from '../../../config/variables';
import i18n from '../../../i18n';

const details = (props) => {
  let isOpening = false;
  // const openClosingTime = props.selectedShop.bdes ? ('08:00;12:00;22:00;23:00').split(';') : [];
  const openClosingTime = props.selectedShop.bdes ? (props.selectedShop.bdes).split(';') : [];
  let firstClose = moment(openClosingTime[1] === '00:00' ? '23:59' : openClosingTime[1], 'HH:mm');
  if (openClosingTime[1] < openClosingTime[0] && openClosingTime[1] !== '00:00') {
    firstClose = moment(openClosingTime[1], 'HH:mm').add(1, 'days');
  }
  let secondClose = null;
  if (openClosingTime.length === 4) {
    secondClose = moment(openClosingTime[3] === '00:00' ? '23:59' : openClosingTime[3], 'HH:mm');
    if (openClosingTime[3] < openClosingTime[2] && openClosingTime[3] !== '00:00') {
      secondClose = moment(openClosingTime[3], 'HH:mm').add(1, 'days');
    }
  }
  if (moment().isBetween(moment(openClosingTime[0], 'HH:mm'), firstClose, null, '[]')
    || (openClosingTime.length === 4
      && moment().isBetween(moment(openClosingTime[2], 'HH:mm'), secondClose, null, '[]'))) {
    isOpening = true;
  }
  return (
    <View style={styles.container}>
      <View style={styles.timeContainer}>
        <View style={styles.openTimeArea}>
          <View style={styles.openTimePart}>
            <Text style={styles.dateHeader}>{i18n.t('booking.about.openTime')}</Text>
            <Text style={styles.openTime}>
              {openClosingTime.length === 4 ?
                (`${openClosingTime[0]} : ${openClosingTime[1]}\n${openClosingTime[2]} : ${openClosingTime[3]}`)
                : `${props.selectedShop.OpenTime} : ${props.selectedShop.CloseTime}`}
            </Text>
          </View>
          {/* <View style={styles.openTimePart}>
            <Text style={styles.dateHeader}>{i18n.t('booking.about.weekend')}</Text>
            { weekend }
          </View> */}
        </View>
        <View style={styles.shopStatusArea}>
          <View>
            <Button
              title={isOpening ? i18n.t('booking.about.openStatus') : i18n.t('booking.about.closeStatus')}
              buttonStyle={[styles.opening, { borderColor: isOpening ? brandSuccess : textDarkColor }]}
              titleStyle={[styles.buttonTitle, { color: isOpening ? brandSuccess : textDarkColor }]}
            />
          </View>
          <View style={styles.shopStatusIcon}>
            <Icon
              name='credit-card'
              size={22}
              // color={props.selectedShop.creditCard ? textColor : textDarkColor}
              color={textColor}
            />
            <Icon
              name='wifi'
              size={22}
              // color={props.selectedShop.wifi ? textColor : textDarkColor}
              color={textColor}
            />
          </View>
        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: brandLight,
    // flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  timeContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  openTimeArea: {
    flexDirection: 'row'
  },
  openTimePart: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  dateHeader: {
    fontSize: 15,
    marginBottom: 5
  },
  openTime: {
    paddingVertical: 5,
  },
  shopStatusArea: {
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 10
  },
  shopStatusIcon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 5,
  },
  buttonTitle: {
    // color: brandSuccess,
    fontSize,
    fontWeight: 'normal'
  },
  opening: {
    backgroundColor: brandLight,
    elevation: 0,
    minWidth: 70,
    borderWidth: 1,
    // borderColor: brandSuccess,
  }
});


export default details;
