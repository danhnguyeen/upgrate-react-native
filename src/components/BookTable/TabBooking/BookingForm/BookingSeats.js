import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

import { 
  DEVICE_WIDTH,
  brandLight,
  brandWarning,
  textDarkColor,
  brandPrimary,
  textH1
} from '../../../../config/variables';
import i18n from '../../../../i18n';

const bookingSeats = (props) => (
  <View style={styles.container}>
    <View style={[styles.bookingCard, { borderRightWidth: 0.5, borderRightColor: textDarkColor }]}>
      <View style={{flexDirection: 'row'}}>
        <View style={styles.parentTextContainer}>
          <View style={[styles.textContainer, { justifyContent: 'center' }]}>
            <Text style={styles.textStyle}>
              {i18n.t('booking.bookATable.seats').toUpperCase()}
            </Text>
          </View>
          <View style={styles.textContainer}>
            <TouchableOpacity style={styles.actionButton}
              onPress={() => props.changePerson('minus', 'NumberOfAdult')}>
              <Icon
                name='ios-remove-circle-outline'
                type='ionicon'
                color={brandWarning}
                containerStyle={styles.iconStyle}
                underlayColor='#00000000'
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.parentTextContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.selectedData}>{props.data.NumberOfAdult}</Text>
          </View>
          <View style={styles.textContainer}>
            <TouchableOpacity style={styles.actionButton}
              onPress={() => props.changePerson('plus', 'NumberOfAdult')}>
              <Icon
                name='ios-add-circle-outline'
                type='ionicon'
                color={brandWarning}
                containerStyle={styles.iconStyle}
                underlayColor='#00000000'
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
    <View style={[styles.bookingCard, { borderLeftWidth: 0.5, borderLeftColor: textDarkColor }]}>
      <View style={{flexDirection: 'row'}}>
        <View style={styles.parentTextContainer}>
          <View style={[styles.textContainer, { justifyContent: 'center' }]}>
            <Text style={styles.textStyle}>
              {i18n.t('booking.bookATable.rbaby').toUpperCase()}
            </Text>
            <Text style={styles.textStyle}>
              {i18n.t('booking.bookATable.rseats').toUpperCase()}
            </Text>
          </View>
          <View style={styles.textContainer}>
            <TouchableOpacity style={styles.actionButton}
              onPress={() => props.changePerson('minus', 'NumberOfChildren')}>
              <Icon
                name='ios-remove-circle-outline'
                type='ionicon'
                color={brandWarning}
                containerStyle={styles.iconStyle}
                underlayColor='#00000000'
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.parentTextContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.selectedData}>{props.data.NumberOfChildren}</Text>
          </View>
          <View style={styles.textContainer}>
            <TouchableOpacity style={styles.actionButton} 
              onPress={() => props.changePerson('plus', 'NumberOfChildren')}>
              <Icon
                name='ios-add-circle-outline'
                type='ionicon'
                color={brandWarning}
                containerStyle={styles.iconStyle}
                underlayColor='#00000000'
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: brandLight,
    flexDirection: 'row'
  },
  bookingCard: {
    backgroundColor: brandLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
    width: '50%'
  },
  parentTextContainer: {
    flexDirection: 'column', 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  textContainer: { 
    justifyContent: 'flex-end', 
    alignItems: 'center', 
    width: DEVICE_WIDTH / 4,
    minHeight: 40,
    flex: 1,
    // backgroundColor: 'white'
  },
  actionButton: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 5
  },
  textStyle: { 
    fontSize: 18
  },
  selectedData: {
    ...textH1,
    color: brandPrimary
  },
  iconStyle: {
    // paddingBottom: 5
  }
});

export default bookingSeats;
