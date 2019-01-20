import React, { Component } from 'react';
import { TextField } from 'react-native-material-textfield';
import { Icon } from 'native-base';

import { brandPrimary, fontSize } from '../../config/variables';

class TextInput extends Component {
  renderPasswordAccessory = () => {
    if (this.props.icon) {
      return (
        <Icon
          name={this.props.icon.iconName}
          type={this.props.icon.icontype ? this.props.icon.icontype : 'Ionicons'}
          style={{ color: 'rgba(0, 0, 0, .38)', marginHorizontal: 10, fontSize: 26 }}
        />
      );
    }
  }
  render() {
    let value = '';
    if (this.props.value !== null && this.props.value !== undefined) {
      value = this.props.value;
    }
    const errorWithoutMessage = this.props.inValid && !this.props.errorMessage;
    return (
      <TextField
        returnKeyType="next"
        containerStyle={{ marginBottom: 0, paddingBottom: 0}}
        inputContainerStyle={{ marginBottom: 0, paddingBottom: 0}}
        label={this.props.label}
        tintColor={errorWithoutMessage ? 'rgb(213, 0, 0)' : brandPrimary}
        baseColor={errorWithoutMessage ? 'rgb(213, 0, 0)' : 'rgba(0, 0, 0, .38)'}
        lineWidth={errorWithoutMessage ? 2 : 0.5}
        fontSize={fontSize + 2}
        labelFontSize={fontSize - 2}
        error={this.props.inValid ? this.props.errorMessage : null}
        {...this.props}
        value={value}
        renderAccessory={this.renderPasswordAccessory}
      />
    );
  }
};

export default TextInput;