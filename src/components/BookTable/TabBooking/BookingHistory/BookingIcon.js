import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements'

import { textDarkColor } from "../../../../config/variables";

const BookingIcon = () => (
  <View style={styles.icon}>
    <Icon name="ios-restaurant" type='ionicon' color={textDarkColor} size={130} />
  </View>
);
const styles = StyleSheet.create({
  icon: {
    width: 160, 
    height: 160, 
    borderColor: textDarkColor, 
    borderRadius: 160, 
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30
  }
});

export default BookingIcon;