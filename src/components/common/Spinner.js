import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { brandPrimary } from '../../config/variables';

const spinner = (props) => (
  <View style={{ justifyContent: 'center', flex: 1, height: '100%', width: '100%', backgroundColor: props.backgroundColor ? props.backgroundColor : 'transparent' }}>
    <ActivityIndicator size="large" color={brandPrimary} />
  </View>
);

export default spinner;


