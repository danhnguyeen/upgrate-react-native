import React from 'react';
import { Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ListItem } from 'react-native-elements'

import { Popup, OutlineButton } from '../../../components/common';
import {
  brandPrimary,
  brandLight,
  fontFamily,
  titleFontSize,
  platform
} from '../../../config/variables';
import i18n from '../../../i18n';

const restaurantList = (props) => {
  const shops = props.shops ? (
    props.shops.map((shop) => (
      <TouchableOpacity 
        key={shop.bid} 
        onPress={() => props.changeShop(shop)}>
        <ListItem 
          containerStyle={styles.restaurantItem} 
          titleStyle={styles.titleItem}
          rightIcon={<Icon name='ios-arrow-dropright' color={brandPrimary} size={30} />}
          title={shop.bname} />
      </TouchableOpacity>
    ))
  ) : null;
  return (
    <Popup 
      visible={props.isVisible}
      onRequestClose={props.onClose}
      title={props.title.toUpperCase()}
    >
      <Text style={styles.selectTitle}>{i18n.t('booking.selectRestaurant')}</Text>
      <ScrollView style={{ flexDirection: 'column', width: '100%'}}>
        {shops}
      </ScrollView>
      <OutlineButton
        clear
        title={i18n.t('global.cancel').toUpperCase()}
        buttonStyle={styles.buttonStyle}
        containerStyle={styles.buttonStyle}
        titleStyle={styles.buttonTitle}
        onPress={props.onClose}
      />
    </Popup>
  );
}

const styles = StyleSheet.create({
  restaurantItem: {
    backgroundColor: brandLight,
    marginBottom: 5
  },
  buttonStyle: {
    width: '100%',
    margin: 0,
    height: platform === 'ios' ? 70 : 80
  },
  buttonTitle: {
    color: brandPrimary,
    fontFamily,
    padding: 25
  },
  selectTitle: { 
    color: brandPrimary, 
    paddingLeft: 15, 
    paddingBottom: 10, 
    alignSelf: 'flex-start' 
  },
  titleItem: {
    color: '#fff',
    fontSize: titleFontSize,
    fontFamily
  }
});

export default restaurantList;
