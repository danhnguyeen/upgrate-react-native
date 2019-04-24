import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';

import i18n from '../../../i18n';
import {
  brandPrimary,
  brandDark,
  platform
} from '../../../config/variables';

const buttonBooking = (props) => (
  <View style={styles.container}>
    <Button
      large
      loading={props.loading}
      loadingProps={{ size: "small", color: brandPrimary }}
      loadingStyle={{ padding: 11 }}
      title={i18n.t('booking.about.btnBooking')}
      buttonStyle={styles.opening}
      titleStyle={styles.titleStyle}
      onPress={() => props.clicked(2)}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  titleStyle: {
    color: brandPrimary,
    fontSize: platform === 'ios' ? 18 : 20,
    fontWeight: 'normal'
  },
  opening: {
    width: 200,
    height: platform === 'ios' ? 40 : 45,
    elevation: 0,
    backgroundColor: brandDark,
    borderWidth: 0.75,
    borderColor: brandPrimary
  }
});

export default buttonBooking;
