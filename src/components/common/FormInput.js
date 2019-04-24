import React from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import * as Animatable from 'react-native-animatable';

import { brandDanger, fontSize, brandDark, textColor, textDarkColor } from '../../config/variables';

export const formInput = props => {
  const { icon, errorMessage, inValid, label, ...otherProps } = props;

  return (
    <View>
      {label ? <Text>{label}</Text> : null}
      <TextInput
        {...otherProps}
        style={[styles.textInput, { marginBottom: inValid && errorMessage ? 5 : 20 }]}
        placeholderTextColor={textDarkColor}
        underlineColorAndroid='transparent'
      />
      {errorMessage && inValid ?
        <Animatable.Text animation={"fadeIn"} 
          style={{ fontSize: fontSize - 1, color: brandDanger, marginBottom: 10 }}>
          {errorMessage}
        </Animatable.Text>
        : null}
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    width: '100%'
  },
  textInput: {
    width: '100%',
    backgroundColor: brandDark,
    marginTop: 10,
    paddingHorizontal: 15,
    color: textColor,
    paddingVertical: 12,
    borderRadius: 2,
    fontSize: fontSize + 2
  },
  inputContainer: {
    borderRadius: 3,
    backgroundColor: brandDark,
    paddingHorizontal: 0,
    marginTop: 10,
    paddingVertical: 1,
    borderWidth: 1,
    borderColor: brandDark
  }
});

export default formInput;
