import React from 'react';
import { StyleSheet } from 'react-native';
import { Button as RNEButton } from 'react-native-elements';

import { brandPrimary, platform, fontSize, inverseTextColor } from '../../config/variables';

const Button = (props) => {
  const { buttonStyle, disabledTitleStyle, titleStyle, disabledStyle, loadingWithBg, ...otherProps } = props;
  const loadingProps = loadingWithBg ? { size: "small", color: inverseTextColor } : { size: "large", color: brandPrimary };
  return (
    <RNEButton
      {...otherProps}
      large
      disabled={props.disabled || props.loading}
      loadingProps={loadingProps}
      title={props.title}
      disabledTitleStyle={[
        styles.disabledTitleStyle,
        titleStyle,
        disabledTitleStyle,
        (props.loading ? styles.clear : null)
      ]}
      disabledStyle={[
        styles.disabledStyle,
        buttonStyle,
        disabledStyle,
        (props.loading && !loadingWithBg ? styles.clear : null)
      ]}
      buttonStyle={[styles.buttonStyle,
        buttonStyle,
      (props.clear || props.loading ? styles.clear : null)
      ]}
      titleStyle={[styles.titleStyle, { color: props.clear ? brandPrimary : '#fff' }, titleStyle]}
      onPress={props.onPress}
    />
  )
}

const styles = StyleSheet.create({
  titleStyle: {
    color: '#fff',
    fontWeight: 'normal',
    fontSize: fontSize + 2
  },
  buttonStyle: {
    margin: 20,
    height: platform === 'ios' ? 40 : 45,
    elevation: 0,
    backgroundColor: brandPrimary,
    borderWidth: 1,
    borderColor: brandPrimary
  },
  disabledTitleStyle: {
    color: '#fff',
    opacity: 0.7
  },
  disabledStyle: {
    backgroundColor: brandPrimary,
    borderColor: brandPrimary,
    opacity: 0.7
  },
  clear: {
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    opacity: 1
  }
});

export default Button;
