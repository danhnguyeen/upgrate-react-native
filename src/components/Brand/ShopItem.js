import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Linking } from 'react-native';
import { Icon } from 'react-native-elements';
import FastImage from 'react-native-fast-image';
// import * as Animatable from 'react-native-animatable';

import { brandDark, brandLight, shadowColor, DEVICE_WIDTH, lineHeight, fontSize, brandPrimary } from '../../config/variables';

const ShopItem = (props) => {
  // const address = [props.shop.address, props.shop.ward, props.shop.district, props.shop.city].filter(Boolean).join(", ") ; 
  return (
    <View animation="fadeInUp" style={ styles.container }>
      <FastImage 
        style={ styles.pictureStyle } 
        source={{ uri: props.shop.bimg_url }} />
      <View style={ styles.detailContainer }>
        <View>
          <Text style={ styles.titleStyle }>{props.shop.bname}</Text>
          <View style={{flexDirection: 'row'}}>
            <Text style={{ flex: 1, flexWrap: 'wrap', lineHeight, fontSize: fontSize - 1 }}>{props.shop.badd}</Text>
          </View>  
        </View>
        <View style={ styles.phoneContainer }>
          { props.shop.bphone ? 
            <TouchableOpacity onPress={() => Linking.openURL(`tel:${props.shop.bphone}`)} style={ styles.phoneTouch }>
              <Icon 
                name='old-phone'
                type='entypo'
                color={brandPrimary}
                size={14}
              />
              <Text style={styles.phoneNumber}>{ props.shop.bphone }</Text>
            </TouchableOpacity>
          : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    // width: DEVICE_WIDTH - 20,
    backgroundColor: brandLight,
    flexDirection: 'row',
    borderBottomColor: brandDark,
    borderBottomWidth: 1,
    // marginHorizontal: 10,
    marginBottom: 10,
    padding: 15,
    shadowColor: shadowColor,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 1
  },
  pictureStyle: {
    width: 120, 
    height: 90, 
    borderRadius: 3
  },
  detailContainer: {
    flex: 1,
    paddingLeft: 15, 
    justifyContent: 'space-between'
  },  
  titleStyle: {
    lineHeight,
    fontSize: fontSize + 1,
    marginBottom: 5
  },
  phoneContainer: {
    flexDirection: 'row', 
    justifyContent: 'flex-end'
  },
  phoneTouch: {
    flexDirection: 'row', 
    alignItems: 'center'
  },
  phoneNumber: {
    color: brandPrimary,
    bottom: 0,
    paddingLeft: 5,
  }
});

export default ShopItem;
