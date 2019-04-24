import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';

import { brandPrimary, platform, fontSize } from '../../config/variables';

const outlineButton = (props) => (
  <Button
    {...props}
    large
    disabled={props.disabled || props.loading}
    loadingProps={{ size: "large", color: brandPrimary }}
    title={props.title}
    disabledTitleStyle={[
      styles.disabledTitleStyle, 
      props.titleStyle, 
      props.disabledTitleStyle, 
      (props.loading ? { opacity: 1 }: null)
    ]}
    disabledStyle={[
      styles.disabledStyle, 
      props.buttonStyle, 
      props.disabledStyle,
      (props.loading ? { opacity: 1 }: null)
    ]}
    buttonStyle={[styles.buttonStyle, 
      { 
        backgroundColor: props.hasBackground ? brandPrimary : 'transparent' 
      }, 
      props.buttonStyle, 
      (props.clear || props.loading ? styles.clear : null)
    ]}
    titleStyle={[styles.titleStyle, { color: props.hasBackground ? '#fff' : brandPrimary }, props.titleStyle]}
    onPress={props.onPress}
  />
);

const styles = StyleSheet.create({
  titleStyle: {
    color: brandPrimary,
    fontWeight: 'normal',
    fontSize: fontSize + 2
  },
  buttonStyle: {
    margin: 20,
    height: platform === 'ios' ? 40 : 45,
    elevation: 0,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: brandPrimary
  },
  disabledTitleStyle: {
    color: brandPrimary,
    opacity: 0.7
  },
  disabledStyle: {
    backgroundColor: 'transparent',
    borderColor: brandPrimary,
    opacity: 0.7
  },
  clear: {
    borderWidth: 0
  }
});

export default outlineButton;
