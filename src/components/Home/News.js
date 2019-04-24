import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image
} from 'react-native';

import {
  brandPrimary,
  lineHeight,
  shadowColor,
  brandLight,
  fontSize,
  DEVICE_WIDTH,
  brandLightOpacity70
} from '../../config/variables';

const news = (props) => (
  <View style={styles.container} elevation={2}>
    <View style={styles.imageContainer}>
      <Image
        source={{ uri: props.news.ImageUrl }}
        style={styles.imageStyle}
        resizeMode='cover'
      />
      <View style={styles.titleStyle}>
        <Text numberOfLines={1} style={{ color: brandPrimary, fontSize: 17, width: DEVICE_WIDTH - 60 }}>
          {props.news.Title.toUpperCase()}
        </Text>
      </View>
    </View>
    <View style={styles.bodyContainer}>
      <Text numberOfLines={3} style={styles.textBody}>
        {props.news.Content}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    flexDirection: 'column',
    shadowColor: shadowColor,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    backgroundColor: brandLight
  },
  titleStyle: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: brandLightOpacity70,
    width: '100%',
    height: 30,
    paddingTop: 2, 
    paddingLeft: 15,
    justifyContent: 'center'
  },
  textBody: {
    lineHeight,
    fontSize,
    opacity: 0.9
  },
  bodyContainer: {
    flexDirection: 'column',
    paddingHorizontal: 15,
    paddingVertical: 5,
    minHeight: 60,
    justifyContent: 'center'
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageStyle: {
    width: '100%',
    height: 170
  }
});

export default news;
