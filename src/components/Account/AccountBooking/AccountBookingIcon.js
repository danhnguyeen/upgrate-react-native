import React from 'react';
import { View, Text } from 'react-native';

import { BookingIcon } from '../../BookTable/TabBooking/BookingHistory';
import { OutlineButton } from '../../common';
import { brandDark } from '../../../config/variables';
import i18n from '../../../i18n';

export default AccountBookingIcon = (props) => (
  <View style={{ flex: 1, alignItems: 'center', backgroundColor: brandDark }}>
    <BookingIcon />
    <Text>{i18n.t('account.accumulation.youHaventBookTalbeYet')}</Text>
    <OutlineButton
      title={i18n.t('account.accumulation.buttonTableNow')}
      buttonStyle={{ width: 200, marginTop: 20 }}
      onPress={props.action}
    />
  </View>
);