import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image
} from 'react-native';
import * as Animatable from 'react-native-animatable';

import {
  brandPrimary,
  brandLight,
  shadowColor,
  lineHeight,
  titleFontSize
} from '../../config/variables';
const promotion = (props) => (
  <Animatable.View animation="fadeInRight" style={styles.containerNotifyStyleOne}>
    <Image
      source={{ uri: props.promotion.ImageUrl }}
      style={styles.imageNotifyStyleOne}
      resizeMode='cover'
    />
    <View style={styles.containerContentNotifyStyleOne}>
      <Text style={{ color: brandPrimary, fontSize: titleFontSize, lineHeight }} numberOfLines={2}>
        { props.promotion.Title }
      </Text>
    </View>
  </Animatable.View>
);

const styles = StyleSheet.create({
  containerNotifyStyleOne: {
    position: 'relative',
    marginBottom: 5,
    borderWidth: 0,
    marginHorizontal: 5,
    shadowColor: shadowColor,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 2,
    backgroundColor: brandLight
  },
  imageNotifyStyleOne: {
    height: 200,
    width: 250
  },
  containerContentNotifyStyleOne: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    right: 0,
    minHeight: 50,
    backgroundColor: 'rgba(33, 43, 52, 0.9)',
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center'
  },
});

export default promotion;
