import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {
  brandPrimary,
  brandLightOpacity70,
  platform,
  DEVICE_WIDTH
} from '../../../config/variables';

const restaurantSelect = (props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={props.openModal} style={{ justifyContent: 'center' }}>
        <Text style={styles.titleStyle} numberOfLines={1}>
          {props.selectedShop ? props.selectedShop.bname : null}
        </Text>
        <View style={styles.iconStyle}>
          <Icon 
            name='md-more' 
            size={26} 
            color={brandPrimary} 
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 40,
    justifyContent: 'center',
    backgroundColor: brandLightOpacity70
  },
  titleStyle: {
    width: DEVICE_WIDTH - 40,
    paddingLeft: 15,
    fontSize: platform === 'ios' ? 16 : 18,
    color: brandPrimary
  },
  iconStyle: {
    position: 'absolute',
    justifyContent: 'center',
    right: 0,
    paddingHorizontal: 20
  }
});

export default restaurantSelect;
