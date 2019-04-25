import React from 'react';
import {
  Image,
  Text,
  TouchableHighlight,
  View,
  StyleSheet,
} from 'react-native';
import * as Animatable from 'react-native-animatable';

import { DEVICE_WIDTH, brandLight, shadowColor, brandPrimary } from '../../config/variables';

const categories = (props) => {
  if (!props.data) {
    return null;
  }
  let data = props.data;
  return (
    <Animatable.View
      animation="fadeIn"
      key={data.id}
      style={[styles.menuStyle, {
        marginLeft: props.index % 2 ? 5 : 10,
        marginRight: props.index % 2 ? 10 : 5
      }
      ]}>
      <TouchableHighlight onPress={() => props.handleSelectMenu({title: data.menuname, id: data.menuid})}>
        <View style={{ overflow: 'hidden', borderRadius: 3 }}>
          <Image
            source={{uri: data.menuimg_url}}
            style={{width: '100%', height: '100%'}}
            resizeMode={'cover'}
          />
          <View style={styles.textContainer}>
            <Text style={styles.text}>
              {data.menuname}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    </Animatable.View>
  )
};

const styles = StyleSheet.create({
  menuStyle: {
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 10,
    width: (DEVICE_WIDTH - 10) / 2 - 10,
    height: (DEVICE_WIDTH - 10) / 2 - 10,
    backgroundColor: brandLight,
    // borderColor: brandDark,
    borderWidth: 0,
    borderRadius: 3,
    // overflow: 'hidden',
    elevation: 3,
    // borderBottomWidth: 0,
    shadowColor: shadowColor,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3
  },
  textContainer: {
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: 5,
    backgroundColor: 'rgba(33, 43, 52, 0.7)', 
    width: '100%', 
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    color: brandPrimary
  }
});

export default categories;
