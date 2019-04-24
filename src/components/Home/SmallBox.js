import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { brandLight, shadowColor, DEVICE_WIDTH, fontSize } from '../../config/variables';

const SmallBox = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={[styles.container, { ...props.style }]} elevation={2}>
        {props.icon}
        <Text style={styles.titleStyle}>{props.title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 100,
    width: (DEVICE_WIDTH - 50) / 3,
    backgroundColor: brandLight,
    borderRadius: 5,
    marginVertical: 15,
    marginHorizontal: 5,
    shadowColor: shadowColor,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleStyle: {
    fontSize: fontSize
  }
});

export default SmallBox;
