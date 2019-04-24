import React from 'react';
import { View, StyleSheet } from 'react-native';
import { shadowColor, DEVICE_WIDTH, fontSize } from '../../config/variables';

const BrandBox = (props) => {
  return (
    <View style={[styles.container, { ...props.style }]}>
      { props.icon }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 65,
    width: (DEVICE_WIDTH - 100) / 3,
    borderRadius: 5,
    marginTop: 15,
    marginBottom: 5,
    marginHorizontal: 5,
    shadowColor: shadowColor,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleStyle: {
    fontSize: fontSize,
    paddingTop: 5
  }
});

export default BrandBox;
