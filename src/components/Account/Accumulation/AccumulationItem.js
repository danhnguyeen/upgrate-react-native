import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { Icon } from "react-native-elements";
import moment from 'moment';
import * as Animatable from 'react-native-animatable';

import { brandLight, fontSize, brandPrimary, DEVICE_WIDTH } from '../../../config/variables';
import { formatPrice } from '../../../util/utility';

const AccumulationItem = (props) => (
  <Animatable.View animation={'fadeIn'} style={styles.container}>
    {/* <Image source={{url: 'https://2.pik.vn/2018b95df93f-4657-46c6-9976-e50dee08c12c.jpg'}} style={{ width: 50, height: 50}} /> */}
    <View style={{ flex: 6 }}>
      <Text style={styles.brandName} numberOfLines={1}>
        {props.data.branchName}
      </Text>
      <Text style={styles.address} numberOfLines={1}>
        {props.data.branchAddress}
      </Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardType}>
          #{props.data.id}
        </Text>
        <Text style={{ fontSize: fontSize - 1 }}>
          {moment(props.data.datetime).format('HH:mm:ss DD/MM/YYYY')}
        </Text>
      </View>
    </View>
    <View style={{ justifyContent: 'flex-end' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        <Text style={styles.score}>
          {props.data.score}
        </Text>
        <Icon
          size={fontSize + 2}
          name='ios-star'
          type='ionicon'
          color={brandPrimary}
        />
      </View>
      <Text style={{ fontSize: fontSize + 2 }}>{formatPrice(props.data.totalSpend)}</Text>
    </View>
  </Animatable.View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    backgroundColor: brandLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 10,
    padding: 15
  },
  brandName: {
    fontSize: fontSize + 1,
    fontWeight: 'bold',
    width: DEVICE_WIDTH - 50
  },
  address: {
    fontSize: fontSize - 1,
    marginBottom: 10,
    width: DEVICE_WIDTH - 130
  },
  cardType: {
    color: brandPrimary,
    marginBottom: 5,
    fontSize: fontSize + 1
  },
  score: {
    fontSize: fontSize + 2,
    color: brandPrimary,
    fontWeight: 'bold',
    marginRight: 3,
    marginBottom: 5
  }
});

export default AccumulationItem;
