import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements'

import { brandDark, textDarkColor } from '../../../config/variables';
import i18n from '../../../i18n';

export default AccumulationIcon = () => (
  <View style={{ flex: 1, alignItems: 'center', backgroundColor: brandDark }}>
    <View style={styles.icon}>
      <Icon name="ios-star" type='ionicon' color={textDarkColor} size={130} />
    </View>
    <Text>{i18n.t('account.accumulation.accumulationHistoryEmpty')}</Text>
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