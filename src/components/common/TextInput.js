import React, { Component } from 'react';
import { View } from 'react-native';
import { TextField } from 'react-native-material-textfield';
import { Icon } from 'native-base';

import { brandPrimary, fontSize, textLightColor } from '../../config/variables';

class TextInput extends Component {
  render() {
    let value = '';
    if (this.props.value !== null && this.props.value !== undefined) {
      value = this.props.value;
    }
    const { iconName, iconType } = this.props.icon || {};
    const errorWithoutMessage = this.props.inValid && !this.props.errorMessage;
    return (
      <View style={{ flex: 1 }}>
        {this.props.icon ? (
          <Icon 
            name={iconName} 
            type={iconType ? iconType : 'Ionicons'} 
            style={{ color: textLightColor, fontSize: 28, bottom: (this.props.inValid && this.props.errorMessage ? 20 : 8), left: 0, position: 'absolute' }} 
          />
        ) : null}
        <View style={{ marginLeft: this.props.icon ? 35 : 0 }}>
          <TextField
            returnKeyType="next"
            label={this.props.label}
            tintColor={errorWithoutMessage ? 'rgb(213, 0, 0)' : brandPrimary}
            baseColor={errorWithoutMessage ? 'rgb(213, 0, 0)' : 'rgba(0, 0, 0, .38)'}
            lineWidth={errorWithoutMessage ? 2 : 0.5}
            fontSize={fontSize + 2}
            labelFontSize={fontSize - 2}
            error={this.props.inValid ? this.props.errorMessage : null}
            {...this.props}
            value={value}
          />
        </View>
      </View>
    );
  }
};

export default TextInput;