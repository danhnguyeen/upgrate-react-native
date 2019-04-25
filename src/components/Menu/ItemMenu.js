import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity
} from 'react-native';
import { Icon } from 'react-native-elements'

import { DEVICE_WIDTH, brandLight, textColor, shadowColor } from "../../config/variables";
import { formatPrice } from "../../util/utility";
import { fontSize } from '../../config/variables';

const ItemMenu = (props) =>{
  return (
    <View style={[styles.container, { 
      marginLeft: props.index % 2 ? 5 : 10,
      marginRight: props.index % 2 ? 10 : 5
    }]}>
      <TouchableOpacity style={styles.imageContainer} 
        onPress={() => props.showPhotoView(props.item.itemimg_url)}
      >
        { props.item.itemimg_url ?
          <Image
            source={{uri: props.item.itemimg_url}}
            style={styles.imageStyle}
            resizeMode={'cover'}
          />
         :
         <View style={styles.noImage}>
            <Icon
              name='md-images'
              type='ionicon'
              size={56}
              color={textColor}
            />
          </View>
        }
      </TouchableOpacity>
      <View style={styles.infoContainer}>
        <View style={ styles.titleStyle }>
          <Text style={{ textAlign: 'center' }} numberOfLines={2}>{props.item.itemname}</Text>
        </View>
        {/* <View style={styles.priceContainer}>
          <Text style={{ fontSize: fontSize + 1 }}>
            {formatPrice(props.item.itemprice)}
          </Text>
        </View> */}
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    width: (DEVICE_WIDTH / 2) - 15,
    marginBottom: 10,
    borderWidth: 0,
    borderColor: brandLight,
    backgroundColor: brandLight,
    flexDirection: 'column',
    borderRadius: 3,
    elevation: 3,
    shadowColor: shadowColor,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3
  },
  imageStyle: {
    width: (DEVICE_WIDTH / 2) - 15,
    height: (DEVICE_WIDTH / 2) - 15
  },
  noImage: {
    width: (DEVICE_WIDTH / 2) - 15,
    height: (DEVICE_WIDTH / 2) - 15,
    justifyContent: 'center',
  },
  infoContainer: {
    flexDirection: 'column',
    paddingHorizontal: 10
  },
  titleStyle: {
    height: 50,
    paddingVertical: 5,
    justifyContent: 'center'
  },
  imageContainer: {
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center'
  },
  priceContainer: {
    borderColor: 'grey',
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0.7,
    paddingVertical: 5
  }
});

export default ItemMenu;
